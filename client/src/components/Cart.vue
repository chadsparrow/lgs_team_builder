<template>
  <div class="navItem">
    <button class="btn btn-info">
      <i class="fas fa-shopping-cart fa-lg"></i>
      <!-- <span class="badge badge-danger ml-2" v-if="notifications.length >0">{{notifications.length}}</span>
      <span class="badge badge-info ml-2" v-else>{{notifications.length}}</span>-->
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
