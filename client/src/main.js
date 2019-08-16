import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Axios from 'axios';

Vue.config.productionTip = false;
const accessToken = localStorage.getItem('access_token');

Vue.prototype.$http = Axios;

if (accessToken) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
