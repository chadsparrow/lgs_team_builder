import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Axios from 'axios';
import Toasted from 'vue-toasted';

Vue.use(Toasted, { position: 'bottom-center', duration: 4000 });

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
