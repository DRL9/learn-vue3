import type { Plugin } from "vue";

const $translate = (opts: any) => (key: string) => {
  return key.split(".").reduce((o, k) => {
    if (o) return o[k];
    return o;
  }, opts);
};

export const translatePlugin: Plugin = {
  install(app, opts) {
    app.config.globalProperties.$translate = $translate(opts);
    app.provide("version", "1.1");
  },
};

// work in vue3
declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $translate: ReturnType<typeof $translate>;
  }
}
