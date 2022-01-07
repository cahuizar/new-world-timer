import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueCountdownTimer from 'vuejs-countdown-timer';
import DatetimePicker from 'vuetify-datetime-picker'

Vue.use(VueCountdownTimer);
Vue.use(DatetimePicker);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
