<template>
  <div class="numBox rounded" style="position: relative">
    <q-linear-progress
      :value="(currHp - character.hp) / character.hp"
      color="yellow-4"
      track-color="white"
      class="rounded"
      style="position: absolute; z-index: 10; width: 100%; height: 100%"
    >
      <div
        class="absolute-full flex flex-center"
        style="color: black; font-size: calc(1rem + 0.5px)"
      >
        {{ currHp }} / {{ character.hp }}
      </div>
      <q-popup-proxy @show="workingHP = currHp" @hide="updateCurrHp(workingHP)">
        <div class="column">
          <q-linear-progress
            :value="(workingHP - character.hp) / character.hp"
            color="yellow-4"
            track-color="white"
            style="height: 2rem; width: 20rem; position: absolute; z-index: 10"
          >
            <div
              class="absolute-full flex flex-center"
              style="color: black; font-size: 1rem"
            >
              {{ workingHP }}
              <span style="color: gray">
                &nbsp;({{ signed(workingHP - currHp) }})
              </span>
            </div>
          </q-linear-progress>
          <q-linear-progress
            :value="workingHP / character.hp"
            color="blue-2"
            track-color="white"
            style="height: 2rem"
          />
          <q-btn-group style="width: 20rem" spread stretch>
            <q-btn label="-10" @click="workingHP -= 10" />
            <q-btn label="-5" @click="workingHP -= 5" />
            <q-btn label="-1" @click="workingHP -= 1" />
            <q-btn label="+1" @click="workingHP += 1" />
            <q-btn label="+5" @click="workingHP += 5" />
            <q-btn label="+10" @click="workingHP += 10" />
          </q-btn-group>
          <div v-if="Object.entries(character.immunities).length > 0">
            <b>Immunities</b>
            {{
              Object.entries(character.immunities)
                .map(([k, v]) => capitalize(k) + ' ' + v)
                .join(', ')
            }}
          </div>
          <div v-if="Object.entries(character.resistances).length > 0">
            <b>Resistances</b>
            {{
              Object.entries(character.resistances)
                .map(([k, v]) => capitalize(k) + ' ' + v)
                .join(', ')
            }}
          </div>
          <div v-if="Object.entries(character.weaknesses).length > 0">
            <b>Weaknesses</b>
            {{
              Object.entries(character.weaknesses)
                .map(([k, v]) => capitalize(k) + ' ' + v)
                .join(', ')
            }}
          </div>
        </div>
      </q-popup-proxy>
    </q-linear-progress>
    <q-linear-progress
      :value="currHp / character.hp"
      color="blue-2"
      track-color="white"
      class="rounded"
    />
  </div>
</template>

<script setup lang="ts">
import { capitalize, ref } from 'vue';
import { signed } from 'src/character/util';
import Character from 'src/character/character';

const { character, currHp } = defineProps<{
  character: Character;
  currHp: number;
  updateCurrHp: (hp: number) => void;
}>();

const workingHP = ref<number>(currHp);
</script>
