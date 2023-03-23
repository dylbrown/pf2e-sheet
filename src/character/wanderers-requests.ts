import { Ability, Action, Item, Spell, Weapon } from './model';
import { getActions, makeSource, parseDescription } from './util';

async function load(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res.json();
}

export async function loadFeat(feat: Ability) {
  const data = await load(
    '/.netlify/functions/wanderers-request?type=feat&id=' +
      encodeURIComponent(feat.id)
  );
  feat.source = makeSource(data.feat.contentSrc);
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
  spell.description = parseDescription(entry.description ?? '');
  if (entry.cast.includes('_TO_')) {
    const actions = entry.cast.split('_TO_');
    spell.cost = actions[0] == 'ONE' ? Action.One : Action.Two;
    spell.maxCost = getActions(actions[1]);
  } else {
    spell.cost = getActions(entry.cast);
  }
  spell.castTime = entry.cast.replaceAll('_', ' ');
  spell.components = JSON.parse(entry?.castingComponents).map((o: string) =>
    o[0].toUpperCase()
  );
  spell.source = makeSource(entry.contentSrc);
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
