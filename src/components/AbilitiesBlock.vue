<template>
  <div class="abilities-flex first-page" ref="abilities">
    <div class="ability-box ability-section do-not-break">
      Class Feats & Features
    </div>
    <AbilityBlock
      v-for="[index, ability] in types(
        character.abilities,
        [AbilityType.ClassFeat, AbilityType.ClassFeature],
        []
      ).entries()"
      :key="index"
      :ability="ability"
    />
    <div class="ability-box ability-section do-not-break">
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
      :ability="ability"
    />
    <div class="ability-box ability-section do-not-break">Ancestry Feats</div>
    <AbilityBlock
      v-for="[index, ability] in types(
        character.abilities,
        [AbilityType.AncestryFeat],
        []
      ).entries()"
      :key="index"
      :ability="ability"
    />
    <div id="inventory-grid" ref="inventoryGrid">
      <div class="inventory-title col-section-title">Inventory</div>
      <div class="col-section-label">#</div>
      <div class="col-section-label">Item Name</div>
      <div class="col-section-label">Wt.</div>
      <template v-for="item of character.inventory" :key="item">
        <div>{{ item.count }}</div>
        <div>{{ item.name }}</div>
        <div>{{ item.weight }}</div></template
      >
    </div>
    <template v-for="list of character.spells.lists" :key="list.name">
      <PreparedList v-if="list.type == 'Prepared'" :list="list" />
      <SpontaneousList v-if="list.type == 'Spontaneous'" :list="list" />
      <InnateList v-if="list.type == 'Innate'" :list="list" />
      <template v-for="level of list.known.slice().reverse()">
        <SpellBlock v-for="spell of level" :key="spell.name" :spell="spell" />
      </template>
    </template>
    <template v-if="character.spells.focusPoints > 0">
      <div
        style="position: absolute; width: calc(100% / 3 - 8px)"
        class="do-not-break"
      >
        <div class="spells-title col-section-title">Focus Spells</div>
      </div>
      <template
        v-for="list of character.spells.lists.filter((l) => l.focus.length > 0)"
        :key="list.name"
      >
        <div id="focus-rolls" class="do-not-break">
          <div class="spells-title col-section-title">{{ list.name }}</div>
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
        />
      </template>
    </template>
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

import { ref } from 'vue';

defineProps<{
  character: Character;
}>();

const inventoryGrid = ref<HTMLDivElement>();
const abilities = ref<HTMLDivElement>();

defineExpose({
  inventoryGrid,
  abilities,
});
</script>
