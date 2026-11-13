<template>
  <q-table flat bordered dense :rows="weapons" :columns="COLUMNS" :rows-per-page-options="[0]" row-key="name" hide-title
    hide-bottom class="weapons-table">
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn dense size=".6em" flat @click="props.expand = !props.expand"
            :icon="props.expand ? 'info' : 'sym_o_info'" v-if="remotelyInteresting(props.row as Weapon)" />
        </q-td>
        <q-td class="weapon-table">
          <div>
            <div class="weapon-info">{{ props.row.name }}</div>
          </div>
        </q-td>
        <q-td class="weapon-table">
          <div>
            <div class="weapon-info" :class="(modifiedAttack(props.row as Weapon) < props.row.attack
              ? 'de'
              : '') +
              (modifiedAttack(props.row as Weapon) != props.row.attack
                ? 'buffed'
                : '')
              ">
              {{ attacks(props.row as Weapon) }}
            </div>
          </div>
        </q-td>
        <q-td class="weapon-table">
          <div>
            <div class="weapon-info bounded-line" data-max="1.6">
              <span class="list-flow">
                <template v-for="instance of modifiedDamage(props.row as Weapon).getDamageInstances()"
                  :key="instance.toString()">
                  <template v-if="instance.dice > 0">{{ instance.diceString }}</template><span
                    v-if="instance.bonus != 0" :class="(instance.bonus <
                      props.row.damage.bonus
                      ? 'de'
                      : '') +
                      (instance.bonus !=
                        props.row.damage.bonus
                        ? 'buffed'
                        : '')
                      ">{{
                        instance.damageString
                      }}</span>&nbsp;{{
                      instance.typeString.trim()
                    }}<template v-for="rune of props.row.runes ?? []" :key="rune.name">
                    <ClickableRune :rune="rune">
                      &nbsp;+ {{ rune.toString() }}</ClickableRune>
                  </template>
                </template>
              </span>
            </div>
          </div>
        </q-td>
        <q-td class="weapon-table">
          <div>
            <div class="weapon-info bounded-line" :data-pass="2" data-max="1.6">
              <span class="list-flow">
                <template v-for="(instance, index) of modifiedDamage(props.row as Weapon, true).getDamageInstances()"
                  :key="instance.toString()">
                  <template v-if="index > 0"><template
                      v-if="modifiedDamage(props.row as Weapon, true).getDamageInstances()[index - 1]?.typeString != instance.typeString">&nbsp;+
                    </template><template v-else>+</template></template>
                  <template v-if="instance.dice > 0">{{ instance.diceString }}</template><span
                    v-if="instance.bonus != 0" :class="(instance.bonus <
                      props.row.damage.bonus * 2
                      ? 'de'
                      : '') +
                      (instance.bonus !=
                        props.row.damage.bonus * 2
                        ? 'buffed'
                        : '')
                      ">{{
                        instance.damageString
                      }}</span><template
                    v-if="damageCount(props.row as Weapon, true) == index + 1 || modifiedDamage(props.row as Weapon, true).getDamageInstances()[index + 1]?.typeString != instance.typeString">&nbsp;{{
                      instance.typeString.trim()
                    }}</template>
                </template>
                <template v-for="rune of props.row.runes ?? []" :key="rune.name">
                  <ClickableRune :rune="rune">
                    &nbsp;+ {{ rune.double().toString() }}</ClickableRune>
                </template>
              </span>
            </div>
          </div>
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand && remotelyInteresting(props.row as Weapon)" :props="props">
        <q-td colspan="100%">
          <div class="row-stretch">
            <div class="line">
              <div class="underlined weapon-traits bounded-line" :data-pass="2" :data-max="1.4">
                <span class="list-flow">
                  <template v-for="(trait, index) in props.row.traits" :key="trait.name">
                    <template v-if="(index as number) > 0">, </template>
                    <ClickableTrait :trait="trait" />
                  </template>
                </span>
              </div>
              <div class="labello compact">Traits</div>
            </div>
            <div class="line" style="flex-grow: 0.5" v-if="props.row.hands">
              <div class="underlined weapon-info">{{ props.row.hands }}</div>
              <div class="labello compact">Hands</div>
            </div>
            <div class="line" v-if="props.row.range">
              <div class="underlined weapon-info">{{ props.row.range }}</div>
              <div class="labello compact">Range</div>
            </div>
            <div class="line" v-if="props.row.reload">
              <div class="underlined weapon-info">{{ props.row.reload }}</div>
              <div class="labello compact">Reload</div>
            </div>
            <div class="line" v-if="props.row.capacity">
              <div class="underlined weapon-info">{{ props.row.capacity }}</div>
              <div class="labello compact">Capacity</div>
            </div>
            <div class="line" v-if="props.row.usage">
              <div class="underlined weapon-info">{{ props.row.usage }}</div>
              <div class="labello compact">Usage</div>
            </div>
            <div class="line" v-if="props.row.runes.length > 0">
              <div class="underlined weapon-traits bounded-line" :data-pass="3" :data-max="1.4">
                <span class="list-flow">
                  <template v-for="(rune, index) in props.row.runes" :key="rune.name">
                    <template v-if="(index as number) > 0">, </template>
                    <ClickableRune :rune="rune">{{ rune.name }}</ClickableRune>
                  </template>
                </span>
              </div>
              <div class="labello compact">Runes</div>
            </div>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>
<script setup lang="ts">
import { Attribute, type Weapon } from '@/character/model';
import Character from '@/character/character';
import { QTableColumn } from 'quasar';
import { applyAttackMods, applyDamageMods, applyMods } from '@/character/modifiers';
import { signed } from '@/character/util';
import ClickableRune from './clickable/ClickableRune.vue';
import ClickableTrait from './clickable/ClickableTrait.vue';

const COLUMNS: QTableColumn[] = [
  { name: 'info', label: '', field: 'name', align: 'left' },
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'attack', label: 'Attack', field: 'attack', align: 'left' },
  { name: 'damage', label: 'Damage', field: 'damage', align: 'left' },
  { name: 'crit', label: 'Crit Damage', field: 'crit', align: 'left' },
];

const { character } = defineProps<{
  character: Character;
  weapons: Weapon[];
}>();

const modifiedAttack = (weapon: Weapon) => {
  return applyAttackMods(character, weapon);
};
const attacks = (weapon: Weapon) => {
  const attack = modifiedAttack(weapon);

  const mapAmount = -5 + applyMods(character, Attribute.MultipleAttackPenalty) +
    (weapon.traits.some((t) => t.name === 'Agile') ? 1 : 0);
  return `${signed(attack)}/${signed(attack + mapAmount)}/${signed(attack + mapAmount * 2)}`;
};
const modifiedDamage = (weapon: Weapon, critical: boolean = false) => {
  return applyDamageMods(character, weapon, critical);
};
const damageCount = (weapon: Weapon, critical: boolean = false) => {
  return modifiedDamage(weapon, critical).getDamageInstances().length;
};
const remotelyInteresting = (weapon: Weapon) => {
  return (
    weapon.capacity ||
    weapon.hands ||
    weapon.range ||
    weapon.traits ||
    weapon.reload ||
    weapon.runes.length > 0
  );
};
</script>
