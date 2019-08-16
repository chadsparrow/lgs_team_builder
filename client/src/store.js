import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    accessToken: localStorage.getItem('access_token') || '',
    currentMember: {}
  },
  actions: {
    login: ({ commit }, user) => {
      return new Promise(async (resolve, reject) => {
        try {
          // commit('auth_request');
          const resp = await axios.post('/api/v1/auth/login', user);
          localStorage.setItem('access_token', resp.data.token);
          commit('SET_CURRENT_MEMBER', resp.data.member);
          resolve(resp);
        } catch (err) {
          // commit('auth_error');
          localStorage.removeItem('access_token');
          reject(err);
        }
      });
    },
    // eslint-disable-next-line no-unused-vars
    register({ commit }, user) {
      return new Promise(async (resolve, reject) => {
        try {
          // commit ('auth_request');
          const resp = await axios.post('/api/v1/auth/register', user);
          resolve(resp);
        } catch (err) {
          // commit ('auth_error')
          reject(err);
        }
      });
    }
  },
  mutations: {
    SET_CURRENT_MEMBER: (state, member) => {
      state.currentMember = member;
    }
  }
});
