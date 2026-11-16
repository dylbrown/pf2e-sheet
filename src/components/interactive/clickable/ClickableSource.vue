<template>
  <span class="display-inline">
    <Clickable :label="source.name">
      {{ source.fullName }}
      <div style="max-width: 25vw">
        <span v-html="source.description" />
      </div>
    </Clickable>
  </span>
</template>
<script setup lang="ts">
import type { Source } from '@/character/model';
import Clickable from './Clickable.vue';

const { source } = defineProps<{
  source: Source;
  popupClass?: string;
}>();
</script>
