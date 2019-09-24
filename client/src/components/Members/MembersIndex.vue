<template>
  <div>
    <router-link to="/dashboard/members/add" class="btn btn-info">
      <i class="fas fa-plus" style="vertical-align: middle;"></i> Add Member
    </router-link>
    <br />
    <br />
    <span v-if="members && members.length === 0">No Members Found</span>
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr v-for="member of members" :key="member._id" @click.prevent="loadMember(member._id)">
            <td>{{ member.name }}</td>
            <td>{{ member.email }}</td>
            <td>
              <span>{{ member.isAdmin ? 'Admin' : 'Member' }}</span>
            </td>
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
  name: 'MembersIndex',
  components: {
    Paginate
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 12
    };
  },
  created: async function() {
    try {
      await this.$store.dispatch('getMembers');
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Members',
          link: '#'
        }
      ];
      await this.$store.commit('CLEAR_CURRENTS');
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  computed: {
    members: function() {
      return this.$store.getters.allMembers;
    },
    indexOfLastItem: function() {
      return this.currentPage * this.itemsPerPage;
    },
    indexOfFirstItem: function() {
      return this.indexOfLastItem - this.itemsPerPage;
    },
    currentCatalogs: function() {
      if (this.members) return this.members.slice(this.indexOfFirstItem, this.indexOfLastItem);
    },
    pageNumbers: function() {
      const pageArray = [];
      if (this.members) {
        for (let i = 1; i <= Math.ceil(this.members.length / this.itemsPerPage); i++) {
          pageArray.push(i);
        }
      }
      return pageArray.length;
    }
  },
  methods: {
    loadMember: function(id) {
      this.$router.push({ name: 'membersById', params: { id } }).catch(() => {});
    }
  }
};
</script>
