<template>
  <q-table
    flat
    bordered
    dense
    :rows="abilities"
    :rows-per-page-options="[0]"
    :columns="ABILITY_COLUMNS"
    row-key="name"
    hide-header
    hide-title
    hide-bottom
  >
    <template v-slot:body="props">
      <q-tr :props="props" ref="row">
        <q-td
          key="name"
          :props="props"
          @click="
            currentAbility = props.row;
            showAbility = true;
          "
        >
          <div class="action-icon inline" v-if="props.row.activity">
            {{ props.row.cost }}
          </div>
          {{ props.row.name }}
        </q-td>
        <q-td key="traits" :props="props" class="table-traits">
          <span>
            <template
              v-for="(trait, index) in props.row.traits"
              :key="trait.name"
            >
              <template v-if="index > 0">, </template
              ><ClickableTrait :trait="trait" />
            </template>
          </span>
        </q-td>
        <q-td key="source" :props="props">{{ props.row.source.name }}</q-td>
        <q-td key="level" :props="props">{{ props.row.level }}</q-td>
      </q-tr>
    </template>
  </q-table>
  <q-dialog v-model="showAbility">
    <AbilityBlock
      ref="classAbilities"
      :ability="currentAbility"
      :interactive="true"
      v-if="currentAbility"
    />
  </q-dialog>
</template>
<script setup lang="ts">
import AbilityBlock from 'src/components/AbilityBlock.vue';
import ClickableTrait from 'src/components/interactive/ClickableTrait.vue';
import type { QTableColumn } from 'quasar';
import type { Ability } from 'src/character/model';
import { ref } from 'vue';

defineProps<{
  abilities: Ability[];
}>();

const showAbility = ref<boolean>(false);
const currentAbility = ref<Ability | undefined>(undefined);

const ABILITY_COLUMNS: QTableColumn[] = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'traits', label: 'Traits', field: 'traits' },
  { name: 'source', label: 'Source', field: 'source' },
  { name: 'level', label: 'Level', field: 'level' },
];
</script>
