import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App.vue";
import router from "./router";

import vueCookies from "vue-cookies";

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(vueCookies);

app.$cookies.config("7d");

router.isReady().then(() => {
  app.mount("#app");
});
