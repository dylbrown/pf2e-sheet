<template>
  <div class="prep-slot" :class="cast ? 'cast' : ''">
    <div class="level-label">{{ level }}</div>
    <span v-if="contents != null">
      {{ contents.name }}<template v-if="contents.level < level">ᴴ</template>
    </span>
    <q-popup-proxy
      self="top middle"
      anchor="bottom middle"
      ref="buttonPopup"
      v-if="contents || spells.length > 0"
    >
      <q-btn-group>
        <q-btn
          icon="fa-solid fa-wand-magic-sparkles"
          @click="cast = !cast"
          :style="cast ? 'color: grey' : ''"
          v-if="contents && level > 0"
        />
        <q-btn
          icon="ra-scroll-unfurled"
          @click="
            viewing = true;
            if ($refs.buttonPopup) ($refs.buttonPopup as QPopupProxy).hide();
          "
          v-if="contents"
        />
        <q-btn
          icon="fa-solid fa-book"
          @click="
            selecting = true;
            if ($refs.buttonPopup) ($refs.buttonPopup as QPopupProxy).hide();
          "
          v-if="spells.length > 0"
        />
      </q-btn-group>
    </q-popup-proxy>
  </div>
  <q-dialog v-model="selecting">
    <q-card>
      <SpellsTable
        :spells="spells"
        :preparing="true"
        :list="list"
        :is-heightened="(s) => (s.level < level ? level : 0)"
        @select="
          (spell: Spell) => {
            contents = spell;
            selecting = false;
          }
        "
      />
    </q-card>
  </q-dialog>
  <q-dialog v-model="viewing">
    <SpellBlock v-if="contents" :spell="contents" interactive />
  </q-dialog>
</template>

<script setup lang="ts">
import { Spell, SpellList } from 'src/character/model';
import { ref, watch } from 'vue';
import SpellsTable from './SpellsTable.vue';
import * as LS from 'src/pages/localStorage';
import { QPopupProxy } from 'quasar';
import SpellBlock from '../SpellBlock.vue';

const props = defineProps<{
  list: SpellList;
  level: number;
  charName: string;
  saveKey: string[];
  notifier: number;
}>();

const spells =
  (props.level > 0
    ? props.list.heightenedKnown[props.level]
    : props.list.known[0]) ?? [];

let initialSpell = null;
const initialSpellName = LS.load(props.charName, ...props.saveKey);
if (initialSpellName != null) {
  for (const spell of spells) {
    if (spell.name == initialSpellName) {
      initialSpell = spell;
      break;
    }
  }
}
const contents = ref<Spell | null>(initialSpell);
const CAST_KEY = ['cast', ...props.saveKey];
const cast = ref<boolean>(LS.loadOrDefault(props.charName, false, ...CAST_KEY));
const selecting = ref<boolean>(false);
const viewing = ref<boolean>(false);

watch(contents, (spell) => {
  LS.save(props.charName, spell?.name, ...props.saveKey);
});
watch(cast, (isCast) => {
  LS.save(props.charName, isCast, ...CAST_KEY);
});
watch(
  () => props.notifier,
  () => {
    cast.value = false;
  },
);
</script>
