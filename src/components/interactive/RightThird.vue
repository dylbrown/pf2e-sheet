<template>
  <div id="rightThird">
    <div
      class="column"
      style="justify-content: stretch; align-items: end"
      ref="rightThird"
    >
      <q-tabs
        v-model="currentRightTab"
        dense
        class="text-grey right-tabs"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        style="flex-grow: 0"
        v-if="character.items.length > 0 || character.spells.lists.length > 0"
      >
        <q-tab
          name="items"
          icon="fa-solid fa-suitcase"
          v-if="character.items.length > 0"
        />
        <q-tab name="skills" icon="ra-circle-of-circles" />
        <q-tab
          name="spells"
          icon="ra-incense"
          v-if="character.spells.lists.length > 0"
        />
      </q-tabs>
      <q-scroll-area
        class="full-height full-width"
        horizontal-bar-style="opacity: 0"
        :horizontal-thumb-style="{ opacity: '0' }"
      >
        <span id="rightTabHolder">
          <q-resize-observer @resize="tabsResize" />
          <q-tab-panels
            v-model="currentRightTab"
            keep-alive
            animated
            transition-duration="200"
            transition-next="slide-right"
            transition-prev="slide-left"
            @transition="afterTransition"
          >
            <q-tab-panel name="items" style="padding: 0">
              <InteractiveItems :character="character" />
            </q-tab-panel>
            <q-tab-panel name="skills" style="padding: 0">
              <InteractiveSkills :character="character" />
            </q-tab-panel>
            <q-tab-panel name="spells" style="padding: 0">
              <InteractiveSpells :character="character" />
            </q-tab-panel>
          </q-tab-panels>
        </span>
      </q-scroll-area>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type Character from 'src/character/character';
import InteractiveSkills from 'src/components/interactive/InteractiveSkills.vue';
import InteractiveItems from 'src/components/interactive/InteractiveItems.vue';
import InteractiveSpells from 'src/components/interactive/InteractiveSpells.vue';
defineProps<{
  character: Character;
}>();

const currentRightTab = ref('skills');

const rightThird = ref<HTMLDivElement | null>(null);
let newTabWidth = -1;
const tabsResize = (size: { height: number; width: number }) => {
  newTabWidth = size.width;
};
const afterTransition = () => {
  if (!rightThird.value || newTabWidth == 0) return;
  rightThird.value.style.width = newTabWidth + 'px';
};
</script>
