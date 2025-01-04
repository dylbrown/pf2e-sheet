<template>
  <div style="display: flex; justify-content: space-between">
    <span>
      {{ props.character.money + extraMoney / 10 }} sp
      <q-popup-proxy
        self="bottom right"
        anchor="top right"
        @before-show="workingMoney = 0"
        @hide="extraMoney += workingMoney"
      >
        <div
          class="flex flex-center"
          style="color: black; font-size: 14px; padding: 5px"
        >
          <template v-if="workingMoney < 10">
            {{ signed(workingMoney) }} cp
          </template>
          <template v-if="workingMoney >= 10 && workingMoney % 100 != 0">
            {{ signed(workingMoney / 10) }} sp
          </template>
          <template
            v-if="
              workingMoney >= 10 &&
              workingMoney % 100 == 0 &&
              workingMoney % 1000 != 0
            "
          >
            {{ signed(workingMoney / 100) }} gp
          </template>
          <template v-if="workingMoney >= 10 && workingMoney % 1000 == 0">
            {{ signed(workingMoney / 1000) }} pp
          </template>
        </div>
        <q-btn-group>
          <q-btn
            label="-1 pp"
            @click="workingMoney -= 1000"
            class="money-button"
          />
          <q-btn
            label="-1 gp"
            @click="workingMoney -= 100"
            class="money-button"
          />
          <q-btn
            label="-1 sp"
            @click="workingMoney -= 10"
            class="money-button"
          />
          <q-btn
            label="-1 cp"
            @click="workingMoney -= 1"
            class="money-button"
          />
          <q-btn
            label="+1 cp"
            @click="workingMoney += 1"
            class="money-button"
          />
          <q-btn
            label="+1 sp"
            @click="workingMoney += 10"
            class="money-button"
          />
          <q-btn
            label="+1 gp"
            @click="workingMoney += 100"
            class="money-button"
          />
          <q-btn
            label="+1 pp"
            @click="workingMoney += 1000"
            class="money-button"
          />
        </q-btn-group>
      </q-popup-proxy>
    </span>
    <span
      >{{ character.totalBulk }}/{{
        5 +
        abilityMod(character.scores[Score.Strength]) +
        character.bulkLimitBonus
      }}({{
        10 +
        abilityMod(character.scores[Score.Strength]) +
        character.bulkLimitBonus
      }}) Bulk</span
    >
  </div>
</template>

<script setup lang="ts">
import Character from 'src/character/character';
import { ref, watch } from 'vue';
import { signed, abilityMod } from 'src/character/util';
import { Score } from 'src/character/model';
import * as TS from 'src/pages/localStorage';

const props = defineProps<{ character: Character }>();

const extraMoney = ref<number>(
  TS.loadOrDefault(props.character.name, 0, 'money'),
);
watch(extraMoney, (money) => {
  TS.save(props.character.name, money, 'money');
});

const workingMoney = ref<number>(0);
</script>
