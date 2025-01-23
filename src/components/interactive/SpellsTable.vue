<template>
  <q-table
    flat
    bordered
    dense
    :rows="spells"
    :columns="COLUMNS"
    row-key="name"
    class="no-scroll spells-table"
    :class="extraClass"
    :hide-header="!preparing"
    hide-bottom
    :rows-per-page-options="[0]"
    :filter="[showHeightened]"
    :filter-method="filterMethod"
    binary-state-sort
    :pagination="{ sortBy: 'name' }"
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          style="vertical-align: bottom"
        >
          {{ col.label }}
        </q-th>
        <q-th v-if="preparing" auto-width>
          <q-btn icon="fa-solid fa-filter" flat>
            <q-menu self="top right" anchor="bottom right">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-select
                      clearable
                      outlined
                      v-model="targets"
                      :options="Object.keys(TARGET_OPTIONS)"
                      multiple
                      label="Targets"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-toggle
                      v-model="showHeightened"
                      label="Show Heightened"
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-toggle v-model="showLegacy" label="Show Legacy" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu> </q-btn
        ></q-th>
        <q-th v-if="innate" auto-width></q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props" ref="row">
        <q-td key="name" :props="props">
          <ClickableSpell
            :spell="props.row"
            :heightened="isHeightened ? isHeightened(props.row) : 0"
          />
        </q-td>
        <q-td v-if="preparing" auto-width>
          <q-btn
            icon="fa-solid fa-book-bookmark"
            text-color="grey"
            @click="$emit('select', props.row)"
          />
        </q-td>
        <q-td v-if="innate && charName && notifier != undefined" auto-width>
          <PipCounter
            :max="props.row.castsPerDay"
            :start="props.row.castsPerDay"
            v-if="props.row.level > 0"
            interactive
            :save-key="[
              'innate',
              list.name.replaceAll(' ', '-'),
              props.row.name.replaceAll(' ', '-'),
            ]"
            :char-name="charName"
            :notifier="notifier"
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
import { ref } from 'vue';

const COLUMNS: QTableColumn[] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true,
  },
];

const TARGET_OPTIONS: { [key: string]: string } = {
  Fortitude: 'Fortitude',
  Reflex: 'Reflex',
  Will: 'Will',
  AC: 'Make a spell attack',
};

const props = defineProps<{
  spells: Spell[];
  isHeightened?: (s: Spell) => number;
  opened?: boolean;
  list: SpellList;
  preparing?: boolean;
  innate?: boolean;
  charName?: string;
  notifier?: number;
  extraClass?: string;
}>();

defineEmits(['select']);

const showHeightened = ref<boolean>(true);
const showLegacy = ref<boolean>(false);
const targets = ref<string[] | null>([]);

const filterMethod = (spells: readonly Spell[]) => {
  return spells.filter((s) => {
    if (!showHeightened.value && props.isHeightened && props.isHeightened(s))
      return false;
    if (!showLegacy.value && s.name.includes('ᴸ')) return false;
    if (targets.value != null && targets.value.length > 0) {
      if (
        s.description.search(
          new RegExp(
            '(' + targets.value.map((k) => TARGET_OPTIONS[k]).join('|') + ')',
            'gi',
          ),
        ) == -1
      )
        return false;
    }
    return true;
  });
};
</script>
