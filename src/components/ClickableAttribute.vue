<template>
  <span ref="name" class="clickable-trait">{{ name }}</span>
  <q-popup-proxy :class="popupClass + ' trait-popup'" :target="$refs.name">
    {{ abilityMod }}
    {{ scoreName }}, {{ profBonus }} Proficiency<template v-if="item"
      >, {{ item }} Item.</template
    >
  </q-popup-proxy>
</template>
<script setup lang="ts">
import { QPopupProxy } from 'quasar';
import Character from 'src/character/character';
import { Attribute, Proficiency, Score } from 'src/character/model';
import * as Util from 'src/character/util';

const props = defineProps<{
  attribute?: Attribute;
  lore?: string;
  character: Character;
  popupClass?: string;
}>();

const isAt = props.attribute != undefined;

const name = isAt ? Attribute[props.attribute] : props.lore ?? '';

const abilityMod = Util.signed(
  Util.abilityMod(
    props.character.scores[
      isAt
        ? props.character.attributes[props.attribute].score
        : Score.Intelligence
    ]
  )
);

const scoreName = isAt
  ? Score[props.character.attributes[props.attribute].score]
  : 'Intelligence';

const prof = isAt
  ? props.character.attributes[props.attribute].proficiency
  : props.lore
  ? props.character.lore[props.lore].proficiency
  : Proficiency.Untrained;

const profBonus = Util.signed(
  prof + (prof != Proficiency.Untrained ? props.character.level : 0)
);

const item = Util.nonzero(
  props.attribute
    ? props.character.attributes[props.attribute].itemBonus
    : props.lore
    ? props.character.lore[props.lore].itemBonus
    : 0
);
</script>
