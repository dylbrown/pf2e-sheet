import { Ability, Action, Item, Spell, Weapon } from './model';
import * as Util from './util';

async function load(url: string) {
  let res = await fetch(url);

  // Wait a bit and then try one more time
  if (!res.ok) {
    await new Promise((resolve) =>
      setTimeout(resolve, 2500 + Math.random() * 5500)
    );
    res = await fetch(url);
  }

  // If still not, then give up
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error);
  }
  return res.json();
}

export async function loadClass(id: number) {
  const data = await load(
    '/.netlify/functions/wanderers-request?type=class&id=' +
      encodeURIComponent(id)
  );
  return data;
}

export async function loadFeat(feat: Ability) {
  const data = await load(
    '/.netlify/functions/wanderers-request?type=feat&id=' +
      encodeURIComponent(feat.id)
  );
  feat.source = Util.makeSource(data.feat.contentSrc);
  feat.traits = data.traits.map((o: { name: string }) => o.name);
}

export async function loadItem(item: Item) {
  const data = await load(
    '/.netlify/functions/wanderers-request?type=item&id=' +
      encodeURIComponent(item.id)
  );
  const entry = data.item;
  item.traits = data.traits.map((o: { name: string }) => o.name);
  if (item.weapon) {
    const weapon = item as Weapon;
    weapon.hands = entry.hands == 'TWO' ? 2 : 1;
    if (entry.weapons?.isRanged) {
      weapon.range = entry.weapons?.rangedRange;
      weapon.reload = entry.weapons?.rangedReload;
    }
  }
}

export async function loadSpell(spell: Spell) {
  const data = await load(
    '/.netlify/functions/wanderers-request?type=spell&id=' +
      encodeURIComponent(spell.id)
  );
  const entry = data.spell;
  spell.name = entry.name;
  spell.level = entry.level;
  spell.description = Util.parseDescription(entry.description ?? '');

  for (const ordinal of ['One', 'Two', 'Three', 'Four']) {
    const val = entry['heightened' + ordinal + 'Val'];
    if (val == null) continue;
    const type_and_num = val.split('_', 2);
    let label = '';
    if (type_and_num[0] == 'PLUS') {
      label = '+' + Util.ordinalToNumber(type_and_num[1]);
    } else if (type_and_num[0] == 'LEVEL') {
      label = Util.numberAppendOrdinal(parseInt(type_and_num[1]));
    }
    spell.description += Util.parseDescription(
      `<b>(${label})</b> ` + entry['heightened' + ordinal + 'Text']
    );
  }

  if (entry.cast.includes('_TO_')) {
    const actions = entry.cast.split('_TO_');
    spell.cost = actions[0] == 'ONE' ? Action.One : Action.Two;
    spell.maxCost = Util.getActions(actions[1]);
  } else {
    spell.cost = Util.getActions(entry.cast);
  }
  spell.castTime = entry.cast.replaceAll('_', ' ');
  spell.components = JSON.parse(entry?.castingComponents).map((o: string) =>
    o[0].toUpperCase()
  );
  spell.source = Util.makeSource(entry.contentSrc);
  spell.traits = data.traits.map((o: { name: string }) => o.name);
  spell.requirements = entry?.requirements || '';
  spell.range = entry?.range || '';
  spell.area = entry?.area || '';
  spell.targets = entry?.targets || '';
  spell.duration = entry?.duration || '';
  spell.save =
    entry.savingThrow != null
      ? entry.savingThrow[0] + entry.savingThrow.substring(1).toLowerCase()
      : '';
}
