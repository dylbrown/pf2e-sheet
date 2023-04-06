<template>
  <div class="spell-box">
    <div class="spell-attrs">
      <div class="spell-title">{{ spell.name }}</div>
      <div
        class="spell-cost"
        v-if="!isNaN(Number(spell.cost)) && !spell.maxCost"
      >
        <div
          :class="Number(spell.cost) >= 1 ? 'spell-cost-yes' : 'spell-cost-no'"
        >
          <span>♦</span>
        </div>
        <div
          :class="Number(spell.cost) >= 2 ? 'spell-cost-yes' : 'spell-cost-no'"
        >
          <span>♦</span>
        </div>
        <div
          :class="Number(spell.cost) >= 3 ? 'spell-cost-yes' : 'spell-cost-no'"
        >
          <span>♦</span>
        </div>
      </div>
      <div
        class="spell-cost"
        v-if="!isNaN(Number(spell.cost)) && spell.maxCost"
      >
        <div class="spell-cost-yes">
          <span>♦</span>
        </div>
        <div
          :class="
            Number(spell.cost) < 2
              ? 'spell-cost-yes spell-cost-optional'
              : 'spell-cost-yes'
          "
        >
          <span>♦</span>
        </div>
        <div
          :class="
            Number(spell.cost) < 3
              ? 'spell-cost-yes spell-cost-optional'
              : 'spell-cost-yes'
          "
        >
          <span>♦</span>
        </div>
      </div>
      <LinePart label="Level" :content="spell.level.toString()" />
      <div v-if="isNaN(Number(spell.cost))">
        <LinePart label="Cast Time" :content="spell.castTime" />
      </div>
      <LinePart label="Components" :content="spell.components.join(', ')" />
      <LinePart label="Source" :content="spell.source" />
      <LinePart label="Traits" :content="spell.traits.join(', ')" />
      <LinePart label="Requirements" :content="spell.requirements" />
      <LinePart label="Range" :content="spell.range" />
      <LinePart label="Area" :content="spell.area" />
      <LinePart label="Targets" :content="spell.targets" />
      <LinePart label="Duration" :content="spell.duration" />
      <LinePart label="Save" :content="spell.save" />
    </div>
    <div class="ability-description" v-html="spell.description" />
  </div>
</template>

<script setup lang="ts">
import { Spell } from 'src/character/model';
import LinePart from './LinePart.vue';

defineProps<{
  spell: Spell;
}>();
</script>
