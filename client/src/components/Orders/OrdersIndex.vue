<template>
  <div>
    <span v-if="currentOrders && currentOrders.length === 0">No Orders Found</span>
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr>
            <th>Team ID</th>
            <th>Store ID</th>
            <th>Total Amount</th>
            <th>Order Date</th>
          </tr>
          <tr v-for="order of currentOrders" :key="order._id" @click.prevent="loadOrder(order._id)">
            <th scope="row">{{ order.teamId }}</th>
            <td>{{ order.storeId }}</td>
            <td>{{ order.totalAmount }}</td>
            <td>{{ order.orderDate }}</td>
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
import Paginate from 'vuejs-paginate';

export default {
  name: 'OrdersIndex',
  components: {
    Paginate
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 15,
      breadcrumbs: [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Orders',
          link: '#'
        }
      ],
      orders: []
    };
  },
  created: async function() {
    try {
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
      const orders = await this.$store.dispatch('getOrders');
      this.orders = orders.data;
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
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
    currentOrders: function() {
      if (orders.length > 0) {
        return this.orders.slice(this.indexOfFirstItem, this.indexOfLastItem);
      }
      return [];
    },
    pageNumbers: function() {
      const pageArray = [];
      for (let i = 1; i <= Math.ceil(this.teams.length / this.itemsPerPage); i++) {
        pageArray.push(i);
      }
      return pageArray.length;
    }
  },
  methods: {
    loadOrder: function(id) {
      this.$router.push({ name: 'orderById', params: { id } }).catch(() => {});
    }
  }
};
</script>
