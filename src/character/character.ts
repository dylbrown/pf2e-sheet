import { capitalize, Reactive, reactive } from 'vue';
import Abilities from './abilities';
import {
  Weapon,
  Item,
  Builder,
  Rune,
  Scores,
  Attributes,
  Lores,
  DamageInstance,
} from './model';
import {
  Proficiency,
  Attribute,
  Score,
  attrScore,
  skills,
  weaponsAndArmor,
  Trait,
  sfSkills,
  Source,
} from './model';
import Spells from './spells';
import * as Wanderer from './wanderers-requests';
import { abilityMod, getProficiency, parseDescription } from './util';
import vm from 'node:vm';
import { Condition, ConditionData, ModEffect } from './modifiers';

type NumbersOfType = { [type: string]: number };
export default class Character {
  remaster = false;
  starfinder = false;
  name = 'Dave';
  player = '';
  level = 0;
  ancestry = 'Stickytongue Tomato';
  background = 'Potato';
  class = 'Tuber';
  deity = '';
  alignment = 'LN';
  size = 'Medium';
  traits = Array<Trait>();
  senses = Array<string>();
  languages = Array<string>();
  scores: Scores;
  speed: NumbersOfType = { '': 25 };
  classDC = 10;
  hp = 69;
  immunities: NumbersOfType = {};
  resistances: NumbersOfType = {};
  weaknesses: NumbersOfType = {};
  ac = 23;
  combat = {
    armor: {
      proficiency: Proficiency.Trained,
      ac: 0,
    },
    shield: {
      proficiency: Proficiency.Trained,
      ac: 0,
    },
    attacks: Array<Weapon>(),
  };
  abilities = new Abilities();
  attributes: Attributes;
  lore: Lores = {};
  items = Array<Item>();
  totalBulk = 0;
  bulkLimitBonus = 0;
  money = 0;
  spells = new Spells();
  modifiers: Reactive<ModEffect[]>;
  conditions: Reactive<{ [key in Condition]?: ConditionData }>;

  constructor() {
    this.scores = {} as Scores;
    this.attributes = {} as Attributes;
    Object.values(Score).forEach((s) => (this.scores[s as Score] = 10));
    Object.values(Attribute).forEach((a) => {
      if (isNaN(a as number)) return;
      this.attributes[a as Attribute] = {
        total: 0,
        score: attrScore[Attribute[a as Attribute]] as Score,
        itemBonus: 0,
        level: 0,
        proficiency: Proficiency.Untrained,
      };
    });
    this.conditions = reactive({});
    this.modifiers = reactive([]);
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */

  load(data: any): Array<Promise<void>> {
    switch (data.version) {
      case 3:
        return this.loadLegacy(data);
      case 4:
        return this.loadRemaster(data);
      default:
        alert('Version not supported!');
    }
    return [];
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */

  private loadRemaster(data: any) {
    const contextRaw: { [key: string]: any } = {
      ceil: Math.ceil,
      floor: Math.floor,
      max: Math.max,
      min: Math.min,
    };
    this.remaster = true;
    this.starfinder = data.character.content_sources.enabled.includes(276);
    Source.bank.build(data.content.all_sources);
    Trait.bank.build(data.content.all_traits);
    this.name = data.character?.name ?? '';
    this.level = data.character?.level ?? 0;
    contextRaw.level = this.level;

    // Ancestry & Heritage name
    this.ancestry = data.character?.details?.ancestry?.name.replaceAll(
      ' (Playtest)',
      '',
    );
    const heritages = data.content?.feats_features?.heritages;
    if (heritages && heritages[0] && heritages[0].name) {
      this.ancestry = heritages[0].name.includes(this.ancestry)
        ? heritages[0].name
        : heritages[0].name + ' ' + this.ancestry;
    }

    this.background = data.character?.details?.background?.name ?? '';
    this.class = data.character?.details?.class?.name ?? '';
    this.size = data.content?.size ?? '';
    this.traits = (data.content?.character_traits ?? []).map(
      (e: { id: number }) => Trait.bank.get(e.id),
    );

    // Ability Scores
    for (let i = 0; i < 6; i++) {
      const score = i as Score;
      const key = 'ATTRIBUTE_' + Score[score].substring(0, 3).toUpperCase();
      const entry = data.content?.attributes[key];
      if (!entry) continue;
      this.scores[score] = 10 + 2 * entry.value + (entry.partial ? 1 : 0);
      contextRaw[key] = abilityMod(this.scores[score]);
      contextRaw[key.toLowerCase()] = abilityMod(this.scores[score]);
    }

    // Senses
    for (const senseType of Object.values(data.content?.senses ?? [])) {
      for (const sense of senseType as Array<any>) {
        const senseName = sense.sense?.name ?? '';
        if (senseName.length == 0 || senseName == 'Hearing') continue;
        this.senses.push(senseName);
      }
    }

    this.languages = (data.content?.languages ?? []).map((lang: string) =>
      capitalize(lang.toLowerCase().replaceAll(' (playtest)', 'ᴾ')),
    );

    // Speed
    (data.content?.speeds ?? []).forEach((speed: any) => {
      const name: string = speed.name.replaceAll(/SPEED_?/gi, '');
      if (speed.value.value == 0) return;
      this.speed[name] = speed.value.total;
    });

    this.classDC =
      10 + parseInt(data.content?.proficiencies?.CLASS_DC?.total ?? 0);
    contextRaw.CLASS_DC = this.classDC;
    this.ac = data.content?.ac ?? 0;
    this.combat.armor.ac =
      data.content?.armor_item?.item?.meta_data?.ac_bonus ?? 0;
    this.combat.armor.ac +=
      data.content?.armor_item?.item?.meta_data?.runes.potency ?? 0;
    this.combat.shield.ac =
      data.content?.shield_item?.item?.meta_data?.ac_bonus ?? 0;
    this.hp = data.content?.max_hp ?? 0;

    const addDamageEffect = (s: string, e: NumbersOfType) => {
      const info = s.split(',');
      if (!info[0] || !info[1]) return;
      e[info[0].trim()] = parseInt(info[1]);
    };

    // Immunities, Resistances, Weaknesses
    data.content.raw_data_dump.variables.IMMUNITIES.value.forEach((s: string) =>
      addDamageEffect(s, this.immunities),
    );
    data.content.raw_data_dump.variables.RESISTANCES.value.forEach(
      (s: string) => addDamageEffect(s, this.resistances),
    );
    data.content.raw_data_dump.variables.WEAKNESSES.value.forEach((s: string) =>
      addDamageEffect(s, this.weaknesses),
    );

    this.setProficiency(data, Attribute.Perception);
    this.setProficiency(data, Attribute.Fortitude, 'SAVE_FORT', true);
    this.setProficiency(data, Attribute.Reflex, 'SAVE_');
    this.setProficiency(data, Attribute.Will, 'SAVE_');
    (this.starfinder ? sfSkills : skills).forEach((s) =>
      this.setProficiency(data, s, 'SKILL_'),
    );
    Object.entries(weaponsAndArmor).forEach(([k, v]) =>
      this.setProficiency(data, v, k, true),
    );
    const armorCategory = data.content?.armor_item?.item?.meta_data?.category;
    if (armorCategory) {
      const attributeName = armorCategory.startsWith('un')
        ? 'UNARMORED_DEFENSE'
        : armorCategory.toUpperCase() + '_ARMOR';
      if (weaponsAndArmor[attributeName])
        this.combat.armor.proficiency =
          this.attributes[
            weaponsAndArmor[attributeName] as Attribute
          ].proficiency;
    }

    // Lores
    for (const [a, e] of Object.entries(data.content?.proficiencies)) {
      if (a.startsWith('SKILL_LORE_') && a.charAt(11) != '_') {
        const entry: any = e;
        this.lore[capitalize(a.substring(11).replaceAll('_', ' ')) + ' Lore'] =
          {
            proficiency: entry?.parts?.profValue as Proficiency,
            total: parseInt(entry?.total ?? '0'),
            itemBonus: entry.parts.breakdown.bonusValue ?? 0,
            score: Score.Intelligence,
            level: entry.parts.level ?? 0,
          };
      }
    }

    // Weapons
    const attackMap = new Map<string, Builder<Weapon>>();
    for (const entry of data?.content?.weapons ?? []) {
      const b = new Weapon.WBuilder();
      b.partial = {
        name: entry.item.name,
        id: entry.item.id,
        instanceID: entry.id,
        count: -1,
        weight: '',
        attack: parseInt(entry.stats.attack_bonus.total[0]),
        hands: entry.item.hands,
        traits: Trait.bank.map(entry.item.traits),
        weapon: true,
        description: entry.item.description,
        source: Source.bank.get(entry.item.content_source_id),
        range: entry.item.meta_data.range ?? undefined,
        reload: entry.item.meta_data.reload ?? undefined,
        potency: entry.item.meta_data.runes.potency ?? 0,
      };
      b.partial.damage = new DamageInstance(
        entry.stats.damage.bonus.total,
        entry.stats.damage.damageType,
        entry.stats.damage.dice.toString(),
        entry.stats.damage.die,
      );
      const runes: Array<Rune> = [];
      for (const otherDamage of entry.stats.damage.other ?? []) {
        runes.push(
          new Rune(
            otherDamage.bonus,
            otherDamage.damageType,
            otherDamage.dice,
            otherDamage.die,
            otherDamage.source.substring(
              otherDamage.source.indexOf('<') + 1,
              otherDamage.source.indexOf('>'),
            ),
            parseDescription(
              otherDamage.source.substring(otherDamage.source.indexOf('>') + 1),
            ),
          ),
        );
      }
      b.partial.runes = runes;
      if (entry.item.meta_data.starfinder) {
        b.partial.capacity = entry.item.meta_data.starfinder.capacity;
        b.partial.usage = entry.item.meta_data.starfinder.usage;
      }
      const attack = b.build();
      if (!attack) {
        console.log(b.partial.name + ' failed to build!');
        console.log(entry);
        continue;
      }
      attackMap.set(attack.name, b);
      this.combat.attacks.push(attack);
    }

    // Inventory
    for (const entry of data?.content?.inventory_flat ?? []) {
      if (
        entry.item.name.includes('Improvised') ||
        entry.item.name.includes('Fist')
      )
        continue;
      const wb: Builder<Weapon> | undefined = attackMap.get(entry.name);
      if (wb) {
        wb.partial.id = entry.item.id;
        wb.partial.count = Number(entry.item.meta_data.quantity);
        wb.partial.weight = entry.item.bulk ?? '';
        this.items.push(wb.build());
      } else {
        const b = new Item.Builder();
        b.partial = {
          name: entry.item.name,
          id: entry.item.id,
          instanceID: entry.id,
          count: Number(entry.item.meta_data.quantity),
          weight: entry.item.bulk ?? '',
          traits: Trait.bank.map(entry.item.traits),
          weapon: false,
          description: parseDescription(entry.item.description),
          source: Source.bank.get(entry.item.content_source_id),
        };
        this.items.push(b.build());
      }
    }

    // Bulk
    this.totalBulk = data.content.total_bulk;
    this.bulkLimitBonus =
      data.content.raw_data_dump.variables.BULK_LIMIT_BONUS?.value ?? 0;

    // Money
    const coins = data.character.inventory.coins;
    this.money = coins.pp * 100 + coins.gp * 10 + coins.sp + coins.cp / 10.0;

    for (const [key, e] of Object.entries(
      data.content.raw_data_dump.variables,
    )) {
      const entry = e as any;
      if (entry && entry.value && entry.type == 'num')
        contextRaw[key] = Number(entry.value);
    }
    const context = vm.createContext(contextRaw);
    this.abilities.loadRemaster(
      data.content.feats_features,
      data.character.operation_data.selections,
      context,
    );
    this.spells.loadRemaster(
      data.content,
      this.class,
      context,
      abilityMod(this.scores[Score.Charisma]),
      this.abilities,
    );

    return [];
  }

  private setProficiency(
    data: any,
    attribute: Attribute,
    prefix = '',
    prefixOnly = false,
  ) {
    const proficiencies = data.content?.proficiencies;
    if (!proficiencies) return;
    const key = prefixOnly
      ? prefix
      : prefix + Attribute[attribute].toUpperCase();
    this.attributes[attribute].total = parseInt(proficiencies[key].total ?? 0);
    this.attributes[attribute].level = proficiencies[key].parts?.level ?? 0;
    this.attributes[attribute].itemBonus =
      proficiencies[key].parts?.breakdown?.bonusValue ?? 0;
    this.attributes[attribute].proficiency = (proficiencies[key].parts
      ?.profValue ?? 0) as Proficiency;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private loadLegacy(data: any) {
    const promises: Array<Promise<void>> = [];
    this.name = data.character?.name ?? '';
    this.level = data.character?.level ?? 0;
    this.ancestry = data.character?._heritage?.name;
    if (!this.ancestry.includes(data.character?._ancestry.name)) {
      this.ancestry += ' ' + data.character?._ancestry.name;
    }
    this.background = data.character?._background?.name ?? '';
    this.class = data.character?._class?.name ?? '';
    const info: any = JSON.parse(data.stats?.generalInfo);
    this.size = info?.size ?? '';
    const traits = info?.traits;
    if (traits instanceof Array)
      this.traits = traits.map((trait) => Trait.bank.dummy(trait));
    parseAndSet(
      data.stats?.totalAbilityScores,
      'Score',
      (k, v) => (this.scores[Object.values(Score).indexOf(k) as Score] = v),
    );

    if (data.build?.senses instanceof Array) {
      for (const entry of data.build.senses) {
        this.senses.push(entry.value.name);
      }
    }
    if (data.build?.languages instanceof Array) {
      for (const entry of data.build.languages) {
        this.languages.push(entry.value.name);
      }
    }
    this.speed = data.stats?.totalSpeed ?? 0;
    this.classDC = data.stats?.totalClassDC ?? 0;
    this.ac = data.stats?.totalAC ?? 0;
    this.hp = data.stats?.maxHP ?? 0;
    this.attributes[Attribute.Perception].total =
      data.stats?.totalPerception ?? 0;
    const setAttribute = (k: string, v: number) => {
      if (k.includes('Lore')) {
        this.lore[k] = {
          proficiency: 0,
          total: v,
          itemBonus: 0,
          level: 0,
          score: Score.Intelligence,
        };
      } else {
        this.attributes[
          Object.values(Attribute).indexOf(k) as Attribute
        ].total = v;
      }
    };
    parseAndSet(data.stats?.totalSkills, 'Bonus', setAttribute);
    parseAndSet(data.stats?.totalSaves, 'Bonus', setAttribute);

    for (const [a, prof] of Object.entries(data.profs)) {
      const proficiency: Proficiency = getProficiency(
        prof ? prof.toString() : '',
      );
      if (a.includes('Lore')) {
        if (this.lore[a]) {
          this.lore[a].proficiency = proficiency;
        } else {
          this.lore[a] = {
            proficiency: proficiency,
            total:
              Number(proficiency) +
              this.level +
              Math.floor((this.scores[Score.Intelligence] - 10) / 2),
            itemBonus: 0,
            score: Score.Intelligence,
            level: proficiency != Proficiency.Untrained ? this.level : 0,
          };
        }
        continue;
      }
      const attr: Attribute = Object.values(Attribute).indexOf(
        a.replaceAll('_', ''),
      ) as Attribute;
      if ((attr as number) == -1) continue;
      this.attributes[attr].proficiency = proficiency;
      this.attributes[attr].itemBonus =
        this.attributes[attr].total -
        this.level -
        proficiency -
        Math.floor((this.scores[this.attributes[attr].score] - 10) / 2);
    }
    const attackMap = new Map<string, Builder<Weapon>>();
    const itemBuilders: Array<Builder<Item>> = [];
    const itemPromises: Array<Promise<void>> = [];

    const attacks: any = JSON.parse(data.stats?.weapons);
    if (attacks instanceof Array) {
      for (const entry of attacks) {
        if (entry.Name.includes('Improvised') || attackMap.has(entry.Name))
          continue;
        const wb = new Weapon.WBuilder();
        wb.partial = {
          name: entry.Name,
          id: -1,
          instanceID: '',
          count: -1,
          weight: '',
          attack: parseInt(entry.Bonus),
          damage: DamageInstance.parseFromString(entry.Damage),
          hands: '0',
          traits: [],
          weapon: true,
          description: '',
          source: Source.None,
        };
        if (wb.partial.name) attackMap.set(wb.partial.name, wb);
        itemBuilders.push(wb);
      }
    }
    if (data.invItems instanceof Array) {
      for (const entry of data.invItems) {
        if (entry.name.includes('Improvised') || entry.name.includes('Fist'))
          continue;
        const wb = attackMap.get(entry.name);
        let b: Builder<Item> | undefined = wb;
        if (b) {
          b.partial.id = entry.itemID;
          b.partial.count = Number(entry.quantity);
          b.partial.weight = entry.bulk > 0 ? entry.bulk : 0;
        } else {
          b = new Item.Builder();
          b.partial = {
            name: entry.name,
            id: entry.itemID,
            instanceID: '',
            count: Number(entry.quantity),
            weight: entry.bulk > 0 ? entry.bulk : 0,
            traits: [],
            weapon: false,
            description: parseDescription(entry.description),
            source: Source.None,
          };
        }
        if (wb) {
          // Rune Check
          for (let i = 1; i <= 4; i++) {
            const key = 'propRune' + i + 'ID';
            if (entry[key]) {
              itemPromises.push(Wanderer.loadRune(wb, entry[key]));
            }
          }
        }
        itemPromises.push(Wanderer.loadItem(b));
      }
    }
    promises.push(...itemPromises);
    promises.push(
      Promise.all(itemPromises).then(() => {
        this.items.push(...itemBuilders.map((b) => b.build()));
        this.combat.attacks.push(...attackMap.values().map((wb) => wb.build()));
      }),
    );
    const metaData = {
      spells: new Array<any>(),
      class_features: new Array<any>(),
    };
    for (const entry of data.metaData) {
      switch (entry.source) {
        case 'spellCastingType':
        case 'spellKeyAbilities':
        case 'spellLists':
        case 'spellSlots':
        case 'focusSpell':
        case 'focusPoint':
        case 'innateSpell':
          metaData.spells.push(entry);
          break;
        case 'classChoice':
          metaData.class_features.push(entry);
      }
    }
    promises.push(
      ...this.abilities.loadLegacy(data, metaData.class_features, this.level),
    );
    promises.push(...this.spells.loadLegacy(data, metaData.spells));

    for (const list of this.spells.lists) {
      if (!list.attack_attr || list.attack_attr.valueOf() == -1) continue;
      // Attack
      const attack_prof = this.attributes[list.attack_attr].proficiency;
      if (attack_prof != Proficiency.Untrained) list.attack += this.level;
      list.attack += attack_prof;
      list.attack += Math.floor((this.scores[list.score] - 10) / 2) ?? 0;
      // DC
      if (!list.dc_attr || list.dc_attr.valueOf() == -1) continue;
      const dc_prof = this.attributes[list.dc_attr].proficiency;
      if (dc_prof != Proficiency.Untrained) list.dc += this.level;
      list.dc += dc_prof;
      list.dc += Math.floor((this.scores[list.score] - 10) / 2) ?? 0;
    }

    return promises;
  }
}

function parseAndSet(
  data: string,
  valName: string,
  set: (key: string, val: number) => void,
) {
  const scores: any = JSON.parse(data);
  if (scores instanceof Array) {
    for (const entry of scores) {
      set(entry.Name, Number(entry[valName]));
    }
  }
}
