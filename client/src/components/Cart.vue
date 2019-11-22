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
export default {
  name: 'Cart',
  data() {
    return {
      dataReady: false
    };
  },
  computed: {
    member: function() {
      return this.$store.getters.loggedInMember;
    },
    currentCart: function() {
      return this.$store.getters.currentCart;
    }
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
