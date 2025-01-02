<template>
  <div v-if="!ready" id="load-box">
    <h5>Pathfinder Second Edition Character Sheet for Wanderer's Guide</h5>
    <q-toggle
      :label="`Generating ${
        interactiveMode ? 'Interactive (WIP)' : 'Paper'
      } Sheet`"
      v-model="interactiveMode"
    />
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
  <InteractiveSheet v-if="ready && interactiveMode" :character="character" />
  <PaperSheet v-if="ready && !interactiveMode" :character="character" />
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
import InteractiveSheet from 'src/pages/InteractiveSheet.vue';
import PaperSheet from 'src/pages/PaperSheet.vue';
import { ref, watch } from 'vue';
import * as LS from 'src/pages/localStorage';
const file = ref<File | null>(null);
const ready = ref(false);
const interactiveMode = ref(LS.loadGlobalOrDefault('interactive', false));
watch(interactiveMode, (val) => {
  LS.saveGlobal('interactive', val);
});

const progress = ref(0);
const character = new Character();

const load = () => {
  if (file.value instanceof File) {
    const reader = new FileReader();
    reader.onload = () => {
      const promises = character.load(JSON.parse(reader.result as string));
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
