<template>
  <div class="container-fluid" v-if="!isLoading">
    <div class="header">
      <div class="form-group form-inline mb-2">
        <label for="storesSeachText" class="mr-2">Search:</label>
        <input
          type="text"
          id="storesSearchText"
          v-if="stores.length > 0"
          class="form-control form-control-sm mr-3"
          v-model="storesSearchText"
          placeholder="Enter any text to filter stores..."
          autofocus
        />
        <small class="text-muted">Showing: {{ filteredCount }}/{{ stores.length }}</small>
      </div>
    </div>
    <h5 class="text-center" v-if="currentStores.length === 0">No Stores Found</h5>
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr>
            <th scope="col">Store Name</th>
            <th scope="col">Brand</th>
            <th scope="col">Team</th>
            <th scope="col" v-if="access">Account #</th>
            <th scope="col" v-if="access">Order #</th>
            <th scope="col" v-if="access">Admin</th>
            <th scope="col">Opening Date</th>
            <th scope="col">Closing Date</th>
            <th scope="col" class="text-center">Mode</th>
            <th scope="col" v-if="access">Total Orders</th>
            <th scope="col" v-if="access">Currency</th>
            <th scope="col" v-if="access">Total Collected</th>
          </tr>
          <tr v-for="store of currentStores" :key="store._id" @click.prevent="loadStore(store._id)">
            <td scope="row">{{ store.storeName }}</td>
            <td v-if="store.brand === 'GARNEAU'">
              <img src="/images/assets/garneau_logo.png" alt="Garneau Logo" />
            </td>
            <td v-if="store.brand === 'SUGOI'">
              <img src="/images/assets/sugoi_logo.png" alt="Sugoi Logo" />
            </td>
            <td v-if="store.brand === 'SOMBRIO'">
              <img src="/images/assets/sombrio_logo.png" alt="Sombrio Logo" />
            </td>
            <td>{{ store.teamId.name }}</td>
            <td v-if="access">{{ store.teamId.teamId }}</td>
            <td v-if="access">{{ store.refOrder }}</td>
            <td v-if="access">{{ store.adminId.name }}</td>
            <td v-if="store.openingDate">
              {{
                store.openingDate | moment('timezone', store.timezone, 'MMM Do YYYY / hh:mm a - z')
              }}
            </td>
            <td v-else>No Opening Date</td>
            <td v-if="store.closingDate">
              {{
                store.closingDate | moment('timezone', store.timezone, 'MMM Do YYYY / hh:mm a - z')
              }}
            </td>
            <td v-else>No Closing Date</td>
            <td
              :class="
                store.mode === 'OPEN'
                  ? 'bg-success text-white text-center'
                  : store.mode === 'CLOSED'
                  ? 'bg-danger text-white text-center'
                  : store.mode === 'HOLD'
                  ? 'bg-warning text-white text-center'
                  : store.mode === 'SURVEY'
                  ? 'text-center'
                  : null
              "
            >
              {{ store.mode }}
            </td>
            <td class="text-center" v-if="access">{{ store.totalOrders }}</td>
            <td v-if="access">{{ store.currency }}</td>
            <td class="text-center" v-if="access">{{ store.collectedAmount | currency }}</td>
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
import Vue2Filters from 'vue2-filters';
import { mapGetters } from 'vuex';

export default {
  name: 'StoreIndex',
  mixins: [Vue2Filters.mixin],
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
    this.$store.commit('LOADING_TRUE');
    try {
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Stores',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.commit('CLEAR_CURRENTS');
      await this.$store.dispatch('getStores');
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  computed: {
    ...mapGetters(['isLoading', 'loggedInMember', 'stores']),
    member: function() {
      return this.loggedInMember;
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
          store.brand.toLowerCase().includes(this.storesSearchText.toLowerCase()) ||
          store.storeName.toLowerCase().includes(this.storesSearchText.toLowerCase()) ||
          store.teamId.name.toLowerCase().includes(this.storesSearchText.toLowerCase()) ||
          store.teamId.teamId.toLowerCase().includes(this.storesSearchText.toLowerCase()) ||
          store.refOrder.toLowerCase().includes(this.storesSearchText.toLowerCase()) ||
          store.adminId.name.toLowerCase().includes(this.storesSearchText.toLowerCase()) ||
          store.managerId.name.toLowerCase().includes(this.storesSearchText.toLowerCase()) ||
          store.mode.toLowerCase().includes(this.storesSearchText.toLowerCase())
        ) {
          return store;
        }
      });
    },
    filteredCount: function() {
      return this.filteredStores.length;
    },
    access: function() {
      if (this.member && this.member.isAdmin) return true;

      return false;
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
.header {
  .form-control {
    width: 500px;
  }
}

table {
  font-size: 0.8rem;

  td {
    img {
      height: 45%;
    }
  }
}
</style>
