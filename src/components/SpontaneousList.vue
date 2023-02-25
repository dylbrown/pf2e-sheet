<template>
  <div id="spells-spontaneous">
    <div class="spells-title col-section-title">${listName} Spells</div>
    <div class="spells-stats">
      <div class="rollLabel">Spell Attack</div>
      <div class="numBox rounded">
        ${character.attributes.get(spellList.spellAttacksAttribute?lower_case,
        listName).total?string.@s}
      </div>
      <div class="rollLabel">Spell DC</div>
      <div class="numBox rounded">
        ${(10 + character.attributes.get(spellList.spellDCsAttribute?lower_case,
        listName).total)?string}
      </div>
    </div>
    <div id="spells-spontaneous-grid">
      [#list spellList.spellsKnown?reverse as levelSpells] [#if levelSpells?size
      > 0] [#assign level=spellList.spellsKnown?size-levelSpells?index-1] [#if
      level == 0]
      <div class="spells-level" style="grid-column-end: span 2">
        <div class="spells-line"></div>
        <div class="spells-level-label">Cantrips</div>
        <div class="spells-line"></div>
      </div>
      [#else]
      <div class="spells-level">
        <div class="spells-line"></div>
        <div class="spells-level-label">Level ${level}</div>
        <div class="spells-line"></div>
      </div>
      <div class="spells-level">
        <div class="spells-line"></div>
        [#list 1..spellList.spellSlots[level] as i]
        <div class="spells-slot"></div>
        [/#list]
        <div class="spells-line"></div>
      </div>
      [/#if] [#list levelSpells as spell] [#if spell?index % 2 == 0]
      <div class="spells-name left">${spell.name}</div>
      [#else]
      <div class="spells-name right">${spell.name}</div>
      [/#if] [/#list] [#if levelSpells?size % 2 == 1]
      <div class="spells-name right"></div>
      [/#if] [/#if] [/#list]
    </div>
  </div>
</template>

<script setup lang="ts">
import { SpellList } from 'src/character/model';

defineProps<{
  list: SpellList;
}>();
</script>
