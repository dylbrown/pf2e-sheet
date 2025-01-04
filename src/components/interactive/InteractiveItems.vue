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
      hide-bottom
      :rows-per-page-options="[0]"
    >
      <template v-slot:body="props">
        <q-tr :props="props" ref="row">
          <q-td key="name" :props="props">
            <ClickableItem :item="props.row" />
          </q-td>
          <q-td key="count" :props="props">
            <q-popup-proxy self="top middle" anchor="bottom middle">
              <q-btn-group>
                <q-btn label="-" @click="changeQuantity(props.row, -1)" />
                <q-btn label="+" @click="changeQuantity(props.row, 1)" />
              </q-btn-group> </q-popup-proxy
            >{{ props.row.count + extraCount[props.row.instanceID] }}</q-td
          >
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';
import type Character from 'src/character/character';
import { Item } from 'src/character/model';
import ClickableItem from 'src/components/interactive/ClickableItem.vue';
import * as LS from 'src/pages/localStorage';
import { ref } from 'vue';

const COLUMNS: QTableColumn[] = [
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'count', label: 'Count', field: 'count', sortable: true },
];

const { character } = defineProps<{
  character: Character;
}>();

const extraCount = ref<{ [instanceID: string]: number }>({});

for (const item of character.items) {
  extraCount.value[item.instanceID] = LS.loadOrDefault(
    character.name,
    0,
    'items',
    item.instanceID,
    'count',
  );
}

const changeQuantity = (item: Item, amount: number) => {
  extraCount.value[item.instanceID] =
    amount + (extraCount.value[item.instanceID] ?? 0);
  LS.save(
    character.name,
    extraCount.value[item.instanceID],
    'items',
    item.instanceID,
    'count',
  );
};
</script>
