<template>
  <div class="line">
    <div :class="grid ? 'quad-grid' : 'quad-row'">
      <div class="prof-box" :class="proficiency >= 2 ? 'filled' : ''"></div>
      <div class="prof-box" :class="proficiency >= 4 ? 'filled' : ''"></div>
      <div class="prof-box" :class="proficiency >= 6 ? 'filled' : ''"></div>
      <div class="prof-box" :class="proficiency >= 8 ? 'filled' : ''"></div>
    </div>
    <div class="labello" v-if="grid">Prof</div>
  </div>
</template>

<script setup lang="ts">
import type { Proficiency } from 'src/character/model';

defineProps<{
  grid: boolean;
  proficiency: Proficiency;
}>();
</script>
