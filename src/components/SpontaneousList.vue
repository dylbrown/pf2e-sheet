<template>
  <div class="spells-spontaneous" :data-list="list.name">
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
    <div class="spells-spontaneous-grid">
      <template
        v-for="[index, level] of Array.from(list.known.entries())
          .reverse()
          .filter(([_, level]) => level.length > 0)"
        :key="index"
      >
        <div
          class="spells-level"
          style="grid-column-end: span 2"
          v-if="index == 0"
        >
          <div class="spells-line"></div>
          <div class="spells-level-label">Cantrips</div>
          <div class="spells-line"></div>
        </div>
        <template v-if="index > 0">
          <div class="spells-level">
            <div class="spells-line"></div>
            <div class="spells-level-label">Level {{ index }}</div>
            <div class="spells-line"></div>
          </div>
          <div class="spells-level">
            <div class="spells-line"></div>
            <div
              class="spells-slot"
              v-for="n in list.slots[index]"
              :key="n"
            ></div>
            <div class="spells-line"></div>
          </div>
        </template>
        <div
          class="spells-name"
          :class="i % 2 == 0 ? 'left' : 'right'"
          v-for="[i, spell] of level.entries()"
          :key="spell.name"
        >
          {{ spell.name }}
        </div>

        <div
          class="spells-name right"
          v-if="list.known[index].length % 2 == 1"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { signed } from 'src/character/util';
import { SpellList } from 'src/character/model';

defineProps<{
  list: SpellList;
}>();
</script>
