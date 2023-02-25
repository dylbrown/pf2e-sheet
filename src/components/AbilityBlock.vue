<template>
  <div class="ability-box">
    <div class="action-icon" v-if="ability.activity">
      {{ ability.cost }}
    </div>
    <div class="ability-title">{{ ability.name }}</div>
    <line-part label="Source" :content="ability.source" />
    <line-part label="Traits" :content="ability.traits?.join(', ') || ''" />
    <line-part label="Requirements" :content="ability.requirements || ''" />
    <line-part
      v-if="ability.activity"
      label="Trigger"
      :content="ability.trigger || ''"
    />
    <div class="ability-description">{{ ability.description }}</div>
  </div>
</template>

<script setup lang="ts">
import LinePart from './LinePart.vue';
import { Ability } from 'src/character/model';
defineProps<{
  ability: Ability;
}>();
</script>
