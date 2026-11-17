<template>
  <Clickable :popup-class="popupClass">
    <template #label><span :class="noBuffTint ? '' : buffClass">{{ label ?? name }}</span></template>
    <template v-if="dc">
      10 from base
      <br />
    </template>
    {{ Util.signed(abilityMod) }} from {{ scoreName }}
    <br />
    {{ Util.signed(attrEntry?.proficiency ?? 0) }} from being
    {{
      attrEntry != undefined ? Proficiency[attrEntry.proficiency] : 'Untrained'
    }}
    <br />
    {{ Util.signed(attrEntry?.level ?? 0) }} from level
    <template v-for="[type, entry] of attrEntry.custom.entries" :key="type">
      <br />
      <span>{{ Util.signed(entry.value) }} {{ capitalize(type.toLowerCase()) }}
        {{
          entry.value > 0 ? 'bonus' : 'penalty'
        }} ({{ entry.source.join(', ') }})</span>
    </template>
    <template v-for="[type, bonus] of Object.entries(c.bonuses).filter(
      ([type, bonus]) => bonus > 0 || c.penalties[type as StatModType] < 0,
    )" :key="type">
      <br />
      <span :class="type != StatModType.Item ||
        bonus > attrEntry.itemBonus ||
        c.penalties[type as StatModType] < 0
        ? bonus + c.penalties[type as StatModType] > 0
          ? 'buffed'
          : 'debuffed'
        : ''
        ">{{ Util.signed(bonus + c.penalties[type as StatModType]) }} {{ type }}
        {{
          bonus + c.penalties[type as StatModType] > 0 ? 'bonus' : 'penalty'
        }}</span>
    </template>
  </Clickable>
</template>
<script setup lang="ts">
import type PCharacter from '@/character/character';
import { Attribute, Proficiency, Score, Weapon } from '@/character/model';
import { applyMods, calculateMods, getAttackMods, StatModType } from '@/character/modifiers';
import * as Util from '@/character/util';
import { capitalize, computed } from 'vue';
import Clickable from './Clickable.vue';

const props = defineProps<{
  attribute: Attribute;
  lore?: string;
  character: PCharacter;
  popupClass?: string;
  dc?: boolean;
  weapon?: Weapon;
  label?: string;
  noBuffTint?: boolean;
}>();

let attribute = props.attribute;

let name = Attribute[props.attribute];

let attrEntry = props.character.attributes[props.attribute];

const isLore = props.attribute == Attribute.LoreChecks && props.lore && props.character.lore[props.lore];
if (isLore) {
  name = (props.lore ?? '');
  attrEntry = props.character.lore[props.lore]!;
} else if (props.attribute == Attribute.Attacks && props.weapon) {
  name = props.weapon.name;
  attribute = props.weapon.attribute;
  attrEntry = getAttackMods(props.character, props.weapon);
}

const abilityMod = attrEntry ? Util.abilityMod(
  props.character.scores.value[attrEntry.score],
) : 0;

const scoreName = Score[attrEntry.score];

const c = computed(() => {
  const [bonuses, penalties] = calculateMods(
    props.character,
    attribute,
    [{
      type: StatModType.Item,
      attrs: [attribute],
      amount: attrEntry.itemBonus,
    }],
    attrEntry.score
  );
  return { bonuses, penalties };
});

const displayedTotal = computed(() => {
  let displayedTotal =
    abilityMod + (attrEntry?.proficiency ?? 0) + (attrEntry?.level ?? 0);

  Object.values(c.value).forEach((m) => {
    Object.values(m).forEach((n) => {
      displayedTotal += n;
    });
  });
  attrEntry.custom.entries.forEach(([k, e]) => displayedTotal += e.value);
  return displayedTotal;
});

const actualTotal = applyMods(
  props.character,
  attribute,
  attrEntry
);

if (actualTotal !== displayedTotal.value) {
  alert(
    `${isLore ? props.lore : Attribute[props.attribute]} breakdown is incorrect! Your total is ${actualTotal} but they add up to ${displayedTotal.value}. Let Dylan know!`,
  );
}

const buffClass = computed(() => {
  return (displayedTotal.value < attrEntry.total
    ? 'de'
    : '') +
    (displayedTotal.value != attrEntry.total
      ? 'buffed'
      : '');
});
</script>
