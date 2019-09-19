<template>
  <div>
    <div v-if="memberisAdmin" class="row">
      <div class="col-sm-12" v-if="unfinishedTeams.length>0">
        <div class="table-responsive">
          <h5 class="text-info">Reserved Team Names</h5>
          <table class="table table-hover table-striped">
            <tbody>
              <tr
                v-for="unfinished of unfinishedTeams"
                :key="unfinished._id"
                @click.prevent="loadTeam(unfinished._id)"
              >
                <th scope="row">{{ unfinished.teamId }}</th>
                <td>{{ unfinished.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-sm-12" v-else>
        <span>No Reserved Team Names</span>
      </div>
      <div class="col-sm-12 mt-4">
        <router-link to="/dashboard/teams/add" class="btn btn-info">
          <i class="fas fa-plus"></i> Reserve Team Name
        </router-link>
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="col-sm-12">
        <span
          v-if="currentTeams && currentTeams.length === 0 && member && member.isAdmin"
        >No Teams Found</span>
        <span
          v-else-if="currentTeams && currentTeams.length === 0"
        >No Teams Found - Contact your team manager to add you</span>
        <div class="table-responsive" v-else>
          <table
            class="table table-hover table-striped"
            v-if="currentTeams && currentTeams.length>0"
          >
            <tbody>
              <tr>
                <th scope="col">Team ID</th>
                <th scope="col">Name</th>
                <th scope="col">Admin</th>
                <th scope="col">Manager</th>
                <th scope="col">Members</th>
              </tr>
              <tr v-for="team of currentTeams" :key="team._id" @click.prevent="loadTeam(team._id)">
                <td scope="row">{{ team.teamId }}</td>
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

export default {
  name: 'TeamsIndex',
  components: {
    Paginate
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 12,
      breadcrumbs: [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Teams',
          link: '#'
        }
      ]
    };
  },
  created: async function() {
    try {
      await this.$store.dispatch('getTeams');
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    },
    teams: function() {
      return this.$store.getters.teams;
    },
    unfinishedTeams: function() {
      return this.$store.getters.unfinishedTeams;
    },
    indexOfLastItem: function() {
      return this.currentPage * this.itemsPerPage;
    },
    indexOfFirstItem: function() {
      return this.indexOfLastItem - this.itemsPerPage;
    },
    currentTeams: function() {
      return this.teams.slice(this.indexOfFirstItem, this.indexOfLastItem);
    },
    pageNumbers: function() {
      const pageArray = [];
      for (let i = 1; i <= Math.ceil(this.teams.length / this.itemsPerPage); i++) {
        pageArray.push(i);
      }
      return pageArray.length;
    },
    memberisAdmin: function() {
      if (this.member) return this.member.isAdmin ? true : false;
    }
  },
  methods: {
    loadTeam: function(id) {
      this.$router.push({ name: 'teamsById', params: { id } }).catch(() => {});
    }
  }
};
</script>
