<template>
  <div class="item-box" ref="box">
    <div class="ability-title">{{ item.name }}</div>
    <line-part label="Source" :content="item.source" />
    <div class="line" v-if="item.traits.length > 0">
      <div class="underlined" style="flex-direction: row">
        <span v-if="interactive">
          <template v-for="(trait, index) in item.traits" :key="trait.name">
            <template v-if="index > 0">, </template>
            <ClickableTrait :trait="trait" />
          </template>
        </span>
        <template v-else>{{
          item.traits.map((t) => t.name).join(', ')
        }}</template>
      </div>
      <div class="labello">Traits</div>
    </div>
    <line-part label="Bulk" :content="item.weight" />
    <div
      class="ability-description"
      ref="description"
      v-html="interactive ? item.description : ''"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LinePart from './LinePart.vue';
import ClickableTrait from './interactive/ClickableTrait.vue';
import type { Item } from 'src/character/model';
import * as Positioning from './paper/positioning';
const props = defineProps<{
  item: Item;
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
    props.item.description,
  );
};

defineExpose({
  position,
});
</script>
