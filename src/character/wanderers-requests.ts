import { LocalStorage } from 'quasar';
import type { Ability, Item, Spell, Weapon } from './model';
import { Action, Trait } from './model';
import * as Util from './util';
import runeLookupJSON from './examples/rune_lookup.json';
const runeLookup = runeLookupJSON as { [key: string]: number };

async function load(
  url_prefix: string,
  ls_key: string,
  id: number,
  store?: boolean,
) {
  // First, try to retrieve from LocalStorage
  const full_key = '2e-sheet:' + ls_key;
  if (store) {
    const cache = LocalStorage.getItem(full_key) as {
      [id: number]: object;
    } | null;
    if (cache != null) {
      if (cache[id]) return cache[id];
    }
  }

  // If not, poll the API
  const url = url_prefix + encodeURIComponent(id);
  let res = await fetch(url);

  // Wait a bit and then try one more time
  if (!res.ok) {
    await new Promise((resolve) =>
      setTimeout(resolve, 2500 + Math.random() * 5500),
    );
    res = await fetch(url);
  }

  // If still not, then give up
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error);
  }
  return res.json().then((json) => {
    if (!store) return json;
    const new_cache = (LocalStorage.getItem(full_key) ?? {}) as {
      [id: number]: object;
    };
    new_cache[id] = json;
    LocalStorage.set(full_key, new_cache);
    return json;
  });
}

export async function loadClass(id: number) {
  const data = await load(
    '/.netlify/functions/wanderers-request?type=class&id=',
    'class',
    id,
  );
  return data;
}

export async function loadFeat(feat: Ability) {
  const data = await load(
    '/.netlify/functions/wanderers-request?type=feat&id=',
    'feat',
    feat.id,
  );
  feat.source = Util.makeSource(data.feat.contentSrc);
  feat.traits = data.traits.map(
    (o: { name: string; description: string; id: number }) =>
      Trait.createIfAbsent(o.name, o.id, o.description),
  );
}

export async function loadItem(item: Item) {
  const data = await load(
    '/.netlify/functions/wanderers-request?type=item&id=',
    'item',
    item.id,
  );
  const entry = data.item;
  item.traits = data.traits.map(
    (o: { name: string; description: string; id: number }) =>
      Trait.createIfAbsent(o.name, o.id, o.description),
  );
  if (item.weapon) {
    const weapon = item as Weapon;
    weapon.hands = entry.hands == 'TWO' ? '2' : '1';
    if (entry.weapons?.isRanged) {
      weapon.range = entry.weapons?.rangedRange;
      weapon.reload = entry.weapons?.rangedReload;
    }
  }
}

export async function loadSpell(spell: Spell) {
  const data = await load(
    '/.netlify/functions/wanderers-request?type=spell&id=',
    'spell',
    spell.id,
  );
  const entry = data.spell;
  spell.name = entry.name;
  spell.level = entry.level;
  spell.description = Util.parseDescription(entry.description ?? '');

  const heightenedArray = [];
  for (const ordinal of ['One', 'Two', 'Three', 'Four']) {
    const val = entry['heightened' + ordinal + 'Val'];
    if (val == null) continue;
    if (val == 'CUSTOM') {
      const text = entry['heightened' + ordinal + 'Text'].replaceAll(
        /~ (\(\d{1,2}\w\w\))/gi,
        '<br><b>$1</b>',
      );
      spell.description += Util.parseDescription(text);
      break;
    }
    const type_and_num = val.split('_', 2);
    let label = '';
    if (type_and_num[0] == 'PLUS') {
      label = '+' + Util.ordinalToNumber(type_and_num[1]);
    } else if (type_and_num[0] == 'LEVEL') {
      label = Util.numberAppendOrdinal(parseInt(type_and_num[1]));
    }
    const heightened = Util.parseDescription(
      `<b>(${label})</b> ` + entry['heightened' + ordinal + 'Text'],
    );
    heightenedArray.push(heightened.replace(/(^<p>)(.*)<\/p>$/gi, '$2'));
  }
  spell.description += heightenedArray.join('<br>');
  spell.description = spell.description.replaceAll(
    /<br>([\s\n\r]*<br>)+/gi,
    '<br>',
  );

  if (entry.cast.includes('_TO_')) {
    const actions = entry.cast.split('_TO_');
    spell.cost = actions[0] == 'ONE' ? Action.One : Action.Two;
    spell.maxCost = Util.getActions(actions[1]);
  } else {
    spell.cost = Util.getActions(entry.cast);
  }
  spell.castTime = entry.cast.replaceAll('_', ' ');
  spell.components = JSON.parse(entry?.castingComponents).map((o: string) =>
    o[0] ? o[0].toUpperCase() : '',
  );
  spell.source = Util.makeSource(entry.contentSrc);
  spell.traits = data.traits.map(
    (o: { name: string; description: string; id: number }) =>
      Trait.createIfAbsent(o.name, o.id, o.description),
  );
  spell.requirements = entry?.requirements || '';
  spell.range = entry?.range?.replaceAll(/f(ee|oo)t/gi, 'ft.') || '';
  spell.area = entry?.area?.replaceAll(/f(ee|oo)t/gi, 'ft.') || '';
  spell.targets = entry?.targets?.replaceAll(/f(ee|oo)t/gi, 'ft.') || '';
  spell.duration = entry?.duration || '';
  spell.save =
    entry.savingThrow != null
      ? (entry.savingThrow as string)
          .split('_')
          .map(
            (bit: string) =>
              bit.substring(0, 1).toUpperCase() +
              bit.substring(1).toLowerCase(),
          )
          .join(' ')
      : '';
}
export async function loadRune(weapon: Weapon, key: string) {
  const data = await load(
    '/.netlify/functions/wanderers-request?type=item&id=',
    'item',
    runeLookup[key] ?? -1,
    false,
  );
  const entry = data.item;
  for (const line of entry.code.split('\n')) {
    const equals = line.indexOf('=');
    if (equals == -1) continue;
    const key = line.substring(0, equals);
    const value = line.substring(equals + 1);

    switch (key) {
      case 'DEFAULT-ON-HIT-DAMAGE': {
        weapon.damage += value;
      }
    }
  }
}
