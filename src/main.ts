import Vue from "vue";
import App from "./App.vue";
import router from "./shared/router";
import store from "./shared/store";
import Header from "./components/Header.vue";
import ApiService from "./shared/services/api.service";
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css'
import Vuelidate from 'vuelidate'
import { FormBuilder } from 'vue-formio';
import FormList from "@/components/FormList.vue";


Vue.use(Vuelidate)
Vue.use(VueMaterial)
Vue.config.productionTip = false;
Vue.component('Header', Header);
Vue.component('formbuilder', FormBuilder);
Vue.component('formlist', FormList);
ApiService.init(process.env.VUE_APP_ROOT_API)

new Vue({
  router,
  store,
  beforeCreate() {
    this.$store.commit('load');
  },
  render: h => h(App)
}).$mount("#app");
