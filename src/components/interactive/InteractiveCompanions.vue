<template>
  <div class="flex-column tab items" style="justify-content: stretch; min-width: fit-content;">
    <q-list>
      <template v-for="(companion, index) in character.companions" :key="companion.name">
        <template v-if="index > 0">
          <div class="sectionDivider">
            <hr />
          </div>
        </template>
        <q-expansion-item group="companions" :label="companion.name" header-class="sectionLabel" dense dense-toggle
          expand-separator :default-opened="index == 0">
          <div class="column no-wrap companion">
            <div v-if="!isFamiliar(companion)" class="row no-wrap">
              <template v-for="i in 6">
                <div class="column no-wrap numBox rounded" style="padding: .25em;">
                  <span>{{ Score[i - 1]?.substring(0, 3) }}</span>
                  <span>{{ Util.signed(Util.abilityMod(companion.scores.value[i - 1 as Score])) }}</span>
                </div>
              </template>
            </div>
            <div class="companion-info">
              <span class="column">
                <span>Size</span>
                <span>{{ companion.size }}</span>
              </span>
              <span class="column">
                <span>Senses</span>
                <span style="font-size: .9em;">{{ companion.senses.join(', ') }}</span>
              </span>
              <span class="column">
                <span>Languages</span>
                <span>{{ companion.languages.join(', ') || 'None' }}</span>
              </span>
              <span class="column">
                <span>Traits</span>
                <span>
                  <template v-for="(trait, index) in companion.traits" :key="trait.name">
                    <template v-if="(index as number) > 0">, </template>
                    <ClickableTrait :trait="trait" />
                  </template>
                </span>
              </span>
              <span class="column">
                <span>Speeds</span>
                <span>{{
                  Object.entries(companion.speed)
                    .map(
                      ([type, speed]) =>
                        capitalize(type.toLowerCase()) + ' ' + speed + ' ft.',
                    )
                    .join(', ')
                }}</span>
              </span>
            </div>
            <div>
              <InteractiveHealth :character="companion" :curr-hp="currHP[companion.id]!"
                :update-curr-hp="(hp: number) => (currHP[companion.id] = hp)" />
            </div>
            <div class="companion-saves">
              <template v-for="attr of [
                Attribute.Perception,
                Attribute.Fortitude,
                Attribute.Reflex,
                Attribute.Will,
              ]" :key="attr">
                <span>
                  <ClickableAttribute :attribute="attr" :character="character" noBuffTint />
                </span>
                <span class="rounded numBox">{{ Util.signed(character.attributes[attr].total) }}</span>
              </template>
            </div>
            <div class="companion-skills">
              <template v-for="skill of companion.starfinder ? sfSkills : skills">
                <template v-if="companion.attributes[skill].proficiency != Proficiency.Untrained">
                  <span>{{ Attribute[skill] }}</span>
                  <span class="numBox rounded">{{ Util.signed(companion.attributes[skill].total) }}</span>
                </template>
              </template>
            </div>
            <div class="companion-attacks">
              <template v-for="weapon of companion.combat.attacks">
                <span>{{ weapon.name.replaceAll('Animal ', '') }} {{ Util.signed(weapon.attack) }} (<i><template
                      v-for="(trait, index) in weapon.traits" :key="trait.name">
                      <template v-if="(index as number) > 0">, </template>
                      <ClickableTrait :trait="trait" />
                    </template></i>)</span>
                <span>{{
                  weapon.damage.toString() }}</span>
              </template>
            </div>
          </div>
        </q-expansion-item>
      </template>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import type PCharacter from '@/character/character';
import { Attribute, Item, Proficiency, Score, sfSkills, skills } from '@/character/model';
import * as LS from '@/pages/localStorage';
import * as Util from '@/character/util';
import { Character } from '@/character/character';
import ClickableAttribute from './clickable/ClickableAttribute.vue';
import ClickableTrait from './clickable/ClickableTrait.vue';
import InteractiveHealth from './InteractiveHealth.vue';
import { ref, watch, capitalize } from 'vue';

const { character } = defineProps<{
  character: PCharacter;
}>();

const isFamiliar = (c: Character) => c.traits.some(t => t.name == 'Familiar');
const currHP = ref<{ [id: number]: number }>(
  {}
);
for (const companion of character.companions) {
  currHP.value[companion.id] = LS.load(character.name, 'companions', companion.id.toString(), 'hp') ?? companion.hp;
}
watch(currHP, (value) => {
  for (const companion of character.companions) {
    LS.save(character.name, value[companion.id], 'companions', companion.id.toString(), 'hp');
  }
});
</script>
