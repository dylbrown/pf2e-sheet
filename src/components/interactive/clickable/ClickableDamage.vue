<template>
  <span class="display-inline">
    <Clickable>
      <template #label>
        <template v-for="(instance, index) of modifiedDamage.getDamageInstances()" :key="instance.toString()">
          <template v-if="index > 0"><template
              v-if="modifiedDamage.getDamageInstances()[index - 1]?.typeString != instance.typeString">&nbsp;+
            </template><template v-else>+</template></template>
          <template v-if="instance.dice > 0">{{ instance.diceString }}</template><span v-if="instance.bonus != 0"
            :class="(instance.bonus <
              weapon.damage.bonus * mult
              ? 'de'
              : '') +
              (instance.bonus !=
                weapon.damage.bonus * mult
                ? 'buffed'
                : '')
              ">{{
                instance.damageString
              }}</span><template
            v-if="damageCount == index + 1 || modifiedDamage.getDamageInstances()[index + 1]?.typeString != instance.typeString">&nbsp;{{
              instance.typeString.trim()
            }}</template>
        </template>
      </template>
      <span :class="dice > weapon.damage.dice ? 'bold' : ''">{{ dice }}</span>{{ die }}<template v-if="crit"> ({{
        weapon.damage.dice }}&times;2{{ fatalTrait ? '+1' : '' }})</template> from the{{ fatalTrait ? `
      ${fatalTrait.name}` : '' }}{{ weapon.striking == 3 ? ' Major' : '' }}{{ weapon.striking == 2 ? ' Greater' : ''
      }}{{
        weapon.striking ? ' Striking' : '' }} weapon
      <template v-if="deadlyTrait">
        <br />{{ weapon.damage.dice }}{{ deadlyDie }} from {{ deadlyTrait.name }}
      </template>
      <template v-if="specDamage">
        <br />+{{ specDamage * mult }}<template v-if="crit"> ({{ specDamage }}&times;2)</template> from{{ greaterSpec ?
          ' Greater' : '' }} Weapon Specialization
      </template>
      <template v-if="useStr">
        <!-- TODO: Rogue -->
        <br />+{{ str * mult }}<template v-if="crit"> ({{ str }}&times;2)</template> from Strength
      </template>
      <template v-if="propulsiveTrait">
        <br />+{{ propDmg * mult }}<template v-if="crit"> ({{ propDmg }}&times;2)</template> from Propulsive trait
      </template>
      <template v-for="[type, bonus] of Object.entries(c.bonuses).filter(
        ([type, bonus]) => bonus > 0 || c.penalties[type as StatModType] < 0,
      )" :key="type">
        <br />
        <span :class="bonus + c.penalties[type as StatModType] > 0
          ? 'buffed'
          : 'debuffed'
          ">{{ Util.signed((bonus + c.penalties[type as StatModType]) * mult) }}<template v-if="crit"> ({{ bonus +
            c.penalties[type as StatModType] }}&times;2)</template>
          {{ type }}
          {{
            bonus + c.penalties[type as StatModType] > 0 ? 'bonus' : 'penalty'
          }}</span>
      </template>
    </Clickable>
  </span>
</template>

<script setup lang="ts">
import { Attribute, Proficiency, Score, WeaponSpecialization, type Weapon } from '@/character/model';
import Clickable from './Clickable.vue';
import PCharacter from '@/character/character';
import { applyDamageMods, calculateMods, getAttackMods, StatModType } from '@/character/modifiers';
import { computed } from 'vue';
import * as Util from '@/character/util';

const { weapon, character, crit } = defineProps<{
  character: PCharacter;
  weapon: Weapon;
  crit: boolean;
  popupClass?: string;
}>();

const mult = crit ? 2 : 1;

const modifiedDamage = computed(() => applyDamageMods(character, weapon, crit));
const damageCount = computed(() => modifiedDamage.value.getDamageInstances().length);

const fatalTrait = crit ? weapon.traits.find((r) => r.name.startsWith('Fatal')) : undefined;

const dice = weapon.damage.dice * mult + (fatalTrait ? 1 : 0);
const die = crit && fatalTrait ? fatalTrait.name.replaceAll(/^Fatal /gi, '') : weapon.damage.die;
const deadlyTrait = crit ? weapon.traits.find((r) => r.name.startsWith('Deadly')) : undefined;
const deadlyDie = deadlyTrait ? deadlyTrait.name.replaceAll(/^Deadly /gi, '') : '';
let specDamage = 0;
const greaterSpec = character.combat.weapon_specialization == WeaponSpecialization.Greater;
if (character.combat.weapon_specialization != WeaponSpecialization.None) {
  switch (getAttackMods(character, weapon).proficiency) {
    case Proficiency.Legendary:
      specDamage = 4;
      break;
    case Proficiency.Master:
      specDamage = 3;
      break;
    case Proficiency.Expert:
      specDamage = 2;
      break;
  }
  specDamage *= greaterSpec ? 2 : 1;
}

const useStr = weapon.range === undefined ||
  weapon.traits.some((t) => t.name.startsWith('Thrown'));

const str = Util.abilityMod(character.scores.value[Score.Strength]);

const propulsiveTrait = weapon.traits.find((r) => r.name == 'Propulsive');
const propDmg = str > 0 ? Math.floor(str / 2) : str;

const c = computed(() => {
  const [bonuses, penalties] = calculateMods(
    character,
    Attribute.DamageRolls,
    undefined,
    useStr ? Score.Strength : undefined
  );
  return { bonuses, penalties };
});
</script>
