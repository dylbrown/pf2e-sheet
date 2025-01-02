<template>
  <span ref="clickableName" class="clickable-trait">{{ item.name }}</span>
  <q-popup-proxy
    :class="popupClass + ' clickable-popup'"
    :target="$refs.clickableName as Element"
  >
    <ItemBlock :item="item" interactive />
  </q-popup-proxy>
</template>
<script setup lang="ts">
import { QPopupProxy } from 'quasar';
import { Item } from 'src/character/model';
import ItemBlock from '../ItemBlock.vue';

defineProps<{
  item: Item;
  popupClass?: string;
}>();
</script>
