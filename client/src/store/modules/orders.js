import Vue from 'vue';
export default {
  state: {
    orders: [],
    currentOrder: {},
  },
  actions: {
    getOrders({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('CLEAR_ORDERS');
          const res = await Vue.axios.get('/api/v1/orders');
          commit('SET_ORDERS');
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
  },
  mutations: {
    SET_ORDERS(state, payload) {
      state.orders = payload;
    },
    CLEAR_ORDERS(state) {
      state.orders = [];
    },
  },
  getters: {
    orders: (state) => state.orders,
  },
};
