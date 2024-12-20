import { parseDescription } from './util';

export enum AbilityType {
  ClassFeat,
  ClassFeature,
  GeneralFeat,
  SkillFeat,
  AncestryFeat,
  Unknown,
}

export enum Proficiency {
  Untrained = 0,
  Trained = 2,
  Expert = 4,
  Master = 6,
  Legendary = 8,
}

export enum Score {
  Strength,
  Dexterity,
  Constitution,
  Intelligence,
  Wisdom,
  Charisma,
}

export enum Action {
  One = '1',
  Two = '2',
  Three = '3',
  Free = '◇',
  Reaction = '↩',
  TwoRounds = '6',
  None = '',
}

export enum Attribute {
  Acrobatics,
  Arcana,
  Athletics,
  Crafting,
  Deception,
  Diplomacy,
  Intimidation,
  Medicine,
  Nature,
  Occultism,
  Performance,
  Religion,
  Society,
  Stealth,
  Survival,
  Thievery,
  Perception,
  Fortitude,
  Reflex,
  Will,
  UnarmedAttacks,
  SimpleWeapons,
  MartialWeapons,
  AdvancedWeapons,
  UnarmoredDefense,
  LightArmor,
  MediumArmor,
  HeavyArmor,
  ClassDC,
  SpellAttacks,
  SpellDCs,
  ArcaneSpellAttacks,
  ArcaneSpellDCs,
  DivineSpellAttacks,
  DivineSpellDCs,
  OccultSpellAttacks,
  OccultSpellDCs,
  PrimalSpellAttacks,
  PrimalSpellDCs,
  Computers,
  Piloting,
}

export const attrScore: { [a in Attribute as string]: Score } = {
  Acrobatics: Score.Dexterity,
  Arcana: Score.Intelligence,
  Athletics: Score.Strength,
  Computers: Score.Intelligence,
  Crafting: Score.Intelligence,
  Deception: Score.Charisma,
  Diplomacy: Score.Charisma,
  Intimidation: Score.Charisma,
  Medicine: Score.Wisdom,
  Nature: Score.Wisdom,
  Occultism: Score.Intelligence,
  Performance: Score.Charisma,
  Piloting: Score.Dexterity,
  Religion: Score.Wisdom,
  Society: Score.Intelligence,
  Stealth: Score.Dexterity,
  Survival: Score.Wisdom,
  Thievery: Score.Dexterity,
  Perception: Score.Wisdom,
  Fortitude: Score.Constitution,
  Reflex: Score.Dexterity,
  Will: Score.Wisdom,
  UnarmedAttacks: Score.Strength,
  SimpleWeapons: Score.Strength,
  MartialWeapons: Score.Strength,
  AdvancedWeapons: Score.Strength,
  UnarmoredDefense: Score.Dexterity,
  LightArmor: Score.Dexterity,
  MediumArmor: Score.Dexterity,
  HeavyArmor: Score.Dexterity,
  ClassDC: Score.Strength,
};

export const skills = [
  Attribute.Acrobatics,
  Attribute.Arcana,
  Attribute.Athletics,
  Attribute.Crafting,
  Attribute.Deception,
  Attribute.Diplomacy,
  Attribute.Intimidation,
  Attribute.Medicine,
  Attribute.Nature,
  Attribute.Occultism,
  Attribute.Performance,
  Attribute.Religion,
  Attribute.Society,
  Attribute.Stealth,
  Attribute.Survival,
  Attribute.Thievery,
];

export const sfSkills = [
  Attribute.Acrobatics,
  Attribute.Arcana,
  Attribute.Athletics,
  Attribute.Computers,
  Attribute.Crafting,
  Attribute.Deception,
  Attribute.Diplomacy,
  Attribute.Intimidation,
  Attribute.Medicine,
  Attribute.Nature,
  Attribute.Occultism,
  Attribute.Performance,
  Attribute.Piloting,
  Attribute.Religion,
  Attribute.Society,
  Attribute.Stealth,
  Attribute.Survival,
  Attribute.Thievery,
];

export const weaponsAndArmor: { [s: string]: Attribute } = {
  UNARMED_ATTACKS: Attribute.UnarmedAttacks,
  SIMPLE_WEAPONS: Attribute.SimpleWeapons,
  MARTIAL_WEAPONS: Attribute.MartialWeapons,
  ADVANCED_WEAPONS: Attribute.AdvancedWeapons,
  UNARMORED_DEFENSE: Attribute.UnarmoredDefense,
  LIGHT_ARMOR: Attribute.LightArmor,
  MEDIUM_ARMOR: Attribute.MediumArmor,
  HEAVY_ARMOR: Attribute.HeavyArmor,
};

export interface Item {
  name: string;
  id: number;
  count: number;
  weight: string;
  traits: Trait[];
  weapon: boolean;
}

export interface Weapon extends Item {
  attack: string;
  damage: string;
  hands: string;
  range?: number;
  reload?: string;
  capacity?: number;
  usage?: number;
}

export class Ability {
  name: string;
  id: number;
  level: number;
  type: AbilityType;
  source = '';
  description: string;
  activity: boolean;
  traits: Array<Trait> = [];
  cost?: Action;
  frequency?: string;
  requirements?: string;
  trigger?: string;
  code?: string;

  constructor(
    name: string,
    id: number,
    level: number,
    type: AbilityType,
    activity: boolean,
    description: string,
  ) {
    this.name = name;
    this.id = id;
    this.level = level;
    this.type = type;
    this.activity = activity;
    this.description = parseDescription(description);
  }
}

export class Spell {
  name: string;
  id: number;
  level = 0;
  description = '';
  cost: Action = Action.Free;
  maxCost?: Action;
  castTime = '';
  components?: Array<string> = [];
  source = '';
  traits: Array<Trait> = [];
  requirements = '';
  range = '';
  area = '';
  targets = '';
  duration = '';
  save = '';
  innate = false;
  castsPerDay?: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

export type SpellList = {
  name: string;
  attack_attr: Attribute;
  dc_attr: Attribute;
  attack: number;
  dc: number;
  type: string;
  tradition: string;
  score: Score;
  known: Array<Array<Spell>>;
  slots: Array<number>;
  focus: Array<Spell>;
};

interface DataEntry {
  id: number;
  name: string;
  description: string;
}
export class Trait {
  name: string;
  description: string;
  id: number;

  private static trait_map: { [id: number]: Trait } = {};

  private constructor(name: string, id: number, description: string) {
    this.name = name
      .replace(' (legacy)', 'ᴸ')
      .replace(' - Item', 'ᴵ')
      .replace(' Archetype', 'ᴬ');
    this.id = id;
    this.description = description ? parseDescription(description) : '';
  }

  // DB
  private static db: { [id: number]: DataEntry } = {};
  public static setDB(db: Array<DataEntry>) {
    for (const entry of db) {
      this.db[entry.id] = entry;
    }
  }

  // DB Access
  static map(traits: Array<number>): Trait[] {
    return traits.map((id: number) => Trait.getFromDB(id));
  }
  public static getFromDB(id: number) {
    if (this.trait_map[id]) return this.trait_map[id];
    if (!this.trait_map[id] && this.db[id]) {
      this.trait_map[id] = new Trait(
        this.db[id].name.replaceAll(' (Playtest)', 'ᴾ'),
        id,
        this.db[id].description,
      );
      return this.trait_map[id];
    }
    return new Trait(id.toString(), id, '');
  }

  // === Legacy stuff ===
  public static createIfAbsent(
    name: string,
    id: number,
    description = '',
  ): Trait {
    if (this.trait_map[id]) return this.trait_map[id];
    const trait = new Trait(name, id, description);
    this.trait_map[id] = trait;
    return trait;
  }

  // === Legacy stuff ===
  public static dummy(name: string) {
    return new Trait(name, -1, '');
  }
}

const sources: { [id: number]: string } = {
  1: 'PC1',
  7: 'GMC',
  8: 'MC',
  11: 'CRB',
  12: 'DA',
  13: 'SoM',
  14: 'APG',
  15: 'RoE',
  16: 'TV',
  17: 'G&G',
  18: 'AG',
  19: 'CG',
  20: 'Abs',
  21: 'Fbs',
  23: 'GB',
  24: 'IL',
  25: 'KoL',
  28: 'ME',
  29: 'PFS',
  31: 'WG',
  35: 'P#183',
  41: 'P#176',
  42: 'P#172',
  51: 'BotD',
  146: 'Hh',
  185: 'HotW',
  256: 'PC2',
  276: 'SF2',
  318: 'TXCG',
  400: 'WoI',
};

export function getSource(id: number) {
  if (!sources[id]) console.log('Missing Source Name: ' + id);
  return sources[id] ?? id.toString();
}
