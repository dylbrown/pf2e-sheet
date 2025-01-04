<template>
  <div class="line pip-line">
    <div class="pip-counter" :style="`width: ${SIZE}em; height: ${SIZE}em`">
      <q-popup-proxy
        self="top middle"
        anchor="bottom middle"
        v-if="interactive"
      >
        <q-btn-group>
          <q-btn label="-" @click="remove" />
          <q-btn label="+" @click="add" />
        </q-btn-group>
      </q-popup-proxy>
      <template v-for="i in max" :key="i">
        <div
          class="prof-box rounded"
          :class="i <= current ? 'filled' : ''"
          ref="pips"
          :style="`width: ${SIZE / Math.PI}em; height: ${SIZE / Math.PI}em`"
        ></div>
      </template>
    </div>
    <div class="labello" v-if="label">{{ label }}</div>
  </div>
</template>
<script setup lang="ts">
import * as LS from 'src/pages/localStorage';
import { onMounted, ref, watch } from 'vue';

const SIZE = 2.5;

const {
  saveKey = [],
  charName,
  max,
  start,
  notifier,
} = defineProps<{
  label?: string;
  max: number;
  start: number;
  interactive?: boolean;
  charName?: string;
  saveKey?: string[];
  notifier?: number;
}>();
const current = ref<number>(
  LS.loadOrDefault(charName, Math.max(0, Math.min(max, start)), ...saveKey),
);
watch(current, (val) => {
  if (!charName || !saveKey) return;
  LS.save(charName, val, ...saveKey);
});
watch(
  () => notifier,
  () => {
    current.value = max;
  },
);

const pips = ref<HTMLDivElement[] | null>(null);

onMounted(() => {
  if (pips.value) {
    if (pips.value.length > 1) {
      const radians = (2 * Math.PI) / max;
      let radius = SIZE / 4;
      const apothemRatio = max > 2 ? Math.cos(Math.PI / max) : 1;
      const newRadius =
        max % 2 == 0
          ? radius / apothemRatio
          : (radius * 2) / (1 + apothemRatio);
      const yShift = max % 2 == 0 ? 0 : newRadius - radius;
      radius = newRadius;
      for (const [index, pip] of pips.value.entries()) {
        const angle = (index - (max > 2 && max % 2 == 0 ? 0.5 : 0)) * radians;
        const x = Math.sin(angle) * radius;
        const y = -Math.cos(angle) * radius + yShift;
        pip.style.left = `calc(50% + ${x}em)`;
        pip.style.top = `calc(50% + ${y}em)`;
      }
    } else if (pips.value[0]) {
      pips.value[0].style.left = '50%';
      pips.value[0].style.top = '50%';
    }
  }
});

const add = () => {
  if (current.value < max) current.value += 1;
};

const remove = () => {
  if (current.value > 0) current.value -= 1;
};

defineExpose({ add, remove });
</script>
