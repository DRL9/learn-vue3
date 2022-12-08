<script setup lang="ts">
import type { Directive } from "vue";
import { inject } from "vue";

const vExample: Directive = {
  mounted(el, binding, vnode, prevNode) {
    console.log(el, binding, vnode, prevNode);
  },
};

const version = inject("version");
</script>

<template>
  <div>
    <input v-example:foo.a.b="2" />
    <div>
      {{ version }}
    </div>
    <div>
      {{ $translate("greet") }}
    </div>
  </div>
</template>
