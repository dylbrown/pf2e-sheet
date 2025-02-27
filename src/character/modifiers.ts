import Character from './character';
import {
  ac,
  attacks,
  Attribute,
  attrScore,
  DamageInstance,
  saves,
  skills,
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

  static clone(mod: ModEffect): ModEffect {
    return new ModEffect(
      mod.name,
      mod.statMods.map((sm) => StatMod.clone(sm)),
      mod.enabled,
    );
  }
}

export class ConditionData extends ModEffect {
  private _value = 1;
  readonly has_value: boolean;
  readonly icon: string;
  constructor(name: string, statMods: StatMod[], icon: string, value?: number) {
    super(name, statMods, true);
    this.icon = icon;
    this.has_value = value !== undefined;
    if (value !== undefined) this._value = value;
  }

  get value(): number {
    return this._value;
  }
  set value(value: number) {
    if (value < 0 || !Number.isInteger(value)) return;
    this._value = value;
    for (const statMod of this.statMods) {
      statMod.amount = value * -1;
    }
  }

  static override clone(mod: ConditionData): ConditionData {
    return new ConditionData(
      mod.name,
      mod.statMods.map((sm) => StatMod.clone(sm)),
      mod.icon,
      mod.has_value ? mod.value : undefined,
    );
  }
}

export enum Condition {
  Blinded = 'Blinded',
  Clumsy = 'Clumsy',
  Drained = 'Drained',
  Enfeebled = 'Enfeebled',
  Fascinated = 'Fascinated',
  Fatigued = 'Fatigued',
  Frightened = 'Frightened',
  OffGuard = 'Off-Guard',
  Sickened = 'Sickened',
  Stupefied = 'Stupefied',
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
    1,
  ),
  [Condition.Drained]: new ConditionData(
    Condition.Drained,
    [new StatMod(StatModType.Status, [Attribute.ConChecks], -1)],
    'ra-bleeding-hearts',
    1,
  ),
  [Condition.Enfeebled]: new ConditionData(
    Condition.Enfeebled,
    [new StatMod(StatModType.Status, [Attribute.StrChecks], -1)],
    'ra-broken-bone',
    1,
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
    1,
  ),
  [Condition.OffGuard]: new ConditionData(
    Condition.OffGuard,
    [new StatMod(StatModType.Circumstance, [Attribute.AC], -2)],
    'ra-uncertainty',
  ),
  [Condition.Sickened]: new ConditionData(
    Condition.Sickened,
    [new StatMod(StatModType.Status, [Attribute.ChecksAndDCs], -1)],
    'o_sick',
    1,
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
    1,
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

export function applyAttackMods(character: Character, base: number) {
  const bonuses: ModNumberList = {
    [StatModType.None]: 0,
    [StatModType.Item]: 0, // TODO: determine
    [StatModType.Status]: 0,
    [StatModType.Circumstance]: 0,
  };
  const penalties: ModNumberList = {
    [StatModType.None]: 0,
    [StatModType.Item]: 0, // TODO: determine
    [StatModType.Status]: 0,
    [StatModType.Circumstance]: 0,
  };

  const conditionsList = Object.values(character.conditions);
  const condCount = conditionsList.length;
  for (let i = 0; i < condCount + character.modifiers.length; i++) {
    const mod =
      i < condCount ? conditionsList[i] : character.modifiers[i - condCount];
    if (mod == undefined || !mod.enabled) continue;
    for (const sMod of mod.statMods) {
      if (
        sMod.type == StatModType.Item ||
        !sMod.attrs.includes(Attribute.Attacks)
      )
        continue;
      if (sMod.amount > 0) {
        bonuses[sMod.type] = Math.max(bonuses[sMod.type], sMod.amount);
      } else if (sMod.amount < 0) {
        penalties[sMod.type] = Math.min(penalties[sMod.type], sMod.amount);
      }
    }
  }

  return (
    base +
    Object.values(bonuses).reduce((a, b) => a + b, 0) +
    Object.values(penalties).reduce((a, b) => a + b, 0)
  );
}

export function applyDamageMods(
  character: Character,
  damage: DamageInstance,
): DamageInstance {
  const [bonuses, penalties] = calculateMods(character, Attribute.DamageRolls);

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

type ModNumberList = { [s in StatModType]: number };
export function calculateMods(
  character: Character,
  modifiedAttr: Attribute,
  itemBonus: number = 0,
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
    for (const sMod of mod.statMods) {
      let amount = sMod.amount;
      let matches = false;
      for (const attr of sMod.attrs) {
        let good = false;
        switch (attr) {
          case Attribute.ChecksAndDCs: {
            good = ![Attribute.HP, Attribute.DamageRolls].includes(
              modifiedAttr,
            );
            break;
          }
          case Attribute.Attacks: {
            good = attacks.includes(modifiedAttr);
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
            const score = attrScore[Attribute[attr]];
            if (score === undefined) break;
            good = score == attrScore[Attribute[modifiedAttr]];
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
  return [bonuses, penalties];
}
