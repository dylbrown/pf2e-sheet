<template>
  <div class="line" v-if="content">
    <div :class="box ? 'numBox rounded' : 'underlined'" :style="box ? '' : 'flex-direction: row'">{{ content }}</div>
    <div class="labello">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  content: string;
  box?: boolean;
}>();
</script>
