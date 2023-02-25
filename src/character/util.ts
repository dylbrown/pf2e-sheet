import { Ability } from './model';

export function abilityMod(score: number) {
  return signed(Math.floor((score - 10) / 2));
}

export function nonzero(num: number) {
  return num != 0 ? signed(num) : '';
}

export function signed(num: number) {
  return num < 0 ? '-' + num : '+' + num;
}

export function types(
  abilities: Array<Ability>,
  include: Array<string>,
  exclude: Array<string>
) {
  return abilities.filter(
    (value: Ability) =>
      (include.length == 0 || include.includes(value.type)) &&
      !exclude.includes(value.type)
  );
}
