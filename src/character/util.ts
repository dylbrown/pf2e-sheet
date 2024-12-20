import { marked } from 'marked';
import type { Ability } from './model';
import { AbilityType, Action, Proficiency, Score } from './model';

export function abilityMod(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function nonzero(num: number) {
  return num != 0 ? signed(num) : '';
}

export function signed(num: number) {
  return num < 0 ? num.toString() : '+' + num;
}

export function types(
  abilities: Array<Ability>,
  include: Array<AbilityType>,
  exclude: Array<AbilityType>,
) {
  return abilities.filter(
    (value: Ability) =>
      (include.length == 0 || include.includes(value.type)) &&
      !exclude.includes(value.type),
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

export function getProficiency(prof: string) {
  switch (prof.substring(0, 1).toUpperCase()) {
    case 'U':
      return Proficiency.Untrained;
    case 'T':
      return Proficiency.Trained;
    case 'E':
      return Proficiency.Expert;
    case 'M':
      return Proficiency.Master;
    case 'L':
      return Proficiency.Legendary;
  }
  return Proficiency.Untrained;
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
  switch (s.toLowerCase()) {
    case 'cantrip':
    case 'zero':
      return 0;
    case 'first':
    case 'one':
      return 1;
    case 'second':
    case 'two':
      return 2;
    case 'third':
    case 'three':
      return 3;
    case 'fourth':
    case 'four':
      return 4;
    case 'fifth':
    case 'five':
      return 5;
    case 'sixth':
    case 'six':
      return 6;
    case 'seventh':
    case 'seven':
      return 7;
    case 'eighth':
    case 'eight':
      return 8;
    case 'ninth':
    case 'nine':
      return 9;
    case 'tenth':
    case 'ten':
      return 10;
  }
  return -1;
}

export function numberAppendOrdinal(i: number) {
  switch (i) {
    case 2:
      return i + 'nd';
    case 3:
      return i + 'rd';
    default:
      return i + 'th';
  }
}

export function getActions(s: string) {
  switch (s.replaceAll(/[_-]/g, '')) {
    case 'ONEACTION':
    case 'ACTION':
      return Action.One;
    case 'TWOACTIONS':
      return Action.Two;
    case 'THREEACTIONS':
      return Action.Three;
    case 'REACTION':
      return Action.Reaction;
    case 'TWOROUNDS':
      return Action.TwoRounds;
    case 'FREE':
    case 'FREEACTION':
      return Action.Free;
  }
  return Action.None;
}

export function makeSource(s: string) {
  const parts = s.split('-');
  if (parts.length == 1) return s;
  return parts.reduce((acc, value) => acc + value[0], '');
}

export function parseDescription(s: string, level = 0) {
  const cleaned = marked
    .parse(s, { async: false })
    .replaceAll(
      /\((feat|action|activity|trait|spell): ([\w ]+\w)( ?\|[\w ]+)?\)/gi,
      '$2',
    );
  const actions = cleaned
    .replaceAll('ONE-ACTION', '⯁')
    .replaceAll('TWO-ACTIONS', '⯁⯁')
    .replaceAll('THREE-ACTIONS', '⯁⯁⯁');

  const conditions = actions
    .replaceAll(/\[\[\w+\]\]\{([A-Za-z1-9 ]+)\}/gi, '$1')
    .replaceAll(/\[\[(\w+)\]\]/gi, '$1');
  const attackReminders = conditions.replaceAll(
    /make a (ranged )?spell attack( rolls?)?/gi,
    '<u>$&</u>',
  );
  const damageReminders = attackReminders.replaceAll(
    /(takes?|deal(s|ing)?|restores?|drains|gains|gain a)( \+?\d[\w\d]*( [\d\w]+)* (bonus|damage|hit points)( die)?)/gi,
    '$1 <b>$3</b>',
  );
  const conditionReminders = damageReminders
    .replaceAll(
      /(Invisible|Friendly|Helpful|Hostile|Indifferent|Unfriendly|Doomed|Dying|Frightened|Unconscious|Wounded|Hidden|Observed|Undetected|Unnoticed|Clumsy|Drained|Enfeebled|Stupefied|Blinded|Concealed|Dazzled|Deafened|Invisible) (\d|for \d+ (rounds?|minutes?|hours?|days?))/gi,
      '<b>$&</b>',
    )
    .replaceAll(/(gains? the )(\w+)( condition)/gi, '$1<b>$2</b>$3');
  const degrees = conditionReminders.replaceAll(
    /((Critical )?(Success|Failure)):/gi,
    '&nbsp;&nbsp;<b>$1</b>',
  );
  const HEADING = '\n<span class="description-header">$2</span> ';
  const header = degrees.replaceAll(/(\n~ )([^:]+):/gi, HEADING);
  const kineticist = header.replaceAll(/(~ )(Level \([^)]*\)):/gi, '<b>$2</b>');
  const links = kineticist.replaceAll(/\[(\s|\n|\r)*<a[^\]]*\]/gi, '');
  const remasterLinks = links
    .replaceAll(/<a[^>]*>([^<]*)<\/a>/gi, '$1')
    .replaceAll(/<a[^>]*><em>([^<]*)<\/em><\/a>/gi, '<em>$1</em>');
  const traits = remasterLinks.replaceAll(/\((\w+)\)\{\w+\}/gi, '($1)');
  const colons = traits.replaceAll(/(<li>)\s*:\s*/gi, '$1');
  const hs = colons.replaceAll(/(<h\d[^>]*>|<\/h\d>)/gi, '');
  const featReferences = hs.replaceAll(/(\(feat: )([^)]*)\)/gi, '<i>$2</i>');
  const spaced = featReferences.replaceAll(/[\n\r]+/gi, '<br>');
  let tablecut = spaced
    .replaceAll(
      /(<\/t(d|r|head|h|able|body)>)<br>(<\/?t(d|r|head|h|able|body))/gi,
      '$1$3',
    )
    .replaceAll(
      /(<\/t(d|r|head|h|able|body)>)<br>(<\/?t(d|r|head|h|able|body))/gi,
      '$1$3',
    )
    .replaceAll(/((able|r|head|body)>)<br>(<t)/gi, '$1$3');

  if (level > 0) {
    for (
      let heighten = tablecut.indexOf('⬆️');
      heighten != -1;
      heighten = tablecut.indexOf('⬆️')
    ) {
      const ceil = Math.ceil;
      const floor = Math.floor;
      const max = Math.max;
      const min = Math.min;
      // Weird hack here to ensure ceil and floor aren't optimized out
      const open = tablecut.indexOf('{{', heighten) + ceil(floor(max(min(2))));
      const close = tablecut.indexOf('}}', heighten);
      const result = eval(tablecut.substring(open, close));
      tablecut = tablecut.replace(/⬆️\{\{([^}])*\}\}/i, '<b>⇮</b> ' + result);
    }
  }
  return tablecut.replaceAll(/(<br>)+$/gi, '');
}
