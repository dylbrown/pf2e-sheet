<template>
  <span ref="name" class="clickable-trait">{{ Attribute[attribute] }}</span>
  <q-popup-proxy :class="popupClass + ' trait-popup'" :target="$refs.name">
    {{
      Util.signed(
        Util.abilityMod(character.scores[character.attributes[attribute].score])
      )
    }}
    {{ Score[character.attributes[attribute].score] }},
    {{ profBonus }} Proficiency<template v-if="item"
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
  attribute: Attribute;
  character: Character;
  popupClass?: string;
}>();

const profBonus = Util.signed(
  props.character.attributes[props.attribute].proficiency +
    (props.character.attributes[props.attribute].proficiency !=
    Proficiency.Untrained
      ? props.character.level
      : 0)
);

const item = Util.nonzero(
  props.character.attributes[props.attribute].itemBonus
);
</script>
