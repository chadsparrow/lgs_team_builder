import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import Toasted from 'vue-toasted';
import VuejsDialog from 'vuejs-dialog';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import VueMoment from 'vue-moment';
import moment from 'moment-timezone';
import Datetime from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';
import vueCountryRegionSelect from 'vue-country-region-select';
import VueClipboard from 'vue-clipboard2';
import Vue2Filters from 'vue2-filters';
import interceptorsSetup from './helpers/interceptors';
import VueCurrencyInput from 'vue-currency-input';

interceptorsSetup();
Vue.use(VueMoment, { moment });
Vue.use(VuejsDialog);
Vue.use(Toasted, {
  position: 'bottom-center',
  duration: 4000,
  iconPack: 'fontawesome',
  fullWidth: true,
  fitToScreen: true,
  singleton: true
});
Vue.use(Datetime);
Vue.use(vueCountryRegionSelect);
Vue.use(VueClipboard);
Vue.use(Vue2Filters);
Vue.use(VueCurrencyInput);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
