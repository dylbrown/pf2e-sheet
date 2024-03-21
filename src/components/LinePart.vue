<template>
  <div class="line" v-if="content">
    <div class="underlined" style="flex-direction: row">{{ content }}</div>
    <div class="labello">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  content: string;
}>();
</script>
