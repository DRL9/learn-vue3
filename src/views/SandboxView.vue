<template>
  <div>
    <MyTable :data="list">
      <MyTableColumn prop="id" label="id" />
      <MyTableColumn prop="name" label="名称" />
    </MyTable>

    <MyTable :data="list">
      <MyTableColumn prop="id" label="id" />
      <MyTableColumn prop="name" label="名称" />
      <MyTableColumn prop="name" label="名称2" v-slot="scope">
        <div>{{ scope.row.name }} {{ scope.col.label }}</div>
      </MyTableColumn>
      <MyTableColumn>
        <template v-slot="scope">
          <div>
            {{ scope.row.id }}
          </div>
        </template>
        <template #append="scope"
          ><button>click {{ scope.row.id }}</button></template
        >
      </MyTableColumn>
    </MyTable>
  </div>
</template>

<script setup lang="ts">
import MyTable from "@/components/table/MyTable.vue";
import MyTableColumn from "@/components/table/MyTableColumn.vue";
import { reactive } from "vue";
const list = reactive([
  { id: 1, name: "mark" },
  { id: 2, name: "john" },
]);
</script>
