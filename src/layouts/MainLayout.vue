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

async function getAll(type: string) {
  const url = '/.netlify/functions/wanderers-request?type=' + type;
  try {
    return await fetch(url)
      .then((res) => res.json())
      .catch((a) => console.log(a));
  } catch (err) {
    console.log(err);
  }
}
const featsP = getAll('feat');
const itemsP = getAll('item');
const spellsP = getAll('spell');

const load = () => {
  if (file.value instanceof File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result != null) {
        Promise.all([featsP, itemsP, spellsP]).then(
          ([feats, items, spells]) => {
            character.load(
              JSON.parse(reader.result as string),
              feats,
              items,
              spells
            );
            ready.value = true;
          }
        );
      }
    };
    reader.readAsText(file.value);
  }
};
</script>
