<template>
  <span ref="clickableName" class="display-inline">
    <slot name="label">{{ label }}</slot>
  </span>
  <q-popup-proxy :class="popupClass + ' clickable-popup'" :target="$refs.clickableName as Element">
    <slot />
  </q-popup-proxy>
</template>
<script setup lang="ts">
import { QPopupProxy } from 'quasar';

const props = defineProps<{
  label?: string;
  popupClass?: string | undefined;
}>();
</script>
