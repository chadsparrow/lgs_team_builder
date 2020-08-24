import Vue from 'vue';
import i18n from '../../i18n';
import router from '../../router';
import VueCookies from 'vue-cookies';
Vue.use(VueCookies);

export default {
  state: {
    notificationsReady: false,
    status: '',
    loggedInMember: Vue.$cookies.get('tb_member') || false,
    emails: [],
    notifications: [],
    menu: [],
  },
  actions: {
    login: ({ commit }, loginCreds) => {
      return new Promise(async (resolve, reject) => {
        try {
          commit('AUTH_REQUEST');
          const res = await Vue.axios.post('/api/v1/auth/login', loginCreds);
          const emails = res.data[0].emails;
          const member = $cookies.get('tb_member');
          commit('AUTH_SUCCESS', { member, emails });
          resolve(res);
        } catch (err) {
          commit('AUTH_ERROR');
          reject(err);
        }
      });
    },
    logout: ({ commit }, { id }) => {
      return new Promise(async (resolve, reject) => {
        try {
          await Vue.axios.get(`/api/v1/auth/logout/${id}`);
          commit('LOGOUT');
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
    register(context, member) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await Vue.axios.post('/api/v1/auth/register', member);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    joinTeam(context, { member, teamId }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await Vue.axios.post(`/api/v1/auth/register/${teamId}`, {
            member,
          });
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    changePassword(context, { updatedPassword, id }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await Vue.axios.patch(
            `/api/v1/members/password/${id}`,
            updatedPassword
          );
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    updateEmail(context, { updatedEmail, id }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await Vue.axios.patch(
            `/api/v1/members/email/${id}`,
            updatedEmail
          );
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getMe({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await Vue.axios.get(`/api/v1/members/${id}/me`);
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
          const res = await Vue.axios.delete(`/api/v1/notifications/${nId}`);
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
    },
  },
  mutations: {
    AUTH_REQUEST(state) {
      state.status = 'loading';
    },
    AUTH_SUCCESS(state, { member, emails }) {
      state.status = 'success';
      state.loggedInMember = member;
      state.emails = emails;
    },
    AUTH_ERROR(state) {
      state.status = 'error';
    },
    LOGOUT(state) {
      state.status = '';
      state.loggedInMember = false;
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
            href: { path: '/dashboard/index' },
            title: i18n.t('menu.dashboard'),
            icon: 'fas fa-columns',
          },
          {
            href: { path: '/dashboard/members' },
            title: i18n.t('menu.adminOnly.members'),
            icon: 'fas fa-user',
          },
          {
            href: { path: '/dashboard/teams' },
            title: i18n.t('menu.adminOnly.teams'),
            icon: 'fas fa-users',
          },
          {
            href: { path: '/dashboard/stores' },
            title: i18n.t('menu.adminOnly.stores'),
            icon: 'fas fa-store',
          },
          {
            href: { path: '/dashboard/orders' },
            title: i18n.t('menu.adminOnly.orders'),
            icon: 'fas fa-receipt',
          },
          {
            href: { path: '/dashboard/catalogs' },
            title: i18n.t('menu.adminOnly.catalogs'),
            icon: 'fas fa-book',
          },
          {
            header: true,
            title: i18n.t('menu.accountHeader'),
            hiddenOnCollapse: true,
            class: 'text-center',
          },
          {
            href: { path: '/dashboard/profile' },
            title: i18n.t('menu.profile'),
            icon: 'fas fa-id-card',
          },
        ];
      } else {
        state.menu = [
          {
            href: { path: '/dashboard/index' },
            title: i18n.t('menu.dashboard'),
            icon: 'fas fa-columns',
          },
          {
            href: { path: '/dashboard/teams' },
            title: i18n.t('menu.regular.teams'),
            icon: 'fas fa-users',
          },
          {
            href: { path: '/dashboard/stores' },
            title: i18n.t('menu.regular.stores'),
            icon: 'fas fa-store',
          },
          {
            href: { path: '/dashboard/orders' },
            title: i18n.t('menu.regular.orders'),
            icon: 'fas fa-receipt',
          },
          {
            header: true,
            title: i18n.t('menu.accountHeader'),
            hiddenOnCollapse: true,
            class: 'text-center',
          },
          {
            href: { path: '/dashboard/profile' },
            title: i18n.t('menu.profile'),
            icon: 'fas fa-id-card',
          },
        ];
      }
    },
  },
  getters: {
    notificationsReady: (state) => state.notificationsReady,
    isLoggedIn: (state) => !!state.loggedInMember,
    authStatus: (state) => state.status,
    loggedInMember: (state) => state.loggedInMember,
    emails: (state) => state.emails,
    notifications: (state) => state.notifications,
    menu: (state) => state.menu,
  },
};
