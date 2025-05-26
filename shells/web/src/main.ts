import { createApp } from "vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// Router
import router from "./router";

// Components
import App from "./App.vue";

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  }
});

createApp(App).use(vuetify).use(router).mount("#app");
