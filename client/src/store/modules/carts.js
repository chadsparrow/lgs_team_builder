import axios from 'axios';
export default {
  state: {
    showCart: false,
    currentCart: {}
  },
  actions: {
    getMemberStoreCart({ commit }, storeId) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('CLEAR_CURRENT_CART');
          const res = await axios.get(`/api/v1/carts/${storeId}`);
          commit('SET_CURRENT_CART', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    addItemToCart({ commit }, { storeId, item }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post(`/api/v1/carts/${storeId}`, item);
          commit('SET_CURRENT_CART', res.data[0].updatedCart);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    removeCartItem({ commit }, { id, itemId }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('CLEAR_CURRENT_CART');
          const res = await axios.delete(`/api/v1/carts/${id}?itemId=${itemId}`);
          commit('SET_CURRENT_CART', res.data[0].updatedCart);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    updateCart({ commit }, { id, items }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('CLEAR_CURRENT_CART');
          const res = await axios.put(`/api/v1/carts/${id}`, { items });
          commit('SET_CURRENT_CART', res.data[0].updatedCart);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    removeStoreItemFromCart(context, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.delete(`/api/v1/carts/removeitems/${id}`);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    }
  },
  mutations: {
    SHOW_CART(state) {
      state.showCart = true;
    },
    HIDE_CART(state) {
      state.showCart = false;
    },
    CLEAR_CURRENT_CART(state) {
      state.currentCart = null;
    },
    SET_CURRENT_CART(state, payload) {
      state.currentCart = payload;
    }
  },
  getters: {
    showCart: state => state.showCart,
    currentCart: state => state.currentCart
  }
};
