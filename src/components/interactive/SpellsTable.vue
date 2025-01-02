<template>
  <q-table
    flat
    bordered
    dense
    :rows="spells"
    :columns="COLUMNS"
    row-key="name"
    class="no-scroll"
    hide-header
    hide-title
    hide-bottom
    :rows-per-page-options="[0]"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
        <q-th v-if="preparing" auto-width></q-th>
        <q-th v-if="innate" auto-width></q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props" ref="row">
        <q-td key="name" :props="props">
          <ClickableSpell :spell="props.row" />
        </q-td>
        <q-td v-if="preparing" auto-width>
          <q-btn
            icon="fa-solid fa-book-bookmark"
            text-color="grey"
            @click="$emit('select', props.row)"
          />
        </q-td>
        <q-td v-if="innate" auto-width>
          <PipCounter
            :max="props.row.castsPerDay"
            :start="props.row.castsPerDay"
            v-if="props.row.level > 0"
            interactive
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { QTableColumn } from 'quasar';
import { Spell, SpellList } from 'src/character/model';
import ClickableSpell from './ClickableSpell.vue';
import PipCounter from '../PipCounter.vue';

const COLUMNS: QTableColumn[] = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
];

defineProps<{
  spells: Spell[];
  opened?: boolean;
  list: SpellList;
  preparing?: boolean;
  innate?: boolean;
}>();

defineEmits(['select']);
</script>
