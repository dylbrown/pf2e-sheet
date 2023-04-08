<template>
  <div class="spells-prepared" :data-list="list.name">
    <div class="spells-title col-section-title">{{ list.name }} Spells</div>
    <div class="spells-stats">
      <div class="rollLabel">Spell Attack</div>
      <div class="numBox rounded">
        {{ list.attack != 0 ? signed(list.attack) : '' }}
      </div>
      <div class="rollLabel">Spell DC</div>
      <div class="numBox rounded">
        {{ list.dc != 0 ? list.dc : '' }}
      </div>
    </div>
    <div class="col-section-label" style="border-left: 1px solid black">
      Spell Name
    </div>
    <div
      class="col-section-label col-center"
      style="border-right: 1px solid black"
    >
      Slots
    </div>
    <template
      v-for="[index, level] of Array.from(list.known.entries())
        .reverse()
        .filter(([_, level]) => level.length > 0)"
      :key="index"
    >
      <div class="spells-level">
        <div class="spells-line fixed"></div>
        <div class="spells-level-label">
          <template v-if="index == 0">Cantrips</template>
          <template v-if="index > 0">Level {{ index }}</template>
        </div>
        <div class="spells-line"></div>
      </div>
      <div class="spells-level">
        <div class="spells-line"></div>
        <div class="spells-level-label">{{ list.slots[index] }}</div>
        <div class="spells-line"></div>
      </div>
      <template v-for="spell of level" :key="spell">
        <div class="spells-name">{{ spell.name }}</div>
        <div class="spells-slot-container">
          <div class="spells-slot" v-if="index == 0"></div>
          <div
            class="spells-slot"
            v-for="n in Math.max(3, list.slots[index])"
            :key="n"
          ></div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { signed } from 'src/character/util';
import { SpellList } from 'src/character/model';

defineProps<{
  list: SpellList;
}>();
</script>
