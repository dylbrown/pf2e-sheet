<template>
  <div class="prep-slot" :class="cast ? 'cast' : ''">
    <div class="level-label" v-if="!contents">{{ level }}</div>
    <span v-if="contents != null"> {{ contents.name }}</span>
    <q-popup-proxy self="top middle" anchor="bottom middle" ref="buttonPopup">
      <q-btn-group>
        <q-btn
          icon="fa-solid fa-wand-magic-sparkles"
          @click="cast = !cast"
          :style="cast ? 'color: grey' : ''"
          v-if="contents && level > 0"
        />
        <q-btn
          icon="fa-solid fa-book"
          @click="
            selecting = true;
            if ($refs.buttonPopup) ($refs.buttonPopup as QPopupProxy).hide();
          "
        />
      </q-btn-group>
    </q-popup-proxy>
  </div>
  <q-dialog v-model="selecting">
    <q-card>
      <SpellsTable
        :spells="list.known[level] ?? []"
        :preparing="true"
        :level="level"
        :list="list"
        style="max-width: 80vw; max-height: 80vh"
        @select="
          (spell: Spell) => {
            contents = spell;
            selecting = false;
          }
        "
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Spell, SpellList } from 'src/character/model';
import { ref } from 'vue';
import SpellsTable from './SpellsTable.vue';
import { QPopupProxy } from 'quasar';

const contents = ref<Spell | null>(null);
const cast = ref<boolean>(false);
const selecting = ref<boolean>(false);

defineProps<{ list: SpellList; level: number }>();
</script>
