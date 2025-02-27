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
            <div class="row center-content">
              <span><q-icon icon :name="effect.icon" /> {{ effect.name }}</span>
            </div>
            <div
              style="color: grey; font-size: 0.5em"
              v-for="[i, statMod] of Object.entries(effect.statMods)"
              :key="i"
            >
              {{
                effect.has_value
                  ? conditions[effect.name as Condition]
                    ? signed(
                        -1 * (conditions[effect.name as Condition]?.value ?? 0),
                      )
                    : '-X'
                  : statMod.amount
              }}
              {{ statMod.type }} to
              {{ statMod.attrs.map(AttrLabel).join(', ') }}
            </div>
            <q-toggle
              v-if="!effect.has_value"
              v-model="conditionEnabled[i]"
              @update:model-value="
                (value) => updateCondition(effect.name as Condition, value)
              "
            />
            <div v-if="effect.has_value" class="value-condition">
              <q-btn
                dense
                icon="remove"
                @click="removeCondition(effect.name as Condition)"
              />
              <div style="padding: 0 10px">
                {{ conditions[effect.name as Condition]?.value ?? 0 }}
              </div>
              <q-btn
                dense
                icon="add"
                @click="addCondition(effect.name as Condition)"
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

const props = defineProps<{
  character: Character;
}>();

const AttrLabel = (a: Attribute) =>
  Attribute[a].replaceAll(/([a-z])([A-Z])/g, '$1 $2');

const viewConditions = ref<boolean>(false);

type ConditionSaveData = { [key in Condition]?: number };
const loadedConditions = LS.load<ConditionSaveData>(
  props.character.name,
  'conditions',
);
if (loadedConditions != null) {
  for (const condition of Object.values(Condition)) {
    // eslint-disable-next-line vue/no-mutating-props
    delete props.character.conditions[condition];
  }
  for (const [condition, value] of Object.entries(loadedConditions)) {
    const effect = ConditionData.clone(
      conditionEffects[condition as Condition],
    );
    if (effect.has_value) effect.value = value;
    // eslint-disable-next-line vue/no-mutating-props
    props.character.conditions[condition as Condition] = effect;
  }
}
const conditions = props.character.conditions;

const conditionEnabled = ref<boolean[]>(
  Array(Object.keys(conditionEffects).length).fill(false),
);
for (const [i, key] of Object.keys(conditionEffects).entries()) {
  conditionEnabled.value[i] = conditions[key as Condition] != null;
}
const addCondition = (condition: Condition) => {
  if (!conditions[condition])
    conditions[condition] = ConditionData.clone(conditionEffects[condition]);
  else conditions[condition].value += 1;
};
const removeCondition = (condition: Condition) => {
  if (!conditions[condition]) return;
  if (conditions[condition].value > 1) conditions[condition].value -= 1;
  else delete conditions[condition];
};

const updateCondition = (condition: Condition, value: boolean) => {
  if (value && !conditions[condition]) {
    conditions[condition] = ConditionData.clone(conditionEffects[condition]);
  } else if (!value && conditions[condition]) {
    delete conditions[condition];
  }
};

watch(conditions, (val) => {
  const data: ConditionSaveData = {};
  Object.entries(val).forEach(([condition, effect]) => {
    data[condition as Condition] = effect.has_value ? effect.value : 1;
  });
  LS.save(props.character.name, data, 'conditions');
});
</script>
