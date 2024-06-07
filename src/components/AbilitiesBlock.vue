<template>
  <div class="page" ref="page">
    <div class="abilities-flex" ref="abilities">
      <div class="ability-box ability-section do-not-break" ref="classLabel">
        Class Feats & Features
      </div>
      <AbilityBlock
        v-for="[index, ability] in types(
          character.abilities,
          [AbilityType.ClassFeat, AbilityType.ClassFeature],
          []
        ).entries()"
        :key="index"
        ref="classAbilities"
        :ability="ability"
      />
      <div class="ability-box ability-section do-not-break" ref="generalLabel">
        General & Skill Feats
      </div>
      <AbilityBlock
        v-for="[index, ability] in types(
          character.abilities,
          [],
          [
            AbilityType.ClassFeat,
            AbilityType.ClassFeature,
            AbilityType.AncestryFeat,
          ]
        ).entries()"
        :key="index"
        ref="generalAbilities"
        :ability="ability"
      />
      <div class="ability-box ability-section do-not-break" ref="ancestryLabel">
        Ancestry Feats
      </div>
      <AbilityBlock
        v-for="[index, ability] in types(
          character.abilities,
          [AbilityType.AncestryFeat],
          []
        ).entries()"
        :key="index"
        ref="ancestryAbilities"
        :ability="ability"
      />
      <div class="inventory-grid" ref="inventoryGrid">
        <div class="grid-chunk">
          <div class="inventory-title col-section-title">Inventory</div>
          <div class="col-section-label">#</div>
          <div class="col-section-label">Item Name</div>
          <div class="col-section-label">Wt.</div>
          <template v-for="item of character.inventory" :key="item">
            <div class="fixed-item">{{ item.count }}</div>
            <div class="fixed-item">{{ item.name }}</div>
            <div class="fixed-item">{{ item.weight }}</div></template
          >
        </div>
      </div>
      <template v-for="list of character.spells.lists" :key="list.name">
        <PreparedList
          v-if="list.type == 'Prepared'"
          :list="list"
          :character="character"
        />
        <SpontaneousList
          v-if="list.type == 'Spontaneous'"
          :list="list"
          :character="character"
        />
        <InnateList
          v-if="list.type == 'Innate'"
          :list="list"
          :character="character"
        />
        <template v-for="level of list.known.slice().reverse()">
          <SpellBlock
            v-for="spell of level"
            :key="spell.name"
            :spell="spell"
            ref="spells"
            :data-list="list.name"
          />
        </template>
      </template>
      <template v-if="character.spells.focusPoints > 0">
        <div
          style="position: absolute; width: calc(100% / 3)"
          class="do-not-break"
          ref="focusLabel"
        >
          <div class="spells-title col-section-title">Focus Spells</div>
        </div>
        <template
          v-for="list of character.spells.lists.filter(
            (l) => l.focus.length > 0
          )"
          :key="list.name"
        >
          <div class="focus-rolls do-not-break" :data-focus="list.name">
            <div class="spells-title col-section-title">
              {{ list.name }}
            </div>
            <div class="spells-stats" v-if="list.type == 'None'">
              <div class="rollLabel">Spell Attack</div>
              <div class="numBox rounded">
                {{ signed(list.attack) }}
              </div>
              <div class="rollLabel">Spell DC</div>
              <div class="numBox rounded">
                {{ list.dc }}
              </div>
            </div>
          </div>
          <SpellBlock
            v-for="spell of list.focus"
            :key="spell.name"
            :spell="spell"
            ref="focusSpells"
            :data-focus="list.name"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import AbilityBlock from 'src/components/AbilityBlock.vue';
import SpellBlock from 'src/components/SpellBlock.vue';
import InnateList from 'src/components/InnateList.vue';
import PreparedList from 'src/components/PreparedList.vue';
import SpontaneousList from 'src/components/SpontaneousList.vue';
import { signed, types } from 'src/character/util';
import Character from 'src/character/character';
import { AbilityType } from 'src/character/model';

import { ref, onMounted } from 'vue';
import * as Positioning from './positioning';

const props = defineProps<{
  character: Character;
  heightMeasure: HTMLDivElement | null;
}>();

// References
const page = ref<HTMLDivElement | null>(null);
const abilities = ref<HTMLDivElement | null>(null);
const classLabel = ref<HTMLDivElement | null>(null);
const classAbilities = ref<InstanceType<typeof AbilityBlock>[] | null>(null);
const generalLabel = ref<HTMLDivElement | null>(null);
const generalAbilities = ref<InstanceType<typeof AbilityBlock>[] | null>(null);
const ancestryLabel = ref<HTMLDivElement | null>(null);
const ancestryAbilities = ref<InstanceType<typeof AbilityBlock>[] | null>(null);
const inventoryGrid = ref<HTMLDivElement | null>(null);
const spells = ref<InstanceType<typeof SpellBlock>[] | null>(null);
const focusSpells = ref<InstanceType<typeof SpellBlock>[] | null>(null);
const focusLabel = ref<HTMLDivElement | null>(null);
let storedHeight = 0;

// Positioning Function
const position = () => {
  if (
    !abilities.value ||
    !page.value ||
    !classAbilities.value ||
    !classLabel.value ||
    !generalAbilities.value ||
    !generalLabel.value ||
    !ancestryAbilities.value ||
    !ancestryLabel.value ||
    !inventoryGrid.value
  )
    return;

  const height =
    storedHeight == 0
      ? abilities.value.getBoundingClientRect().height
      : storedHeight;
  page.value.style.top = height + 'px';
  const pos = new Positioning.Positioning(height);

  // Class Feats & Features
  pos.apply(classLabel.value);
  for (const block of classAbilities.value) {
    block.position(pos);
  }

  // Skill & General Feats
  pos.apply(generalLabel.value);
  for (const block of generalAbilities.value) {
    block.position(pos);
  }

  // Ancestry Feats
  pos.apply(ancestryLabel.value);
  for (const block of ancestryAbilities.value) {
    block.position(pos);
  }

  // Inventory
  pos.moveLeftIfPast(0.75, 0.75, 0.5);
  /*
  for (let i = inventoryGrid.value.children.length - 1; i >= 0; i--) {
    const item = inventoryGrid.value.children.item(i);
    if (!item || item.classList.contains('fixed-item')) break;
    inventoryGrid.value.removeChild(item);
  }
  while (inventoryGrid.value.getBoundingClientRect().height < height) {
    inventoryGrid.value.appendChild(document.createElement('div'));
  }
  if (inventoryGrid.value.lastElementChild)
    inventoryGrid.value.removeChild(inventoryGrid.value.lastElementChild);*/
  Positioning.positionGrid(pos, inventoryGrid.value);

  // Spells
  if (spells.value) {
    pos.moveLeftIfPast(0.75, 0.75, 0.5);
    for (const list of props.character.spells.lists) {
      const header = document.querySelector(
        `[data-list='${list.name}']`
      ) as HTMLElement;
      if (header) {
        Positioning.positionHeader(pos, header);
        const grid = document.querySelector(
          `[data-grid='${list.name}']`
        ) as HTMLElement;
        if (grid) {
          Positioning.positionGrid(pos, grid);
        }
        for (const block of spells.value) {
          if (block.$attrs['data-list'] == list.name) block.position(pos);
        }
      }
    }
  }

  // Focus Spells
  if (focusLabel.value && focusSpells.value) {
    pos.apply(focusLabel.value);
    for (const list of props.character.spells.lists) {
      const header = document.querySelector(
        `[data-focus='${list.name}']`
      ) as HTMLElement;
      if (header) Positioning.positionHeader(pos, header);
      for (const block of focusSpells.value) {
        if (block.$attrs['data-focus'] == list.name) block.position(pos);
      }
    }
  }
  /*
  const sepContainer = document.querySelector('.separator')?.parentElement;
  if (sepContainer) {
    for (let i = 1; i <= pos.page + 1; i++) {
      sepContainer.innerHTML +=
        "<div class='separator' style='top: calc(" + i + "00vh - 3px)'></div>";
    }
  }
  */
  page.value.style.height = `${pos.pageHeight * (pos.page + 1)}px`;
  page.value.dataset.pages = `${pos.page + 1}`;
};
onMounted(() => {
  position();
});
</script>
