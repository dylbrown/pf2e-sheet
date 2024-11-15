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
  Free = 'F',
  Reaction = 'R',
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
  ArcaneSpellAttacks,
  ArcaneSpellDCs,
  DivineSpellAttacks,
  DivineSpellDCs,
  OccultSpellAttacks,
  OccultSpellDCs,
  PrimalSpellAttacks,
  PrimalSpellDCs,
}

export const attrScore: { [a in Attribute as string]: Score } = {
  Acrobatics: Score.Dexterity,
  Arcana: Score.Intelligence,
  Athletics: Score.Strength,
  Crafting: Score.Intelligence,
  Deception: Score.Charisma,
  Diplomacy: Score.Charisma,
  Intimidation: Score.Charisma,
  Medicine: Score.Wisdom,
  Nature: Score.Wisdom,
  Occultism: Score.Intelligence,
  Performance: Score.Charisma,
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
  traits: string[];
  weapon: boolean;
}

export interface Weapon extends Item {
  attack: string;
  damage: string;
  hands: string;
  range?: number;
  reload?: number;
}

export class Ability {
  name: string;
  id: number;
  level: number;
  type: AbilityType;
  source = '';
  description: string;
  activity: boolean;
  traits: Array<string> = [];
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
    description: string
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
  components: Array<string> = [];
  source = '';
  traits: Array<string> = [];
  requirements = '';
  range = '';
  area = '';
  targets = '';
  duration = '';
  save = '';

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
