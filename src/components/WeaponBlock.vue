<template>
  <div class="row-stretch weapon" style="flex-grow: 0">
    <div class="weapon-label bounded-line" data-max="2.4">
      {{ weapon.name }}
    </div>
    <div class="flex-column">
      <div class="row-stretch">
        <div class="line" style="flex-grow: 0.5">
          <div
            class="underlined weapon-info"
            :class="
              (modifiedAttack < weapon.attack ? 'de' : '') +
              (modifiedAttack != weapon.attack ? 'buffed' : '')
            "
          >
            {{ signed(modifiedAttack) }}
          </div>
          <div class="labello compact">Attack</div>
        </div>
        <div class="line">
          <div class="underlined weapon-info bounded-line" data-max="1.8">
            <span class="list-flow">
              <template v-if="modifiedDamage.dice > 0">{{
                damageSplitString[0]
              }}</template
              ><span
                v-if="modifiedDamage.bonus != 0"
                :class="
                  (modifiedDamage.bonus < weapon.damage.bonus ? 'de' : '') +
                  (modifiedDamage.bonus != weapon.damage.bonus ? 'buffed' : '')
                "
                >{{ damageSplitString[modifiedDamage.dice > 0 ? 1 : 0] }}</span
              >&nbsp;{{ damageSplitString[damageSplitString.length - 1]?.trim()
              }}<template v-for="rune of weapon.runes ?? []" :key="rune.name">
                <ClickableRune :rune="rune" v-if="interactive">
                  &nbsp;+ {{ rune.toString() }}</ClickableRune
                ><template v-else>
                  &nbsp;+ {{ rune.dice }}{{ rune.die
                  }}<template v-if="rune.bonus > 0">
                    + {{ rune.bonus }}</template
                  >
                  {{
                    rune.damageType.name.replaceAll('persistent ', 'p.')
                  }}</template
                >
              </template></span
            >
          </div>
          <div class="labello compact">Damage</div>
        </div>
        <div class="line" style="flex-grow: 0.5">
          <div class="underlined weapon-info">{{ weapon.hands }}</div>
          <div class="labello compact">Hands</div>
        </div>
        <div class="line" v-if="weapon.range">
          <div class="underlined weapon-info">{{ weapon.range }}</div>
          <div class="labello compact">Range</div>
        </div>
        <div class="line" v-if="weapon.reload">
          <div class="underlined weapon-info">{{ weapon.reload }}</div>
          <div class="labello compact">Reload</div>
        </div>
        <div class="line" v-if="weapon.capacity">
          <div class="underlined weapon-info">{{ weapon.capacity }}</div>
          <div class="labello compact">Capacity</div>
        </div>
        <div class="line" v-if="weapon.usage">
          <div class="underlined weapon-info">{{ weapon.usage }}</div>
          <div class="labello compact">Usage</div>
        </div>
        <div class="line" v-if="weapon.runes.length > 0">
          <div
            class="underlined weapon-traits bounded-line"
            :data-pass="3"
            :data-max="1.5"
          >
            <span v-if="interactive" class="list-flow">
              <template v-for="(rune, index) in weapon.runes" :key="rune.name">
                <template v-if="index > 0">, </template>
                <ClickableRune :rune="rune">{{ rune.name }}</ClickableRune>
              </template>
            </span>
            <template v-else>{{
              weapon.runes.map((r) => r.name).join(', ')
            }}</template>
          </div>
          <div class="labello compact">Runes</div>
        </div>
        <div class="line">
          <div
            class="underlined weapon-traits bounded-line"
            :data-pass="2"
            :data-max="1.5"
          >
            <span v-if="interactive" class="list-flow">
              <template
                v-for="(trait, index) in weapon.traits"
                :key="trait.name"
              >
                <template v-if="index > 0">, </template>
                <ClickableTrait :trait="trait" />
              </template>
            </span>
            <template v-else>{{
              weapon.traits.map((t) => t.name).join(', ')
            }}</template>
          </div>
          <div class="labello compact">Traits</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Weapon } from 'src/character/model';
import ClickableRune from './interactive/ClickableRune.vue';
import ClickableTrait from './interactive/ClickableTrait.vue';
import Character from 'src/character/character';
import { applyAttackMods, applyDamageMods } from 'src/character/modifiers';
import { signed } from 'src/character/util';
import { computed } from 'vue';

const { character, weapon, interactive } = defineProps<{
  character: Character;
  weapon: Weapon;
  interactive: boolean;
}>();

const modifiedAttack = computed(() => {
  return interactive
    ? applyAttackMods(character.modifiers, weapon.attack)
    : weapon.attack;
});
const modifiedDamage = computed(() => {
  return interactive
    ? applyDamageMods(character.modifiers, weapon.damage)
    : weapon.damage;
});
const damageSplitString = computed(() => {
  return modifiedDamage.value.splitString();
});
</script>
