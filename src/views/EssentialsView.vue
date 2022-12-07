<script setup lang="ts">
import { computed, onUnmounted } from "vue";
import { reactive, ref } from "vue";

const id = "hello";
const obj = {
  id: "world",
  style: {
    color: "red",
  },
};

let { count } = reactive({ count: 0 });
function addCount() {
  count++;
}

let count2 = ref(0);
function addCount2() {
  count2.value++;
}

let state2 = reactive({ count: ref(2) });
function addCount3() {
  state2.count++;
}

const list = reactive([1]);
const listCount = computed(() => list.length);
function addList() {
  list.push(1);
}

const fName = ref("John");
const lName = ref("Doe");
const fullName = computed({
  get() {
    return fName.value + "." + lName.value;
  },
  set(v) {
    [fName.value, lName.value] = v.split(".");
  },
});

const isActive = ref(true);

const forObj = reactive({ a: "aValue", b: "bValue" });

const inputValue = ref("");

const checkedNames = ref([]);

const picked = ref("");

const refInput = ref<HTMLInputElement | null>(null);

defineProps(["title"]);
</script>

<template>
  <div>{{ title }}</div>
  <div :id="id">{{ id }}</div>
  <div v-bind="obj">{{ obj.id }}</div>
  <button @click="addCount">{{ count }}</button>
  <div>
    <button @click="addCount2">{{ count2 }}</button>
  </div>
  <div>
    <button @click="addCount3">{{ state2.count }}</button>
  </div>
  <button @click="addList">add list {{ listCount }}</button>
  <div :class="{ isActive: isActive }"></div>
  <ul>
    <li v-for="(value, key, index) in forObj" :key="key">
      {{ value }}- {{ key }}-{{ index }}
    </li>
  </ul>
  <div>
    <span v-for="i in 8" :key="i">{{ i }}</span>
  </div>
  <div>
    <input v-model="inputValue" @keydown.alt.enter="inputValue = ''" />
  </div>

  <div>
    <div>Checked names: {{ checkedNames }}</div>

    <input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
    <label for="jack">Jack</label>

    <input type="checkbox" id="john" value="John" v-model="checkedNames" />
    <label for="john">John</label>

    <input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
    <label for="mike">Mike</label>
  </div>
  <div>
    <div>Picked: {{ picked }}</div>

    <input type="radio" id="one" value="One" v-model="picked" />
    <label for="one">One</label>

    <input type="radio" id="two" :value="{ a: 'two' }" v-model="picked" />
    <label for="two">Two</label>
  </div>
  <div>
    <input ref="refInput" />
    <button @click="refInput?.focus()">focus</button>
  </div>
</template>
