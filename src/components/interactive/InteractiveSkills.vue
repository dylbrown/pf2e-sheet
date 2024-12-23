<template>
  <div
    class="column tab"
    style="justify-content: stretch; max-width: fit-content"
  >
    <div id="skills-grid">
      <template
        v-for="skill of character.starfinder ? sfSkills : skills"
        :key="skill"
      >
        <div class="skill-label">
          <ClickableAttribute :attribute="skill" :character="character" />
        </div>
        <div class="line">
          <div class="underlined-roll">
            {{ Util.signed(character.attributes[skill].total) }}
          </div>
        </div>
        <ProficiencyDisplay
          :grid="false"
          :proficiency="character.attributes[skill].proficiency"
        />
      </template>
      <template
        v-for="[name, lore] of Object.entries(character.lore)"
        :key="name"
      >
        <div class="skill-label lore-label">
          <ClickableAttribute :lore="name" :character="character" />
        </div>
        <div class="line">
          <div class="underlined-roll">
            {{ Util.signed(lore.total) }}
          </div>
        </div>
        <ProficiencyDisplay :grid="false" :proficiency="lore.proficiency" />
      </template>
      <div class="line conditionals">
        {{ character.abilities.conditionals.join(', ') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ClickableAttribute from 'src/components/interactive/ClickableAttribute.vue';
import ProficiencyDisplay from 'src/components/ProficiencyDisplay.vue';
import type Character from 'src/character/character';
import * as Util from 'src/character/util';
import { skills, sfSkills } from 'src/character/model';

defineProps<{
  character: Character;
}>();
</script>
