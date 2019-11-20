/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
    dataReady: false,
    notificationsReady: false,
    status: '',
    token: localStorage.getItem('token') || '',
    loggedInMember: {},
    emails: [],
    notifications: [],
    breadcrumbs: [],
    allMembers: [],
    catalogs: [],
    teams: [],
    stores: [],
    orders: [],
    currentTeam: {},
    currentTeamStores: [],
    currentMember: {},
    currentCatalog: {},
    currentCatalogItems: [],
    currentCatalogItem: {},
    currentStore: {},
    currentOrder: {},
    currentStoreItems: [],
    currentStoreItem: {}
  },
  actions: {
    login: ({ commit }, loginCreds) => {
      return new Promise(async (resolve, reject) => {
        try {
          commit('AUTH_REQUEST');
          const res = await axios.post('/api/v1/auth/login', loginCreds);
          const token = res.data[0].token;
          const member = res.data[0].member;
          const emails = res.data[0].emails;
          localStorage.setItem('token', token);
          localStorage.setItem('member', member._id);
          commit('AUTH_SUCCESS', { token, member, emails });
          resolve(res);
        } catch (err) {
          commit('AUTH_ERROR');
          localStorage.removeItem('token');
          reject(err);
        }
      });
    },
    setLoggedInMember({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get(`/api/v1/members/${id}`);
          const member = res.data;
          commit('SET_LOGGED_IN', member);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    register({ commit }, member) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/auth/register', member);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    joinTeam({ commit }, { member, teamId }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post(`/api/v1/auth/register/${teamId}`, { member });
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit('LOGOUT');
        localStorage.removeItem('token');
        localStorage.removeItem('member');
        commit('CLEAR_CURRENTS');
        commit('CLEAR_TEAMS');
        commit('CLEAR_STORES');
        commit('CLEAR_ORDERS');
        commit('CLEAR_ALL_NOTIFICATIONS');
        resolve();
      });
    },
    setBreadcrumbs({ commit }, breadcrumbs) {
      return new Promise((resolve, reject) => {
        commit('SET_BREADCRUMBS', breadcrumbs);
        resolve();
      });
    },
    changePassword({ commit }, { updatedPassword, id }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.patch(`/api/v1/members/password/${id}`, updatedPassword);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    updateEmail({ commit }, { updatedEmail, id }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.patch(`/api/v1/members/email/${id}`, updatedEmail);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    toggleDisableInvites({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.patch(`/api/v1/members/${id}/disableinvites`);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    toggleAutoAccepts({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.patch(`/api/v1/members/${id}/disableautoaccepts`);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getCatalogs({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          commit('CLEAR_CATALOGS');
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
    getCatalogsQuery({ commit }, brand) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          commit('CLEAR_CATALOGS');
          const res = await axios.get(`/api/v1/catalogs?brand=${brand}`);
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
          commit('CLEAR_CATALOG_ITEMS');
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
    addCatalogItem({ commit }, catalogItem) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.post(`/api/v1/catalogitems/`, catalogItem);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getCatalogItem({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get(`/api/v1/catalogitems/${id}`);
          commit('SET_CURRENT_CATALOG_ITEM', res.data);
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
          commit('CLEAR_MEMBERS');
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
          const res = await axios.get(`/api/v1/members/${id}/me`);
          const payload = res.data.notifications;
          commit('SET_NOTIFICATIONS', payload);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    removeNotification({ commit, dispatch }, { nId }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.delete(`/api/v1/notifications/${nId}`);
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
    getTeams({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          commit('CLEAR_TEAMS');
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
    getTeamForRegister({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.get(`/api/v1/teams/${id}/register`);
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
          commit('CLEAR_TEAM_STORES');
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
    duplicateTeamStore({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.post(`/api/v1/stores/${id}/dup`);
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
          commit('CLEAR_STORES');
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
    updateStore({ commit }, { id, updatedStore }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.put(`/api/v1/stores/${id}`, updatedStore);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    getStoreItems({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          commit('CLEAR_STORE_ITEMS');
          const res = await axios.get(`/api/v1/storeitems/store/${id}`);
          commit('SET_CURRENT_STORE_ITEMS', res.data);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    updateStoreItems({ commit }, { id, storeItems }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          commit('CLEAR_STORE_ITEMS');
          const res = await axios.put(`/api/v1/storeitems/${id}`, { storeItems });
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    removeLike({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.put(`/api/v1/storeitems/${id}/removelike`);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    addLike({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          const res = await axios.put(`/api/v1/storeitems/${id}/addlike`);
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    removeStoreItem({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('TOGGLE_LOADING');
          commit('CLEAR_STORE_ITEMS');
          const res = await axios.delete(`/api/v1/storeitems/${id}`);
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
          commit('CLEAR_ORDERS');
          const res = await axios.get('/api/v1/orders');
          commit('SET_ORDERS');
          commit('TOGGLE_LOADING');
          resolve(res);
        } catch (err) {
          commit('TOGGLE_LOADING');
          reject(err);
        }
      });
    },
    setDataReadyTrue({ commit }) {
      commit('SET_DATA_READY_TRUE');
    },
    setDataReadyFalse({ commit }) {
      commit('SET_DATA_READY_FALSE');
    },
    setNotificationsReadyTrue({ commit }) {
      commit('SET_NOTIFICATIONS_READY_TRUE');
    },
    setNotificationsReadyFalse({ commit }) {
      commit('SET_NOTIFICATIONS_READY_FALSE');
    }
  },
  mutations: {
    TOGGLE_LOADING(state) {
      state.isLoading = !state.isLoading;
    },
    SET_DATA_READY_TRUE(state) {
      state.dataReady = true;
    },
    SET_DATA_READY_FALSE(state) {
      state.dataReady = false;
    },
    SET_NOTIFICATIONS_READY_TRUE(state) {
      state.notificationsReady = true;
    },
    SET_NOTIFICATIONS_READY_FALSE(state) {
      state.notificationsReady = false;
    },
    AUTH_REQUEST(state) {
      state.status = 'loading';
    },
    AUTH_SUCCESS(state, { token, member, emails }) {
      state.status = 'success';
      state.token = token;
      state.loggedInMember = member;
      state.emails = emails;
    },
    AUTH_ERROR(state) {
      state.status = 'error';
    },
    SET_LOGGED_IN(state, member) {
      state.loggedInMember = member;
    },
    LOGOUT(state) {
      state.status = '';
      state.token = '';
      state.loggedInMember = null;
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
      state.currentCatalogItem = null;
      state.currentStore = null;
      state.currentOrder = null;
      state.currentStoreItems = null;
      state.currentStoreItem = null;
    },
    SET_ALL_MEMBERS(state, payload) {
      state.allMembers = payload;
    },
    CLEAR_MEMBERS(state) {
      state.allMembers = [];
    },
    SET_CURRENT_MEMBER(state, payload) {
      state.currentMember = payload;
    },
    SET_TEAMS(state, payload) {
      state.teams = payload;
    },
    CLEAR_TEAMS(state) {
      state.teams = [];
    },
    SET_CURRENT_TEAM(state, payload) {
      state.currentTeam = payload;
    },
    SET_TEAM_STORES(state, payload) {
      state.currentTeamStores = payload;
    },
    CLEAR_TEAM_STORES(state) {
      state.currentTeamStores = [];
    },
    SET_STORES(state, payload) {
      state.stores = payload;
    },
    CLEAR_STORES(state) {
      state.stores = [];
    },
    SET_CURRENT_STORE(state, payload) {
      state.currentStore = payload;
    },
    CLEAR_CATALOGS(state) {
      state.catalogs = [];
    },
    SET_CATALOGS(state, payload) {
      state.catalogs = payload;
    },
    SET_CURRENT_CATALOG(state, payload) {
      state.currentCatalog = payload;
    },
    CLEAR_CATALOG_ITEMS(state) {
      state.currentCatalogItems = [];
    },
    SET_CURRENT_CATALOG_ITEMS(state, payload) {
      state.currentCatalogItems = payload;
    },
    SET_CURRENT_CATALOG_ITEM(state, payload) {
      state.currentCatalogItem = payload;
    },
    CLEAR_STORE_ITEMS(state) {
      state.currentStoreItems = [];
    },
    SET_CURRENT_STORE_ITEMS(state, payload) {
      state.currentStoreItems = payload;
    },
    SET_CURRENT_STORE_ITEM(state, payload) {
      state.currentStoreItem = payload;
    },
    SET_NOTIFICATIONS(state, payload) {
      state.notifications = payload;
    },
    CLEAR_ALL_NOTIFICATIONS(state) {
      state.notifications = [];
    },
    SET_ORDERS(state, payload) {
      state.orders = payload;
    },
    CLEAR_ORDERS(state) {
      state.orders = [];
    }
  },
  getters: {
    isLoading: state => state.isLoading,
    dataReady: state => state.dataReady,
    notificationsReady: state => state.notificationsReady,
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    loggedInMember: state => state.loggedInMember,
    allMembers: state => state.allMembers,
    teams: state => state.teams,
    currentTeam: state => state.currentTeam,
    emails: state => state.emails,
    notifications: state => state.notifications,
    breadcrumbs: state => state.breadcrumbs,
    teamStores: state => state.currentTeamStores,
    getMember: state => state.currentMember,
    stores: state => state.stores,
    orders: state => state.orders,
    catalogs: state => state.catalogs,
    currentCatalog: state => state.currentCatalog,
    currentCatalogItems: state => state.currentCatalogItems,
    currentCatalogItem: state => state.currentCatalogItem,
    currentStore: state => state.currentStore,
    currentStoreItems: state => state.currentStoreItems,
    currentStoreItem: state => state.currentStoreItem
  }
});
