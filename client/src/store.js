/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    member: sessionStorage.getItem('member') || null,
    catalogs: [],
    catalog: {},
    members: [],
    foundMember: {}
  },
  actions: {
    login: ({ commit }, loginCreds) => {
      return new Promise(async (resolve, reject) => {
        try {
          commit('AUTH_REQUEST');
          const res = await axios.post('/api/v1/auth/login', loginCreds);
          const token = res.data[0].token;
          let member = res.data[0].member;
          member = JSON.stringify(member);
          localStorage.setItem('token', token);
          sessionStorage.setItem('member', member);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          commit('AUTH_SUCCESS', { token, member });
          resolve(res);
        } catch (err) {
          commit('AUTH_ERROR');
          localStorage.removeItem('token');
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
        localStorage.removeItem('token');
        resolve();
      });
    },
    getCatalogs({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get('/api/v1/catalogs');
          commit('SET_CATALOGS', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getCatalog({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get(`/api/v1/catalogs/${id}`);
          commit('SET_CATALOG', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getMembers({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get('/api/v1/members');
          commit('SET_MEMBERS', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getMember({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get(`/api/v1/members/${id}`);
          commit('SET_MEMBER', res.data);
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
      state.member = null;
    },
    SET_CATALOGS(state, catalogs) {
      state.catalogs = catalogs;
    },
    SET_CATALOG(state, catalog) {
      state.catalog = catalog;
    },
    SET_MEMBERS(state, members) {
      state.members = members;
    },
    SET_MEMBER(state, member) {
      state.foundMember = member;
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    getCurrentMember: state => {
      return JSON.parse(state.member);
    },
    catalogs: state => state.catalogs,
    catalog: state => state.catalog,
    members: state => state.members,
    foundMember: state => state.foundMember
  }
});
