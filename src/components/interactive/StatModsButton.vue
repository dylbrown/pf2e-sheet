<template>
  <div class="numBox rounded" style="min-height: 3.6em">
    <q-btn class="buff-button">
      <div class="column buffs">
        <span v-for="mod of mods.filter((mod) => mod.enabled)" :key="mod.name">
          {{ mod.name }}
        </span>
      </div>
      <q-popup-proxy self="top left" anchor="bottom left">
        <q-list>
          <q-item v-for="mod of mods" :key="mod.name" class="stat-mod-item">
            <q-item-section>
              <q-item-label>{{ mod.name }}</q-item-label>
              <q-item-label
                caption
                v-for="[i, statMod] of Object.entries(mod.statMods)"
                :key="i"
              >
                {{ signed(statMod.amount) }} {{ statMod.type }} to
                {{ statMod.attrs.map(AttrLabel).join(', ') }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle color="blue" v-model="mod.enabled" val="battery" />
            </q-item-section>
          </q-item>
          <q-item class="stat-mod-item">
            <q-item-section>
              <q-btn icon="add" @click="addStatMod = true" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-popup-proxy>
    </q-btn>
  </div>
  <q-dialog v-model="addStatMod">
    <q-card>
      <q-card-section>
        <q-input
          v-model="WIPmodEffect.name"
          label="Buff / Debuff Name"
          style="padding-left: 5px"
        />
      </q-card-section>
      <q-card-section
        ><q-list>
          <q-item
            v-for="[i, statMod] of Object.entries(WIPmodEffect.statMods)"
            :key="i"
          >
            <div class="row no-wrap items-end">
              <q-input
                v-model.number="statMod.amount"
                type="number"
                filled
                style="max-width: 65px; padding-right: 5px"
                :prefix="statMod.amount >= 0 ? '+' : ''"
              />
              <q-select
                v-model="statMod.type"
                :options="Object.values(StatModType)"
                label="Type"
                style="min-width: 165px"
              />
              <span
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                &nbsp;to&nbsp;
              </span>
              <q-select
                v-model="statMod.attrs"
                multiple
                :options="OPTIONS"
                :option-label="AttrLabel"
                clearable
                label="Attribute(s)"
                style="min-width: 165px"
              />
            </div>
          </q-item>
          <q-item class="stat-mod-item">
            <q-item-section>
              <q-btn
                icon="add"
                @click="WIPmodEffect.statMods.push(new StatMod())"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <div class="row" style="justify-content: stretch">
        <q-btn flat icon="done" @click="reset(true)" style="flex-grow: 1" />
        <q-btn flat icon="close" @click="reset()" style="flex-grow: 1" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import Character from 'src/character/character';
import {
  Attribute,
  ModEffect,
  sfSkills,
  skills,
  StatMod,
  StatModType,
} from 'src/character/model';
import { signed } from 'src/character/util';
import { reactive, ref, watch } from 'vue';
import * as LS from 'src/pages/localStorage';

const props = defineProps<{
  character: Character;
}>();

const options_temp = [
  Attribute.AttackRolls,
  Attribute.DamageRolls,
  Attribute.Saves,
  Attribute.SkillChecks,
];
options_temp.push(...(props.character.starfinder ? sfSkills : skills));
const OPTIONS = options_temp.map((s) => s as Attribute);
const AttrLabel = (a: Attribute) =>
  Attribute[a].replaceAll(/([a-z])([A-Z])/g, '$1 $2');

const addStatMod = ref<boolean>(false);

const WIPmodEffect = ref<ModEffect>(new ModEffect());
WIPmodEffect.value.statMods.push(new StatMod());

const mods = reactive(
  LS.loadOrDefault(
    props.character.name,
    props.character.modifiers,
    'modifiers',
  ),
);
watch(mods, (val) => {
  LS.save(props.character.name, val, 'modifiers');
});

const reset = (set?: boolean) => {
  if (set) mods.push(WIPmodEffect.value);
  WIPmodEffect.value = new ModEffect();
  WIPmodEffect.value.statMods.push(new StatMod());
  addStatMod.value = false;
};
</script>
