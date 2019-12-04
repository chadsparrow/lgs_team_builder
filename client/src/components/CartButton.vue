<template>
  <div>
    <div class="navItem">
      <button class="btn btn-info" @click="openCart">
        <i class="fas fa-shopping-cart fa-lg"></i>
        <span class="badge badge-danger ml-2" v-if="currentCart && currentCart.items.length > 0">
          {{ currentCart.items.length }}
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Cart',
  computed: {
    ...mapGetters(['loggedInMember', 'currentCart'])
  },
  methods: {
    openCart: function() {
      if (this.currentCart.items.length > 0) {
        this.$router.push({
          name: 'cart',
          params: { id: this.currentCart._id },
          query: { storeId: this.currentCart.storeId }
        });
      }
    }
  }
};
</script>
