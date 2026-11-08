<template>
  <div>
    <transition name="pop-out-left">
      <q-list v-if="showFilters"
        style="position: fixed; z-index: -1; transform: translateX(calc(-100% + 4px)); background: white; border: 1px solid lightgrey; border-radius: 4px">
        <q-item>
          <q-item-section>
            <q-input outlined clearable label="Search" v-model="filterName" dense />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select clearable outlined v-model="requiredTraits" dense :options="Object.keys(ALL_TRAITS)" multiple
              label="Required Traits" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select clearable outlined v-model="prohibitedTraits" dense :options="Object.keys(ALL_TRAITS)" multiple
              label="Prohibited Traits" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select clearable outlined v-model="targets" dense :options="Object.keys(TARGET_OPTIONS)" multiple
              label="Targets" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-toggle v-model="showHeightened" dense label="Show Heightened" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Show Rarities</q-item-label>
            <q-range v-model="showRarity" dense markers :marker-labels="rarityLabel" :min="0" :max="Rarity.COUNT - 1"
              style="font-size: .75em; padding: 0 2em" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-toggle v-model="showLegacy" dense label="Show Legacy" />
          </q-item-section>
        </q-item>
      </q-list>
    </transition>
    <q-table flat bordered dense :rows="spells" :columns="COLUMNS" row-key="name" class="no-scroll spells-table"
      :class="extraClass" :hide-header="!preparing" hide-bottom :rows-per-page-options="[0]"
      :filter="[showHeightened, filter]" :filter-method="filterMethod" binary-state-sort
      :pagination="{ sortBy: 'name' }">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" style="vertical-align: bottom">
            {{ col.label }}
          </q-th>
          <q-th v-if="preparing" auto-width>
            <q-btn icon="fa-solid fa-filter" flat @click="showFilters = !showFilters" /></q-th>
          <q-th v-if="innate" auto-width></q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" ref="row">
          <q-td key="name" :props="props">
            <ClickableSpell :spell="props.row" :heightened="isHeightened ? isHeightened(props.row) : 0" />
          </q-td>
          <q-td v-if="preparing" auto-width>
            <q-btn icon="fa-solid fa-book-bookmark" text-color="grey" @click="$emit('select', props.row)" />
          </q-td>
          <q-td v-if="innate && charName && notifier != undefined" auto-width>
            <PipCounter :max="props.row.castsPerDay" :start="props.row.castsPerDay" v-if="props.row.level > 0"
              interactive :save-key="[
                'innate',
                list.name.replaceAll(' ', '-'),
                props.row.name.replaceAll(' ', '-'),
              ]" :char-name="charName" :notifier="notifier" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { QRange, QTableColumn, SliderMarkerLabels } from 'quasar';
import { Rarity, Spell, SpellList } from '@/character/model';
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
  filter?: (spell: Spell) => boolean;
}>();

const ALL_TRAITS = [...new Set(props.spells.flatMap((s => s.traits)))].sort((a, b) => a.name > b.name ? 1 : -1).reduce((acc, curr) => (acc[curr.name] = curr.id, acc), {} as { [key: string]: number });

defineEmits(['select']);

const showHeightened = ref<boolean>(true);
const showRarity = ref<{ min: number, max: number }>({ min: 0, max: 0 })
const showLegacy = ref<boolean>(false);
const targets = ref<string[] | null>([]);
const requiredTraits = ref<string[] | null>([]);
const prohibitedTraits = ref<string[] | null>([]);
const filterName = ref<string>('');
const showFilters = ref<boolean>(false);

const rarityLabel: SliderMarkerLabels = (rarity: number) => {
  return Rarity[rarity] ?? '';
}

const filterMethod = (spells: readonly Spell[]) => {
  return spells.filter((s) => {
    if (!showHeightened.value && props.isHeightened && props.isHeightened(s))
      return false;
    if (props.filter && props.filter(s) == false) return false;
    if (!showLegacy.value && s.name.includes('ᴸ')) return false;
    if (filterName.value && !s.name.toLowerCase().includes(filterName.value.toLowerCase())) return false;
    if (s.rarity < showRarity.value.min || s.rarity > showRarity.value.max) return false;
    if (requiredTraits.value != null && requiredTraits.value.length > 0) {
      for (const trait of requiredTraits.value) {
        if (!s.traits.some((t) => t.id == ALL_TRAITS[trait])) return false;
      }
    }
    if (prohibitedTraits.value != null && prohibitedTraits.value.length > 0) {
      for (const trait of prohibitedTraits.value) {
        if (s.traits.some((t) => t.id == ALL_TRAITS[trait])) return false;
      }
    }
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
