import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Toasted from 'vue-toasted';
import VuejsDialog from 'vuejs-dialog';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import VueMoment from 'vue-moment';
import moment from 'moment-timezone';
import Datetime from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';
import vueCountryRegionSelect from 'vue-country-region-select';

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

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
