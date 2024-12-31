<template>
  <span ref="clickableName" class="clickable-trait">{{ item.name }}</span>
  <q-popup-proxy
    :class="popupClass + ' clickable-popup'"
    :target="$refs.clickableName as Element"
  >
    <template v-for="(trait, index) in item.traits" :key="trait.name">
      <template v-if="index > 0">, </template>
      <ClickableTrait :trait="trait" />
    </template>
    <span v-html="item.description" />
  </q-popup-proxy>
</template>
<script setup lang="ts">
import { QPopupProxy } from 'quasar';
import { Item } from 'src/character/model';
import ClickableTrait from './ClickableTrait.vue';

defineProps<{
  item: Item;
  popupClass?: string;
}>();
</script>
