import axios from 'axios';
import store from '../store';
import router from '../router';

export default function setup() {
  axios.interceptors.response.use(
    function(response) {
      return response;
    },
    async function(error) {
      if (error.response.status !== 401) {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
      store.dispatch('logout');
      router.push({ name: 'login' });

      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  );

  axios.interceptors.request.use(
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
