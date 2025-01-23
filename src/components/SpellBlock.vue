<template>
  <div class="spell-box" ref="box">
    <div class="spell-attrs">
      <div class="spell-title">
        {{ spell.name }}
      </div>
      <div class="spell-cost" v-if="spell.cost && !spell.maxCost">
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
      <div class="spell-cost" v-if="spell.cost && spell.maxCost">
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
      <LinePart
        label="Cast Time"
        :content="spell.castTime"
        v-if="!spell.cost"
      />
      <LinePart label="Level" :content="spell.level.toString()" />
      <LinePart
        label="Components"
        v-if="spell.components"
        :content="spell.components.join(', ')"
      />
      <LinePart
        label="Per Day"
        :content="spell.castsPerDay ? spell.castsPerDay.toString() : ''"
      />
      <LinePart label="Source" :content="spell.source.name" />
      <div class="line" v-if="spell.traits.length > 0">
        <div class="underlined" style="flex-direction: row">
          <span v-if="interactive">
            <template v-for="(trait, index) in spell.traits" :key="trait.name">
              <template v-if="index > 0">, </template>
              <ClickableTrait :trait="trait" />
            </template>
          </span>
          <template v-else>{{
            spell.traits.map((t) => t.name).join(', ')
          }}</template>
        </div>
        <div class="labello">Traits</div>
      </div>
      <LinePart label="Requirements" :content="spell.requirements" />
      <LinePart label="Range" :content="spell.range" />
      <LinePart label="Area" :content="spell.area" />
      <LinePart label="Targets" :content="spell.targets" />
      <LinePart label="Duration" :content="spell.duration" />
      <LinePart label="Save" :content="spell.save" />
    </div>
    <div
      class="ability-description"
      ref="description"
      v-html="interactive ? spell.description : ''"
    />
  </div>
</template>

<script setup lang="ts">
import type { Spell } from 'src/character/model';
import LinePart from './LinePart.vue';
import ClickableTrait from './interactive/ClickableTrait.vue';
import { ref } from 'vue';
import * as Positioning from './paper/positioning';

const props = defineProps<{
  spell: Spell;
  interactive: boolean;
}>();
const box = ref<HTMLDivElement | null>(null);
const description = ref<HTMLDivElement | null>(null);

const position = (pos: Positioning.Positioning) => {
  if (!box.value || !description.value) return;
  Positioning.position(
    pos,
    box.value,
    description.value,
    props.spell.description,
  );
};

defineExpose({
  position,
});
</script>
