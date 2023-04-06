import { Score, Spell, SpellList } from './model';
import * as Wanderer from './wanderers-requests';
import * as Util from './util';

export default class Spells {
  focusPoints = 0;
  lists = new Array<SpellList>();
  lookup = {} as { [key: string]: SpellList };

  private getOrCreateSpellsList(spellSRC: string) {
    let list = this.lookup[spellSRC];
    if (list == null && spellSRC.length > 0) {
      list = this.lookup[spellSRC] = {
        name: spellSRC,
        attack: 0,
        dc: 0,
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
  load(data: any, metaData: any): Promise<void>[] {
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
          list.tradition = value[0] + value.toLowerCase().substring(1);
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
          this.focusPoints += 1;
          break;
        }
        case 'innateSpell': {
          const innateList = this.getOrCreateSpellsList(entry.sourceType);
          innateList.type = 'Innate';
          const idIndex = entry.value.indexOf(':');
          const id = entry.value.substring(0, idIndex);
          const spell = new Spell(id, Number(id));
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
