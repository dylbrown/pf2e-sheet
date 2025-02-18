<template>
  <div
    class="flex-column tab"
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
          <div
            class="underlined-roll"
            :class="
              (modifiedSkill(skill) < character.attributes[skill].total
                ? 'de'
                : '') +
              (modifiedSkill(skill) != character.attributes[skill].total
                ? 'buffed'
                : '')
            "
          >
            {{ Util.signed(modifiedSkill(skill)) }}
          </div>
        </div>
        <ProficiencyDisplay
          :grid="false"
          :proficiency="character.attributes[skill].proficiency"
        />
      </template>
      <template v-for="[name, lore] of filteredLores" :key="name">
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
import {
  skills,
  sfSkills,
  SpellListSubType,
  ApparitionList,
  Attribute,
} from 'src/character/model';
import { applyMods } from 'src/character/modifiers';
import { computed, reactive } from 'vue';

const props = defineProps<{
  character: Character;
}>();
const mods = props.character.modifiers;

const modifiedSkill = (skill: Attribute) => {
  return applyMods(mods, props.character.attributes, skill);
};

const aList = props.character.spells.lists.find(
  (l) => l.subtype == SpellListSubType.Apparition,
) as ApparitionList | undefined;

const curr = aList ? reactive(aList.currentApparitions) : undefined;
const filteredLores = computed(() => {
  const checkLore = (lore: string) => {
    if (!aList || !aList.apparitions || !curr) return true;
    if (
      aList.apparitions.values().some((a) => {
        return (
          !curr.includes(a.name) &&
          aList.apparitionSkills.get(a)?.includes(lore.toLowerCase())
        );
      })
    )
      return false;
    return true;
  };
  return Object.entries(props.character.lore).filter(([lore]) =>
    checkLore(lore),
  );
});
</script>
