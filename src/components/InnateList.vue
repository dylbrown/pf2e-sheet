<template>
  <div class="spells-spontaneous" :data-list="list.name">
    <div class="spells-title col-section-title">{{ list.name }} Spells</div>
    <div class="spells-stats">
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
</template>

<script setup lang="ts">
import { signed } from 'src/character/util';
import { SpellList } from 'src/character/model';
import Character from 'src/character/character';

defineProps<{
  character: Character;
  list: SpellList;
}>();
</script>
