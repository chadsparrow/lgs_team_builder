import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import Toasted from 'vue-toasted';
import VueMoment from 'vue-moment';
import moment from 'moment-timezone';
import Datetime from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';
import vueCountryRegionSelect from 'vue-country-region-select';
import VueClipboard from 'vue-clipboard2';
import Vue2Filters from 'vue2-filters';
import ZoomOnHover from 'vue-zoom-on-hover';
import VueCookies from 'vue-cookies';

import axios from 'axios';
import VueAxios from 'vue-axios';
import interceptorsSetup from './helpers/interceptors';

import VueCurrencyInput from 'vue-currency-input';
import VueSidebarMenu from 'vue-sidebar-menu';
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';
import i18n from './i18n';

import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

Vue.use(VueAxios, axios);
axios.defaults.withCredentials = true;
interceptorsSetup();

Vue.use(VueMoment, { moment });

Vue.use(Toasted, {
  position: 'bottom-right',
  duration: 4000,
  iconPack: 'fontawesome',
  fullWidth: false,
  fitToScreen: false,
  singleton: true,
});

Vue.use(Datetime);
Vue.use(vueCountryRegionSelect);
Vue.use(VueClipboard);
Vue.use(Vue2Filters);
Vue.use(VueCurrencyInput);
Vue.use(VueSidebarMenu);
Vue.use(ZoomOnHover);
Vue.use(VueCookies);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
