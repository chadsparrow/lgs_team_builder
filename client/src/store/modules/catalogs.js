import axios from 'axios';
export default {
  state: {
    catalogs: [],
    currentCatalog: {},
    currentCatalogItems: [],
    currentCatalogItem: {}
  },
  actions: {
    getCatalogs({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('CLEAR_CATALOGS');
          const res = await axios.get('/api/v1/catalogs');
          commit('SET_CATALOGS', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getCatalogsQuery({ commit }, brand) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('CLEAR_CATALOGS');
          const res = await axios.get(`/api/v1/catalogs?brand=${brand}`);
          commit('SET_CATALOGS', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getCatalog({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get(`/api/v1/catalogs/${id}`);
          commit('SET_CURRENT_CATALOG', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    addCatalog(context, catalog) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post(`/api/v1/catalogs`, catalog);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    editCatalog(context, { id, catalog }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.put(`/api/v1/catalogs/${id}`, catalog);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getCatalogItems({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('CLEAR_CATALOG_ITEMS');
          const res = await axios.get(`/api/v1/catalogitems/catalog/${id}`);
          commit('SET_CURRENT_CATALOG_ITEMS', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    addCatalogItem(context, catalogItem) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post(`/api/v1/catalogitems/`, catalogItem);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getCatalogItem({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get(`/api/v1/catalogitems/${id}`);
          commit('SET_CURRENT_CATALOG_ITEM', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    updateCatalogItem(context, { id, updatedCatalogItem }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.put(`/api/v1/catalogitems/${id}`, updatedCatalogItem);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    }
  },
  mutations: {
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
    }
  },
  getters: {
    catalogs: state => state.catalogs,
    currentCatalog: state => state.currentCatalog,
    currentCatalogItems: state => state.currentCatalogItems,
    currentCatalogItem: state => state.currentCatalogItem
  }
};
