<template>
  <div id="rightThird">
    <div
      class="column"
      style="justify-content: stretch; align-items: end"
      ref="rightThird"
    >
      <div
        class="column"
        style="justify-content: stretch; align-items: stretch; width: 100%"
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
          ref="tabButtons"
          v-if="character.items.length > 0 || character.spells.lists.length > 0"
        >
          <q-tab name="skills" icon="ra-circle-of-circles" />
          <q-tab
            name="spells"
            icon="ra-incense"
            v-if="character.spells.lists.length > 0"
          />
          <q-tab
            name="items"
            icon="fa-solid fa-suitcase"
            v-if="character.items.length > 0"
          />
        </q-tabs>
        <q-scroll-area
          class="full-height full-width"
          horizontal-bar-style="opacity: 0"
          :horizontal-thumb-style="{ opacity: '0' }"
        >
          <span id="rightTabHolder" ref="rightTabHolder">
            <q-resize-observer @resize="tabsResize" />
            <q-tab-panels
              v-model="currentRightTab"
              keep-alive
              animated
              transition-duration="200"
              transition-next="slide-right"
              transition-prev="slide-left"
              @transition="afterTransition"
              @vue:mounted="afterTransition"
            >
              <q-tab-panel name="items" style="padding: 0">
                <InteractiveItems :character="character" />
              </q-tab-panel>
              <q-tab-panel name="skills" style="padding: 0">
                <InteractiveSkills :character="character" />
              </q-tab-panel>
              <q-tab-panel name="spells" style="padding: 0">
                <InteractiveSpells
                  :character="character"
                  :notifier="notifier"
                />
              </q-tab-panel>
            </q-tab-panels>
          </span>
        </q-scroll-area>
        <q-tab-panels
          v-model="currentRightTab"
          keep-alive
          animated
          transition-duration="200"
          transition-next="slide-right"
          transition-prev="slide-left"
          @transition="afterTransition"
          @vue:mounted="afterTransition"
        >
          <q-tab-panel
            name="items"
            style="
              border: 1px solid rgba(0, 0, 0, 0.1);
              box-sizing: border-box;
              border-radius: 4px;
            "
          >
            <InteractiveItemsFooter :character="character" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type Character from 'src/character/character';
import InteractiveSkills from 'src/components/interactive/InteractiveSkills.vue';
import InteractiveItems from 'src/components/interactive/InteractiveItems.vue';
import InteractiveItemsFooter from './InteractiveItemsFooter.vue';
import InteractiveSpells from 'src/components/interactive/InteractiveSpells.vue';
import { QTabs } from 'quasar';
defineProps<{
  character: Character;
  notifier: number;
}>();

const currentRightTab = ref('skills');
let expectedTab = 'skills';

const rightThird = ref<HTMLDivElement | null>(null);

const tabButtons = ref<QTabs | null>(null);
const rightTabHolder = ref<HTMLSpanElement | null>(null);
const tabsResize = (size: { height: number; width: number }) => {
  if (expectedTab != currentRightTab.value) {
    expectedTab = currentRightTab.value;
    return;
  }
  if (!rightThird.value) return;
  rightThird.value.style.width =
    Math.max(
      size.width,
      tabButtons.value?.$el.getBoundingClientRect().width ?? 0,
    ) + 'px';
};
const afterTransition = () => {
  if (!rightThird.value || !rightTabHolder.value) return;
  rightThird.value.style.width =
    Math.max(
      rightTabHolder.value.offsetWidth,
      tabButtons.value?.$el.getBoundingClientRect().width ?? 0,
    ) + 'px';
};
</script>
