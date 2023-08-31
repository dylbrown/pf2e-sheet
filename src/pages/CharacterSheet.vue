<template>
  <div ref="root">
    <div class="page first-page">
      <div class="printBorder"></div>
      <div id="leftThird">
        <div class="column" style="justify-content: stretch">
          <div>PATHFINDER CHARACTER SHEET</div>
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel" style="text-transform: uppercase">
            Ability Scores
          </div>
          <div id="ability-grid">
            <div class="line">
              <div class="inverted numBox rounded" style="font-weight: bold">
                STR
              </div>
              <div class="label invisible">A</div>
            </div>
            <div class="line">
              <div class="underlined-roll">
                {{ abilityMod(character.scores[Score.Strength]) }}
              </div>
              <div class="label">Mod</div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                {{ character.scores[Score.Strength] }}
              </div>
              <div class="label">Score</div>
            </div>
            <div class="line">
              <div class="inverted numBox rounded" style="font-weight: bold">
                INT
              </div>
              <div class="label invisible">A</div>
            </div>
            <div class="line">
              <div class="underlined-roll">
                {{ abilityMod(character.scores[Score.Intelligence]) }}
              </div>
              <div class="label">Mod</div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                {{ character.scores[Score.Intelligence] }}
              </div>
              <div class="label">Score</div>
            </div>
            <div class="line">
              <div class="inverted numBox rounded" style="font-weight: bold">
                DEX
              </div>
              <div class="label invisible">A</div>
            </div>
            <div class="line">
              <div class="underlined-roll">
                {{ abilityMod(character.scores[Score.Dexterity]) }}
              </div>
              <div class="label">Mod</div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                {{ character.scores[Score.Dexterity] }}
              </div>
              <div class="label">Score</div>
            </div>
            <div class="line">
              <div class="inverted numBox rounded" style="font-weight: bold">
                WIS
              </div>
              <div class="label invisible">A</div>
            </div>
            <div class="line">
              <div class="underlined-roll">
                {{ abilityMod(character.scores[Score.Wisdom]) }}
              </div>
              <div class="label">Mod</div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                {{ character.scores[Score.Wisdom] }}
              </div>
              <div class="label">Score</div>
            </div>
            <div class="line">
              <div class="inverted numBox rounded" style="font-weight: bold">
                CON
              </div>
              <div class="label invisible">A</div>
            </div>
            <div class="line">
              <div class="underlined-roll">
                {{ abilityMod(character.scores[Score.Constitution]) }}
              </div>
              <div class="label">Mod</div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                {{ character.scores[Score.Constitution] }}
              </div>
              <div class="label">Score</div>
            </div>
            <div class="line">
              <div class="inverted numBox rounded" style="font-weight: bold">
                CHA
              </div>
              <div class="label invisible">A</div>
            </div>
            <div class="line">
              <div class="underlined-roll">
                {{ abilityMod(character.scores[Score.Charisma]) }}
              </div>
              <div class="label">Mod</div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                {{ character.scores[Score.Charisma] }}
              </div>
              <div class="label">Score</div>
            </div>
          </div>
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel">Misc.</div>
          <div class="row-between">
            <div class="line">
              <div class="numBox rounded">{{ character.speed }} ft.</div>
              <div class="label">Speed</div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                {{ character.classDC }}
              </div>
              <div class="label">Class DC</div>
            </div>
            <div class="line" style="flex-grow: 0">
              <div class="hero-grid">
                <div class="hero-box"></div>
                <div class="hero-box"></div>
                <div class="hero-box"></div>
              </div>
              <div class="label">Hero Points</div>
            </div>
          </div>
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel">Health</div>
          <div class="row-between" style="flex-grow: 2">
            <div class="line" style="flex-grow: 0">
              <div class="numBox rounded">{{ character.hp }}</div>
              <div class="label">Max</div>
            </div>
            <div class="line">
              <div class="numBox"></div>
              <div class="label">Current</div>
            </div>
            <div class="line">
              <div class="numBox"></div>
              <div class="label">Conditions</div>
            </div>
          </div>
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel">Armor Class</div>
          <div id="ac-grid">
            <div class="top-right rollLabel">AC</div>
            <div class="line">
              <div class="underlined-roll">{{ character.ac }}</div>
              <div class="label">Total</div>
            </div>
            <div class="line">
              <div class="numBox rounded" style="border: none">10</div>
              <div class="box-label">Base</div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                {{ abilityMod(character.scores[Score.Dexterity]) }}
              </div>
              <div class="box-label">DEX</div>
            </div>
            <ProficiencyDisplay
              :proficiency="character.combat.armor.proficiency"
              :grid="true"
            />
            <div class="line">
              <div class="numBox">
                {{ nonzero(character.combat.armor.ac) }}
              </div>
              <div class="box-label">Item</div>
            </div>
            <div class="line">
              <div class="numBox dashed"></div>
              <div class="box-label">Temp</div>
            </div>
            <div class="line">
              <div class="numBox" style="border-radius: 40%">
                {{ nonzero(character.combat.shield.ac) }}
              </div>
              <div class="box-label">Shield</div>
            </div>
          </div>
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel">Perception + Saves</div>
          <div id="rolls-grid">
            <div class="center-right rollLabel">PERCEPTION</div>
            <div class="line">
              <div class="underlined-roll">
                {{ signed(character.attributes[Attribute.Perception].total) }}
              </div>
              <div class="label">Mod</div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                {{ abilityMod(character.scores[Score.Wisdom]) }}
              </div>
              <div class="label">WIS</div>
            </div>
            <ProficiencyDisplay
              :proficiency="
                character.attributes[Attribute.Perception].proficiency
              "
              :grid="true"
            />
            <div class="line">
              <div class="numBox">
                {{
                  nonzero(character.attributes[Attribute.Perception].itemBonus)
                }}
              </div>
              <div class="label">Item</div>
            </div>
            <div class="line">
              <div class="numBox dashed"></div>
              <div class="label">Temp</div>
            </div>
            <div class="center-right rollLabel">FORTITUDE</div>
            <div class="line">
              <div class="underlined-roll">
                {{ signed(character.attributes[Attribute.Fortitude].total) }}
              </div>
              <div class="label">Mod</div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                {{ abilityMod(character.scores[Score.Constitution]) }}
              </div>
              <div class="label">CON</div>
            </div>
            <ProficiencyDisplay
              :proficiency="
                character.attributes[Attribute.Fortitude].proficiency
              "
              :grid="true"
            />
            <div class="line">
              <div class="numBox">
                {{
                  nonzero(character.attributes[Attribute.Fortitude].itemBonus)
                }}
              </div>
              <div class="label">Item</div>
            </div>
            <div class="line">
              <div class="numBox dashed"></div>
              <div class="label">Temp</div>
            </div>
            <div class="center-right rollLabel">REFLEX</div>
            <div class="line">
              <div class="underlined-roll">
                {{ signed(character.attributes[Attribute.Reflex].total) }}
              </div>
              <div class="label">Mod</div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                {{ abilityMod(character.scores[Score.Dexterity]) }}
              </div>
              <div class="label">DEX</div>
            </div>
            <ProficiencyDisplay
              :proficiency="character.attributes[Attribute.Reflex].proficiency"
              :grid="true"
            />
            <div class="line">
              <div class="numBox">
                {{ nonzero(character.attributes[Attribute.Reflex].itemBonus) }}
              </div>
              <div class="label">Item</div>
            </div>
            <div class="line">
              <div class="numBox dashed"></div>
              <div class="label">Temp</div>
            </div>
            <div class="center-right rollLabel">WILL</div>
            <div class="line">
              <div class="underlined-roll">
                {{ signed(character.attributes[Attribute.Will].total) }}
              </div>
              <div class="label">Mod</div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                {{ abilityMod(character.scores[Score.Wisdom]) }}
              </div>
              <div class="label">WIS</div>
            </div>
            <ProficiencyDisplay
              :proficiency="character.attributes[Attribute.Will].proficiency"
              :grid="true"
            />
            <div class="line">
              <div class="numBox">
                {{ nonzero(character.attributes[Attribute.Will].itemBonus) }}
              </div>
              <div class="label">Item</div>
            </div>
            <div class="line">
              <div class="numBox dashed"></div>
              <div class="label">Temp</div>
            </div>
          </div>
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel">Weapon & Armor Proficiencies</div>
          <div id="prof-grid">
            <ProficiencyDisplay
              :proficiency="
                character.attributes[Attribute.UnarmedAttacks].proficiency
              "
              :grid="false"
            />
            <ProficiencyDisplay
              :proficiency="
                character.attributes[Attribute.SimpleWeapons].proficiency
              "
              :grid="false"
            />
            <ProficiencyDisplay
              :proficiency="
                character.attributes[Attribute.MartialWeapons].proficiency
              "
              :grid="false"
            />
            <ProficiencyDisplay
              :proficiency="
                character.attributes[Attribute.AdvancedWeapons].proficiency
              "
              :grid="false"
            />
            <div class="label">Unarmed</div>
            <div class="label">Simple</div>
            <div class="label">Martial</div>
            <div class="label">Advanced</div>
            <ProficiencyDisplay
              :proficiency="
                character.attributes[Attribute.UnarmoredDefense].proficiency
              "
              :grid="false"
            />
            <ProficiencyDisplay
              :proficiency="
                character.attributes[Attribute.LightArmor].proficiency
              "
              :grid="false"
            />
            <ProficiencyDisplay
              :proficiency="
                character.attributes[Attribute.MediumArmor].proficiency
              "
              :grid="false"
            />
            <ProficiencyDisplay
              :proficiency="
                character.attributes[Attribute.HeavyArmor].proficiency
              "
              :grid="false"
            />
            <div class="label">Unarmored</div>
            <div class="label">Light</div>
            <div class="label">Medium</div>
            <div class="label">Heavy</div>
          </div>
        </div>
      </div>
      <div id="middleThird">
        <div class="column" style="justify-content: flex-start">
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel">Character Info</div>
          <div id="info-grid">
            <div
              class="line"
              style="grid-row-end: span 2; grid-column-end: span 2"
            >
              <div class="underlined wrap">
                {{ character.name }}
              </div>
              <div class="label">Character Name</div>
            </div>
            <div class="line" style="grid-column-end: span 2; min-height: 2em">
              <div class="underlined">
                {{ character.ancestry }}
              </div>
              <div class="label">Ancestry & Heritage</div>
            </div>
            <div class="line" style="grid-column-end: span 2">
              <div class="underlined">{{ character.background }}</div>
              <div class="label">Background</div>
            </div>
            <div class="line" style="grid-column-end: span 2">
              <div class="underlined">{{ character.player }}</div>
              <div class="label">Player</div>
            </div>
            <div class="line">
              <div class="underlined">
                {{ character.class }} {{ character.level }}
              </div>
              <div class="label">Class</div>
            </div>
            <div class="line">
              <div class="underlined">{{ character.deity }}</div>
              <div class="label">Deity</div>
            </div>
            <div class="line">
              <div class="underlined">{{ character.alignment }}</div>
              <div class="label">Alignment</div>
            </div>
            <div class="line">
              <div class="underlined">{{ character.size }}</div>
              <div class="label">Size</div>
            </div>
            <div class="line" style="grid-column-end: span 2">
              <div class="underlined">
                {{ character.traits.join(', ') }}
              </div>
              <div class="label">Traits</div>
            </div>
            <div class="line" style="grid-column-end: span 2">
              <div class="underlined bounded-line">
                {{ character.languages.join(', ') }}
              </div>
              <div class="label">Languages</div>
            </div>
            <div class="line" style="grid-column-end: span 2">
              <div class="underlined bounded-line">
                {{ character.senses.join(', ') }}
              </div>
              <div class="label">Senses</div>
            </div>
          </div>
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel">Strikes</div>
          <WeaponBlock
            v-for="attack in character.combat.attacks"
            :key="attack.name"
            :weapon="attack"
          />
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel">Actions and Activities</div>
          <div class="column" style="flex-grow: 0">
            <template
              v-for="[index, ability] in Array.from(
                character.abilities.entries()
              ).filter(([_, a]) => a.activity)"
              :key="index"
            >
              <div class="action-divider" v-if="index > 0"></div>
              <ActionBlock :action="ability" />
            </template>
          </div>
          <div id="focus" v-if="character.spells.focusPoints > 0">
            <div class="line">
              <div class="numBox rounded"></div>
              <div class="label">Focus</div>
            </div>
            <div class="line">
              <div class="numBox rounded">
                {{ character.spells.focusPoints }}
              </div>
              <div class="label">Max Focus</div>
            </div>
          </div>
        </div>
      </div>
      <div id="rightThird">
        <div class="column" style="justify-content: stretch">
          <div class="sectionDivider">
            <hr />
          </div>
          <div class="sectionLabel">Skills</div>
          <div id="skills-grid">
            <div class="label">Skill</div>
            <div class="label">Total</div>
            <div class="label">Stat</div>
            <div class="label">Prof</div>
            <div class="label">Item</div>
            <template v-for="skill of skills" :key="skill">
              <div class="skill-label">{{ Attribute[skill] }}</div>
              <div class="line">
                <div class="underlined-roll">
                  {{ signed(character.attributes[skill].total) }}
                </div>
              </div>
              <div style="align-self: center; text-transform: uppercase">
                {{ Score[character.attributes[skill].score].substring(0, 3) }}
              </div>
              <ProficiencyDisplay
                :grid="false"
                :proficiency="character.attributes[skill].proficiency"
              />
              <div class="line">
                <div class="numBox">
                  <template v-if="character.attributes[skill].itemBonus != 0">{{
                    character.attributes[skill].itemBonus
                  }}</template>
                </div>
              </div>
            </template>
            <template
              v-for="[name, lore] of Object.entries(character.lore)"
              :key="name"
            >
              <div class="skill-label lore-label">{{ name }}</div>
              <div class="line">
                <div class="underlined-roll">
                  {{ signed(lore.total) }}
                </div>
              </div>
              <div style="align-self: center; text-transform: uppercase">
                INT
              </div>
              <ProficiencyDisplay
                :grid="false"
                :proficiency="lore.proficiency"
              />
              <div class="line">
                <div class="numBox">
                  <template v-if="lore.itemBonus != 0">{{
                    lore.itemBonus
                  }}</template>
                </div>
              </div></template
            >
          </div>
        </div>
      </div>
    </div>
    <AbilitiesBlock :character="character" />
    <div class="separator first-page" style="top: -3px"></div>
    <div class="height_measure" ref="heightMeasure"></div>
  </div>
</template>

<script setup lang="ts">
import { abilityMod, nonzero, signed } from 'src/character/util';
import Character from 'src/character/character';
import { Attribute, skills, Score } from 'src/character/model';
import ActionBlock from 'src/components/ActionBlock.vue';
import ProficiencyDisplay from 'src/components/ProficiencyDisplay.vue';
import WeaponBlock from 'src/components/WeaponBlock.vue';
import AbilitiesBlock from 'src/components/AbilitiesBlock.vue';
import { onMounted, ref } from 'vue';

defineProps<{
  character: Character;
}>();

const root = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!root.value) return;
  root.value.querySelectorAll('.bounded-line').forEach((val) => {
    const value = val as HTMLElement;
    const bound = parseFloat(val.getAttribute('data-max') ?? '2.1');
    let size = parseFloat(getComputedStyle(value).fontSize);
    while (
      value.offsetHeight / parseFloat(getComputedStyle(value).lineHeight) >=
        bound &&
      size > 4
    ) {
      size -= 0.25;
      value.style.fontSize = size.toString() + 'px';
    }
  });
});
</script>

<style>
@import '../css/sheet.scss';
</style>
