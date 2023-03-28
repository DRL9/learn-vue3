<script setup lang="ts">
import { getCurrentInstance, onMounted, onUnmounted, useSlots } from "vue";
import type { Table } from "./store";

type TableColumnProps1 = {
  prop: string;
  label: string;
};
let idSeed = 1;

const props = defineProps<TableColumnProps1>();
const parent = getCurrentInstance()?.parent as Table;

const ctx = {
  ...props,
  id: idSeed++ + "",
  slots: useSlots(),
};

onMounted(() => {
  parent.store.commit("insertColumn", ctx);
});

onUnmounted(() => {
  parent.store.commit("removeColumn", ctx);
});
</script>

<template>
  <div></div>
</template>
