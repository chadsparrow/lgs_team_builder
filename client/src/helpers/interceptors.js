import Vue from 'vue';
import store from '../store';
import router from '../router';

export default function setup() {
  Vue.axios.defaults.withCredentials = true;

  Vue.axios.interceptors.response.use(
    function(response) {
      return response;
    },
    async function(error) {
      if (error.response.status !== 401 && error.response.status !== 500) {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
      if (error.response.status === 401) {
        store.dispatch('logout');
        router.push({ name: 'home' });
      }

      if (error.response.status === 500) {
        router.push({ name: '500' });
      }

      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  );

  Vue.axios.interceptors.request.use(
    function(config) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    function(err) {
      return Promise.reject(err);
    }
  );
}
