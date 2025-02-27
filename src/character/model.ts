import { makeSource, parseDescription } from './util';
import type vm from 'node:vm';

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
  OnePlus = '1+',
  TwoPlus = '2+',
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
  Attacks,
  DamageRolls,
  Saves,
  SkillChecks,
  AC,
  LoreChecks,
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

export const attacks = [
  Attribute.UnarmedAttacks,
  Attribute.SimpleWeapons,
  Attribute.MartialWeapons,
  Attribute.AdvancedWeapons,
];

export const saves = [Attribute.Fortitude, Attribute.Reflex, Attribute.Will];

export const ac = [
  Attribute.UnarmoredDefense,
  Attribute.LightArmor,
  Attribute.MediumArmor,
  Attribute.HeavyArmor,
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

export type Scores = {
  [score in Score]: number;
};

export type AttributeEntry = {
  total: number;
  score: Score;
  itemBonus: number;
  level: number;
  proficiency: Proficiency;
};

export type Attributes = {
  [attribute in Attribute]: AttributeEntry;
};

export type Lores = {
  [lore: string]: AttributeEntry;
};

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Verifier<T> = (t: Partial<Mutable<T>>) => t is Mutable<T>;

export interface Builder<T> {
  partial: Partial<Mutable<T>>;
  build(): T;
}
abstract class ABuilder<T> {
  partial: Partial<Mutable<T>>;
  private ctor: (t: Mutable<T>) => T;

  protected constructor(
    ctor: (t: Mutable<T>) => T,
    partial: Partial<Mutable<T>> = {},
  ) {
    this.ctor = ctor;
    this.partial = partial;
  }

  private verify<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends { [P in K]?: any },
    K extends PropertyKey,
  >(obj: T, ...keys: K[]): obj is T & { [P in K]-?: Exclude<T[P], undefined> } {
    return keys.every((k) => obj[k] !== undefined);
  }

  build(): T {
    if (!this.verify(this.partial))
      throw Error('Failed to verify: ' + this.partial);
    return this.partial;
  }
}

export class Item {
  readonly name: string;
  readonly id: number;
  readonly instanceID: string;
  readonly count: number;
  readonly weight: string;
  readonly traits: Trait[];
  readonly weapon: boolean;
  readonly description: string;
  readonly source: Source;

  protected constructor(i: Mutable<Item>) {
    this.name = i.name;
    this.id = i.id;
    this.instanceID = i.instanceID;
    this.count = i.count;
    this.weight = i.weight;
    this.traits = i.traits;
    this.weapon = i.weapon;
    this.description = i.description;
    this.source = i.source;
  }
  private static verify(t: Partial<Mutable<Item>>): t is Mutable<Item> {
    throw new Error('Method not implemented.');
  }

  static Builder = class extends ABuilder<Item> {
    constructor() {
      super((t: Mutable<Item>) => new Item(t));
    }
  };
}

export class Weapon extends Item {
  readonly attack: number;
  readonly damage: DamageInstance;
  readonly hands: string;
  readonly range?: number;
  readonly reload?: string;
  readonly capacity?: number;
  readonly usage?: number;
  readonly runes: Rune[];

  protected constructor(w: Mutable<Weapon>) {
    super(w);
    this.attack = w.attack;
    this.damage = w.damage;
    this.hands = w.hands;
    if (w.range) this.range = w.range;
    if (w.reload) this.reload = w.reload;
    if (w.capacity) this.capacity = w.capacity;
    if (w.usage) this.usage = w.usage;
    this.runes = w.runes ?? [];
  }

  static WBuilder = class extends ABuilder<Weapon> {
    constructor(b?: Builder<Item>) {
      super((t: Mutable<Weapon>) => new Weapon(t), b?.partial);
      if (b) {
        b.partial = {};
      }
    }
  };
}

export class DamageType {
  private _shortName: string;
  readonly name: string;
  readonly priority: boolean;
  get shortName(): string {
    return this._shortName;
  }
  private constructor(name: string, shortName: string, priority: boolean) {
    this.name = name;
    this._shortName = shortName;
    this.priority = priority;
  }

  private static damageTypes: { [name: string]: DamageType } = {};
  private static nameKeys: { [name: string]: string | null } = {};
  static get(name: DamageType | string, priority: boolean = false): DamageType {
    if (name instanceof DamageType) return name;
    let dt = this.damageTypes[name.toLowerCase()];
    if (dt) return dt;
    const lastSpace = name.lastIndexOf(' ');
    let key = name
      .substring(0, lastSpace + 1)
      .replaceAll(/persistent /gi, 'P.');
    let finalWordKey = '';
    for (let i = 1; i <= name.length; i++) {
      const letter = name.substring(lastSpace + i, lastSpace + i + 1);
      const capitalized = i == 1 ? letter.toUpperCase() : letter.toLowerCase();
      key += capitalized;
      finalWordKey += capitalized;
      const nameKey = this.nameKeys[key];
      if (!nameKey && !this.nameKeys[finalWordKey]) break;
      else if (nameKey) {
        const conflict = this.damageTypes[nameKey.toLowerCase()];
        if (!conflict) break;
        if (!priority && conflict?.priority) continue;
        conflict._shortName += conflict.name[conflict._shortName.length];
        delete this.nameKeys[key];
        this.nameKeys[conflict._shortName] = nameKey;
      }
    }
    dt = new DamageType(name, key, priority);
    this.damageTypes[name.toLowerCase()] = dt;
    this.nameKeys[key] = name;
    return dt;
  }
}
DamageType.get('Slashing', true);
DamageType.get('Bludgeoning', true);
DamageType.get('Piercing', true);

export class DamageInstance {
  readonly bonus: number;
  readonly damageType: DamageType;
  readonly dice: number;
  readonly die: string;

  constructor(
    bonus: number,
    damageType: DamageType | string,
    dice: number,
    die: string,
  ) {
    this.bonus = bonus;
    this.damageType = DamageType.get(damageType);
    this.dice = dice;
    this.die = die;
  }

  splitString(): string[] {
    const damage: string[] = [];
    if (this.dice > 0) {
      damage[0] = this.dice + this.die;
    }
    if (this.bonus != 0) {
      if (damage[0])
        damage[1] = (this.bonus > 0 ? '+' : '-') + Math.abs(this.bonus);
      else damage[0] = this.bonus.toString();
    }
    damage.push(' ' + this.damageType.shortName);
    return damage;
  }

  toString(): string {
    return this.splitString().join('');
  }

  static parseFromString(s: string): DamageInstance {
    const dIndex = s.indexOf('d');
    const dice = dIndex != -1 ? parseInt(s.substring(0, dIndex)) : 0;
    const modIndex = s.search('[ +-]');
    const die =
      dice > 0
        ? s.substring(dIndex, modIndex == -1 ? undefined : modIndex)
        : '';
    const backwards = [...s].reverse().join('');
    const damageTypeIndex = s.length - backwards.search('[ \\d]');
    const bonus = parseInt(s.substring(Math.max(0, modIndex), damageTypeIndex));
    const damageType = s.substring(damageTypeIndex);
    return new DamageInstance(bonus, damageType, dice, die);
  }
}

export class Rune extends DamageInstance {
  name: string;
  description: string;

  constructor(
    bonus: number,
    damageType: DamageType | string,
    dice: number,
    die: string,
    name: string,
    description: string,
  ) {
    super(bonus, damageType, dice, die);
    this.name = name;
    this.description = description;
  }
}

export class Ability {
  name: string;
  id: number;
  level: number;
  type: AbilityType;
  source = Source.None;
  description: string;
  rawDescription: string;
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
    source: Source,
    traits: Trait[],
    description: string,
    context?: vm.Context,
  ) {
    this.name = name;
    this.id = id;
    this.level = level;
    this.type = type;
    this.activity = activity;
    this.source = source;
    this.traits = traits;
    this.description = parseDescription(description, context);
    this.rawDescription = description;
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

export interface SpellList {
  name: string;
  attack_attr: Attribute;
  dc_attr: Attribute;
  attack: number;
  dc: number;
  type: SpellListType;
  subtype: SpellListSubType;
  tradition: string;
  score: Score;
  known: Array<Array<Spell>>;
  heightenedKnown: Array<Array<Spell>>;
  slots: Array<number>;
  focus: Array<Spell>;
}

export interface ApparitionList extends SpellList {
  apparitions: Map<string, Ability>;
  vesselSpells: Map<Ability, string>;
  apparitionSkills: Map<Ability, string[]>;
  apparitionSpells: Map<Ability, string[]>;
  currentApparitions: string[];
}

export enum SpellListType {
  None = '',
  Prepared = 'Prepared',
  Spontaneous = 'Spontaneous',
  Innate = 'Innate',
  FocusOnly = 'Focus Only',
}

export enum SpellListSubType {
  None = '',
  List = 'List',
  Tradition = 'Tradition',
  Apparition = 'Apparition',
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
  public static readonly bank = new StaticBank<Trait>((e) => {
    if (e.description.includes(`deal ${e.name.toLowerCase()} damage`))
      DamageType.get(e.name);
    return new Trait(e.name, e.id, e.description);
  });
}
export class Source extends AbstractDataEntry {
  public static readonly bank = new StaticBank<Source>(
    (e) => new Source(makeSource(e.name), e.id, e.description),
  );

  public static readonly None = new Source('', -1, '');
}
