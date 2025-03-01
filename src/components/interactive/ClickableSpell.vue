<template>
  <span ref="clickableName" class="clickable-trait">
    {{ spell.name }}<template v-if="heightened">ᴴ</template>
  </span>
  <q-popup-proxy
    :class="popupClass + ' clickable-popup'"
    :target="$refs.clickableName as Element"
  >
    <SpellBlock :spell="spell" :interactive="true" :heightened="heightened" />
  </q-popup-proxy>
</template>

<script setup lang="ts">
import { QPopupProxy } from 'quasar';
import { Spell } from 'src/character/model';
import SpellBlock from '../SpellBlock.vue';

defineProps<{
  spell: Spell;
  popupClass?: string;
  heightened?: number | undefined;
}>();
</script>
