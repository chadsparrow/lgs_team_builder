/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(Vuex);
Vue.use(VueAxios, axios);

export default new Vuex.Store({
  state: {
    isLoading: false,
    status: '',
    token: localStorage.getItem('token') || '',
    member: localStorage.getItem('member') || null,
    catalog: {},
    catalogItems: [],
    emails: [],
    notifications: [],
    breadcrumbs: []
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
          localStorage.setItem('member', member);
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
        localStorage.removeItem('member');
        resolve();
      });
    },
    setBreadcrumbs({ commit }, breadcrumbs) {
      return new Promise((resolve, reject) => {
        commit('SET_BREADCRUMBS', breadcrumbs);
        resolve();
      });
    },
    getCatalogs({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get('/api/v1/catalogs');
          commit('TOGGLE_LOADING');
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
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getMemberDetails({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get(`/api/v1/members/${id}/details`);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    addMember({ commit }, member) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.post('/api/v1/members/register', member);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    deleteMember({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.delete(`/api/v1/members/${id}`);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    updateMember({ commit }, { updatedMember, id }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.put(`/api/v1/members/${id}`, updatedMember);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    toggleAdmin({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.patch(`/api/v1/members/admin/${id}`);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getTeams({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get('/api/v1/teams');
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getTeam({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get(`/api/v1/teams/${id}`);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    addTeam({ commit }, team) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.post('/api/v1/teams', team);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getStores({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get('/api/v1/stores');
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getOrders({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get('/api/v1/orders');
          commit('TOGGLE_LOADING');
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
    SET_BREADCRUMBS(state, breadcrumbs) {
      state.breadcrumbs = breadcrumbs;
    }
  },
  getters: {
    isLoading: state => state.isLoading,
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    getCurrentMember: state => {
      return JSON.parse(state.member);
    },
    emails: state => state.emails,
    notifications: state => state.notifications,
    breadcrumbs: state => state.breadcrumbs
  }
});
