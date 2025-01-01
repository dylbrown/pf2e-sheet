<template>
  <span ref="clickableName" class="clickable-trait">{{ spell.name }}</span>
  <q-popup-proxy
    :class="popupClass + ' clickable-popup'"
    :target="$refs.clickableName"
  >
    <SpellBlock :spell="spell" :interactive="true" />
  </q-popup-proxy>
</template>

<script setup lang="ts">
import { QPopupProxy } from 'quasar';
import { Spell } from 'src/character/model';
import SpellBlock from '../SpellBlock.vue';

defineProps<{
  spell: Spell;
  popupClass?: string;
}>();
</script>
