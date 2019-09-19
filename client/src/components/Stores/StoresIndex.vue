<template>
  <div>
    <div v-if="member && member.isAdmin">
      <router-link to="/dashboard/stores/add" class="btn btn-info">
        <i class="fas fa-plus" style="vertical-align: middle;"></i> Add Store
      </router-link>
      <br />
      <br />
    </div>
    <span class="text-center" v-if="currentStores && currentStores.length === 0">No Stores Found</span>
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr>
            <th>Team ID</th>
            <th>Store Name</th>
            <th>Brand</th>
            <th>Admin ID</th>
            <th>Manager ID</th>
            <th>Mode</th>
            <th>Total Orders</th>
          </tr>
          <tr v-for="store of currentStores" :key="store._id" @click.prevent="loadStore(store._id)">
            <th scope="row">{{ store.teamId }}</th>
            <td>{{ store.storeName }}</td>
            <td>{{ store.brand }}</td>
            <td>{{ store.adminId }}</td>
            <td>{{ store.managerId }}</td>
            <td>{{ store.mode }}</td>
            <td>{{ store.totalOrders }}</td>
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
  name: 'StoreIndex',
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
          text: 'Stores',
          link: '#'
        }
      ],
      stores: []
    };
  },
  created: async function() {
    try {
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
      const stores = await this.$store.dispatch('getStores');
      this.stores = stores.data;
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
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
    currentStores: function() {
      return this.stores.slice(this.indexOfFirstItem, this.indexOfLastItem);
    },
    pageNumbers: function() {
      const pageArray = [];
      for (let i = 1; i <= Math.ceil(this.stores.length / this.itemsPerPage); i++) {
        pageArray.push(i);
      }
      return pageArray.length;
    }
  },
  methods: {
    loadStore: function(id) {
      this.$router.push({ name: 'storeById', params: { id } }).catch(() => {});
    }
  }
};
</script>
