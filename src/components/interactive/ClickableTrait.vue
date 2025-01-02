<template>
  <span class="clickable-trait">
    {{ trait.name
    }}<q-popup-proxy :class="popupClass + ' clickable-popup'">
      {{ trait.name }}
      <div style="max-width: 25vw">
        <span v-html="trait.description" />
      </div>
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
