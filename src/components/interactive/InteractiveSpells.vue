<template>
  <div class="column tab items" style="justify-content: stretch">
    <q-list bordered>
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
          :label="list.name"
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
              list.type == SpellListType.Spontaneous ||
              list.type == SpellListType.Prepared
            "
          >
            <template
              v-for="(slots, index) in list.slots.toReversed()"
              :key="index"
            >
              <template v-if="slots > 0"
                >{{ 10 - index + ': ' + slots }}<br
              /></template>
            </template>
          </template>
        </q-expansion-item>
      </template>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import * as Util from 'src/character/util';
import { SpellListType } from 'src/character/model';
import type Character from 'src/character/character';

defineProps<{
  character: Character;
}>();
</script>
