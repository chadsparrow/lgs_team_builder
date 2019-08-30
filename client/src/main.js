import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Axios from 'axios';
import Toasted from 'vue-toasted';
import VuejsDialog from 'vuejs-dialog';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';

Vue.use(VuejsDialog);
Vue.use(Toasted, { position: 'bottom-right', duration: 4000 });

Vue.config.productionTip = false;
const token = localStorage.getItem('token');

Vue.prototype.$http = Axios;

if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
