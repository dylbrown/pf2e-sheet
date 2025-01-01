<template>
  <div class="column tab items" style="justify-content: stretch">
    <q-table
      flat
      bordered
      dense
      :rows="character.items"
      :columns="COLUMNS"
      row-key="name"
      class="no-scroll"
      hide-header
      hide-title
      hide-bottom
      :rows-per-page-options="[0]"
    >
      <template v-slot:body="props">
        <q-tr :props="props" ref="row">
          <q-td key="name" :props="props">
            <ClickableItem :item="props.row" />
          </q-td>
          <q-td key="count" :props="props">{{ props.row.count }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';
import type Character from 'src/character/character';
import ClickableItem from 'src/components/interactive/ClickableItem.vue';

const COLUMNS: QTableColumn[] = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'count', label: 'Count', field: 'count' },
];

defineProps<{
  character: Character;
}>();
</script>
