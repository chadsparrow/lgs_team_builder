<template>
  <div class="navItem">
    <button class="btn btn-info">
      <i class="fas fa-shopping-cart fa-lg"></i>
      <span class="badge badge-danger ml-2" v-if="currentCart && currentCart.items.length > 0">
        {{ currentCart.items.length }}
      </span>
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Cart',
  computed: {
    ...mapGetters(['loggedInMember', 'currentCart'])
  },
  created: async function() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.navItem {
  position: relative;
}
</style>
