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
    catalogs: [],
    currentCatalog: {},
    emails: [],
    notifications: [],
    breadcrumbs: [],
    allMembers: [],
    teams: [],
    stores: [],
    currentTeam: {},
    currentTeamStores: [],
    currentMember: {},
    currentCatalogItems: [],
    currentStore: {}
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
          commit('SET_CATALOGS', res.data);
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
          commit('SET_CURRENT_CATALOG', res.data);
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
          commit('SET_CURRENT_CATALOG_ITEMS', res.data);
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
          commit('SET_ALL_MEMBERS', res.data);
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
          commit('SET_CURRENT_MEMBER', res.data);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getMe({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get(`/api/v1/members/${id}/me`);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getMemberTeams({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get(`/api/v1/members/${id}/teams`);
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
    getAdmins({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get('/api/v1/members/admins');
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
          commit('SET_TEAMS', res.data);
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
          commit('SET_CURRENT_TEAM', res.data);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    addTeam({ commit }, newTeam) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.post('/api/v1/teams', newTeam);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    updateTeam({ commit }, { updatedTeam, id }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.put(`/api/v1/teams/${id}`, updatedTeam);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    addTeamMember({ commit }, { newTeamMember, id }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.post(`/api/v1/teams/${id}/addmember`, newTeamMember);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    removeTeamMembers({ commit }, { chosenMembers, id }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.post(`/api/v1/teams/${id}/removemembers`, {
            members: chosenMembers
          });
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getTeamStores({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get(`/api/v1/stores/team/${id}`);
          commit('SET_TEAM_STORES', res.data);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    addTeamStore({ commit }, newStore) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.post('/api/v1/stores/', newStore);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    sendInviteNotification({ commit }, { id, teamId }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.post(`/api/v1/members/${id}/invite`, { team: teamId });
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
          commit('SET_STORES', res.data);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getStore({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get(`/api/v1/stores/${id}`);
          commit('SET_CURRENT_STORE', res.data);
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
    },
    CLEAR_CURRENTS(state) {
      state.currentMember = null;
      state.currentTeam = null;
      state.currentTeamStores = null;
      state.currentCatalog = null;
      state.currentCatalogItems = null;
      state.currentStore = null;
    },
    SET_ALL_MEMBERS(state, payload) {
      state.allMembers = payload;
    },
    SET_CURRENT_MEMBER(state, payload) {
      state.currentMember = payload;
    },
    SET_TEAMS(state, payload) {
      state.teams = payload;
    },
    SET_CURRENT_TEAM(state, payload) {
      state.currentTeam = payload;
    },
    SET_TEAM_STORES(state, payload) {
      state.currentTeamStores = payload;
    },
    SET_STORES(state, payload) {
      state.stores = payload;
    },
    SET_CURRENT_STORE(state, payload) {
      state.currentStore = payload;
    },
    SET_CATALOGS(state, payload) {
      state.catalogs = payload;
    },
    SET_CURRENT_CATALOG(state, payload) {
      state.currentCatalog = payload;
    },
    SET_CURRENT_CATALOG_ITEMS(state, payload) {
      state.currentCatalogItems = payload;
    }
  },
  getters: {
    isLoading: state => state.isLoading,
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    getCurrentMember: state => {
      return JSON.parse(state.member);
    },
    allMembers: state => state.allMembers,
    teams: state => state.teams,
    currentTeam: state => state.currentTeam,
    emails: state => state.emails,
    notifications: state => state.notifications,
    breadcrumbs: state => state.breadcrumbs,
    teamStores: state => state.currentTeamStores,
    getMember: state => state.currentMember,
    stores: state => state.stores,
    catalogs: state => state.catalogs,
    currentCatalog: state => state.currentCatalog,
    currentCatalogItems: state => state.currentCatalogItems,
    currentStore: state => state.currentStore
  }
});
