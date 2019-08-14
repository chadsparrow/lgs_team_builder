import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: localStorage.getItem('access_token') || '',
    currentUser: {}
  },
  mutations: {},
  actions: {
    login: async ({ email, password }) => {
      const res = await Axios.post('http://localhost:8080/api/v1/auth/login', { email, password });
      const data = await res.data;
      console.log(data);
    }
  }
});
