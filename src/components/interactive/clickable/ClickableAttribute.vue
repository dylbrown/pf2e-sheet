<template>
  <Clickable :label="name" :popup-class="popupClass">
    {{ Util.signed(abilityMod) }} from {{ scoreName }}
    <br />
    {{ Util.signed(attrEntry?.proficiency ?? 0) }} from being
    {{
      attrEntry != undefined ? Proficiency[attrEntry.proficiency] : 'Untrained'
    }}
    <br />
    {{ Util.signed(attrEntry?.level ?? 0) }} from level
    <template v-for="[type, bonus] of Object.entries(c.bonuses).filter(
      ([type, bonus]) => bonus > 0 || c.penalties[type as StatModType] < 0,
    )" :key="type">
      <br />
      <span :class="type != StatModType.Item ||
        bonus > item ||
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
import type Character from '@/character/character';
import { Attribute, Proficiency, Score } from '@/character/model';
import { applyMods, calculateMods, StatModType } from '@/character/modifiers';
import * as Util from '@/character/util';
import { computed } from 'vue';
import Clickable from './Clickable.vue';

const props = defineProps<{
  attribute: Attribute;
  lore?: string;
  character: Character;
  popupClass?: string;
}>();

const isLore = props.attribute == Attribute.LoreChecks && props.lore;

const name = !isLore ? Attribute[props.attribute] : (props.lore ?? '');

const attrEntry = !isLore
  ? props.character.attributes[props.attribute]
  : props.lore
    ? props.character.lore[props.lore]
    : undefined;

const abilityMod = Util.abilityMod(
  props.character.scores.value[
  !isLore
    ? props.character.attributes[props.attribute].score
    : (attrEntry?.score ?? Score.Intelligence)
  ],
);

const scoreName = !isLore
  ? Score[props.character.attributes[props.attribute].score]
  : Score[attrEntry?.score ?? Score.Intelligence];

const item = !isLore
  ? props.character.attributes[props.attribute].itemBonus
  : props.lore
    ? (props.character.lore[props.lore]?.itemBonus ?? 0)
    : 0;

const c = computed(() => {
  const [bonuses, penalties] = calculateMods(
    props.character,
    props.attribute,
    item,
  );
  return { bonuses, penalties };
});

let displayedTotal =
  abilityMod + (attrEntry?.proficiency ?? 0) + (attrEntry?.level ?? 0);

Object.entries(c.value).forEach(([_s, m]) => {
  Object.entries(m).forEach(([_ss, n]) => {
    displayedTotal += n;
  });
});

const actualTotal = applyMods(
  props.character,
  props.attribute,
  isLore ? props.character.lore[props.lore] : undefined,
);

if (actualTotal !== displayedTotal) {
  alert(
    `${isLore ? props.lore : Attribute[props.attribute]} breakdown is incorrect! Your total is ${actualTotal} but they add up to ${displayedTotal}. Let Dylan know!`,
  );
}
</script>
