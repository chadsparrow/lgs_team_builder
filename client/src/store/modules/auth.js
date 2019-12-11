import axios from 'axios';
export default {
  state: {
    notificationsReady: false,
    status: '',
    token: localStorage.getItem('token') || '',
    loggedInMember: {},
    emails: [],
    notifications: [],
    menu: []
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
          commit('SET_MENU', member.isAdmin);
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
    register(context, member) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/auth/register', member);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    joinTeam(context, { member, teamId }) {
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
        try {
          commit('LOGOUT');
          localStorage.removeItem('token');
          localStorage.removeItem('member');
          commit('CLEAR_CURRENTS');
          commit('CLEAR_TEAMS');
          commit('CLEAR_STORES');
          commit('CLEAR_ORDERS');
          commit('CLEAR_ALL_NOTIFICATIONS');
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    },
    changePassword(context, { updatedPassword, id }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.patch(`/api/v1/members/password/${id}`, updatedPassword);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    updateEmail(context, { updatedEmail, id }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.patch(`/api/v1/members/email/${id}`, updatedEmail);
          resolve(res);
        } catch (err) {
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
    removeNotification(context, { nId }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.delete(`/api/v1/notifications/${nId}`);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    setNotificationsReadyTrue({ commit }) {
      commit('SET_NOTIFICATIONS_READY_TRUE');
    },
    setNotificationsReadyFalse({ commit }) {
      commit('SET_NOTIFICATIONS_READY_FALSE');
    }
  },
  mutations: {
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
      state.loggedInMember = { isAdmin: null };
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
      state.currentCart = null;
    },
    SET_NOTIFICATIONS(state, payload) {
      state.notifications = payload;
    },
    CLEAR_ALL_NOTIFICATIONS(state) {
      state.notifications = [];
    },
    SET_NOTIFICATIONS_READY_TRUE(state) {
      state.notificationsReady = true;
    },
    SET_NOTIFICATIONS_READY_FALSE(state) {
      state.notificationsReady = false;
    },
    SET_MENU(state, isAdmin) {
      if (isAdmin) {
        state.menu = [
          {
            href: { path: '/dashboard/members' },
            title: 'Members',
            icon: 'fas fa-user'
          },
          {
            href: { path: '/dashboard/teams' },
            title: 'Teams',
            icon: 'fas fa-users'
          },
          {
            href: { path: '/dashboard/stores' },
            title: 'Stores',
            icon: 'fas fa-store'
          },
          {
            href: { path: '/dashboard/orders' },
            title: 'Orders',
            icon: 'fas fa-receipt'
          },
          {
            href: { path: '/dashboard/catalogs' },
            title: 'Catalogs',
            icon: 'fas fa-book'
          },
          {
            header: true,
            title: 'Account',
            hiddenOnCollapse: true,
            class: 'text-center'
          },
          {
            href: { path: '/dashboard/profile' },
            title: 'Profile',
            icon: 'fas fa-id-card'
          }
        ];
      } else {
        state.menu = [
          {
            href: { path: '/dashboard/teams' },
            title: 'My Teams',
            icon: 'fas fa-users'
          },
          {
            href: { path: '/dashboard/stores' },
            title: 'My Stores',
            icon: 'fas fa-store'
          },
          {
            href: { path: '/dashboard/orders' },
            title: 'My Orders',
            icon: 'fas fa-receipt'
          },
          {
            header: true,
            title: 'Account',
            hiddenOnCollapse: true,
            class: 'text-center'
          },
          {
            href: { path: '/dashboard/profile' },
            title: 'Profile',
            icon: 'fas fa-id-card'
          }
        ];
      }
    }
  },
  getters: {
    notificationsReady: state => state.notificationsReady,
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    loggedInMember: state => state.loggedInMember,
    emails: state => state.emails,
    notifications: state => state.notifications,
    menu: state => state.menu
  }
};
