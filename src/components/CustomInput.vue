<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: string;
  suffix: string;
  suffixModifiers?: { uppercase: boolean };
}>();

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
  (e: "update:suffix", v: string): void;
}>();

const suffixValue = computed({
  get() {
    return props.suffix;
  },
  set(v) {
    console.log(props.suffixModifiers);
    emit(
      "update:suffix",
      props.suffixModifiers?.uppercase ? v.toUpperCase() : v
    );
  },
});
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as any)?.value)"
  />
  <input v-model="suffixValue" />
</template>
