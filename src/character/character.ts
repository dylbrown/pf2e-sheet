import { capitalize } from 'vue';
import Abilities from './abilities';
import {
  Proficiency,
  Attribute,
  Score,
  Weapon,
  Item,
  attrScore,
  skills,
  weaponsAndArmor,
  Trait,
} from './model';
import Spells from './spells';
import * as Wanderer from './wanderers-requests';
import { abilityMod, getProficiency, signed } from './util';

export default class Character {
  remaster = false;
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
  speed = 25;
  classDC = 10;
  hp = 69;
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
  lore = {} as {
    [lore: string]: {
      proficiency: Proficiency;
      total: number;
      itemBonus: number;
    };
  };
  inventory = Array<Item>();

  spells = new Spells();

  constructor() {
    this.scores = {} as Scores;
    this.attributes = {} as Attributes;
    Object.values(Score).forEach((s) => (this.scores[s as Score] = 10));
    Object.values(Attribute).forEach((a) => {
      if (isNaN(a as number)) return;
      this.attributes[a as Attribute] = {
        total: -1,
        score: attrScore[Attribute[a as Attribute]],
        itemBonus: 0,
        proficiency: Proficiency.Untrained,
      };
    });
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private loadRemaster(data: any) {
    this.remaster = true;
    Trait.setDB(data.content.all_traits);
    this.name = data.character?.name ?? '';
    this.level = data.character?.level ?? 0;

    // Ancestry & Heritage name
    this.ancestry = data.character?.details?.ancestry?.name;
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
      (e: { id: number }) => Trait.getFromDB(e.id)
    );

    // Ability Scores
    for (let i = 0; i < 6; i++) {
      const score = i as Score;
      const key = Score[score].substring(0, 3).toUpperCase();
      const entry = data.content?.attributes['ATTRIBUTE_' + key];
      if (!entry) continue;
      this.scores[score] = 10 + 2 * entry.value + (entry.partial ? 1 : 0);
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
      capitalize(lang.toLowerCase())
    );

    // Speed
    (data.content?.speeds ?? [])
      .map((speed: any) => {
        const name = speed.name.replaceAll(/SPEED_?/gi, '');
        if (speed.value.value == 0) return '';
        return name.length == 0
          ? speed.value.value
          : name + ' ' + speed.value.value;
      })
      .filter((s: string) => s.length > 0)
      .join(', ');

    this.classDC =
      10 + parseInt(data.content?.proficiencies?.CLASS_DC?.total ?? 0);
    this.ac = data.content?.ac ?? 0;
    this.combat.armor.ac =
      data.content?.armor_item?.item?.meta_data?.ac_bonus ?? 0;
    this.combat.armor.ac +=
      data.content?.armor_item?.item?.meta_data?.runes.potency ?? 0;
    this.combat.shield.ac =
      data.content?.shield_item?.item?.meta_data?.ac_bonus ?? 0;
    this.hp = data.content?.max_hp ?? 0;
    this.setProficiency(data, Attribute.Perception);
    this.setProficiency(data, Attribute.Fortitude, 'SAVE_FORT', true);
    this.setProficiency(data, Attribute.Reflex, 'SAVE_');
    this.setProficiency(data, Attribute.Will, 'SAVE_');
    skills.forEach((s) => this.setProficiency(data, s, 'SKILL_'));
    Object.entries(weaponsAndArmor).forEach(([k, v]) =>
      this.setProficiency(data, v, k, true)
    );
    const armorCategory = data.content?.armor_item?.item?.meta_data?.category;
    if (armorCategory) {
      this.combat.armor.proficiency =
        this.attributes[
          weaponsAndArmor[armorCategory.toUpperCase() + '_ARMOR']
        ].proficiency;
    }

    // Lores
    for (const [a, e] of Object.entries(data.content?.proficiencies)) {
      if (a.startsWith('SKILL_LORE_') && a.charAt(11) != '_') {
        const entry: any = e;
        this.lore[capitalize(a.substring(11)) + ' Lore'] = {
          proficiency: entry?.parts?.profValue as Proficiency,
          total: parseInt(entry?.total ?? '0'),
          itemBonus: entry.parts.breakdown.bonusValue ?? 0,
        };
      }
    }

    const attackMap = new Map<string, Weapon>();
    for (const entry of data?.content?.weapons ?? []) {
      const damage =
        entry.stats.damage.dice.toString() +
        entry.stats.damage.die +
        '+' +
        entry.stats.damage.bonus.total +
        ' ' +
        entry.stats.damage.damageType; // TODO: Support extra types
      const attack: Weapon = {
        name: entry.item.name,
        id: -1,
        count: -1,
        weight: '',
        attack: signed(entry.stats.attack_bonus.total[0]),
        damage: damage,
        hands: entry.item.hands,
        traits: Trait.map(entry.item.traits),
        weapon: true,
      };
      // TODO: Range and reload
      attackMap.set(attack.name, attack);
      this.combat.attacks.push(attack);
    }
    for (const entry of data?.content?.inventory_flat ?? []) {
      if (
        entry.item.name.includes('Improvised') ||
        entry.item.name.includes('Fist')
      )
        continue;
      let item: Item | undefined = attackMap.get(entry.name);
      if (item) {
        item.id = entry.item.id;
        item.count = Number(entry.item.meta_data.quantity);
        item.weight = entry.item.bulk ?? '';
      } else {
        item = {
          name: entry.item.name,
          id: entry.item.id,
          count: Number(entry.item.meta_data.quantity),
          weight: entry.item.bulk ?? '',
          traits: Trait.map(entry.item.traits),
          weapon: false,
        };
      }
      if (item.weapon) {
        // const weapon = item as Weapon;
        // TODO: Rune check
      }
      this.inventory.push(item);
    }
    this.abilities.loadRemaster(data.content.feats_features);
    this.spells.loadRemaster(
      data.content,
      this.class,
      this.level,
      abilityMod(this.scores[Score.Charisma])
    );

    return [];
  }

  private setProficiency(
    data: any,
    attribute: Attribute,
    prefix = '',
    prefixOnly = false
  ) {
    const proficiencies = data.content?.proficiencies;
    if (!proficiencies) return;
    const key = prefixOnly
      ? prefix
      : prefix + Attribute[attribute].toUpperCase();
    this.attributes[attribute].total = parseInt(proficiencies[key].total ?? 0);
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
      this.traits = traits.map((trait) => Trait.dummy(trait));
    parseAndSet(
      data.stats?.totalAbilityScores,
      'Score',
      (k, v) => (this.scores[Object.values(Score).indexOf(k) as Score] = v)
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
        this.lore[k] = { proficiency: 0, total: v, itemBonus: 0 };
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
        prof ? prof.toString() : ''
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
          };
        }
        continue;
      }
      const attr: Attribute = Object.values(Attribute).indexOf(
        a.replaceAll('_', '')
      ) as Attribute;
      if ((attr as number) == -1) continue;
      this.attributes[attr].proficiency = proficiency;
      this.attributes[attr].itemBonus =
        this.attributes[attr].total -
        this.level -
        proficiency -
        Math.floor((this.scores[this.attributes[attr].score] - 10) / 2);
    }
    const attackMap = new Map<string, Weapon>();

    const attacks: any = JSON.parse(data.stats?.weapons);
    if (attacks instanceof Array) {
      for (const entry of attacks) {
        if (entry.Name.includes('Improvised') || attackMap.has(entry.Name))
          continue;
        const attack: Weapon = {
          name: entry.Name,
          id: -1,
          count: -1,
          weight: '',
          attack: entry.Bonus,
          damage: entry.Damage,
          hands: '0',
          traits: [],
          weapon: true,
        };
        attackMap.set(attack.name, attack);
        this.combat.attacks.push(attack);
      }
    }
    if (data.invItems instanceof Array) {
      for (const entry of data.invItems) {
        if (entry.name.includes('Improvised') || entry.name.includes('Fist'))
          continue;
        let item: Item | undefined = attackMap.get(entry.name);
        if (item) {
          item.id = entry.itemID;
          item.count = Number(entry.quantity);
          item.weight = entry.bulk > 0 ? entry.bulk : 0;
        } else {
          item = {
            name: entry.name,
            id: entry.itemID,
            count: Number(entry.quantity),
            weight: entry.bulk > 0 ? entry.bulk : 0,
            traits: [],
            weapon: false,
          };
        }
        if (item.weapon) {
          const weapon = item as Weapon;
          // Rune Check
          for (let i = 1; i <= 4; i++) {
            const key = 'propRune' + i + 'ID';
            if (entry[key]) {
              promises.push(Wanderer.loadRune(weapon, entry[key]));
            }
          }
        }
        this.inventory.push(item);
        promises.push(Wanderer.loadItem(item));
      }
    }
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
      ...this.abilities.loadLegacy(data, metaData.class_features, this.level)
    );
    promises.push(...this.spells.loadLegacy(data, metaData.spells));

    for (const list of this.spells.lists) {
      if (list.attack_attr.valueOf() == -1) continue;
      // Attack
      const attack_prof = this.attributes[list.attack_attr].proficiency;
      if (attack_prof != Proficiency.Untrained) list.attack += this.level;
      list.attack += attack_prof;
      list.attack += Math.floor((this.scores[list.score] - 10) / 2) ?? 0;
      // DC
      if (list.dc_attr.valueOf() == -1) continue;
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
  set: (key: string, val: number) => void
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scores: any = JSON.parse(data);
  if (scores instanceof Array) {
    for (const entry of scores) {
      set(entry.Name, Number(entry[valName]));
    }
  }
}

type Scores = {
  [score in Score]: number;
};

type Attributes = {
  [attribute in Attribute]: {
    total: number;
    score: Score;
    itemBonus: number;
    proficiency: Proficiency;
  };
};
