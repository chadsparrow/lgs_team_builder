import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Toasted from 'vue-toasted';
import VuejsDialog from 'vuejs-dialog';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import VueMoment from 'vue-moment';
import moment from 'moment-timezone';

Vue.use(VueMoment, { moment });
Vue.use(VuejsDialog);
Vue.use(Toasted, {
  position: 'bottom-center',
  duration: 4000,
  singleton: true,
  iconPack: 'fontawesome'
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
