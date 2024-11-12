<template>
  <div v-if="!ready" id="load-box">
    <h5>Pathfinder Second Edition Character Sheet for Wanderer's Guide</h5>
    <q-file
      v-model="file"
      label="Pick one file"
      accept=".guidechar,.json"
      filled
      style="max-width: 300px; align-self: flex-start"
      :item-aligned="true"
      @update:model-value="(_$event) => load()"
    />
    <q-linear-progress :value="progress" />
  </div>
  <CharacterSheet v-if="ready" :character="character" />
</template>

<style>
#load-box {
  position: fixed;
  left: 30vw;
  width: 40vw;
  top: 25vh;
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>

<script setup lang="ts">
import Character from 'src/character/character';
import CharacterSheet from 'src/pages/CharacterSheet.vue';
import { ref } from 'vue';
let file = ref<File | null>(null);
let ready = ref(false);
let progress = ref(0);
const character = new Character();

const load = () => {
  if (file.value instanceof File) {
    const reader = new FileReader();
    reader.onload = () => {
      let promises = character.load(JSON.parse(reader.result as string));
      Promise.all(promises)
        .then(() => (ready.value = true))
        .catch((a) => {
          console.log(a);
        });
      for (const promise of promises) {
        promise.then(() => {
          progress.value += 1.0 / promises.length;
        });
      }
    };
    reader.readAsText(file.value);
  }
};
</script>
