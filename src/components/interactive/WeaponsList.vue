<template>
  <q-table
    flat
    bordered
    dense
    :rows="weapons"
    :columns="COLUMNS"
    :rows-per-page-options="[0]"
    row-key="name"
    hide-header
    hide-title
    hide-bottom
    class="weapons-table"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn
            size="sm"
            dense
            flat
            @click="props.expand = !props.expand"
            :icon="props.expand ? 'info' : 'o_info'"
            v-if="remotelyInteresting(props.row as Weapon)"
          />
        </q-td>
        <q-td auto-width style="padding-left: 0">
          {{ props.row.name }}
        </q-td>
        <q-td>
          <div class="row-stretch">
            <div class="line" style="flex-grow: 0">
              <div
                class="underlined weapon-info"
                :class="
                  (modifiedAttack(props.row as Weapon) < props.row.attack
                    ? 'de'
                    : '') +
                  (modifiedAttack(props.row as Weapon) != props.row.attack
                    ? 'buffed'
                    : '')
                "
              >
                {{ signed(modifiedAttack(props.row as Weapon)) }}
              </div>
              <div class="labello compact">Attack</div>
            </div>
            <div class="line" style="flex-grow: 0.5">
              <div class="underlined weapon-info bounded-line" data-max="1.8">
                <span class="list-flow">
                  <template
                    v-if="modifiedDamage(props.row as Weapon).dice > 0"
                    >{{ damageSplitString(props.row as Weapon)[0] }}</template
                  ><span
                    v-if="modifiedDamage(props.row as Weapon).bonus != 0"
                    :class="
                      (modifiedDamage(props.row as Weapon).bonus <
                      props.row.damage.bonus
                        ? 'de'
                        : '') +
                      (modifiedDamage(props.row as Weapon).bonus !=
                      props.row.damage.bonus
                        ? 'buffed'
                        : '')
                    "
                    >{{
                      damageSplitString(props.row as Weapon)[
                        modifiedDamage(props.row as Weapon).dice > 0 ? 1 : 0
                      ]
                    }}</span
                  >&nbsp;{{
                    damageSplitString(props.row as Weapon)[
                      damageSplitString(props.row as Weapon).length - 1
                    ]?.trim()
                  }}<template
                    v-for="rune of props.row.runes ?? []"
                    :key="rune.name"
                  >
                    <ClickableRune :rune="rune">
                      &nbsp;+ {{ rune.toString() }}</ClickableRune
                    >
                  </template></span
                >
              </div>
              <div class="labello compact">Damage</div>
            </div>
            <div class="line">
              <div
                class="underlined weapon-traits bounded-line"
                :data-pass="2"
                :data-max="1.5"
              >
                <span class="list-flow">
                  <template
                    v-for="(trait, index) in props.row.traits"
                    :key="trait.name"
                  >
                    <template v-if="index > 0">, </template>
                    <ClickableTrait :trait="trait" />
                  </template>
                </span>
              </div>
              <div class="labello compact">Traits</div>
            </div>
          </div>
        </q-td>
      </q-tr>
      <q-tr
        v-show="props.expand && remotelyInteresting(props.row as Weapon)"
        :props="props"
      >
        <q-td colspan="100%">
          <div class="row-stretch">
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
              <div
                class="underlined weapon-traits bounded-line"
                :data-pass="3"
                :data-max="1.5"
              >
                <span class="list-flow">
                  <template
                    v-for="(rune, index) in props.row.runes"
                    :key="rune.name"
                  >
                    <template v-if="index > 0">, </template>
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
import type { Weapon } from 'src/character/model';
import Character from 'src/character/character';
import { QTableColumn } from 'quasar';
import { applyAttackMods, applyDamageMods } from 'src/character/modifiers';
import { signed } from 'src/character/util';
import ClickableRune from './ClickableRune.vue';
import ClickableTrait from './ClickableTrait.vue';

const COLUMNS: QTableColumn[] = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
];

const { character } = defineProps<{
  character: Character;
  weapons: Weapon[];
}>();

const modifiedAttack = (weapon: Weapon) => {
  return applyAttackMods(character, weapon.attack);
};
const modifiedDamage = (weapon: Weapon) => {
  return applyDamageMods(character, weapon.damage);
};
const damageSplitString = (weapon: Weapon) => {
  return modifiedDamage(weapon).splitString();
};
const remotelyInteresting = (weapon: Weapon) => {
  return (
    weapon.capacity ||
    weapon.hands ||
    weapon.range ||
    weapon.reload ||
    weapon.runes.length > 0
  );
};
</script>
