import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: localStorage.getItem('access_token') || '',
    currentMember: {}
  },
  actions: {
    login: (state, user) => {
      return new Promise(async (resolve, reject) => {
        try {
          // commit('auth_request');
          const resp = await axios.post('/api/v1/auth/login', user);
          const data = await resp.data;
          localStorage.setItem('access_token', data.token);
          resolve(resp);
        } catch (err) {
          // commit('auth_error');
          localStorage.removeItem('access_token');
          reject(err);
        }
      });
    }
  },
  mutations: {}
});
