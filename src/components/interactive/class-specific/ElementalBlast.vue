<template>
  <q-table :columns="COLUMNS" :rows="rows" flat bordered dense :rows-per-page-options="[0]" row-key="name" hide-title
    hide-bottom />
  <div class="row justify-start items-center">
    <span style="padding: 0 .5em; font-weight: bold;">DAMAGE BONUS</span>
    <span style="border-left: 1px solid black;"></span>
    <span style="padding: 0 .5em;">Ranged:</span>
    <span>
      <div class="action-icon inline">1</div> <span :class="oneBuffString">{{ Util.signed(oneFinal) }}</span>
    </span>
    <span style="padding: 0 .5em;">
      <div class="action-icon inline">2</div> <span :class="twoBuffString">{{ Util.signed(twoFinal) }}</span>
    </span>
    <span style="border-left: 1px solid black;"></span>
    <span style="padding: 0 .5em;">Melee:</span>
    <span>
      <div class="action-icon inline">1</div> <span :class="oneBuffString">{{ Util.signed(oneFinal + strBonus)
        }}</span>
    </span>
    <span style="padding: 0 .5em;">
      <div class="action-icon inline">2</div> <span :class="twoBuffString">{{ Util.signed(strBonus + twoFinal)
        }}</span>
    </span>
    <span style="border-left: 1px solid black;"></span>
  </div>
</template>

<script setup lang="ts">
import PCharacter from '@/character/character';
import { QTableColumn } from 'quasar';
import * as Util from '@/character/util';
import { Attribute, Score } from '@/character/model';
import { applyMods, calculateMods, StatModType } from '@/character/modifiers';
import { computed } from 'vue';

const { character } = defineProps<{
  character: PCharacter;
}>();
const COLUMNS: QTableColumn[] = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'range', label: 'Range', field: 'range', align: 'left' },
  { name: 'damage', label: 'Damage', field: 'damage', align: 'left' },
];

const conBonus = Util.abilityMod(character.scores.value[Score.Constitution]);
const strBonus = Util.abilityMod(character.scores.value[Score.Strength]);
const twoBuff = [{
  type: StatModType.Status,
  attrs: [Attribute.DamageRolls],
  amount: conBonus,
}];
const oneFinal = computed(() => applyMods(character, Attribute.DamageRolls));
const twoFinal = computed(() => applyMods(character, Attribute.DamageRolls, character.attributes[Attribute.DamageRolls], twoBuff));
const oneBuffString = computed(() => oneFinal.value ? (oneFinal.value > 0 ? 'buffed' : 'debuffed') : '');
const twoBuffString = computed(() => twoFinal.value != conBonus ? (twoFinal.value > conBonus ? 'buffed' : 'debuffed') : '');

const elementalBlast = character.abilities.find(a => a.name == 'Elemental Blast')!;
const elementListStart = elementalBlast.description.indexOf('<ul>');
const elementListEnd = elementalBlast.description.indexOf('</ul>', elementListStart);
const P = '<p>';
const STRONG = '<strong>';
type ElementInfo = {
  name: string;
  range: string;
  damage: string;
}
const elementList = elementalBlast.description.substring(elementListStart, elementListEnd).split(/<\/li>(<br>)?<li>/gi).filter(s => s && s != '<br>').map(s => {
  const pIndex = s.indexOf(P);
  const end = s.indexOf('</p>', pIndex + P.length);
  const trimmed = s.substring(pIndex + P.length, end);
  const damage = trimmed.search(/\d+d\d+/gi);
  const range = trimmed.lastIndexOf(',');
  return {
    trimmed: trimmed,
    name: trimmed.substring(trimmed.indexOf(STRONG) + STRONG.length, trimmed.indexOf('</strong>')),
    range: trimmed.substring(range + 1).trim().replaceAll('feet', 'ft.'),
    damage: trimmed.substring(damage, range)
  };
}).reduce((acc, value) => {
  acc[value.name] = value;
  return acc;
}, {} as { [name: string]: ElementInfo });

const rows = character.abilities.filter(a => a.name.startsWith('Kinetic Element')).map(a => {
  const brace = a.name.indexOf('(');
  const name = a.name.substring(brace + 1, a.name.indexOf(')', brace));
  return elementList[name];
});
</script>
