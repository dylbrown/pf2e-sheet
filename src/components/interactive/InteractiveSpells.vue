<template>
  <div class="flex-column tab items" style="justify-content: stretch">
    <q-list>
      <template
        v-for="(list, index) in character.spells.lists"
        :key="list.name"
      >
        <template v-if="index > 0">
          <div class="sectionDivider">
            <hr /></div
        ></template>
        <q-expansion-item
          group="magic"
          :label="list.name.replaceAll('_', ' ')"
          header-class="sectionLabel"
          dense
          dense-toggle
          expand-separator
          :default-opened="index == 0"
        >
          <div class="spells-stats" v-if="list.type != ''">
            <div class="rollLabel">Attack</div>
            <div class="numBox rounded">
              {{ Util.signed(list.attack) }}
            </div>
            <div class="rollLabel">DC</div>
            <div class="numBox rounded">
              {{ list.dc }}
            </div>
          </div>
          <template
            v-if="
              list.focus.length > 0 &&
              list.subtype != SpellListSubType.Apparition
            "
          >
            <div class="spells-header">Focus Spells</div>
            <SpellsTable
              :spells="list.focus"
              :list="list"
              :no-expander="true"
            />
          </template>
          <template v-if="list.type == SpellListType.Prepared">
            <div class="spells-header">Prepared Spells</div>
            <div>
              <template
                v-for="(slots, index) in list.slots.toReversed()"
                :key="index"
              >
                <div
                  class="level-slots"
                  v-if="slots > 0"
                  :style="getColumns(slots)"
                >
                  <template v-for="i in slots" :key="i">
                    <SpellSlot
                      :list="list"
                      :level="10 - index"
                      :char-name="character.name"
                      :save-key="[
                        'slots',
                        list.name.replaceAll(' ', '-'),
                        character.level.toString(),
                        (10 - index).toString(), // Slot Level
                        i.toString(), // Slot Index
                      ]"
                      :notifier="notifier"
                    />
                  </template>
                </div>
              </template>
            </div>
          </template>
          <ApparitionSpells
            v-if="
              list.type == SpellListType.Spontaneous &&
              list.subtype == SpellListSubType.Apparition
            "
            :character="character"
            :list="list as ApparitionList"
            :notifier="notifier"
          />
          <template
            v-if="
              list.type == SpellListType.Spontaneous &&
              list.subtype != SpellListSubType.Apparition
            "
          >
            <div class="spells-header">Spontaneous Spells</div>
            <div class="pip-counters">
              <template
                v-for="(slots, index) in list.slots.toReversed()"
                :key="index"
              >
                <PipCounter
                  :start="slots"
                  :max="slots"
                  :label="(10 - index).toString()"
                  interactive
                  :save-key="[
                    'slots',
                    list.name.replaceAll(' ', '-'),
                    character.level.toString(),
                    (10 - index).toString(), // Slot Level
                  ]"
                  :char-name="character.name"
                  :notifier="notifier"
                  v-if="slots > 0 && 10 - index != 0"
                />
              </template>
            </div>
            <template
              v-for="(spells, index) in list.known.toReversed()"
              :key="index"
            >
              <template v-if="list.slots[10 - index] ?? 0 > 0">
                <q-expansion-item
                  :group="list.name + '_spells'"
                  :label="(10 - index).toString()"
                  header-class="sectionLabel"
                  dense
                  dense-toggle
                  expand-separator
                  :default-opened="false"
                >
                  <SpellsTable
                    :spells="spells"
                    :list="list"
                    style="flex-grow: 1"
                  />
                </q-expansion-item>
              </template>
            </template>
          </template>
          <template v-if="list.type == 'Innate'">
            <div class="spells-header">Innate Spells</div>
            <SpellsTable
              :spells="list.known.toReversed().flat()"
              :list="list"
              :innate="true"
              :char-name="character.name"
              :notifier="notifier"
              style="flex-grow: 1"
            />
          </template>
        </q-expansion-item>
      </template>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import * as Util from 'src/character/util';
import {
  ApparitionList,
  SpellListSubType,
  SpellListType,
} from 'src/character/model';
import type Character from 'src/character/character';
import ApparitionSpells from './ApparitionSpells.vue';
import SpellsTable from './SpellsTable.vue';
import PipCounter from '../PipCounter.vue';
import SpellSlot from './SpellSlot.vue';

defineProps<{
  character: Character;
  notifier: number;
}>();

const getColumns = (slots: number) => {
  const columns = Math.ceil(slots / (1 + Math.floor(slots / 4.0)));
  return `grid-template-columns: repeat(${columns}, 1fr)`;
};
</script>
