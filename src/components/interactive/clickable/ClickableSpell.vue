<template>
  <span class="display-inline">
    <Clickable>
      <template #label>
        {{ spell.name }}<template v-if="heightened">ᴴ</template>
        <template v-if="spell.rarity == Rarity.Uncommon">&#x1d41;</template>
        <template v-if="spell.rarity == Rarity.Rare">&#x1d3f;</template>
        <template v-if="spell.rarity == Rarity.Unique">&#x1d4e;</template>
      </template>
      <SpellBlock :spell="spell" :interactive="true" :heightened="heightened" />
    </Clickable>
  </span>
</template>

<script setup lang="ts">
import { Rarity, Spell } from '@/character/model';
import SpellBlock from '../../SpellBlock.vue';
import Clickable from './Clickable.vue';

defineProps<{
  spell: Spell;
  popupClass?: string;
  heightened?: number | undefined;
}>();
</script>
