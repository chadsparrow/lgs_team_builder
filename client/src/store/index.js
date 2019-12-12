import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import members from './modules/members';
import catalogs from './modules/catalogs';
import teams from './modules/teams';
import stores from './modules/stores';
import carts from './modules/carts';
import orders from './modules/orders';
import { getUserLocales } from 'get-user-locale';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    members,
    catalogs,
    teams,
    stores,
    carts,
    orders
  },
  state: {
    isLoading: false,
    breadcrumbs: [],
    userLocales: getUserLocales()
  },
  actions: {
    setBreadcrumbs({ commit }, breadcrumbs) {
      return new Promise((resolve, reject) => {
        try {
          commit('SET_BREADCRUMBS', breadcrumbs);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    }
  },
  mutations: {
    LOADING_TRUE(state) {
      state.isLoading = true;
    },
    LOADING_FALSE(state) {
      state.isLoading = false;
    },
    SET_BREADCRUMBS(state, breadcrumbs) {
      state.breadcrumbs = breadcrumbs;
    }
  },
  getters: {
    isLoading: state => state.isLoading,
    breadcrumbs: state => state.breadcrumbs,
    userLocales: state => state.userLocales
  }
});
