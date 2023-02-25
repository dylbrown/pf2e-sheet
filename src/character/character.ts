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
} from './model';

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
  inventory = Array<Item>();

  spells = {
    focusPoints: 0,
    lists: Array<SpellList>(),
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
  load(data: any) {
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
      if (k.includes('Lore')) return;
      this.attributes[Object.values(Attribute).indexOf(k) as Attribute].total =
        v;
    };
    parseAndSet(data.stats?.totalSkills, 'Bonus', setAttribute);
    parseAndSet(data.stats?.totalSaves, 'Bonus', setAttribute);

    for (const [a, prof] of Object.entries(data.profs)) {
      if (a.includes('Lore')) continue;
      const attr: Attribute = Object.values(Attribute).indexOf(
        a.replaceAll('_', '')
      ) as Attribute;
      switch (prof as string) {
        case 'T':
          this.attributes[attr].proficiency = Proficiency.Trained;
          break;
        case 'E':
          this.attributes[attr].proficiency = Proficiency.Expert;
          break;
        case 'M':
          this.attributes[attr].proficiency = Proficiency.Master;
          break;
        case 'L':
          this.attributes[attr].proficiency = Proficiency.Legendary;
          break;
      }
    }

    const scores: any = JSON.parse(data.stats?.weapons);
    if (scores instanceof Array) {
      for (const entry of scores) {
        if (entry.Name.includes('Improvised')) continue;
        this.combat.attacks.push({
          name: entry.Name,
          attack: entry.Bonus,
          damage: entry.Damage,
        });
      }
    }

    if (data.build.feats instanceof Array) {
      for (const entry of data.build.feats) {
        let cost: Action | undefined = undefined;
        switch (entry.value?.actions) {
          case 'ACTION':
            cost = Action.One;
            break;
          case 'TWO_ACTIONS':
            cost = Action.Two;
            break;
          case 'THREE_ACTIONS':
            cost = Action.Three;
            break;
          case 'REACTION':
            cost = Action.Reaction;
            break;
          case 'FREE':
            cost = Action.Free;
            break;
        }
        let type = entry.sourceType;
        if (entry.sourceCode.startsWith('classAbility')) {
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
        this.abilities.push({
          name: entry.value?.name ?? '',
          type: type,
          source: '',
          description: entry.value?.description,
          activity: cost != undefined,
          traits: [],
          cost: cost,
          frequency: entry.value?.frequency,
          requirements: entry.value?.requirements,
          trigger: entry.value?.trigger,
        });
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
