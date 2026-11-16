<template>
  <span class="display-inline">
    <Clickable>
      <template #label>
        <slot />
      </template>
      {{ rune.name }}
      <div style="max-width: 25vw">
        <span v-html="rune.description" />
      </div>
    </Clickable>
  </span>
</template>
<script setup lang="ts">
import type { Rune } from '@/character/model';
import Clickable from './Clickable.vue';

defineProps<{
  rune: Rune;
  popupClass?: string;
}>();
</script>
