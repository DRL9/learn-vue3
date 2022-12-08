import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";
import HelloWorld from "./components/HelloWorld.vue";
import { translatePlugin } from "./plugins/translate";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(translatePlugin, {
  greet: {
    john: "is john",
  },
});

app.config.errorHandler = (err) => {
  console.log(err);
};

app.component("HelloWorl", HelloWorld);

const vm = app.mount("#app");
console.log(vm);
