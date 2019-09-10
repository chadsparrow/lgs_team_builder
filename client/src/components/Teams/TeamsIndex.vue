<template>
  <div>
    <div class="table-responsive" v-if="unfinishedTeams && unfinishedTeams.length >0">
      <h5 class="text-info">Reserved Team Names</h5>
      <table class="table table-hover table-striped">
        <tbody>
          <tr
            v-for="unfinished of unfinishedTeams"
            :key="unfinished._id"
            @click.prevent="loadTeam(unfinished._id)"
          >
            <th>{{ unfinished.name }}</th>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="member && member.isAdmin">
      <router-link to="/dashboard/teams/add" class="btn btn-info">
        <i class="fas fa-plus"></i> Reserve Team Name
      </router-link>
      <br />
      <br />
    </div>
    <span v-if="currentTeams && currentTeams.length === 0">No Teams Found</span>
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr>
            <th>Name</th>
            <th>Admin</th>
            <th>Contact</th>
            <th>Members</th>
          </tr>
          <tr v-for="team of currentTeams" :key="team._id" @click.prevent="loadTeam(team._id)">
            <th scope="row">{{ team.name }}</th>
            <td>{{ team.adminId }}</td>
            <td>{{ team.mainContact.name }}</td>
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
      ],
      teams: [],
      unfinishedTeams: []
    };
  },
  created: async function() {
    try {
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
      const res = await this.$store.dispatch('getTeams');
      this.teams = res.data.teams;
      this.unfinishedTeams = res.data.unfinishedTeams;
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
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
    }
  },
  methods: {
    loadTeam: function(id) {
      this.$router.push({ name: 'teamsById', params: { id } }).catch(() => {});
    }
  }
};
</script>