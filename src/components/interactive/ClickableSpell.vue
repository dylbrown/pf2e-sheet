<template>
  <span ref="clickableName" class="clickable-trait">
    {{ spell.name }}<template v-if="heightened">ᴴ</template>
    <template v-if="spell.rarity == Rarity.Uncommon">&#x1d41;</template>
    <template v-if="spell.rarity == Rarity.Rare">&#x1d3f;</template>
    <template v-if="spell.rarity == Rarity.Unique">&#x1d4e;</template>
  </span>
  <q-popup-proxy :class="popupClass + ' clickable-popup'" :target="$refs.clickableName as Element">
    <SpellBlock :spell="spell" :interactive="true" :heightened="heightened" />
  </q-popup-proxy>
</template>

<script setup lang="ts">
import { QPopupProxy } from 'quasar';
import { Rarity, Spell } from '@/character/model';
import SpellBlock from '../SpellBlock.vue';

defineProps<{
  spell: Spell;
  popupClass?: string;
  heightened?: number | undefined;
}>();
</script>
