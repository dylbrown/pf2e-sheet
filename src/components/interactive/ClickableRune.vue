<template>
  <span class="clickable-trait">
    <slot /><q-popup-proxy :class="popupClass + ' clickable-popup'">
      {{ rune.name }}
      <div style="max-width: 25vw">
        <span v-html="rune.description" />
      </div>
    </q-popup-proxy>
  </span>
</template>
<script setup lang="ts">
import { QPopupProxy } from 'quasar';
import type { Rune } from 'src/character/model';

defineProps<{
  rune: Rune;
  popupClass?: string;
}>();
</script>
