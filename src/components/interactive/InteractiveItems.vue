<template>
  <div class="column tab items" style="justify-content: stretch">
    <q-table
      flat
      bordered
      dense
      :rows="character.items"
      :columns="COLUMNS"
      row-key="name"
      style="max-height: 50%"
      class="vertical-scroll-table"
      hide-header
      hide-title
      hide-bottom
      :rows-per-page-options="[0]"
    />
  </div>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';
import type Character from 'src/character/character';

const COLUMNS: QTableColumn[] = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'count', label: 'Count', field: 'count' },
];

defineProps<{
  character: Character;
}>();
</script>
