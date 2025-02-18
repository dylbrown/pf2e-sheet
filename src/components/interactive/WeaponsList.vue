<template>
  <q-list flat bordered dense separator>
    <q-item v-for="weapon of weapons" :key="weapon.name">
      <WeaponBlock
        :character="character"
        :weapon="weapon"
        interactive
        style="width: 100%"
      />
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
import type { Weapon } from 'src/character/model';
import WeaponBlock from '../WeaponBlock.vue';
import Character from 'src/character/character';

defineProps<{
  character: Character;
  weapons: Weapon[];
}>();
</script>
