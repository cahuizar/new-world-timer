import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: colors.blueGrey.darken2,
        secondary: colors.blueGrey.lighten2,
        accent: colors.blueGrey.darken3,
      },
    },
  },
});
