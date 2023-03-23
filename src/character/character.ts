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
import {
  getActions,
  getScore,
  ordinalToNumber,
  parseDescription,
} from './util';
import * as Wanderer from './wanderers-requests';

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
    lists: new Array<SpellList>(),
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

  getOrCreateSpellsList(spellSRC: string) {
    let list = this.spells.lookup[spellSRC];
    if (list == null && spellSRC.length > 0) {
      list = this.spells.lookup[spellSRC] = {
        name: spellSRC,
        attack: 0,
        dc: 0,
        type: '',
        known: [[], [], [], [], [], [], [], [], [], [], []],
        slots: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        focus: [],
        tradition: '',
        score: -1 as Score,
      };
      this.spells.lists.push(list);
    }
    return list;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load(data: any) {
    const promises: Array<Promise<void>> = [];
    this.name = data.character?.name ?? '';
    this.level = data.character?.level ?? 0;
    // Wanderer.loadClass(data.character?.classID);
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

    const attacks: any = JSON.parse(data.stats?.weapons);
    if (attacks instanceof Array) {
      for (const entry of attacks) {
        if (entry.Name.includes('Improvised')) continue;
        const attack: Weapon = {
          name: entry.Name,
          id: -1,
          count: -1,
          weight: '',
          attack: entry.Bonus,
          damage: entry.Damage,
          hands: 0,
          traits: [],
          weapon: true,
        };
        attackMap.set(attack.name, attack);
        this.combat.attacks.push(attack);
      }
    }

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
        const feat: Ability = {
          name: entry.value?.name ?? '',
          id: entry.value?.id ?? -1,
          type: type,
          source: '',
          description: parseDescription(entry.value?.description),
          activity: cost != Action.None,
          traits: [],
          cost: cost,
          frequency: entry.value?.frequency,
          requirements: entry.value?.requirements,
          trigger: entry.value?.trigger,
        };
        promises.push(Wanderer.loadFeat(feat));
        this.abilities.push(feat);
      }
    }
    if (data.invItems instanceof Array) {
      for (const entry of data.invItems) {
        if (entry.name.includes('Improvised') || entry.name.includes('Fist'))
          continue;
        let item: Item | undefined = attackMap.get(entry.name);
        if (item) {
          item.id = entry.itemID;
          item.count = Number(entry.quantity);
          item.weight = entry.bulk > 0 ? entry.bulk : 0;
        } else {
          item = {
            name: entry.name,
            id: entry.itemID,
            count: Number(entry.quantity),
            weight: entry.bulk > 0 ? entry.bulk : 0,
            traits: [],
            weapon: false,
          };
        }
        this.inventory.push(item);
        promises.push(Wanderer.loadItem(item));
      }
    }
    if (data.spellBookSpells instanceof Array) {
      for (const entry of data.spellBookSpells) {
        const list = this.getOrCreateSpellsList(entry.spellSRC);
        const spell = new Spell(entry._spellName, entry.spellID);
        promises.push(Wanderer.loadSpell(spell));
        list.known[entry.spellLevel].push(spell);
      }
    }
    if (data.metaData instanceof Array) {
      for (const entry of data.metaData) {
        const i = entry.value.indexOf('=');
        const key: string = entry.value.substring(0, i);
        const value: string = entry.value.substring(i + 1);
        const list = this.getOrCreateSpellsList(key);
        switch (entry.source) {
          case 'spellCastingType': {
            if (value.startsWith('SPONTANEOUS')) list.type = 'Spontaneous';
            else if (value.startsWith('PREPARED')) list.type = 'Prepared';
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
          case 'focusSpell': {
            const spell = new Spell(value, Number(value));
            promises.push(Wanderer.loadSpell(spell));
            list.focus.push(spell);
            break;
          }
          case 'focusPoint': {
            this.spells.focusPoints += 1;
            break;
          }
          case 'innateSpell': {
            const innateList = this.getOrCreateSpellsList(entry.sourceType);
            innateList.type = 'Innate';
            const idIndex = entry.value.indexOf(':');
            const id = entry.value.substring(0, idIndex);
            const spell = new Spell(id, Number(id));
            promises.push(
              Wanderer.loadSpell(spell).then(() => {
                innateList.known[spell.level].push(spell);
              })
            );
          }
        }
        if (list && list.type == '') {
          switch (key) {
            case 'SORCERER':
              list.type = 'Spontaneous';
              break;
          }
        }
      }
    }

    return promises;
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
