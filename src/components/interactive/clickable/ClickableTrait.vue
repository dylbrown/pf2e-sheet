<template>
  <span class="display-inline">
    <Clickable :label="name">
      {{ trait.name }}
      <div style="max-width: 25vw">
        <span v-html="trait.description" />
      </div>
    </Clickable>
  </span>
</template>
<script setup lang="ts">
import type { Trait } from '@/character/model';
import Clickable from './Clickable.vue';

const { trait } = defineProps<{
  trait: Trait;
  popupClass?: string;
}>();
let name = trait.name;
if (trait.name.length > 13) {
  name = name.substring(0, 12).trim() + '…';
}
</script>
