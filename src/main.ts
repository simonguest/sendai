import { createApp } from "vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";

// Components
import App from "./App.vue";

const vuetify = createVuetify();

createApp(App).use(vuetify).mount("#app");
