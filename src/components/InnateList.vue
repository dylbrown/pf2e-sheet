<template>
  <div id="spells-spontaneous">
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
  </div>
</template>

<script setup lang="ts">
import { signed } from 'src/character/util';
import { SpellList } from 'src/character/model';

defineProps<{
  list: SpellList;
}>();
</script>
