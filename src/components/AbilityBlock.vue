<template>
  <div class="ability-box" ref="box">
    <div class="action-icon" v-if="ability.activity">
      {{ ability.cost }}
    </div>
    <div class="ability-title">{{ ability.name }}</div>
    <line-part label="Source" :content="ability.source.name" />
    <div class="line" v-if="ability.traits.length > 0">
      <div class="underlined" style="flex-direction: row">
        <span v-if="interactive">
          <template v-for="(trait, index) in ability.traits" :key="trait.name">
            <template v-if="index > 0">, </template>
            <ClickableTrait :trait="trait" />
          </template>
        </span>
        <template v-else>{{
          ability.traits.map((t) => t.name).join(', ')
        }}</template>
      </div>
      <div class="labello">Traits</div>
    </div>
    <line-part label="Requirements" :content="ability.requirements || ''" />
    <line-part
      v-if="ability.activity && ability.trigger"
      label="Trigger"
      :content="ability.trigger || ''"
    />
    <div
      class="ability-description"
      ref="description"
      v-html="interactive ? ability.description : ''"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LinePart from './LinePart.vue';
import ClickableTrait from './interactive/ClickableTrait.vue';
import type { Ability } from 'src/character/model';
import * as Positioning from './paper/positioning';
const props = defineProps<{
  ability: Ability;
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
    props.ability.description,
  );
};

defineExpose({
  position,
});
</script>
