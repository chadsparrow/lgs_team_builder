/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
    status: '',
    token: localStorage.getItem('token') || '',
    member: sessionStorage.getItem('member') || null,
    catalogs: [],
    catalog: {},
    catalogItems: [],
    members: [],
    foundMember: {},
    emails: [],
    notifications: []
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
          const emails = res.data[0].emails;
          localStorage.setItem('token', token);
          sessionStorage.setItem('member', member);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          commit('AUTH_SUCCESS', { token, member, emails });
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
        sessionStorage.removeItem('member');
        resolve();
      });
    },
    getCatalogs({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get('/api/v1/catalogs');
          commit('TOGGLE_LOADING');
          commit('SET_CATALOGS', res.data);
          commit('SET_CATALOG', {});
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getCatalog({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get(`/api/v1/catalogs/${id}`);
          commit('TOGGLE_LOADING');
          commit('SET_CATALOG', res.data);
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    addCatalog({ commit }, catalog) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.post(`/api/v1/catalogs`, catalog);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    editCatalog({ commit }, [id, catalog]) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.put(`/api/v1/catalogs/${id}`, catalog);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getCatalogItems({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get(`/api/v1/catalogitems/catalog/${id}`);
          commit('TOGGLE_LOADING');
          commit('SET_CATALOG_ITEMS', res.data);
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getMembers({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get('/api/v1/members');
          commit('TOGGLE_LOADING');
          commit('SET_MEMBERS', res.data);
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getMember({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get(`/api/v1/members/${id}`);
          commit('TOGGLE_LOADING');
          commit('SET_MEMBER', res.data);
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    }
  },
  mutations: {
    TOGGLE_LOADING(state) {
      state.isLoading = !state.isLoading;
    },
    AUTH_REQUEST(state) {
      state.status = 'loading';
    },
    AUTH_SUCCESS(state, { token, member, emails }) {
      state.status = 'success';
      state.token = token;
      state.member = member;
      state.emails = emails;
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
    SET_CATALOG_ITEMS(state, catalogitems) {
      state.catalogItems = catalogitems;
    },
    SET_MEMBERS(state, members) {
      state.members = members;
    },
    SET_MEMBER(state, member) {
      state.foundMember = member;
    }
  },
  getters: {
    isLoading: state => state.isLoading,
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    getCurrentMember: state => {
      return JSON.parse(state.member);
    },
    catalogs: state => state.catalogs,
    catalog: state => state.catalog,
    catalogItems: state => state.catalogItems,
    members: state => state.members,
    foundMember: state => state.foundMember,
    emails: state => state.emails,
    notifications: state => state.notifications
  }
});
