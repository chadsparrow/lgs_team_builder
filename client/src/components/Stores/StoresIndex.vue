<template>
  <div>
    <span class="text-center" v-if="currentStores && currentStores.length === 0"
      >No Stores Found</span
    >
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr>
            <th scope="col">Team Name</th>
            <th scope="col">Store Name</th>
            <th scope="col">Admin</th>
            <th scope="col">Manager</th>
            <th scope="col">Mode</th>
            <th scope="col">Total Orders</th>
          </tr>
          <tr v-for="store of currentStores" :key="store._id" @click.prevent="loadStore(store._id)">
            <td scope="row">{{ store.teamId.name }}</td>
            <td>{{ store.storeName }}</td>
            <td>{{ store.adminId.name }}</td>
            <td>{{ store.managerId.name }}</td>
            <td
              class="[store.mode === 'OPEN' ? 'bg-success' : store.mode === 'CLOSED' ? 'bg-danger' : '']"
            >
              {{ store.mode }}
            </td>
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
      itemsPerPage: 12
    };
  },
  created: async function() {
    try {
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Stores',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getStores');
      await this.$store.commit('CLEAR_CURRENTS');
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
    },
    stores: function() {
      return this.$store.getters.stores;
    },
    modeColor: function(store) {
      let bgColor = '';
      switch (store.mode) {
        case 'HOLD':
          bgColor = '#FF8C00';
          break;
        case 'OPEN':
          bgColor = '#9ACD32';
          break;
        case 'CLOSED':
          bgColor = '#B22222';
      }

      return bgColor;
    }
  },
  methods: {
    loadStore: function(id) {
      this.$router.push({ name: 'storesById', params: { id } }).catch(() => {});
    }
  }
};
</script>
