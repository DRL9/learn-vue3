<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string;
    name: string;
    count: number;
    firstName: string;
    isValid?: boolean;
  }>(),
  {
    title: "default title",
  }
);
console.log(props.firstName, props.isValid);

const emit = defineEmits<{
  (e: "confirm", firstName: string, isValid: boolean): void;
}>();
</script>

<template>
  <div>
    {{ title }}
  </div>
  <div>{{ name }}</div>
  <div>{{ count }}</div>
  <div>{{ firstName }}</div>
  <button @click="$emit('confirm', firstName, isValid)">confirm</button>
</template>
