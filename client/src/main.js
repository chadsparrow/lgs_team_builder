import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Axios from 'axios';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/index.css';

Vue.use(VueToast, { position: 'bottom-right' });

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
