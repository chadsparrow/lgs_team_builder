import axios from 'axios';
export default {
  state: {
    teams: [],
    currentTeam: {}
  },
  actions: {
    getTeams({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('CLEAR_TEAMS');
          const res = await axios.get('/api/v1/teams');
          commit('SET_TEAMS', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getTeam({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get(`/api/v1/teams/${id}`);
          commit('SET_CURRENT_TEAM', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getTeamForRegister({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get(`/api/v1/teams/${id}/register`);
          commit('SET_CURRENT_TEAM', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    addTeam(context, newTeam) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/teams', newTeam);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    updateTeam(context, { updatedTeam, id }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.put(`/api/v1/teams/${id}`, updatedTeam);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    addTeamMember(context, { newTeamMember, id }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post(`/api/v1/teams/${id}/addmember`, newTeamMember);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    removeTeamMembers(context, { chosenMembers, id }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post(`/api/v1/teams/${id}/removemembers`, {
            members: chosenMembers
          });
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getTeamStores({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('CLEAR_TEAM_STORES');
          const res = await axios.get(`/api/v1/stores/team/${id}`);
          commit('SET_TEAM_STORES', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    addTeamStore(context, newStore) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/stores/', newStore);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    duplicateTeamStore(context, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post(`/api/v1/stores/${id}/dup`);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    }
  },
  mutations: {
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
    }
  },
  getters: {
    teams: state => state.teams,
    currentTeam: state => state.currentTeam,
    teamStores: state => state.currentTeamStores
  }
};
