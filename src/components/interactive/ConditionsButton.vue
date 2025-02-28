<template>
  <div class="numBox rounded" style="min-height: 3.6em">
    <q-btn class="buff-button">
      <div class="row buffs">
        <div
          class="column"
          v-for="condition of Object.values(conditions)"
          :key="condition.name"
        >
          <q-icon :name="condition.icon" /><template
            v-if="condition.has_value"
            >{{ condition.value }}</template
          >
        </div>
      </div>
      <q-popup-proxy
        self="top left"
        anchor="bottom left"
        v-model="viewConditions"
      >
        <div class="condition-list">
          <div
            class="condition"
            v-for="[i, effect] of Object.values(conditionEffects).entries()"
            :key="i"
          >
            <div class="condition-header">
              <div class="row center-content">
                <span
                  ><q-icon icon :name="effect.icon" /> {{ effect.name }}</span
                >
              </div>
              <div class="condition-desc">
                <template
                  v-for="[i, statMod] of Object.values(
                    effect.statMods,
                  ).entries()"
                  :key="i"
                >
                  <template v-if="i > 0">; </template>
                  {{
                    effect.has_value
                      ? conditions[effect.condition]
                        ? signed(
                            -1 * (conditions[effect.condition]?.value ?? 0),
                          )
                        : '-X'
                      : statMod.amount
                  }}
                  {{ statMod.type }} to
                  {{ statMod.attrs.map(AttrLabel).join(', ') }}
                </template>
                <template
                  v-for="[c, value] of Object.entries(effect.child_conditions)"
                  :key="c"
                  >; {{ c
                  }}<template v-if="typeof value === 'number'">{{
                    ' ' + value
                  }}</template>
                </template>
              </div>
            </div>
            <q-toggle
              v-if="!effect.has_value"
              :disable="isLocked(effect.condition)"
              v-model="conditionEnabled[i]"
              @update:model-value="
                (value) => updateCondition(effect.condition, value)
              "
            />
            <div v-if="effect.has_value" class="value-condition">
              <q-btn
                dense
                icon="remove"
                :disable="isLocked(effect.condition)"
                @click="ConditionData.remove(effect.condition, character)"
              />
              <div style="padding: 0 10px">
                {{ conditions[effect.condition]?.value ?? 0 }}
              </div>
              <q-btn
                dense
                icon="add"
                @click="ConditionData.add(effect.condition, character)"
              />
            </div>
          </div>
        </div>
      </q-popup-proxy>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import Character from 'src/character/character';
import { Attribute } from 'src/character/model';
import { signed } from 'src/character/util';
import { ref, watch } from 'vue';
import * as LS from 'src/pages/localStorage';
import {
  Condition,
  ConditionData,
  conditionEffects,
} from 'src/character/modifiers';

const { character } = defineProps<{
  character: Character;
}>();

const AttrLabel = (a: Attribute) =>
  Attribute[a].replaceAll(/([a-z])([A-Z])/g, '$1 $2');

const viewConditions = ref<boolean>(false);

type ConditionSaveData = { [key in Condition]?: number };
const loadedConditions = LS.load<ConditionSaveData>(
  character.name,
  'conditions',
);
if (loadedConditions != null) {
  for (const condition of Object.values(Condition)) {
    // eslint-disable-next-line vue/no-mutating-props
    delete character.conditions[condition];
  }
  for (const [condition, value] of Object.entries(loadedConditions)) {
    const effect = ConditionData.clone(
      conditionEffects[condition as Condition],
      value,
    );
    // eslint-disable-next-line vue/no-mutating-props
    character.conditions[condition as Condition] = effect;
  }
}
const conditions = character.conditions;

const conditionEnabled = ref<boolean[]>(
  Array(Object.keys(conditionEffects).length).fill(false),
);
for (const [i, key] of Object.keys(conditionEffects).entries()) {
  conditionEnabled.value[i] = conditions[key as Condition] != null;
}

const isLocked = (c: Condition) =>
  character.conditions[c] !== undefined && character.conditions[c]?.locked;

const updateCondition = (condition: Condition, value: boolean) => {
  if (value) {
    ConditionData.add(condition, character);
  } else {
    ConditionData.remove(condition, character);
  }
};

watch(conditions, (val) => {
  const data: ConditionSaveData = {};
  Object.entries(val).forEach(([condition, effect]) => {
    data[condition as Condition] = effect.has_value ? effect.value : 1;
  });
  LS.save(character.name, data, 'conditions');
  for (const [i, key] of Object.keys(conditionEffects).entries()) {
    conditionEnabled.value[i] = conditions[key as Condition] != null;
  }
});
</script>
