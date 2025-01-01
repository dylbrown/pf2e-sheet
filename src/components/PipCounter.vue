<template>
  <div class="line pip-line">
    <div class="pip-counter" :style="`width: ${SIZE}em; height: ${SIZE}em`">
      <q-popup-proxy self="top middle" anchor="bottom middle"
        ><q-btn-group>
          <q-btn label="-" @click="remove" />
          <q-btn label="+" @click="add" /> </q-btn-group
      ></q-popup-proxy>
      <template v-for="i in max" :key="i">
        <div
          class="prof-box rounded"
          :class="i <= current ? 'filled' : ''"
          ref="pips"
          :style="`width: ${SIZE / Math.PI}em; height: ${SIZE / Math.PI}em`"
        ></div>
      </template>
    </div>
    <div class="labello">{{ label }}</div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';

const SIZE = 2.5;

const props = defineProps<{
  label: string;
  max: number;
  start: number;
  interactive: boolean;
}>();

const current = ref<number>(Math.max(0, Math.min(props.max, props.start)));

const pips = ref<HTMLDivElement[] | null>(null);

onMounted(() => {
  if (pips.value) {
    if (pips.value.length > 1) {
      const radians = (2 * Math.PI) / props.max;
      let radius = SIZE / 4;
      const apothemRatio = props.max > 2 ? Math.cos(Math.PI / props.max) : 1;
      const newRadius =
        props.max % 2 == 0
          ? radius / apothemRatio
          : (radius * 2) / (1 + apothemRatio);
      const yShift = props.max % 2 == 0 ? 0 : newRadius - radius;
      radius = newRadius;
      for (const [index, pip] of pips.value.entries()) {
        const angle =
          (index - (props.max > 2 && props.max % 2 == 0 ? 0.5 : 0)) * radians;
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
  if (current.value < props.max) current.value += 1;
};

const remove = () => {
  if (current.value > 0) current.value -= 1;
};

defineExpose({ add, remove });
</script>
