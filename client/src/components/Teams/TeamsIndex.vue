<template>
  <div v-if="!isLoading" class="page">
    <div class="header">
      <div class="form-group has-search">
        <span class="fa fa-search form-control-feedback"></span>
        <input
          type="text"
          id="teamSearch"
          v-if="teams.length > 0"
          class="form-control form-control-sm"
          v-model="teamSearchText"
          placeholder="Search..."
          autofocus
        />
      </div>
      <div v-if="member && member.isAdmin">
        <router-link to="/dashboard/teams/add" class="btn btn-sm btn-info">
          <i class="fas fa-plus mr-2"></i>Add Team
        </router-link>
      </div>
    </div>

    <div class="row team-list">
      <div class="col-sm-12">
        <span v-if="currentTeams.length === 0 && member && member.isAdmin">No Teams Found</span>
        <span v-else-if="currentTeams.length === 0"
          >No Teams Found - Contact your team manager to add you</span
        >
        <div class="table-responsive" v-else>
          <table class="table table-hover table-striped" v-if="currentTeams.length > 0">
            <tbody>
              <tr>
                <th scope="col" v-if="member && member.isAdmin">Account #</th>
                <th scope="col">Name</th>
                <th scope="col">Admin</th>
                <th scope="col">Manager</th>
                <th scope="col">Members</th>
              </tr>
              <tr v-for="team of currentTeams" :key="team._id" @click.prevent="loadTeam(team._id)">
                <td scope="row" v-if="member && member.isAdmin">{{ team.teamId }}</td>
                <td>{{ team.name }}</td>
                <td>{{ team.adminId.name }}</td>
                <td>
                  <i
                    class="fas fa-certificate text-warning mr-1"
                    v-if="member && team.managerId._id === member._id"
                  ></i>
                  {{ team.managerId.name }}
                </td>
                <td>{{ team.members.length }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <paginate
          v-model="currentPage"
          :page-count="pageNumbers"
          :container-class="'pagination pagination-sm'"
          :page-class="'page-item'"
          :page-link-class="'page-link'"
          :prev-class="'page-item'"
          :prev-link-class="'page-link'"
          :next-class="'page-item'"
          :next-link-class="'page-link'"
          :hide-prev-next="true"
          v-if="pageNumbers > 1"
        ></paginate>
      </div>
    </div>
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate';
import { mapGetters } from 'vuex';

export default {
  name: 'TeamsIndex',
  components: {
    Paginate
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 12,
      teamSearchText: ''
    };
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Teams',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getTeams');
      await this.$store.commit('CLEAR_CURRENTS');
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  computed: {
    ...mapGetters(['isLoading', 'loggedInMember', 'teams']),
    member: function() {
      return this.loggedInMember;
    },
    filteredTeams: function() {
      return this.teams.filter(team => {
        if (
          team.name.toLowerCase().includes(this.teamSearchText.toLowerCase()) ||
          team.teamId.toLowerCase().includes(this.teamSearchText.toLowerCase()) ||
          team.adminId.name.toLowerCase().includes(this.teamSearchText.toLowerCase()) ||
          team.managerId.name.toLowerCase().includes(this.teamSearchText.toLowerCase())
        ) {
          return team;
        }
      });
    },
    filteredCount: function() {
      return this.filteredTeams.length;
    },
    indexOfLastItem: function() {
      return this.currentPage * this.itemsPerPage;
    },
    indexOfFirstItem: function() {
      return this.indexOfLastItem - this.itemsPerPage;
    },
    currentTeams: function() {
      return this.filteredTeams.slice(this.indexOfFirstItem, this.indexOfLastItem);
    },
    pageNumbers: function() {
      const pageArray = [];
      for (let i = 1; i <= Math.ceil(this.filteredTeams.length / this.itemsPerPage); i++) {
        pageArray.push(i);
      }
      return pageArray.length;
    }
  },
  methods: {
    loadTeam: function(id) {
      this.$router.push({ name: 'teamsById', params: { id } }).catch(() => {});
    },
    editTeam: function(id) {
      this.$router.push({ name: 'teamsByIdEdit', params: { id } }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: max-content auto;
  grid-gap: 0.5rem;
  width: 100%;
  height: 100%;
  grid-template-areas:
    'header'
    'member-list';

  .header {
    grid-area: header;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .has-search .form-control {
      padding-left: 2rem;
      max-width: 250px;
    }

    .has-search .form-control-feedback {
      position: absolute;
      z-index: 2;
      display: block;
      width: 2rem;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      pointer-events: none;
      color: #aaa;
    }
  }

  .member-list {
    grid-area: member-list;
  }
}
</style>
