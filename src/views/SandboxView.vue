<template>
  <div>
    <div v-for="item in arr" :key="item.id">
      {{ item.count }}
    </div>
    <button @click="handleClick">click</button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const arr = reactive<{ id: number; count: number }[]>([]);
const obj = { id: 2, count: 1 };
arr.push(obj);
function handleClick() {
  obj.count++;
}
</script>
