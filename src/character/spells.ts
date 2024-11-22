import {
  Action,
  Attribute,
  getSource,
  Score,
  Spell,
  SpellList,
  Trait,
} from './model';
import * as Wanderer from './wanderers-requests';
import * as Util from './util';
import { capitalize } from 'vue';

export default class Spells {
  focusPoints = 0;
  lists = new Array<SpellList>();
  lookup = {} as { [key: string]: SpellList };

  private getOrCreateSpellsList(spellSRC: string) {
    spellSRC = capitalize(spellSRC.toLowerCase());
    let list = this.lookup[spellSRC];
    if (list == null && spellSRC.length > 0) {
      list = this.lookup[spellSRC] = {
        name: spellSRC,
        attack_attr: -1 as Attribute,
        dc_attr: -1 as Attribute,
        attack: 0,
        dc: 10,
        type: '',
        known: [[], [], [], [], [], [], [], [], [], [], []],
        slots: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        focus: [],
        tradition: '',
        score: -1 as Score,
      };
      this.lists.push(list);
    }
    return list;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadRemaster(content: any, className: string, level: number) {
    for (const entry of content.spells.all) {
      const list = this.getOrCreateSpellsList(
        entry.casting_source || className
      );
      const spell = this.makeSpell(entry, level);
      list.known[spell.level].push(spell);
    }
    for (const entry of content.spell_sources) {
      const list = this.getOrCreateSpellsList(entry.source.name || className);
      list.attack_attr = Attribute.SpellAttacks;
      list.dc_attr = Attribute.SpellDCs;
      list.attack = entry.stats.spell_attack.total[0];
      list.dc = entry.stats.spell_dc.total;
      list.type = capitalize(entry.source.type.split('-')[0].toLowerCase());
      list.tradition = capitalize(entry.source.tradition.toLowerCase());
      list.score = Util.getScore(entry.source.attribute.split('_')[1]);
    }
    for (const entry of content.spell_slots) {
      const list = this.getOrCreateSpellsList(entry.source || className);
      list.slots[entry.rank]++;
    }
    for (const entry of content.focus_spells) {
      const list = this.getOrCreateSpellsList(
        entry.casting_source || className
      );
      const spell = this.makeSpell(entry, level);
      list.focus.push(spell);
    }
    // TODO: Innate Spells
    //for (const entry of content.innate_spells) {
    //}
    const maxCount = (prev: number, curr: number, id: number) =>
      curr > 0 ? id : prev;
    this.lists.sort(
      (a, b) => b.slots.reduce(maxCount, 0) - a.slots.reduce(maxCount, 0)
    );
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private makeSpell(entry: any, level: number): Spell {
    let cost = Action.None;
    let maxCost = Action.None;
    if (entry.cast.includes('_TO_')) {
      const actions = entry.cast.split('_TO_');
      cost = actions[0] == 'ONE' ? Action.One : Action.Two;
      maxCost = Util.getActions(actions[1]);
    } else {
      cost = Util.getActions(entry.cast);
    }
    return {
      name: entry.name,
      id: entry.id,
      level: entry.rank,
      description: Util.parseDescription(entry.description, level) ?? '',
      source: getSource(entry.content_source_id), // TODO: Sources
      traits: Trait.map(entry.traits),
      cost: cost,
      maxCost: maxCost,
      castTime: entry.cast.replaceAll('_', ' '),
      requirements: entry.requirements ?? '',
      range: entry.range ?? '',
      area: entry.area ?? '',
      targets: entry.targets ?? '',
      duration: entry.duration ?? '',
      save: entry.defense ?? '',
    };
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  loadLegacy(data: any, metaData: any): Promise<void>[] {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const promises: Array<Promise<void>> = [];

    if (data.spellBookSpells instanceof Array) {
      for (const entry of data.spellBookSpells) {
        const list = this.getOrCreateSpellsList(entry.spellSRC);
        const spell = new Spell(entry._spellName, entry.spellID);
        promises.push(Wanderer.loadSpell(spell));
        list.known[entry.spellLevel].push(spell);
      }
    }
    function setTradition(list: SpellList, value: string) {
      list.tradition = value[0] + value.toLowerCase().substring(1);
      list.attack_attr = Object.values(Attribute).indexOf(
        list.tradition + 'SpellAttacks'
      ) as Attribute;
      list.dc_attr = Object.values(Attribute).indexOf(
        list.tradition + 'SpellDCs'
      ) as Attribute;
    }
    for (const entry of metaData) {
      const i = entry.value.indexOf('=');
      const key: string = entry.value.substring(0, i);
      const value: string = entry.value.substring(i + 1);
      const list = this.getOrCreateSpellsList(key);
      switch (entry.source) {
        case 'spellCastingType': {
          if (value.startsWith('SPONTANEOUS')) list.type = 'Spontaneous';
          else if (value.startsWith('PREPARED')) list.type = 'Prepared';
          break;
        }
        case 'spellKeyAbilities': {
          list.score = Util.getScore(value);
          break;
        }
        case 'spellLists': {
          setTradition(list, value);
          break;
        }
        case 'spellSlots': {
          if (!entry.sourceCode.startsWith('classAbility-')) break;
          const slotsData = JSON.parse(value);
          for (const [index, slots] of Object.entries(slotsData)) {
            const indexString: string = index.toString();
            const end = indexString.indexOf('L');
            const n = Util.ordinalToNumber(indexString.substring(0, end));
            if (n >= 0 && slots instanceof Array)
              list.slots[n as number] = (
                slots as Array<number | string>
              ).length;
          }
          break;
        }
        case 'focusSpell': {
          const spell = new Spell(value, Number(value));
          promises.push(Wanderer.loadSpell(spell));
          list.focus.push(spell);
          break;
        }
        case 'focusPoint': {
          this.focusPoints = Math.min(this.focusPoints + 1, 3);
          break;
        }
        case 'innateSpell': {
          const innateList = this.getOrCreateSpellsList(entry.sourceType);
          innateList.type = 'Innate';
          const bits = entry.value.split(':::');
          const spell = new Spell(bits[0], Number(bits[0]));
          setTradition(innateList, bits[2]);
          innateList.score = Util.getScore(bits[4]);
          promises.push(
            Wanderer.loadSpell(spell).then(() => {
              innateList.known[spell.level].push(spell);
            })
          );
        }
      }
      if (list && list.type == '') {
        switch (key) {
          case 'SORCERER':
            list.type = 'Spontaneous';
            break;
        }
      }
    }
    return promises;
  }
}
