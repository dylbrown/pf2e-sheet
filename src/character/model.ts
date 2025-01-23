import { makeSource, parseDescription } from './util';

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
  instanceID: string;
  count: number;
  weight: string;
  traits: Trait[];
  weapon: boolean;
  description: string;
  source: Source;
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
  source = Source.None;
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
  source = Source.None;
  traits: Array<Trait> = [];
  requirements = '';
  range = '';
  area = '';
  targets = '';
  duration = '';
  save = '';
  innate = false;
  castsPerDay?: number;
  heightening = new Heightening();
  traditions = new Array<string>();

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

export class Heightening {
  intervals = Array<number>();
  fixed = Array<number>();
  constructor() {}
}

export type SpellList = {
  name: string;
  attack_attr: Attribute;
  dc_attr: Attribute;
  attack: number;
  dc: number;
  type: SpellListType;
  fullTradition: boolean;
  tradition: string;
  score: Score;
  known: Array<Array<Spell>>;
  heightenedKnown: Array<Array<Spell>>;
  slots: Array<number>;
  focus: Array<Spell>;
};

export enum SpellListType {
  None = '',
  Prepared = 'Prepared',
  Spontaneous = 'Spontaneous',
  Innate = 'Innate',
  FocusOnly = 'Focus Only',
}

interface DataEntry {
  id: number;
  name: string;
  description: string;
}

abstract class AbstractDataEntry implements DataEntry {
  readonly name: string;
  readonly description: string;
  readonly id: number;

  protected constructor(name: string, id: number, description: string) {
    this.name = name
      .replace(' (legacy)', 'ᴸ')
      .replace(' - Item', 'ᴵ')
      .replace(' Archetype', 'ᴬ');
    this.id = id;
    this.description = description ? parseDescription(description) : '';
  }
}

class StaticBank<T extends DataEntry> {
  private bank: { [id: number]: T } = {};
  private ctor: (e: DataEntry) => T;

  public constructor(ctor: (e: DataEntry) => T) {
    this.ctor = ctor;
  }

  // DB
  public build(db: Array<DataEntry>) {
    for (const entry of db ?? []) {
      this.bank[entry.id] = this.ctor(entry);
    }
  }

  // DB Access
  public map(ts: Array<number>): T[] {
    return ts.map((id: number) => this.get(id));
  }
  public get(id: number) {
    if (this.bank[id]) return this.bank[id];
    return this.ctor({ name: id.toString(), id: id, description: '' });
  }

  // === Legacy stuff ===
  public createIfAbsent(name: string, id: number, description = ''): Trait {
    if (this.bank[id]) return this.bank[id];
    const trait = this.ctor({ name, id, description });
    this.bank[id] = trait;
    return trait;
  }

  // === Legacy stuff ===
  public dummy(name: string) {
    return this.ctor({ name, id: -1, description: '' });
  }
}
export class Trait extends AbstractDataEntry {
  public static readonly bank = new StaticBank<Trait>(
    (e) => new Trait(e.name, e.id, e.description),
  );
}
export class Source extends AbstractDataEntry {
  public static readonly bank = new StaticBank<Source>(
    (e) => new Source(makeSource(e.name), e.id, e.description),
  );

  public static readonly None = new Source('', -1, '');
}
