import { Reactive } from 'vue';
import { makeSource, parseDescription } from './util';
import * as LS from '@/pages/localStorage';

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
  Free = '◇',
  Reaction = '↩',
  One = '1',
  Two = '2',
  OnePlus = '1+',
  TwoPlus = '2+',
  Three = '3',
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
  StrChecks,
  DexChecks,
  ConChecks,
  IntChecks,
  WisChecks,
  ChaChecks,
  ChecksAndDCs,
  HP,
  Speeds,
  MultipleAttackPenalty,
  ImpulseAttacks,
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
  AC: Score.Dexterity,
  LoreChecks: Score.Intelligence,
  StrChecks: Score.Strength,
  DexChecks: Score.Dexterity,
  ConChecks: Score.Constitution,
  IntChecks: Score.Intelligence,
  WisChecks: Score.Wisdom,
  ChaChecks: Score.Charisma,
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
  Attribute.Attacks,
];

export const saves = [Attribute.Fortitude, Attribute.Reflex, Attribute.Will];

export const ac = [
  Attribute.UnarmoredDefense,
  Attribute.LightArmor,
  Attribute.MediumArmor,
  Attribute.HeavyArmor,
];

export const notChecksAndDCs = [
  Attribute.HP,
  Attribute.DamageRolls,
  Attribute.Speeds,
  Attribute.MultipleAttackPenalty,
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
  value: {
    [score in Score]: number;
  };
  history: {
    [score in Score]: string[];
  };
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

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Verifier<T> = (t: Partial<Mutable<T>>) => t is Mutable<T>;

export interface Builder<T> {
  partial: Partial<Mutable<T>>;
  build(): T;
}
export abstract class ABuilder<T> {
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

export enum Rarity {
  Common,
  Uncommon,
  Rare,
  Unique,
  COUNT,
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
  readonly rarity: Rarity;

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
    this.rarity = i.rarity;
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
  readonly potency: number;
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
    this.potency = w.potency ?? 0;
  }

  public static WBuilder = class extends ABuilder<Weapon> {
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

export abstract class PrintableDamage {
  abstract getDamageInstances(): DamageInstance[];
  abstract splitString(): string[];
  abstract double(): PrintableDamage;

  toString(): string {
    return this.splitString().join('');
  }
}

export class DamageInstance extends PrintableDamage {
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
    super();
    this.bonus = bonus;
    this.damageType = DamageType.get(damageType);
    this.dice = dice;
    this.die = die;
  }

  getDamageInstances(): DamageInstance[] {
    return [this];
  }

  double(): DamageInstance {
    return new DamageInstance(
      this.bonus * 2,
      this.damageType,
      this.dice * 2,
      this.die,
    );
  }

  get diceString(): string {
    return this.dice > 0 ? this.dice + this.die : '';
  }

  get damageString(): string {
    return this.bonus != 0
      ? (this.bonus > 0 ? (this.dice > 0 ? '+' : '') : '-') +
          Math.abs(this.bonus)
      : '';
  }

  get typeString(): string {
    return ' ' + this.damageType.shortName;
  }

  splitString(): string[] {
    const damage: string[] = [];
    if (this.dice > 0) {
      damage.push(this.diceString);
    }
    if (this.bonus != 0) {
      damage.push(this.damageString);
    }
    damage.push(this.typeString);
    return damage;
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

export class MultiDamageInstance extends PrintableDamage {
  readonly instances: DamageInstance[];

  constructor(instances: DamageInstance[]) {
    super();
    this.instances = instances;
  }

  getDamageInstances(): DamageInstance[] {
    return this.instances;
  }

  double(): MultiDamageInstance {
    return new MultiDamageInstance(
      this.instances.map((instance) => instance.double() as DamageInstance),
    );
  }

  splitString(): string[] {
    const damage: string[] = [];
    for (const instance of this.instances) {
      damage.push(...instance.splitString());
      damage.push('+');
    }
    damage.pop();
    return damage;
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

  override double(): Rune {
    return new Rune(
      this.bonus * 2,
      this.damageType,
      this.dice * 2,
      this.die,
      this.name,
      this.description,
    );
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
  rarity: Rarity;

  constructor(
    name: string,
    id: number,
    level: number,
    type: AbilityType,
    activity: boolean,
    source: Source,
    traits: Trait[],
    description: string,
    rarity: Rarity,
    context?: CharacterContext,
  ) {
    this.name = name;
    this.id = id;
    this.level = level;
    this.type = type;
    this.activity = activity;
    this.source = source;
    this.traits = traits;
    this.description = parseDescription(description, context);
    this.rarity = rarity;
    this.rawDescription = description;
  }
}

export class Spell {
  readonly name: string;
  readonly id: number;
  readonly level = 0;
  readonly description: string = '';
  readonly cost: Action = Action.Free;
  readonly maxCost?: Action;
  readonly castTime = '';
  readonly components?: Array<string> = [];
  readonly source = Source.None;
  readonly traits: Array<Trait> = [];
  readonly requirements = '';
  readonly range = '';
  readonly area = '';
  readonly targets = '';
  readonly duration = '';
  readonly save: string = '';
  readonly innate: boolean = false;
  readonly castsPerDay?: number;
  readonly heightening = new Heightening(0);
  readonly traditions = new Array<string>();
  readonly rarity: Rarity = Rarity.Common;

  protected constructor(w: Mutable<Spell>) {
    this.name = w.name;
    this.id = w.id;
    const record = this as unknown as Record<string, unknown>;
    for (const [k, v] of Object.entries(w as Record<string, unknown>)) {
      record[k] = v;
    }
  }

  static getFavourite(spell: Spell, characterName: string): boolean {
    return (
      LS.load(characterName, 'spells', 'favourites', spell.id.toString()) ??
      false
    );
  }
  static setFavourite(spell: Spell, favourite: boolean, characterName: string) {
    if (favourite) {
      LS.save(
        characterName,
        favourite,
        'spells',
        'favourites',
        spell.id.toString(),
      );
    } else {
      LS.remove(characterName, 'spells', 'favourites', spell.id.toString());
    }
  }

  static SBuilder = class extends ABuilder<Spell> {
    constructor(name?: string, id?: number) {
      super((t: Mutable<Spell>) => new Spell(t));
      if (name !== undefined && id !== undefined) {
        this.partial.name = name;
        this.partial.id = id;
      }
    }
  };
}

export class Heightening {
  intervals = Array<number>();
  fixed = Array<number>();
  readonly base: number;
  constructor(base: number) {
    this.base = base;
  }

  includes(level: number): boolean {
    if (this.fixed.includes(level)) return true;
    for (const increment of this.intervals) {
      for (let l = this.base; l <= 10; l += increment) {
        if (level == l) return true;
      }
    }
    return false;
  }
}

export interface SignatureInfo {
  fixed: Array<number>;
  leq: Array<number>;
  spells: Reactive<{ [id: number]: Spell }>;
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
  signature: SignatureInfo;
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

let sourceDataMissing = false;

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
    if (!sourceDataMissing) {
      sourceDataMissing = true;

      alert(
        "This character is missing info for a source it uses! Please re-export from Wanderer's Guide, and report this as a bug if that doesn't fix it.",
      );
    }
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

export type CharacterContext = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  level: number;
};
