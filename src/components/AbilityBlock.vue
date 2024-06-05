<template>
  <div class="ability-box" ref="box">
    <div class="action-icon" v-if="ability.activity">
      {{ ability.cost }}
    </div>
    <div class="ability-title">{{ ability.name }}</div>
    <line-part label="Source" :content="ability.source" />
    <line-part label="Traits" :content="ability.traits?.join(', ') || ''" />
    <line-part label="Requirements" :content="ability.requirements || ''" />
    <line-part
      v-if="ability.activity && ability.trigger"
      label="Trigger"
      :content="ability.trigger || ''"
    />
    <div class="ability-description" ref="description" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LinePart from './LinePart.vue';
import { Ability } from 'src/character/model';
import * as Positioning from './positioning';
const props = defineProps<{
  ability: Ability;
}>();
const box = ref<HTMLDivElement | null>(null);
const description = ref<HTMLDivElement | null>(null);

const position = (pos: Positioning.Positioning) => {
  if (!box.value || !description.value) return;
  Positioning.position(
    pos,
    box.value,
    description.value,
    props.ability.description
  );
};

defineExpose({
  position,
});
</script>
