<template>
  <span ref="clickableName" class="clickable-trait">{{ Score[score]?.substring(0, 3).toUpperCase() }}</span>
  <q-popup-proxy :class="popupClass + ' clickable-popup'" :target="$refs.clickableName as Element">
    <template v-for="(entry, i) of character.scores.history[score]">
      <br v-if="i > 0" />{{ entry }}</template>
    <template v-if="character.scores.history[score].length == 0"><i>No modifiers</i></template>
  </q-popup-proxy>
</template>
<script setup lang="ts">
import { QPopupProxy } from 'quasar';
import type Character from '@/character/character';
import { Score } from '@/character/model';

const props = defineProps<{
  score: Score;
  character: Character;
  popupClass?: string;
}>();
</script>
