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
    <br />
    <template v-if="item">{{ item }} from item bonuses</template>
  </q-popup-proxy>
</template>
<script setup lang="ts">
import { QPopupProxy } from 'quasar';
import type Character from 'src/character/character';
import { Attribute, Proficiency, Score } from 'src/character/model';
import * as Util from 'src/character/util';

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

const item = Util.nonzero(
  props.attribute
    ? props.character.attributes[props.attribute].itemBonus
    : props.lore
      ? (props.character.lore[props.lore]?.itemBonus ?? 0)
      : 0,
);
</script>
