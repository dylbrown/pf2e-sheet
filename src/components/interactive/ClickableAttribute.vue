<template>
  <span ref="clickableName" class="clickable-trait">{{ name }}</span>
  <q-popup-proxy
    :class="popupClass + ' clickable-popup'"
    :target="$refs.clickableName as Element"
  >
    {{ abilityMod }} from {{ scoreName }}
    <br />
    {{ Util.signed(attrEntry?.proficiency ?? 0) }} from being
    {{
      attrEntry != undefined ? Proficiency[attrEntry.proficiency] : 'Untrained'
    }}
    <br />
    {{ Util.signed(attrEntry?.level ?? 0) }} from level
    <template
      v-for="[type, bonus] of Object.entries(c.bonuses).filter(
        ([type, bonus]) => bonus > 0 || c.penalties[type as StatModType] < 0,
      )"
      :key="type"
    >
      <br />
      <span
        :class="
          type != StatModType.Item ||
          bonus > item ||
          c.penalties[type as StatModType] < 0
            ? bonus + c.penalties[type as StatModType] > 0
              ? 'buffed'
              : 'debuffed'
            : ''
        "
        >{{ Util.signed(bonus + c.penalties[type as StatModType]) }} {{ type }}
        {{
          bonus + c.penalties[type as StatModType] > 0 ? 'bonus' : 'penalty'
        }}</span
      >
    </template>
  </q-popup-proxy>
</template>
<script setup lang="ts">
import { QPopupProxy } from 'quasar';
import type Character from 'src/character/character';
import { Attribute, Proficiency, Score } from 'src/character/model';
import { calculateMods, StatModType } from 'src/character/modifiers';
import * as Util from 'src/character/util';
import { computed } from 'vue';

const props = defineProps<{
  attribute?: Attribute;
  lore?: string;
  character: Character;
  popupClass?: string;
}>();

const isAt = props.attribute != undefined;

const name = isAt ? Attribute[props.attribute] : (props.lore ?? '');

const abilityMod = Util.signed(
  Util.abilityMod(
    props.character.scores[
      isAt
        ? props.character.attributes[props.attribute].score
        : Score.Intelligence
    ],
  ),
);

const scoreName = isAt
  ? Score[props.character.attributes[props.attribute].score]
  : 'Intelligence';

const attrEntry = isAt
  ? props.character.attributes[props.attribute]
  : props.lore
    ? props.character.lore[props.lore]
    : undefined;

const item = props.attribute
  ? props.character.attributes[props.attribute].itemBonus
  : props.lore
    ? (props.character.lore[props.lore]?.itemBonus ?? 0)
    : 0;

const c = computed(() => {
  const [bonuses, penalties] = calculateMods(
    props.character.modifiers,
    props.attribute || Attribute.LoreChecks,
    props.character.attributes[props.attribute || Attribute.LoreChecks]
      .itemBonus ?? 0,
  );
  return { bonuses, penalties };
});
</script>
