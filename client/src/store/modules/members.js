import axios from 'axios';
export default {
  state: {
    allMembers: [],
    currentMember: {}
  },
  actions: {
    getMember(context, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get(`/api/v1/members/${id}`);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getMembers({ commit }) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('CLEAR_MEMBERS');
          const res = await axios.get('/api/v1/members');
          commit('SET_ALL_MEMBERS', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getMemberDetails({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get(`/api/v1/members/${id}/details`);
          commit('SET_CURRENT_MEMBER', res.data);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getMemberTeams(context, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get(`/api/v1/members/${id}/teams`);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    addMember(context, member) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.post('/api/v1/members/register', member);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    deleteMember(context, id) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.delete(`/api/v1/members/${id}`);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    updateMember(context, { updatedMember, id }) {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.put(`/api/v1/members/${id}`, updatedMember);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    },
    getAdmins() {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get('/api/v1/members/admins');
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    }
  },
  mutations: {
    SET_ALL_MEMBERS(state, payload) {
      state.allMembers = payload;
    },
    CLEAR_MEMBERS(state) {
      state.allMembers = [];
    },
    SET_CURRENT_MEMBER(state, payload) {
      state.currentMember = payload;
    }
  },
  getters: {
    allMembers: state => state.allMembers,
    getMember: state => state.currentMember
  }
};
