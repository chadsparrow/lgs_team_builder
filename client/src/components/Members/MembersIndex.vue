<template>
  <div v-if="dataReady" class="page">
    <div class="header">
      <div class="form-group form-inline m-0">
        <label for="memberSearch" class="mr-2">Search:</label>
        <input
          type="text"
          id="memberSearch"
          v-if="members.length > 0"
          class="form-control form-control-sm mr-3"
          v-model="memberSearchText"
          placeholder="Enter name or email to find a member..."
          autofocus
        />
        <small class="text-muted">Showing: {{ filteredCount }}/{{ members.length }}</small>
      </div>
      <div>
        <router-link to="/dashboard/members/add" class="btn btn-sm btn-info">
          <i class="fas fa-plus mr-2"></i>Add Member
        </router-link>
      </div>
    </div>
    <div class="member-list">
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
      this.$store.dispatch('setDataReadyTrue');
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      this.$store.dispatch('setDataReadyTrue');
    }
  },
  beforeDestroy: function() {
    this.$store.dispatch('setDataReadyFalse');
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
    filteredCount: function() {
      return this.filteredMembers.length;
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
    },
    dataReady: function() {
      return this.$store.getters.dataReady;
    }
  },
  methods: {
    loadMember: function(id) {
      this.$router.push({ name: 'membersById', params: { id } }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 40px auto;
  grid-gap: 1rem;
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
    background-color: whitesmoke;
    border-radius: 5px;
    padding: 1.5rem 0.5rem;

    .form-control {
      width: 500px;
    }
  }

  .member-list {
    grid-area: member-list;
  }
}
</style>
