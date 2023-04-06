import { Ability, AbilityType, Action, Score } from './model';

export function abilityMod(score: number) {
  return signed(Math.floor((score - 10) / 2));
}

export function nonzero(num: number) {
  return num != 0 ? signed(num) : '';
}

export function signed(num: number) {
  return num < 0 ? num : '+' + num;
}

export function types(
  abilities: Array<Ability>,
  include: Array<AbilityType>,
  exclude: Array<AbilityType>
) {
  return abilities.filter(
    (value: Ability) =>
      (include.length == 0 || include.includes(value.type)) &&
      !exclude.includes(value.type)
  );
}

export function getScore(s: string) {
  switch (s.substring(0, 3).toLowerCase()) {
    case 'str':
      return Score.Strength;
    case 'dex':
      return Score.Dexterity;
    case 'con':
      return Score.Constitution;
    case 'int':
      return Score.Intelligence;
    case 'wis':
      return Score.Wisdom;
    case 'cha':
      return Score.Charisma;
  }
  return -1 as Score;
}

export function getAbilityType(type: string) {
  switch (type) {
    case 'classFeature':
      return AbilityType.ClassFeature;
    case 'skill':
      return AbilityType.SkillFeat;
    case 'general':
      return AbilityType.GeneralFeat;
    case 'ancestry':
      return AbilityType.AncestryFeat;
    case 'class':
      return AbilityType.ClassFeat;
  }
  return AbilityType.Unknown;
}

export function ordinalToNumber(s: string): number {
  switch (s) {
    case 'cantrip':
      return 0;
    case 'first':
      return 1;
    case 'second':
      return 2;
    case 'third':
      return 3;
    case 'fourth':
      return 4;
    case 'fifth':
      return 5;
    case 'sixth':
      return 6;
    case 'seventh':
      return 7;
    case 'eighth':
      return 8;
    case 'ninth':
      return 9;
    case 'tenth':
      return 10;
  }
  return -1;
}

export function getActions(s: string) {
  switch (s) {
    case 'ACTION':
      return Action.One;
    case 'TWO_ACTIONS':
      return Action.Two;
    case 'THREE_ACTIONS':
      return Action.Three;
    case 'REACTION':
      return Action.Reaction;
    case 'TWO_ROUNDS':
      return Action.TwoRounds;
    case 'FREE':
      return Action.Free;
  }
  return Action.None;
}

export function makeSource(s: string) {
  const parts = s.split('-');
  if (parts.length == 1) return parts[0];
  return parts.reduce((acc, value) => acc + value[0], '');
}

export function parseDescription(s: string) {
  const cleaned = s.replaceAll(
    /\((feat|action|activity|trait): ([\w ]+\w)( ?\|[\w ]+)?\)/gi,
    '$2'
  );
  const degrees = cleaned.replaceAll(
    /(Critical )?(Success|Failure):/gi,
    '<br><b>$&</b>'
  );
  const spacing = degrees.replaceAll('~', '<br>');
  return spacing;
}
