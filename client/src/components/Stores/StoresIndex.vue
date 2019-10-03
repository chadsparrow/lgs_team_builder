<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-4">
        <input
          type="text"
          id="storesSearchText"
          v-if="stores && stores.length > 0"
          class="form-control form-control-sm mb-3"
          v-model="storesSearchText"
          placeholder="Enter any text to filter the stores list..."
          autofocus
        />
      </div>
    </div>

    <span class="text-center" v-if="currentStores && currentStores.length === 0">No Stores Found</span>
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr>
            <th scope="col">Store Name</th>
            <th scope="col">Team Name</th>
            <th scope="col">Account #</th>
            <th scope="col">Order #</th>
            <th scope="col">Admin</th>
            <th scope="col">Opening Date</th>
            <th scope="col">Closing Date</th>
            <th scope="col">Mode</th>
            <th scope="col">Total Orders</th>
            <th scope="col">Currency</th>
            <th scope="col">Total Collected</th>
          </tr>
          <tr v-for="store of currentStores" :key="store._id" @click.prevent="loadStore(store._id)">
            <td scope="row">{{ store.storeName }}</td>
            <td>{{ store.teamId.name }}</td>
            <td>{{ store.teamId.teamId }}</td>
            <td>{{ store.orderReference }}</td>
            <td>{{ store.adminId.name }}</td>
            <td>{{ store.openingDate || 'No Opening Date' }}</td>
            <td>{{ store.closingDate || 'No Closing Date' }}</td>
            <td
              :class="
                  store.mode === 'OPEN'
                    ? 'bg-success text-white'
                    : store.mode === 'CLOSED'
                    ? 'bg-danger text-white'
                    : store.mode === 'HOLD'
                    ? 'bg-warning text-white'
                    : null
                "
            >{{ store.mode }}</td>
            <td>{{ store.totalOrders }}</td>
            <td>{{ store.currency }}</td>
            <td>{{ store.collectedAmount }}</td>
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
      storesSearchText: ''
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
      return this.filteredStores.slice(this.indexOfFirstItem, this.indexOfLastItem);
    },
    pageNumbers: function() {
      const pageArray = [];
      for (let i = 1; i <= Math.ceil(this.filteredStores.length / this.itemsPerPage); i++) {
        pageArray.push(i);
      }
      return pageArray.length;
    },
    filteredStores: function() {
      return this.stores.filter(store => {
        if (
          store.storeName.toLowerCase().includes(this.storesSearchText.toLowerCase()) ||
          store.teamId.name.toLowerCase().includes(this.storesSearchText.toLowerCase()) ||
          store.adminId.name.toLowerCase().includes(this.storesSearchText.toLowerCase()) ||
          store.managerId.name.toLowerCase().includes(this.storesSearchText.toLowerCase()) ||
          store.mode.toLowerCase().includes(this.storesSearchText.toLowerCase())
        ) {
          return store;
        }
      });
    },
    stores: function() {
      return this.$store.getters.stores;
    }
  },
  methods: {
    loadStore: function(id) {
      this.$router.push({ name: 'storesById', params: { id } }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
table {
  font-size: 0.8rem;
}
</style>

