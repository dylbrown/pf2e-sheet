<template>
  <q-file
    v-if="!ready"
    v-model="file"
    label="Pick one file"
    accept=".guidechar"
    filled
    style="max-width: 300px"
    @update:model-value="(_$event) => load()"
  />
  <CharacterSheet v-if="ready" :character="character" />
</template>

<script setup lang="ts">
import Character from 'src/character/character';
import CharacterSheet from 'src/pages/CharacterSheet.vue';
import { ref } from 'vue';
let file = ref<File | null>(null);
let ready = ref(false);
const character = new Character();

const load = () => {
  if (file.value instanceof File) {
    const reader = new FileReader();
    reader.onload = () => {
      character
        .load(JSON.parse(reader.result as string))
        .then(() => (ready.value = true))
        .catch((a) => console.log(a));
    };
    reader.readAsText(file.value);
  }
};
</script>
