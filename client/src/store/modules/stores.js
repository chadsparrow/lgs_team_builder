import axios from 'axios';

export default {
  state: {
    stores: [],
    currentStore: {},
    currentStoreItems: [],
    currentStoreItem: {}
  },
  actions: {
    getStores({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('CLEAR_STORES');
          const res = await axios.get('/api/v1/stores');
          commit('SET_STORES', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getStore({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get(`/api/v1/stores/${id}`);
          commit('SET_CURRENT_STORE', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    updateStore(context, { id, updatedStore }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.put(`/api/v1/stores/${id}`, updatedStore);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getStoreItems({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('CLEAR_STORE_ITEMS');
          const res = await axios.get(`/api/v1/stores/${id}/items`);
          commit('SET_CURRENT_STORE_ITEMS', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    updateStoreItems({ commit }, { id, items }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('CLEAR_STORE_ITEMS');
          const res = await axios.put(`/api/v1/stores/${id}/items`, { items });
          commit('SET_CURRENT_STORE_ITEMS', res.data[0].items);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    updateStoreCharges({ commit }, { id, extraCharges }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.put(`/api/v1/stores/${id}/extras`, { extraCharges });
          commit('SET_CURRENT_STORE', res.data[0].store);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    removeLike(context, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.put(`/api/v1/storeitems/${id}/removelike`);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    addLike(context, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.put(`/api/v1/storeitems/${id}/addlike`);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    }
  },
  mutations: {
    SET_STORES(state, payload) {
      state.stores = payload;
    },
    CLEAR_STORES(state) {
      state.stores = [];
    },
    SET_CURRENT_STORE(state, payload) {
      state.currentStore = payload;
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
    SET_CURRENT_STORE_ITEM_PRICE(state, payload) {
      state.currentStoreItem.price = payload;
    },
    REMOVE_STORE_ITEM(state, payload) {
      state.currentStoreItems = state.currentStoreItems.filter(item => item._id !== payload);
    }
  },
  getters: {
    stores: state => state.stores,
    currentStore: state => state.currentStore,
    currentStoreItems: state => state.currentStoreItems,
    currentStoreItem: state => state.currentStoreItem
  }
};
