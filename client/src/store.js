/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('access_token') || '',
    member: {}
  },
  actions: {
    login: ({ commit }, loginCreds) => {
      return new Promise(async (resolve, reject) => {
        try {
          commit('AUTH_REQUEST');
          const res = await axios.post('/api/v1/auth/login', loginCreds);
          const token = res.data[0].token;
          const member = res.data[0].member;
          localStorage.setItem('access_token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          commit('AUTH_SUCCESS', { token, member });
          resolve(res);
        } catch (err) {
          commit('AUTH_ERROR');
          localStorage.removeItem('access_token');
          reject(err);
        }
      });
    },
    register({ commit }, member) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('AUTH_REQUEST');
          const res = await axios.post('/api/v1/auth/register', member);
          resolve(res);
        } catch (err) {
          commit('AUTH_ERROR');
          reject(err);
        }
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit('LOGOUT');
        localStorage.removeItem('access_token');
        resolve();
      });
    },
    getMembers({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get('/api/v1/members');
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    }
  },
  mutations: {
    AUTH_REQUEST(state) {
      state.status = 'loading';
    },
    AUTH_SUCCESS(state, { token, member }) {
      state.status = 'success';
      state.token = token;
      state.member = member;
    },
    AUTH_ERROR(state) {
      state.status = 'error';
    },
    LOGOUT(state) {
      state.status = '';
      state.token = '';
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status
  }
});
