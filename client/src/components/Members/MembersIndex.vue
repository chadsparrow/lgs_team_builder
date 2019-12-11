<template>
  <div v-if="!isLoading" class="page">
    <div class="header">
      <div class="form-group has-search">
        <span class="fa fa-search form-control-feedback"></span>
        <input
          type="text"
          id="memberSearch"
          v-if="allMembers.length > 0"
          class="form-control form-control-sm"
          v-model="memberSearchText"
          placeholder="Search..."
          autofocus
        />
      </div>
      <div>
        <router-link to="/dashboard/members/add" class="btn btn-sm btn-info">
          <i class="fas fa-plus mr-2"></i>Add Member
        </router-link>
      </div>
    </div>
    <div class="member-list">
      <span v-if="allMembers.length === 0">No Members Found</span>
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
import { mapGetters } from 'vuex';

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
    this.$store.commit('LOADING_TRUE');
    try {
      await this.$store.dispatch('getMembers');
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Members',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  computed: {
    ...mapGetters(['allMembers', 'isLoading']),
    filteredMembers: function() {
      return this.allMembers.filter(member => {
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
      if (this.allMembers) {
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

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: max-content 1fr;
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
    padding: 0.25rem;

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
