<script setup lang="ts">
import CompProps from "@/components/CompProps.vue";
import CustomInput from "@/components/CustomInput.vue";
import { ref } from "vue";

function onConfirm(a: string, b: boolean) {
  console.log(a, b);
}

const inputVal = ref("");
const suffixVal = ref("");
</script>

<template>
  <h2>Component in depth</h2>
  <CompProps name="hello" :count="1" first-name="John" @confirm="onConfirm" />
  <CustomInput v-model="inputVal" v-model:suffix.uppercase="suffixVal" />
</template>
