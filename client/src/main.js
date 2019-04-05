import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import VeeValidate, { Validator } from "vee-validate";

import Table from "./components/Order-table";

Vue.component("my-table", Table);

const checkCell = {
  getMessage(field) {
    return `Such ${field} already exists.`;
  },
  validate(headerOfCol, headersArr) {
    console.log('---'+ headerOfCol+'---'+headersArr+'---');
    return false;
  }
};

Validator.extend("checkCell", checkCell, {});

Vue.use(VeeValidate);
Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
