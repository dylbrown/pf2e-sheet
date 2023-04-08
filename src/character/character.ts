import Abilities from './abilities';
import {
  Proficiency,
  Attribute,
  Score,
  Weapon,
  Item,
  attrScore,
} from './model';
import Spells from './spells';
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
  abilities = new Abilities();
  attributes: Attributes;
  lore = {} as {
    [lore: string]: {
      proficiency: Proficiency;
      total: number;
      itemBonus: number;
    };
  };
  inventory = Array<Item>();

  spells = new Spells();

  constructor() {
    this.scores = {} as Scores;
    this.attributes = {} as Attributes;
    Object.values(Score).forEach((s) => (this.scores[s as Score] = 10));
    Object.values(Attribute).forEach((a) => {
      if (isNaN(a as number)) return;
      this.attributes[a as Attribute] = {
        total: -1,
        score: attrScore[Attribute[a as Attribute]],
        itemBonus: 0,
        proficiency: Proficiency.Untrained,
      };
    });
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load(data: any) {
    const promises: Array<Promise<void>> = [];
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
    const metaData = {
      spells: new Array<any>(),
      class_features: new Array<any>(),
    };
    for (const entry of data.metaData) {
      switch (entry.source) {
        case 'spellCastingType':
        case 'spellKeyAbilities':
        case 'spellLists':
        case 'spellSlots':
        case 'focusSpell':
        case 'focusPoint':
        case 'innateSpell':
          metaData.spells.push(entry);
          break;
        case 'classChoice':
          metaData.class_features.push(entry);
      }
    }
    promises.push(
      ...this.abilities.load(data, metaData.class_features, this.level)
    );
    promises.push(...this.spells.load(data, metaData.spells));

    for (const list of this.spells.lists) {
      // Attack
      const attack_prof = this.attributes[list.attack_attr].proficiency;
      if (attack_prof != Proficiency.Untrained) list.attack += this.level;
      list.attack += attack_prof;
      list.attack += Math.floor((this.scores[list.score] - 10) / 2) ?? 0;
      // DC
      const dc_prof = this.attributes[list.dc_attr].proficiency;
      if (dc_prof != Proficiency.Untrained) list.dc += this.level;
      list.dc += dc_prof;
      list.dc += Math.floor((this.scores[list.score] - 10) / 2) ?? 0;
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
