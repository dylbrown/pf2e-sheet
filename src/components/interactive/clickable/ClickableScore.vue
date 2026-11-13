<template>
  <Clickable :label="Score[score]?.substring(0, 3).toUpperCase()" :popup-class="popupClass">
    <template v-for="(entry, i) of character.scores.history[score]">
      <br v-if="i > 0" />{{ entry }}
    </template>
    <template v-if="character.scores.history[score].length == 0"><i>No modifiers</i></template>
  </Clickable>
</template>
<script setup lang="ts">
import type Character from '@/character/character';
import { Score } from '@/character/model';
import Clickable from './Clickable.vue';

const props = defineProps<{
  score: Score;
  character: Character;
  popupClass?: string;
}>();
</script>
