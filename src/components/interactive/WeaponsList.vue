<template>
  <q-list flat bordered dense separator>
    <q-item v-for="weapon of weapons" :key="weapon.name">
      <WeaponBlock :weapon="weapon" interactive style="width: 100%" />
    </q-item>
  </q-list>
</template>
<script setup lang="ts">
import type Character from 'src/character/character';
import type { Weapon } from 'src/character/model';
import WeaponBlock from '../WeaponBlock.vue';

defineProps<{
  character: Character;
  weapons: Weapon[];
}>();
</script>
