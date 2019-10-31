<template>
  <div v-if="dataReady">
    <span v-if="currentOrders.length === 0">No Orders Found</span>
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr>
            <th>Team ID</th>
            <th>Store ID</th>
            <th>Total Amount</th>
            <th>Order Date</th>
          </tr>
          <tr
            v-for="currentOrder of currentOrders"
            :key="currentOrder._id"
            @click.prevent="loadOrder(currentOrder._id)"
          >
            <th scope="row">{{ currentOrder.teamId }}</th>
            <td>{{ currentOrder.storeId }}</td>
            <td>{{ currentOrder.totalAmount }}</td>
            <td>{{ currentOrder.orderDate }}</td>
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
  name: 'OrdersIndex',
  components: {
    Paginate
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 12
    };
  },
  computed: {
    dataReady: function() {
      return this.$store.getters.dataReady;
    },
    orders: function() {
      return this.$store.getters.orders;
    },
    member: function() {
      return this.$store.getters.loggedInMember;
    },
    indexOfLastItem: function() {
      return this.currentPage * this.itemsPerPage;
    },
    indexOfFirstItem: function() {
      return this.indexOfLastItem - this.itemsPerPage;
    },
    currentOrders: function() {
      return this.orders.slice(this.indexOfFirstItem, this.indexOfLastItem);
    },
    pageNumbers: function() {
      const pageArray = [];
      for (let i = 1; i <= Math.ceil(this.orders.length / this.itemsPerPage); i++) {
        pageArray.push(i);
      }
      return pageArray.length;
    }
  },
  created: async function() {
    try {
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Orders',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getOrders');
      this.$store.dispatch('setDataReadyTrue');
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      this.$store.dispatch('setDataReadyTrue');
    }
  },
  beforeDestroy: function() {
    this.$store.dispatch('setDataReadyFalse');
  },
  methods: {
    loadOrder: function(id) {
      this.$router.push({ name: 'orderById', params: { id } }).catch(() => {});
    }
  }
};
</script>
