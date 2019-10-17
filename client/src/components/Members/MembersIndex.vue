<template>
  <div v-if="dataReady">
    <div class="row mb-3">
      <div class="col-sm-12">
        <router-link to="/dashboard/members/add" class="btn btn-info">
          <i class="fas fa-plus mr-2"></i> Add Member
        </router-link>
      </div>
      <div class="col-sm-4 mt-3">
        <input
          type="text"
          id="memberSearch"
          v-if="members.length > 0"
          class="form-control form-control-sm"
          v-model="memberSearchText"
          placeholder="Enter name or email to find a member..."
          autofocus
        />
      </div>
    </div>
    <span v-if="members.length === 0">No Members Found</span>
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr
            v-for="member of currentMembers"
            :key="member._id"
            @click.prevent="loadMember(member._id)"
          >
            <td>
              <Gravatar :email="member.email" default-img="mp" :size="24" />
            </td>
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
import Gravatar from 'vue-gravatar';

export default {
  name: 'MembersIndex',
  components: {
    Paginate,
    Gravatar
  },
  data() {
    return {
      dataReady: false,
      currentPage: 1,
      itemsPerPage: 12,
      memberSearchText: ''
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
      this.dataReady = true;
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  computed: {
    filteredMembers: function() {
      return this.members.filter(member => {
        if (
          member.name.toLowerCase().includes(this.memberSearchText.toLowerCase()) ||
          member.email.toLowerCase().includes(this.memberSearchText.toLowerCase())
        ) {
          return member;
        }
      });
    },
    members: function() {
      return this.$store.getters.allMembers;
    },
    indexOfLastItem: function() {
      return this.currentPage * this.itemsPerPage;
    },
    indexOfFirstItem: function() {
      return this.indexOfLastItem - this.itemsPerPage;
    },
    currentMembers: function() {
      if (this.filteredMembers)
        return this.filteredMembers.slice(this.indexOfFirstItem, this.indexOfLastItem);
    },
    pageNumbers: function() {
      const pageArray = [];
      if (this.members) {
        for (let i = 1; i <= Math.ceil(this.filteredMembers.length / this.itemsPerPage); i++) {
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
