<template>
  <div ref="root">
    <div class="page first-page">
      <div id="leftThird">
        <div class="flex-column" style="justify-content: stretch">
          <div>PATHFINDER CHARACTER SHEET</div>
          <div class="underlined wrap character-name">
            <span>{{ character.name }}</span>
            <q-btn
              dense
              icon="ra-burning-meteor"
              style="font-size: 0.8em"
              @click="resetConfirm = true"
            />
            <q-dialog v-model="resetConfirm">
              <q-card style="background-color: #f33">
                <q-card-section class="row items-center">
                  <q-avatar icon="ra-burning-meteor" />
                  <span class="q-ml-sm"
                    >Are you sure you would like to reset all cached character
                    data? This won't affect the file, but all selections made on
                    this site will be deleted and the page reloaded.
                  </span>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Cancel" v-close-popup />
                  <q-btn
                    push
                    label="Confirm"
                    v-close-popup
                    @click="reset"
                    color="black"
                    text-color="red"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel" style="text-transform: uppercase">
            Ability Scores
          </div>
          <div id="ability-grid">
            <template v-for="score of [0, 1, 2, 3, 4, 5]" :key="score">
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
          <div class="row-between">
            <div class="line">
              <StatModsButton :character="character" />
              <div class="labello">Buffs/Debuffs</div>
            </div>
            <div class="line">
              <div class="numBox rounded" style="min-height: 3.6em"></div>
              <div class="labello">Conditions</div>
            </div>
          </div>
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel">Health</div>
          <div class="row-between">
            <div class="line">
              <div class="numBox rounded" style="position: relative">
                <q-linear-progress
                  :value="(currHP - character.hp) / character.hp"
                  color="yellow-4"
                  track-color="white"
                  class="rounded"
                  style="
                    position: absolute;
                    z-index: 10;
                    width: 100%;
                    height: 100%;
                  "
                >
                  <div
                    class="absolute-full flex flex-center"
                    style="color: black; font-size: calc(1rem + 0.5px)"
                  >
                    {{ currHP }} / {{ character.hp }}
                  </div>
                  <q-popup-proxy
                    @show="workingHP = currHP"
                    @hide="currHP = workingHP"
                  >
                    <q-linear-progress
                      :value="(workingHP - character.hp) / character.hp"
                      color="yellow-4"
                      track-color="white"
                      style="
                        height: 2rem;
                        width: 20rem;
                        position: absolute;
                        z-index: 10;
                      "
                    >
                      <div
                        class="absolute-full flex flex-center"
                        style="color: black; font-size: 1rem"
                      >
                        {{ workingHP }}
                        <span style="color: gray">
                          &nbsp;({{ Util.signed(workingHP - currHP) }})
                        </span>
                      </div>
                    </q-linear-progress>
                    <q-linear-progress
                      :value="workingHP / character.hp"
                      color="blue-2"
                      track-color="white"
                      style="height: 2rem"
                    />
                    <q-btn-group style="width: 20rem" spread stretch>
                      <q-btn label="-10" @click="workingHP -= 10" />
                      <q-btn label="-5" @click="workingHP -= 5" />
                      <q-btn label="-1" @click="workingHP -= 1" />
                      <q-btn label="+1" @click="workingHP += 1" />
                      <q-btn label="+5" @click="workingHP += 5" />
                      <q-btn label="+10" @click="workingHP += 10" />
                    </q-btn-group>
                  </q-popup-proxy>
                </q-linear-progress>
                <q-linear-progress
                  :value="currHP / character.hp"
                  color="blue-2"
                  track-color="white"
                  class="rounded"
                />
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
                <div
                  class="underlined-roll"
                  :class="
                    (moddedAttr(attr) < character.attributes[attr].total
                      ? 'de'
                      : '') +
                    (moddedAttr(attr) != character.attributes[attr].total
                      ? 'buffed'
                      : '')
                  "
                >
                  {{ Util.signed(moddedAttr(attr)) }}
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
        <div class="flex-column" style="justify-content: flex-start">
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
                label="Strikes"
                header-class="sectionLabel"
                default-opened
                dense
                dense-toggle
                expand-separator
                ref="expStrike"
              >
                <WeaponsList
                  :character="character"
                  :weapons="character.combat.attacks"
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
                    :abilities="
                      Util.types(
                        character.abilities,
                        [AbilityType.AncestryFeat],
                        [],
                      ).filter((a) => !a.activity)
                    "
                  />
                </q-expansion-item>
              </template>
              <template v-if="character.abilities.excluded.length > 0">
                <div class="sectionDivider">
                  <hr />
                </div>
                <q-expansion-item
                  group="middle"
                  label="Hidden Feats + Features"
                  header-class="sectionLabel"
                  default-opened
                  dense
                  dense-toggle
                  expand-separator
                  style="opacity: 0.4"
                >
                  <AbilitiesTable :abilities="character.abilities.excluded" />
                </q-expansion-item>
              </template>
            </q-list>
          </q-scroll-area>
          <div id="focus">
            <PipCounter
              label="Focus"
              :max="character.spells.focusPoints"
              :start="character.spells.focusPoints"
              interactive
              :save-key="['focus']"
              :char-name="character.name"
              :notifier="restNotifier"
              v-if="character.spells.focusPoints > 0"
            />
            <div
              class="line pip-line"
              style="margin-right: 5px; align-self: end"
            >
              <q-btn
                icon="fa-solid fa-bed"
                dense
                style="width: 2.5em; height: 2.5em"
                @click="restConfirm = true"
              />
              <div class="labello">Rest</div>
              <q-dialog v-model="restConfirm">
                <q-card>
                  <q-card-section class="row items-center">
                    <q-avatar icon="fa-solid fa-bed" />
                    <span class="q-ml-sm"
                      >Are you sure you would like to rest? This will reset your
                      focus points and spells cast, as well as granting {{}} Hit
                      Points.
                    </span>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn
                      flat
                      label="Confirm"
                      color="primary"
                      v-close-popup
                      @click="rest"
                    />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
          </div>
        </div>
      </div>
      <RightThird :character="character" :notifier="restNotifier" />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Util from 'src/character/util';
import * as LS from 'src/pages/localStorage';
import type Character from 'src/character/character';
import RightThird from 'src/components/interactive/RightThird.vue';
import { AbilityType, Attribute, Score } from 'src/character/model';
import ClickableTrait from 'src/components/interactive/ClickableTrait.vue';
import ProficiencyDisplay from 'src/components/ProficiencyDisplay.vue';
import { onMounted, ref, watch } from 'vue';
import { QExpansionItem, QPopupProxy, QScrollArea } from 'quasar';
import ClickableAttribute from 'src/components/interactive/ClickableAttribute.vue';
import AbilitiesTable from 'src/components/interactive/AbilitiesTable.vue';
import PipCounter from 'src/components/PipCounter.vue';
import StatModsButton from 'src/components/interactive/StatModsButton.vue';
import WeaponsList from 'src/components/interactive/WeaponsList.vue';
import { applyMods } from 'src/character/modifiers';

document.documentElement.classList.add('interactive');

const props = defineProps<{
  character: Character;
}>();

const moddedAttr = (attr: Attribute) => {
  return applyMods(props.character.modifiers, props.character.attributes, attr);
};

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
const restConfirm = ref<boolean>(false);
const rest = () => {
  if (currHP.value) {
    currHP.value = Math.min(
      currHP.value +
        props.character.level *
          Math.max(
            1,
            Util.abilityMod(props.character.scores[Score.Constitution]),
          ),
      props.character.hp,
    );
  }
  restNotifier.value += 1;
};
const restNotifier = ref<number>(0);

watch(currHP, (value) => {
  LS.save(props.character.name, value, 'hp');
});
watch(focus, (value) => {
  LS.save(props.character.name, value, 'focus');
});

onMounted(() => {
  if (expAct.value) {
    expAct.value.show();
  }
  const startingSizes: Array<{ size: number; element: HTMLElement }> = [];
  const boundedCheck = (first?: boolean) => {
    if (!root.value) return;
    for (const entry of Object.values(startingSizes)) {
      entry.element.style.fontSize = entry.size + 'px';
    }

    root.value
      .querySelectorAll('.bounded-line:not([data-pass])')
      .forEach((val) => {
        const value = val as HTMLElement;
        let size = parseFloat(getComputedStyle(value).fontSize);
        if (first) {
          startingSizes.push({ size: size, element: value });
        }
        const bound =
          parseFloat(val.getAttribute('data-max') ?? '2.1') *
          parseFloat(getComputedStyle(value).lineHeight);
        while (value.offsetHeight >= bound && size > 4) {
          size -= 0.25;
          value.style.fontSize = size.toString() + 'px';
        }
      });
    for (let pass = 2; pass < 5; pass++) {
      const elements = root.value.querySelectorAll(
        `.bounded-line[data-pass="${pass}"]`,
      );
      if (elements.length == 0) break;
      elements.forEach((val) => {
        const value = val as HTMLElement;
        let size = parseFloat(getComputedStyle(value).fontSize);
        if (first) {
          startingSizes.push({ size: size, element: value });
        }
        const bound =
          parseFloat(val.getAttribute('data-max') ?? '2.1') *
          parseFloat(getComputedStyle(value).lineHeight);
        const row = value.parentElement?.parentElement;
        if (!row) return;
        const oldHeight = row.offsetHeight;
        while (oldHeight >= row.offsetHeight && size < bound) {
          size += 0.25;
          value.style.fontSize = size.toString() + 'px';
        }
        size -= 0.25;
        value.style.fontSize = size.toString() + 'px';
      });
    }
  };
  boundedCheck(true);
  if (
    middleScroll.value &&
    middleScroll.value.getScroll().verticalContainerSize <
      middleScroll.value.getScroll().verticalSize
  ) {
    abilityBlock.value?.classList.add('compact');
  }
  boundedCheck();
});

const resetConfirm = ref<boolean>(false);
const reset = () => {
  LS.reset(props.character.name);
  location.reload();
};
</script>

<style lang="scss">
@import '../css/sheet.scss';
</style>
