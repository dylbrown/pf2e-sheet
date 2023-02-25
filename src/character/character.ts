import {
  Proficiency,
  Attribute,
  Score,
  Weapon,
  Ability,
  Item,
  SpellList,
  attrScore,
  Action,
  Spell,
} from './model';
import { getActions, getScore, makeSource, ordinalToNumber } from './util';

export default class Character {
  name = 'Dave';
  player = '';
  level = 0;
  ancestry = 'Stickytongue Tomato';
  background = 'Potato';
  class = 'Tuber';
  deity = '';
  alignment = 'LN';
  size = 'Medium';
  traits = Array<string>();
  senses = Array<string>();
  languages = Array<string>();
  scores: Scores;
  speed = 25;
  classDC = 10;
  hp = 69;
  ac = 23;
  combat = {
    armor: {
      proficiency: Proficiency.Trained,
      ac: 0,
    },
    shield: {
      proficiency: Proficiency.Trained,
      ac: 0,
    },
    attacks: Array<Weapon>(),
  };
  abilities = Array<Ability>();
  attributes: Attributes;
  lore = {} as {
    [lore: string]: {
      proficiency: Proficiency;
      total: number;
      itemBonus: number;
    };
  };
  inventory = Array<Item>();

  spells = {
    focusPoints: 0,
    lists: Array<SpellList>(),
    lookup: {} as { [key: string]: SpellList },
  };

  constructor() {
    this.scores = {} as Scores;
    this.attributes = {} as Attributes;
    Object.values(Score).forEach((s) => (this.scores[s as Score] = 10));
    Object.values(Attribute).forEach((a) => {
      if (isNaN(a as number)) return;
      this.attributes[a as Attribute] = {
        total: 9,
        score: attrScore[Attribute[a as Attribute]],
        itemBonus: 0,
        proficiency: Proficiency.Untrained,
      };
    });
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load(data: any, feats: any, items: any, spells: any) {
    this.name = data.character?.name ?? '';
    this.level = data.character?.level ?? 0;
    this.ancestry = data.character?._heritage?.name ?? '';
    this.background = data.character?._background?.name ?? '';
    this.class = data.character?._class?.name ?? '';
    const info: any = JSON.parse(data.stats?.generalInfo);
    this.size = info?.size ?? '';
    const traits = info?.traits;
    if (traits instanceof Array<string>) this.traits = traits;
    parseAndSet(
      data.stats?.totalAbilityScores,
      'Score',
      (k, v) => (this.scores[Object.values(Score).indexOf(k) as Score] = v)
    );

    if (data.build?.senses instanceof Array) {
      for (const entry of data.build.senses) {
        this.senses.push(entry.value.name);
      }
    }
    if (data.build?.languages instanceof Array) {
      for (const entry of data.build.languages) {
        this.languages.push(entry.value.name);
      }
    }
    this.speed = data.stats?.totalSpeed ?? 0;
    this.classDC = data.stats?.totalClassDC ?? 0;
    this.ac = data.stats?.totalAC ?? 0;
    this.hp = data.stats?.maxHP ?? 0;
    this.attributes[Attribute.Perception].total =
      data.stats?.totalPerception ?? 0;
    const setAttribute = (k: string, v: number) => {
      if (k.includes('Lore')) {
        this.lore[k] = { proficiency: 0, total: v, itemBonus: 0 };
      } else {
        this.attributes[
          Object.values(Attribute).indexOf(k) as Attribute
        ].total = v;
      }
    };
    parseAndSet(data.stats?.totalSkills, 'Bonus', setAttribute);
    parseAndSet(data.stats?.totalSaves, 'Bonus', setAttribute);

    for (const [a, prof] of Object.entries(data.profs)) {
      let proficiency: Proficiency = 0;
      switch (prof as string) {
        case 'T':
          proficiency = Proficiency.Trained;
          break;
        case 'E':
          proficiency = Proficiency.Expert;
          break;
        case 'M':
          proficiency = Proficiency.Master;
          break;
        case 'L':
          proficiency = Proficiency.Legendary;
          break;
      }
      if (a.includes('Lore')) {
        if (this.lore[a]) {
          this.lore[a].proficiency = proficiency;
        } else {
          this.lore[a] = {
            proficiency: proficiency,
            total:
              Number(proficiency) +
              this.level +
              Math.floor((this.scores[Score.Intelligence] - 10) / 2),
            itemBonus: 0,
          };
        }
        continue;
      }
      const attr: Attribute = Object.values(Attribute).indexOf(
        a.replaceAll('_', '')
      ) as Attribute;
      if ((attr as number) == -1) continue;
      this.attributes[attr].proficiency = proficiency;
    }
    const attackMap = new Map<string, Weapon>();

    const scores: any = JSON.parse(data.stats?.weapons);
    if (scores instanceof Array) {
      for (const entry of scores) {
        if (entry.Name.includes('Improvised')) continue;
        const attack = {
          name: entry.Name,
          attack: entry.Bonus,
          damage: entry.Damage,
          hands: 0,
          traits: [],
        };
        attackMap.set(attack.name, attack);
        this.combat.attacks.push(attack);
      }
    }
    const featMap = new Map<string, Ability>();

    if (data.build.feats instanceof Array) {
      for (const entry of data.build.feats) {
        const cost: Action = getActions(entry.value?.actions);
        let type = entry.sourceType;
        if (entry.value?.name.startsWith('Rage')) {
          type = 'classFeature';
        } else {
          switch (entry.value?.genericType) {
            case 'SKILL-FEAT':
              type = 'skill';
              break;
            case 'GENERAL-FEAT':
              type = 'general';
              break;
          }
        }
        const feat = {
          name: entry.value?.name ?? '',
          type: type,
          source: '',
          description: entry.value?.description,
          activity: cost != Action.None,
          traits: [],
          cost: cost,
          frequency: entry.value?.frequency,
          requirements: entry.value?.requirements,
          trigger: entry.value?.trigger,
        };
        featMap.set(entry.value?.name, feat);
        this.abilities.push(feat);
      }
    }
    if (data.invItems instanceof Array) {
      for (const entry of data.invItems) {
        if (entry.name.includes('Improvised') || entry.name.includes('Fist'))
          continue;
        this.inventory.push({
          name: entry.name,
          count: Number(entry.quantity),
          weight: entry.bulk > 0 ? entry.bulk : 0,
        });
      }
    }
    const spellMap = new Map<string, Spell>();
    if (data.spellBookSpells instanceof Array) {
      const lists: { [name: string]: SpellList } = {};
      for (const entry of data.spellBookSpells) {
        let list = lists[entry.spellSRC];
        if (list == null) {
          list = lists[entry.spellSRC] = {
            name: entry.spellSRC,
            attack: 0,
            dc: 0,
            type: '',
            known: [[], [], [], [], [], [], [], [], [], [], []],
            slots: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            focus: [],
            tradition: '',
            score: -1 as Score,
          };
        }
        const spell = {
          name: entry._spellName,
          description: '',
          cost: Action.Free,
          castTime: '',
          components: [],
          source: '',
          traits: [],
          requirements: '',
          range: '',
          area: '',
          targets: '',
          duration: '',
          save: '',
        };
        spellMap.set(spell.name, spell);
        list.known[entry.spellLevel].push(spell);
      }
      this.spells.lists = Array.from(Object.values(lists));
      this.spells.lookup = lists;
    }
    if (data.metaData instanceof Array) {
      for (const entry of data.metaData) {
        const i = entry.value.indexOf('=');
        const key: string = entry.value.substring(0, i);
        const value: string = entry.value.substring(i + 1);
        const list = this.spells.lookup[key];
        switch (entry.source) {
          case 'spellCastingType': {
            list.type = value.startsWith('SPONTANEOUS')
              ? 'Spontaneous'
              : 'Prepared';
            break;
          }
          case 'spellKeyAbilities': {
            list.score = getScore(value);
            break;
          }
          case 'spellLists': {
            list.tradition = value[0] + value.toLowerCase().substring(1);
            break;
          }
          case 'spellSlots': {
            if (!entry.sourceCode.startsWith('classAbility-')) break;
            const slotsData = JSON.parse(value);
            for (const [index, slots] of Object.entries(slotsData)) {
              const indexString: string = index.toString();
              const end = indexString.indexOf('L');
              const n = ordinalToNumber(indexString.substring(0, end));
              if (n >= 0 && slots instanceof Array)
                list.slots[n as number] = (slots as Array<any>).length;
            }
            break;
          }
        }
      }
    }
    for (const s of Object.values(spells)) {
      if (typeof s !== 'object') continue;
      const spellAndTags = s as any;
      const spell = spellAndTags.Spell;
      const e = spellMap.get(spell.name as string);
      if (e != undefined) {
        const entry = e as Spell;
        entry.description = spell.description ?? '';
        if (spell.cast.includes('_TO_')) {
          const actions = spell.cast.split('_TO_');
          entry.cost = actions[0] == 'ONE' ? Action.One : Action.Two;
          entry.maxCost = getActions(actions[1]);
        } else {
          entry.cost = getActions(spell.cast);
        }
        entry.castTime = spell.cast.replaceAll('_', ' ');
        entry.components = JSON.parse(spell.castingComponents) as Array<string>;
        entry.source = makeSource(spell.contentSrc);
        entry.traits = (spellAndTags.Tags as Array<any>).map((o) => o.name);
        entry.requirements = spell.requirements;
        entry.range = spell.range;
        entry.area = spell.area;
        entry.targets = spell.targets;
        entry.duration = spell.duration;
        entry.save =
          spell.savingThrow != null
            ? spell.savingThrow[0] +
              spell.savingThrow.substring(1).toLowerCase()
            : '';
      }
    }

    for (const s of Object.values(feats)) {
      if (typeof s !== 'object') continue;
      const featAndTags = s as any;
      const feat = featAndTags.Feat;
      const f = featMap.get(feat.name as string);
      if (f != undefined) {
        const entry = f as Ability;
        entry.source = makeSource(feat.contentSrc);
        entry.traits = (featAndTags.Tags as Array<any>).map((o) => o.name);
      }
    }

    for (const s of Object.values(items)) {
      if (typeof s !== 'object') continue;
      const itemAndTags = s as any;
      const item = itemAndTags.Item;
      const a = attackMap.get(item.name as string);
      if (a != undefined) {
        const entry = a as Weapon;
        entry.hands = item.hands == 'TWO' ? 2 : 1;
        entry.traits = (itemAndTags.TagArray as Array<any>).map((o) =>
          o.name.replaceAll(' - Item', '')
        );
        if (item.weapons?.isRanged) {
          entry.range = item.weapons?.rangedRange;
          entry.reload = item.weapons?.rangedReload;
        }
      }
    }
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

function parseAndSet(
  data: string,
  valName: string,
  set: (key: string, val: number) => void
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scores: any = JSON.parse(data);
  if (scores instanceof Array) {
    for (const entry of scores) {
      set(entry.Name, Number(entry[valName]));
    }
  }
}

type Scores = {
  [score in Score]: number;
};

type Attributes = {
  [attribute in Attribute]: {
    total: number;
    score: Score;
    itemBonus: number;
    proficiency: Proficiency;
  };
};
