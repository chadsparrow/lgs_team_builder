<template>
  <div id="topNav">
    <Breadcrumbs class="breadCrumbs" />
    <div class="navBar">
      <Notifications />
      <CartButton class="ml-2" v-if="member && !member.isAdmin && showCart" />
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '../components/Breadcrumbs.vue';
import Notifications from '../components/Notifications.vue';
import CartButton from '../components/CartButton.vue';

export default {
  name: 'TopNav',
  components: {
    Breadcrumbs,
    Notifications,
    CartButton
  },
  computed: {
    member: function() {
      return this.$store.getters.loggedInMember;
    },
    showCart: function() {
      return this.$store.getters.showCart;
    }
  }
};
</script>

<style lang="scss" scoped>
#topNav {
  grid-area: topnav;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;

  .navBar {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }
}
</style>
