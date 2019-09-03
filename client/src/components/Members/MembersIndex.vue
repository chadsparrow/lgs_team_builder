<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link class="btn btn-sm" tag="a" to="/dashboard/members">Members</router-link>
        </li>
        <router-link to="/dashboard/members/add" class="btn btn-sm btn-dark ml-auto">
          <i class="fas fa-plus" style="vertical-align: middle;"></i>
        </router-link>
      </ol>
    </nav>

    <span v-if="members && members.length === 0">No Members Found</span>
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr v-for="member of members" :key="member._id" @click.prevent="loadMember(member._id)">
            <th scope="row">{{ member.name }}</th>
            <td>{{ member.email }}</td>
            <td>
              <span v-if="member.isAdmin">Admin</span>
              <span v-else>User</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <paginate
      v-model="currentPage"
      :page-count="pageNumbers"
      :container-class="'pagination'"
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
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import Paginate from 'vuejs-paginate';

export default {
  components: {
    Paginate
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 15
    };
  },
  created: async function() {
    try {
      await this.$store.dispatch('getMembers');
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  computed: {
    members: function() {
      return this.$store.getters.members;
    },
    indexOfLastItem: function() {
      return this.currentPage * this.itemsPerPage;
    },
    indexOfFirstItem: function() {
      return this.indexOfLastItem - this.itemsPerPage;
    },
    currentCatalogs: function() {
      return this.members.slice(this.indexOfFirstItem, this.indexOfLastItem);
    },
    pageNumbers: function() {
      const pageArray = [];
      for (let i = 1; i <= Math.ceil(this.members.length / this.itemsPerPage); i++) {
        pageArray.push(i);
      }
      return pageArray.length;
    }
  },
  methods: {
    loadMember: function(id) {
      this.$router.push({ name: 'memberid', params: { id } }).catch(() => {});
    }
  }
};
</script>
