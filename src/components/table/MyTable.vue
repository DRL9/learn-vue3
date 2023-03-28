<script setup lang="ts">
import { getCurrentInstance } from "vue";
import { useStore, type Table } from "./store";
import Cell from "./cell";

type M = {
  [index: string]: any;
};

defineProps<{
  data: M[];
}>();

const instance = getCurrentInstance() as Table;
const store = useStore();
instance.store = store;
const columns = store.states.originColumns;
</script>

<template>
  <div class="my-table">
    <slot />
    <table>
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.id">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="index">
          <td v-for="col in columns" :key="col.id">
            <Cell :row="row" :col="col" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
td {
  border: 1px solid red;
}
</style>
