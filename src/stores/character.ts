import { defineStore, acceptHMRUpdate } from 'pinia';
import Character from 'src/character/character';

export const useCharacterStore = defineStore('characterStore', {
  state: () => ({
    character: new Character(),
  }),
  getters: {},
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCharacterStore, import.meta.hot));
}
