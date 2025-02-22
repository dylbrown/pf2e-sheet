import Character from './character';
import {
  ac,
  attacks,
  Attribute,
  Attributes,
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
  name: string = '';
  statMods: StatMod[] = [];
  enabled = false;

  static clone(mod: ModEffect): ModEffect {
    const newMod = new ModEffect();
    newMod.name = mod.name;
    newMod.enabled = mod.enabled;
    newMod.statMods = mod.statMods.map((sm) => StatMod.clone(sm));
    return newMod;
  }
}

export function applyMods(
  mods: ModEffect[],
  attrs: Attributes,
  modifiedAttr: Attribute,
) {
  const attrEntry = attrs[modifiedAttr];
  const [bonuses, penalties] = calculateMods(
    mods,
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

export function applyAttackMods(mods: ModEffect[], base: number) {
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

  for (const mod of mods) {
    if (!mod.enabled) continue;
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
  mods: ModEffect[],
  damage: DamageInstance,
): DamageInstance {
  const [bonuses, penalties] = calculateMods(mods, Attribute.DamageRolls);

  return new DamageInstance(
    damage.bonus +
      Object.values(bonuses).reduce((a, b) => a + b, 0) +
      Object.values(penalties).reduce((a, b) => a + b, 0),
    damage.damageType,
    damage.dice,
    damage.die,
  );
}

export function applyACMods(mods: ModEffect[], character: Character): number {
  const [bonuses, penalties] = calculateMods(
    mods,
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
  mods: ModEffect[],
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

  for (const mod of mods) {
    if (!mod.enabled) continue;
    for (const sMod of mod.statMods) {
      let matches = false;
      for (const attr of sMod.attrs) {
        let good = false;
        switch (attr) {
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
      if (sMod.amount > 0) {
        bonuses[sMod.type] = Math.max(bonuses[sMod.type], sMod.amount);
      } else if (sMod.amount < 0) {
        penalties[sMod.type] = Math.min(penalties[sMod.type], sMod.amount);
      }
    }
  }
  return [bonuses, penalties];
}
