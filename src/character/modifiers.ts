import Character from './character';
import {
  ac,
  attacks,
  Attribute,
  attrScore,
  DamageInstance,
  notChecksAndDCs,
  saves,
  Score,
  skills,
  SpellList,
  Weapon,
} from './model';

export enum StatModType {
  None = '',
  Item = 'Item',
  Status = 'Status',
  Circumstance = 'Circumstance',
}
export class StatMod {
  type: StatModType;
  attrs: Array<Attribute>;
  amount: number;

  constructor(
    type = StatModType.None,
    attrs: Array<Attribute> = [],
    amount = 0,
  ) {
    this.type = type;
    this.attrs = attrs;
    this.amount = amount;
  }

  static clone(mod: StatMod): StatMod {
    return new StatMod(mod.type, [...mod.attrs], mod.amount);
  }
}
export class ModEffect {
  name: string;
  statMods: StatMod[];
  enabled;

  constructor(
    name: string = '',
    statMods: StatMod[] = [],
    enabled: boolean = false,
  ) {
    this.name = name;
    this.statMods = statMods;
    this.enabled = enabled;
  }

  apply(
    modifiedAttr: Attribute,
    character: Character,
    bonuses: ModNumberList,
    penalties: ModNumberList,
    score?: Score,
  ) {
    for (const sMod of this.statMods) {
      let amount = sMod.amount;
      let matches = false;
      for (const attr of sMod.attrs) {
        let good = false;
        switch (attr) {
          case Attribute.ChecksAndDCs: {
            good = !notChecksAndDCs.includes(modifiedAttr);
            break;
          }
          case Attribute.Attacks: {
            good =
              attacks.includes(modifiedAttr) ||
              modifiedAttr == Attribute.SpellAttacks;
            break;
          }
          case Attribute.Saves: {
            good = saves.includes(modifiedAttr);
            break;
          }
          case Attribute.SkillChecks: {
            good = skills.includes(modifiedAttr);
            break;
          }
          case Attribute.AC: {
            good = attr == modifiedAttr || ac.includes(modifiedAttr);
            break;
          }
          case Attribute.ConChecks: {
            if (modifiedAttr == Attribute.HP) {
              good = true;
              amount *= character.level;
              break;
            }
            // falls through
          }
          case Attribute.StrChecks:
          case Attribute.DexChecks:
          case Attribute.IntChecks:
          case Attribute.WisChecks:
          case Attribute.ChaChecks: {
            const aScore = attrScore[Attribute[attr]];
            if (aScore === undefined) break;
            good = aScore == (score ?? attrScore[Attribute[modifiedAttr]]);
            break;
          }
          default: {
            good = attr == modifiedAttr;
            break;
          }
        }
        if (good) {
          matches = true;
          break;
        }
      }
      if (!matches) continue;
      if (amount > 0) {
        bonuses[sMod.type] = Math.max(bonuses[sMod.type], amount);
      } else if (amount < 0) {
        penalties[sMod.type] = Math.min(penalties[sMod.type], amount);
      }
    }
  }

  static clone(mod: ModEffect): ModEffect {
    return new ModEffect(
      mod.name,
      mod.statMods.map((sm) => StatMod.clone(sm)),
      mod.enabled,
    );
  }
}

type ConditionList = { [c in Condition]?: number | boolean };
export class ConditionData extends ModEffect {
  private _value = 0;
  readonly condition: Condition;
  readonly has_value: boolean;
  readonly icon: string;
  readonly child_conditions: ConditionList;

  private _lock_minimum: ConditionList = {};
  get lock_minimum() {
    return this._lock_minimum;
  }

  constructor(
    condition: Condition,
    statMods: StatMod[],
    icon: string,
    child_conditions?: ConditionList,
    has_value?: boolean,
  ) {
    super(condition, statMods, true);
    this.condition = condition;
    this.icon = icon;
    this.has_value = has_value ?? false;
    this.child_conditions = child_conditions ?? {};
  }

  get locked(): boolean {
    if (this.has_value) {
      return (
        this._value <=
        Math.max(
          0,
          ...Object.values(this.lock_minimum).filter(
            (s) => typeof s === 'number',
          ),
        )
      );
    }
    return Object.values(this.lock_minimum).length > 0;
  }

  get value(): number {
    return Math.max(
      this._value,
      ...Object.values(this.lock_minimum).filter((s) => typeof s === 'number'),
    );
  }
  private set value(value: number) {
    if (value < 0 || !Number.isInteger(value)) return;
    this._value = value;
    for (const statMod of this.statMods) {
      statMod.amount = value * -1;
    }
  }

  static override clone(mod: ConditionData, value?: number): ConditionData {
    const cc: ConditionList = {};
    Object.assign(cc, mod.child_conditions);
    const c = new ConditionData(
      mod.condition,
      mod.statMods.map((sm) => StatMod.clone(sm)),
      mod.icon,
      cc,
      mod.has_value,
    );
    if (c.has_value && value !== undefined) c.value = value;
    return c;
  }

  static add(condition: Condition, character: Character) {
    if (
      !conditionEffects[condition].has_value &&
      character.conditions[condition]
    )
      return;
    if (!character.conditions[condition]) {
      character.conditions[condition] = ConditionData.clone(
        conditionEffects[condition],
      );

      const c = character.conditions[condition];

      for (const [cs, amount] of Object.entries(c.child_conditions)) {
        const condition = cs as Condition;
        character.conditions[condition] =
          character.conditions[condition] ??
          ConditionData.clone(conditionEffects[condition]);
        const data = character.conditions[condition];
        data.lock_minimum[condition] = amount;
      }
    }
    character.conditions[condition].value += 1;
  }

  static remove(condition: Condition, character: Character) {
    if (
      !character.conditions[condition] ||
      (character.conditions[condition].locked &&
        !character.conditions[condition].has_value)
    )
      return;
    if (
      character.conditions[condition].has_value &&
      character.conditions[condition].value > 0
    ) {
      character.conditions[condition].value -= 1;
      if (character.conditions[condition].value > 0) {
        return;
      }
    }

    for (const [cs] of Object.entries(
      character.conditions[condition].child_conditions,
    )) {
      const condition = cs as Condition;
      const data = character.conditions[condition];
      if (data === undefined) return;
      delete data.lock_minimum[condition];
      if (!data.has_value || data.value == 0) {
        this.remove(data.condition, character);
      }
    }

    delete character.conditions[condition];
  }
}

export enum Condition {
  Blinded = 'Blinded',
  Clumsy = 'Clumsy',
  Drained = 'Drained',
  Encumbered = 'Encumbered',
  Enfeebled = 'Enfeebled',
  Fascinated = 'Fascinated',
  Fatigued = 'Fatigued',
  Frightened = 'Frightened',
  OffGuard = 'Off-Guard',
  Prone = 'Prone',
  Sickened = 'Sickened',
  Stupefied = 'Stupefied',
  Unconscious = 'Unconscious',
}

export const conditionEffects: { [condition in Condition]: ConditionData } = {
  [Condition.Blinded]: new ConditionData(
    Condition.Blinded,
    [new StatMod(StatModType.Status, [Attribute.Perception], -4)],
    'visibility_off',
  ),
  [Condition.Clumsy]: new ConditionData(
    Condition.Clumsy,
    [new StatMod(StatModType.Status, [Attribute.DexChecks], -1)],
    'ra-player-despair',
    undefined,
    true,
  ),
  [Condition.Drained]: new ConditionData(
    Condition.Drained,
    [new StatMod(StatModType.Status, [Attribute.ConChecks], -1)],
    'ra-bleeding-hearts',
    undefined,
    true,
  ),
  [Condition.Encumbered]: new ConditionData(
    Condition.Encumbered,
    [new StatMod(StatModType.None, [Attribute.Speeds], -10)],
    'ra-boot-stomp',
    { [Condition.Clumsy]: 1 },
  ),
  [Condition.Enfeebled]: new ConditionData(
    Condition.Enfeebled,
    [new StatMod(StatModType.Status, [Attribute.StrChecks], -1)],
    'ra-broken-bone',
    undefined,
    true,
  ),
  [Condition.Fascinated]: new ConditionData(
    Condition.Fascinated,
    [
      new StatMod(
        StatModType.Status,
        [Attribute.Perception, Attribute.SkillChecks],
        -2,
      ),
    ],
    'ra-eyeball',
  ),
  [Condition.Fatigued]: new ConditionData(
    Condition.Fatigued,
    [new StatMod(StatModType.Status, [Attribute.AC, Attribute.Saves], -1)],
    'ra-broken-skull',
  ),
  [Condition.Frightened]: new ConditionData(
    Condition.Frightened,
    [new StatMod(StatModType.Status, [Attribute.ChecksAndDCs], -1)],
    'priority_high',
    undefined,
    true,
  ),
  [Condition.OffGuard]: new ConditionData(
    Condition.OffGuard,
    [new StatMod(StatModType.Circumstance, [Attribute.AC], -2)],
    'ra-uncertainty',
  ),
  [Condition.Prone]: new ConditionData(
    Condition.Prone,
    [new StatMod(StatModType.Circumstance, [Attribute.Attacks], -2)],
    'ra-falling',
    { [Condition.OffGuard]: true },
  ),
  [Condition.Sickened]: new ConditionData(
    Condition.Sickened,
    [new StatMod(StatModType.Status, [Attribute.ChecksAndDCs], -1)],
    'o_sick',
    undefined,
    true,
  ),
  [Condition.Stupefied]: new ConditionData(
    Condition.Stupefied,
    [
      new StatMod(
        StatModType.Status,
        [Attribute.IntChecks, Attribute.WisChecks, Attribute.ChaChecks],
        -1,
      ),
    ],
    'o_psychology_alt',
    undefined,
    true,
  ),
  [Condition.Unconscious]: new ConditionData(
    Condition.Unconscious,
    [
      new StatMod(
        StatModType.Status,
        [Attribute.AC, Attribute.Perception, Attribute.Reflex],
        -4,
      ),
    ],
    'airline_seat_flat',
    { [Condition.Blinded]: true, [Condition.OffGuard]: true },
  ),
};

export function applyMods(character: Character, modifiedAttr: Attribute) {
  const attrEntry = character.attributes[modifiedAttr];
  const [bonuses, penalties] = calculateMods(
    character,
    modifiedAttr,
    attrEntry.itemBonus,
  );
  const rawTotal = attrEntry.total - attrEntry.itemBonus;
  return (
    rawTotal +
    Object.values(bonuses).reduce((a, b) => a + b, 0) +
    Object.values(penalties).reduce((a, b) => a + b, 0)
  );
}

export function applyAttackMods(character: Character, weapon: Weapon) {
  let score: Score = Score.Strength;
  if (
    (character.scores[Score.Dexterity] > character.scores[Score.Strength] &&
      weapon.traits.some((t) => t.name.startsWith('Finesse'))) ||
    (weapon.range !== undefined &&
      !weapon.traits.some((t) => t.name.startsWith('Thrown')))
  ) {
    score = Score.Dexterity;
  }
  const [bonuses, penalties] = calculateMods(
    character,
    Attribute.Attacks,
    weapon.potency,
    score,
  );

  return (
    weapon.attack -
    weapon.potency +
    Object.values(bonuses).reduce((a, b) => a + b, 0) +
    Object.values(penalties).reduce((a, b) => a + b, 0)
  );
}

export function applyDamageMods(
  character: Character,
  weapon: Weapon,
): DamageInstance {
  const score: Score | undefined =
    weapon.range === undefined ||
    weapon.traits.some((t) => t.name.startsWith('Thrown'))
      ? Score.Strength
      : undefined;
  const [bonuses, penalties] = calculateMods(
    character,
    Attribute.DamageRolls,
    undefined,
    score,
  );
  const damage = weapon.damage;
  return new DamageInstance(
    damage.bonus +
      Object.values(bonuses).reduce((a, b) => a + b, 0) +
      Object.values(penalties).reduce((a, b) => a + b, 0),
    damage.damageType,
    damage.dice,
    damage.die,
  );
}

export function applyACMods(character: Character): number {
  const [bonuses, penalties] = calculateMods(
    character,
    Attribute.AC,
    character.combat.armor.ac,
  );

  return (
    character.ac -
    character.combat.armor.ac +
    Object.values(bonuses).reduce((a, b) => a + b, 0) +
    Object.values(penalties).reduce((a, b) => a + b, 0)
  );
}

export function applySpellAttackMods(
  character: Character,
  list: SpellList,
): number {
  const [bonuses, penalties] = calculateMods(
    character,
    Attribute.SpellAttacks,
    0,
    list.score,
  );
  return (
    list.attack +
    Object.values(bonuses).reduce((a, b) => a + b, 0) +
    Object.values(penalties).reduce((a, b) => a + b, 0)
  );
}

export function applySpellDCMods(
  character: Character,
  list: SpellList,
): number {
  const [bonuses, penalties] = calculateMods(
    character,
    Attribute.SpellDCs,
    0,
    list.score,
  );
  return (
    list.dc +
    Object.values(bonuses).reduce((a, b) => a + b, 0) +
    Object.values(penalties).reduce((a, b) => a + b, 0)
  );
}

type ModNumberList = { [s in StatModType]: number };
export function calculateMods(
  character: Character,
  modifiedAttr: Attribute,
  itemBonus: number = 0,
  score?: Score,
): [ModNumberList, ModNumberList] {
  const bonuses: ModNumberList = {
    [StatModType.None]: 0,
    [StatModType.Item]: Math.max(0, itemBonus),
    [StatModType.Status]: 0,
    [StatModType.Circumstance]: 0,
  };
  const penalties: ModNumberList = {
    [StatModType.None]: 0,
    [StatModType.Item]: Math.min(0, itemBonus),
    [StatModType.Status]: 0,
    [StatModType.Circumstance]: 0,
  };

  const conditionsList = Object.values(character.conditions);
  const condCount = conditionsList.length;
  for (let i = 0; i < condCount + character.modifiers.length; i++) {
    const mod =
      i < condCount ? conditionsList[i] : character.modifiers[i - condCount];
    if (mod == undefined || !mod.enabled) continue;
    mod.apply(modifiedAttr, character, bonuses, penalties, score);
  }
  return [bonuses, penalties];
}
