<template>
  <span class="clickable-trait">
    {{ trait.name
    }}<q-popup-proxy :class="popupClass + ' trait-popup'">
      {{ trait.name }}
      <span v-html="trait.description" />
    </q-popup-proxy>
  </span>
</template>
<script setup lang="ts">
import { QPopupProxy } from 'quasar';
import type { Trait } from 'src/character/model';

defineProps<{
  trait: Trait;
  popupClass?: string;
}>();
</script>
