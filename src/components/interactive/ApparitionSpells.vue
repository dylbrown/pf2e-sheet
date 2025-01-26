<template>
  <q-select
    clearable
    outlined
    v-model="apparitionChoices"
    :options="list.apparitions.keys().toArray()"
    multiple
    class="apparitionChoices"
    label="Apparitions"
    @update:model-value="
      filter = currentApparitionSpellsOnly;
      focusFilter = currentVesselSpellsOnly;
      sendApparitionChoices.splice(
        0,
        sendApparitionChoices.length,
        ...(apparitionChoices ?? []),
      );
    "
    style="min-width: calc(min(max(1000px, 143.75vh), 100vw - 10px) * 0.3)"
  />
  <div class="spells-header">Focus Spells</div>
  <SpellsTable
    :spells="list.focus"
    :list="list"
    :no-expander="true"
    :filter="focusFilter"
  />
  <div class="spells-header">Spontaneous Spells</div>
  <div class="pip-counters">
    <template v-for="(slots, index) in list.slots.toReversed()" :key="index">
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
  <template v-for="(spells, index) in list.known.toReversed()" :key="index">
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
          :filter="filter"
        />
      </q-expansion-item>
    </template>
  </template>
</template>

<script setup lang="ts">
import Character from 'src/character/character';
import { ApparitionList, Spell } from 'src/character/model';
import SpellsTable from './SpellsTable.vue';
import PipCounter from '../PipCounter.vue';
import { reactive, ref } from 'vue';

const props = defineProps<{
  character: Character;
  list: ApparitionList;
  notifier: number;
}>();

const sendApparitionChoices = reactive(props.list.currentApparitions);
const apparitionChoices = ref<string[]>();

const currentApparitionSpellsOnly = (spell: Spell) => {
  return props.list.apparitionSpells
    .entries()
    .some(
      ([a, spells]) =>
        apparitionChoices.value?.includes(a.name) &&
        spells.includes(spell.name.toLowerCase()),
    );
};
const currentVesselSpellsOnly = (spell: Spell) => {
  return props.list.vesselSpells
    .entries()
    .some(
      ([a, spellName]) =>
        apparitionChoices.value?.includes(a.name) && spellName == spell.name,
    );
};
const filter = ref<(spell: Spell) => boolean>(currentApparitionSpellsOnly);
const focusFilter = ref<(spell: Spell) => boolean>(currentVesselSpellsOnly);
</script>
