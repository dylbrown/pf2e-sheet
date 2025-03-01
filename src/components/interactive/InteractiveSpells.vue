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
            <div
              class="numBox rounded"
              :class="
                moddedSpellAttack(list) > list.attack
                  ? 'buffed'
                  : moddedSpellAttack(list) < list.attack
                    ? 'debuffed'
                    : ''
              "
            >
              {{ Util.signed(moddedSpellAttack(list)) }}
            </div>
            <div class="rollLabel">DC</div>
            <div
              class="numBox rounded"
              :class="
                moddedSpellDC(list) > list.dc
                  ? 'buffed'
                  : moddedSpellDC(list) < list.dc
                    ? 'debuffed'
                    : ''
              "
            >
              {{ moddedSpellDC(list) }}
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
                    :spells="includeSignature(list, 10 - index)"
                    :is-heightened="
                      (s) => (s.level != 10 - index ? 10 - index : 0)
                    "
                    :list="list"
                    style="flex-grow: 1"
                  />
                </q-expansion-item>
              </template>
            </template>
            <q-expansion-item
              :group="list.name + '_spells'"
              label="Signature Spells"
              header-class="sectionLabel"
              dense
              dense-toggle
              expand-separator
              v-if="
                list.signature.fixed.some((v) => v > 0) ||
                list.signature.leq.some((v) => v > 0)
              "
              :default-opened="false"
            >
              <div class="column">
                <div class="spells-header" v-if="bothSignature(list)">
                  Fixed-Level
                </div>
                <div class="signature-slots">
                  <template
                    v-for="(slots, index) in list.signature.fixed.toReversed()"
                    :key="index"
                  >
                    <template v-for="i in slots" :key="i">
                      <SpellSlot
                        :list="list"
                        :level="10 - index"
                        :char-name="character.name"
                        :save-key="[
                          'signature',
                          list.name.replaceAll(' ', '-'),
                          character.level.toString(),
                          (10 - index).toString(), // Slot Level
                          i.toString(), // Slot Index
                        ]"
                        :notifier="notifier"
                        signature
                      />
                    </template>
                  </template>
                </div>
                <div class="spells-header" v-if="bothSignature(list)">
                  Variable Level
                </div>
                <template
                  v-for="(slots, index) in list.signature.leq.toReversed()"
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
                        :min-level="1"
                        :char-name="character.name"
                        :save-key="[
                          'signature',
                          list.name.replaceAll(' ', '-'),
                          character.level.toString(),
                          (10 - index).toString(), // Slot Level
                          i.toString(), // Slot Index
                        ]"
                        :notifier="notifier"
                        signature
                      />
                    </template>
                  </div>
                </template>
              </div>
            </q-expansion-item>
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
  Spell,
  SpellList,
  SpellListSubType,
  SpellListType,
} from 'src/character/model';
import {
  applySpellAttackMods,
  applySpellDCMods,
} from 'src/character/modifiers';
import type Character from 'src/character/character';
import ApparitionSpells from './ApparitionSpells.vue';
import SpellsTable from './SpellsTable.vue';
import PipCounter from '../PipCounter.vue';
import SpellSlot from './SpellSlot.vue';

const { character } = defineProps<{
  character: Character;
  notifier: number;
}>();

const moddedSpellAttack = (list: SpellList) =>
  applySpellAttackMods(character, list);
const moddedSpellDC = (list: SpellList) => applySpellDCMods(character, list);

const getColumns = (slots: number) => {
  const columns = Math.ceil(slots / (1 + Math.floor(slots / 4.0)));
  return `grid-template-columns: repeat(${columns}, 1fr)`;
};

const bothSignature = (list: SpellList) => {
  return (
    list.signature.fixed.some((t) => t > 0) &&
    list.signature.leq.some((t) => t > 0)
  );
};

const includeSignature = (list: SpellList, level: number): Spell[] => {
  return [
    ...(list.known[level] || []),
    ...Object.values(list.signature.spells).filter((s) =>
      s.heightening.includes(level),
    ),
  ];
};
</script>
