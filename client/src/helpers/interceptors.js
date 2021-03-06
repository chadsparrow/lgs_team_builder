import Vue from 'vue';
import store from '../store';
import router from '../router';

export default function setup() {
  Vue.axios.interceptors.response.use(
    function(response) {
      return response;
    },
    async function(error) {
      return new Promise(async (resolve, reject) => {
        if (error.response.status === 401) {
          await store.dispatch('logout', {
            id: store.getters.loggedInMember.aud,
          });
          router.push({ path: '/' });
        }

        if (error.response.status === 500) {
          router.push({ name: '500' });
        }

        reject(error);
      });
    }
  );

  Vue.axios.interceptors.request.use(
    function(config) {
      // const token = localStorage.getItem('token');
      // if (token) {
      //   config.headers['Authorization'] = `Bearer ${token}`;
      // }
      return config;
    },
    function(err) {
      return Promise.reject(err);
    }
  );
}
