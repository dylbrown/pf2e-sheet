<template>
  <div ref="root">
    <div class="page first-page">
      <div id="leftThird">
        <div class="column" style="justify-content: stretch">
          <div>PATHFINDER CHARACTER SHEET</div>
          <div
            class="underlined wrap"
            style="font-size: 0.75em; border: none; font-style: italic"
          >
            {{ character.name }}
          </div>
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel" style="text-transform: uppercase">
            Ability Scores
          </div>
          <div id="ability-grid">
            <template v-for="score of [0, 3, 1, 4, 2, 5]" :key="score">
              <div class="line">
                <div class="inverted numBox rounded" style="font-weight: bold">
                  {{ Score[score]?.substring(0, 3).toUpperCase() }}
                </div>
                <div class="labello invisible">A</div>
              </div>
              <div class="line">
                <div
                  :class="
                    'underlined-roll' +
                    (character.scores[score as Score] % 2 == 1 ? ' odd' : '')
                  "
                >
                  {{
                    Util.signed(
                      Util.abilityMod(character.scores[score as Score]),
                    )
                  }}
                </div>
                <div class="labello">Mod</div>
              </div>
            </template>
          </div>
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel">Misc.</div>
          <div class="row-between">
            <div class="line">
              <div class="numBox rounded bounded-line" data-max="2.1">
                {{ character.speed }} ft.
              </div>
              <div class="labello">Speed</div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                {{ character.classDC }}
              </div>
              <div class="labello">Class DC</div>
            </div>
          </div>
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel">Health</div>
          <div class="row-between">
            <div class="line">
              <div class="numBox rounded">{{ character.hp }}</div>
              <div class="labello">Max</div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                <q-linear-progress
                  :value="currHP / character.hp"
                  color="blue-2"
                  track-color="white"
                  class="rounded"
                >
                  <div
                    class="absolute-full flex flex-center"
                    style="color: black; font-size: calc(1rem + 0.5px)"
                  >
                    {{ currHP }}
                  </div>
                  <q-popup-proxy
                    @show="workingHP = currHP"
                    @hide="currHP = workingHP"
                  >
                    <q-linear-progress
                      :value="workingHP / character.hp"
                      color="blue-2"
                      track-color="white"
                      style="height: 28px"
                    >
                      <div
                        class="absolute-full flex flex-center"
                        style="color: black; font-size: 14px"
                      >
                        {{ workingHP }}
                        <span style="color: gray"
                          >&nbsp;({{ Util.signed(workingHP - currHP) }})</span
                        >
                      </div></q-linear-progress
                    >
                    <q-btn-group>
                      <q-btn label="-10" @click="workingHP -= 10" />
                      <q-btn label="-5" @click="workingHP -= 5" />
                      <q-btn label="-1" @click="workingHP -= 1" />
                      <q-btn label="+1" @click="workingHP += 1" />
                      <q-btn label="+5" @click="workingHP += 5" />
                      <q-btn label="+10" @click="workingHP += 10" />
                    </q-btn-group>
                  </q-popup-proxy>
                </q-linear-progress>
              </div>
              <div class="labello">Current</div>
            </div>
          </div>
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel">Armor Class</div>
          <div id="ac-grid">
            <div class="top-right rollLabel">AC</div>
            <div class="line">
              <div class="underlined-roll">{{ character.ac }}</div>
              <div class="labello">Total</div>
            </div>
            <div class="line">
              <div class="numBox" style="border-radius: 40%">
                {{ Util.nonzero(character.combat.shield.ac) }}
              </div>
              <div class="box-label">Shield</div>
            </div>
          </div>
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel">Perception + Saves</div>
          <div id="rolls-grid">
            <template
              v-for="attr of [
                Attribute.Perception,
                Attribute.Fortitude,
                Attribute.Reflex,
                Attribute.Will,
              ]"
              :key="attr"
            >
              <div class="center-right rollLabel">
                <ClickableAttribute :attribute="attr" :character="character" />
              </div>
              <div class="line">
                <div class="underlined-roll">
                  {{ Util.signed(character.attributes[attr].total) }}
                </div>
                <div class="labello">Mod</div>
              </div>
              <ProficiencyDisplay
                :proficiency="character.attributes[attr].proficiency"
                :grid="true"
              />
            </template>
          </div>
        </div>
      </div>
      <div id="middleThird">
        <div class="column" style="justify-content: flex-start">
          <q-scroll-area ref="middleScroll">
            <q-list bordered>
              <div class="sectionDivider">
                <hr />
              </div>
              <q-expansion-item
                group="middle"
                label="Character Info"
                header-class="sectionLabel"
                default-opened
                dense
                dense-toggle
                expand-separator
                ref="expInfo"
              >
                <div id="info-grid">
                  <div
                    class="line"
                    style="grid-row-end: span 2; grid-column-end: span 2"
                  >
                    <div class="underlined wrap">
                      {{ character.name }}
                    </div>
                    <div class="labello">Character Name</div>
                  </div>
                  <div
                    class="line"
                    style="grid-column-end: span 2; min-height: 2em"
                  >
                    <div class="underlined bounded-line" data-max="1.6">
                      {{ character.ancestry }}
                    </div>
                    <div class="labello">Ancestry & Heritage</div>
                  </div>
                  <div class="line" style="grid-column-end: span 2">
                    <div class="underlined">{{ character.background }}</div>
                    <div class="labello">Background</div>
                  </div>
                  <div class="line" style="grid-column-end: span 2">
                    <div class="underlined">
                      {{ character.class }} {{ character.level }}
                    </div>
                    <div class="labello">Class</div>
                  </div>
                  <div class="line">
                    <div class="underlined">{{ character.player }}</div>
                    <div class="labello">Player</div>
                  </div>
                  <div class="line">
                    <div class="underlined">{{ character.deity }}</div>
                    <div class="labello">Deity</div>
                  </div>
                  <div class="line">
                    <div class="underlined">{{ character.size }}</div>
                    <div class="labello">Size</div>
                  </div>
                  <div class="line" style="grid-column-end: span 3">
                    <div class="underlined bounded-line" data-max="1.7">
                      <span>
                        <template
                          v-for="(trait, index) in character.traits"
                          :key="trait.name"
                        >
                          <template v-if="index > 0">, </template
                          ><ClickableTrait :trait="trait" />
                        </template>
                      </span>
                    </div>
                    <div class="labello">Traits</div>
                  </div>
                  <div class="line" style="grid-column-end: span 2">
                    <div class="underlined bounded-line" data-max="1.7">
                      {{ character.languages.join(', ') }}
                    </div>
                    <div class="labello">Languages</div>
                  </div>
                  <div class="line" style="grid-column-end: span 2">
                    <div class="underlined bounded-line">
                      {{ character.senses.join(', ') }}
                    </div>
                    <div class="labello">Senses</div>
                  </div>
                </div>
              </q-expansion-item>
              <div class="sectionDivider">
                <hr />
              </div>
              <q-expansion-item
                group="middle"
                label="Strikes"
                header-class="sectionLabel"
                default-opened
                dense
                dense-toggle
                expand-separator
                ref="expStrike"
              >
                <WeaponBlock
                  v-for="attack in character.combat.attacks"
                  :key="attack.name"
                  :weapon="attack"
                  :interactive="true"
                />
              </q-expansion-item>
              <div class="sectionDivider">
                <hr />
              </div>
              <q-expansion-item
                group="middle"
                label="Actions + Activities"
                header-class="sectionLabel"
                default-opened
                dense
                dense-toggle
                expand-separator
                ref="expAct"
              >
                <AbilitiesTable
                  :character="character"
                  :abilities="character.abilities.filter((a) => a.activity)"
                />
              </q-expansion-item>
              <div class="sectionDivider">
                <hr />
              </div>
              <q-expansion-item
                group="middle"
                label="Class Feats + Features"
                header-class="sectionLabel"
                default-opened
                dense
                dense-toggle
                expand-separator
              >
                <AbilitiesTable
                  :character="character"
                  :abilities="
                    Util.types(
                      character.abilities,
                      [AbilityType.ClassFeat, AbilityType.ClassFeature],
                      [],
                    ).filter((a) => !a.activity)
                  "
                />
              </q-expansion-item>
              <div class="sectionDivider">
                <hr />
              </div>
              <q-expansion-item
                group="middle"
                label="General + Skill Feats"
                header-class="sectionLabel"
                default-opened
                dense
                dense-toggle
                expand-separator
              >
                <AbilitiesTable
                  :character="character"
                  :abilities="
                    Util.types(
                      character.abilities,
                      [AbilityType.SkillFeat, AbilityType.GeneralFeat],
                      [],
                    ).filter((a) => !a.activity)
                  "
                />
              </q-expansion-item>
              <template
                v-if="
                  Util.types(
                    character.abilities,
                    [AbilityType.AncestryFeat],
                    [],
                  ).filter((a) => !a.activity).length > 0
                "
              >
                <div class="sectionDivider">
                  <hr />
                </div>
                <q-expansion-item
                  group="middle"
                  label="Ancestry Feats + Features"
                  header-class="sectionLabel"
                  default-opened
                  dense
                  dense-toggle
                  expand-separator
                >
                  <AbilitiesTable
                    :character="character"
                    :abilities="
                      Util.types(
                        character.abilities,
                        [AbilityType.AncestryFeat],
                        [],
                      ).filter((a) => !a.activity)
                    "
                  /> </q-expansion-item
              ></template>
            </q-list>
          </q-scroll-area>
          <div id="focus" v-if="character.spells.focusPoints > 0">
            <div class="line">
              <div class="numBox rounded">
                <q-input
                  v-model.number="focus"
                  type="number"
                  :max="character.spells.focusPoints"
                  min="0"
                  input-class="text-right"
                  style="font-size: 1em"
                />
              </div>
              <div
                class="labello"
                style="align-self: center; text-align: center"
              >
                Focus
              </div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                {{ character.spells.focusPoints }}
              </div>
              <div class="labello">Max Focus</div>
            </div>
          </div>
        </div>
      </div>
      <div id="rightThird">
        <div
          class="column"
          style="justify-content: stretch; align-items: end"
          ref="rightThird"
        >
          <q-tabs
            v-model="currentRightTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
            style="flex-grow: 0"
          >
            <q-tab name="items" label="Items" />
            <q-tab name="skills" label="Skills" />
          </q-tabs>
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
              <q-tab-panel name="items" style="padding: 0" ref="itemsTab">
                <InteractiveItems :character="character" />
              </q-tab-panel>
              <q-tab-panel name="skills" style="padding: 0" ref="skillsTab">
                <InteractiveSkills :character="character" />
              </q-tab-panel>
            </q-tab-panels>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Util from 'src/character/util';
import * as LS from 'src/pages/localStorage';
import type Character from 'src/character/character';
import InteractiveSkills from 'src/components/interactive/InteractiveSkills.vue';
import { AbilityType, Attribute, Score } from 'src/character/model';
import ClickableTrait from 'src/components/interactive/ClickableTrait.vue';
import ProficiencyDisplay from 'src/components/ProficiencyDisplay.vue';
import WeaponBlock from 'src/components/WeaponBlock.vue';
import { onMounted, ref, watch } from 'vue';
import {
  QExpansionItem,
  QPopupProxy,
  QScrollArea,
  QTabPanel,
  QTabPanels,
} from 'quasar';
import ClickableAttribute from 'src/components/interactive/ClickableAttribute.vue';
import AbilitiesTable from 'src/components/interactive/AbilitiesTable.vue';
import InteractiveItems from 'src/components/interactive/InteractiveItems.vue';

document.documentElement.classList.add('interactive');

const props = defineProps<{
  character: Character;
}>();

const root = ref<HTMLDivElement | null>(null);
const abilityBlock = ref<HTMLDivElement | null>(null);
const middleScroll = ref<QScrollArea | null>(null);
const expInfo = ref<QExpansionItem | null>(null);
const expStrike = ref<QExpansionItem | null>(null);
const expAct = ref<QExpansionItem | null>(null);
const currHP = ref<number>(
  LS.load(props.character.name, 'hp') ?? props.character.hp,
);
const workingHP = ref<number>(
  LS.load(props.character.name, 'hp') ?? props.character.hp,
);
const focus = ref<number>(
  LS.load(props.character.name, 'focus') ?? props.character.spells.focusPoints,
);

watch(currHP, (value) => {
  LS.save(props.character.name, 'hp', value);
});
watch(focus, (value) => {
  LS.save(props.character.name, 'focus', value);
});

onMounted(() => {
  if (expInfo.value) {
    expInfo.value.show();
  }
  const boundedCheck = () => {
    if (!root.value) return;
    root.value
      .querySelectorAll('.bounded-line:not(.second-pass)')
      .forEach((val) => {
        const value = val as HTMLElement;
        let size = parseFloat(getComputedStyle(value).fontSize);
        const bound =
          parseFloat(val.getAttribute('data-max') ?? '2.1') *
          parseFloat(getComputedStyle(value).lineHeight);
        while (value.offsetHeight >= bound && size > 4) {
          size -= 0.25;
          value.style.fontSize = size.toString() + 'px';
        }
      });
    root.value.querySelectorAll('.bounded-line.second-pass').forEach((val) => {
      const value = val as HTMLElement;
      let size = parseFloat(getComputedStyle(value).fontSize);
      const bound =
        parseFloat(val.getAttribute('data-max') ?? '2.1') *
        parseFloat(getComputedStyle(value).lineHeight);
      const row = value.parentElement?.parentElement;
      if (!row) return;
      const oldHeight = row.offsetHeight;
      while (oldHeight >= row.offsetHeight && value.offsetHeight < bound) {
        size += 0.25;
        value.style.fontSize = size.toString() + 'px';
      }
      size -= 0.25;
      value.style.fontSize = size.toString() + 'px';
    });
  };
  boundedCheck();
  if (
    middleScroll.value &&
    middleScroll.value.getScroll().verticalContainerSize <
      middleScroll.value.getScroll().verticalSize
  ) {
    abilityBlock.value?.classList.add('compact');
  }
  boundedCheck();
});

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

<style>
@import '../css/sheet.scss';
</style>
