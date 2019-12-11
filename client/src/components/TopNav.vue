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
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  padding: 0 1rem;

  .breadCrumbs {
    display: none;
  }

  .navBar {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    .navItem {
      display: flex;
      align-items: center;

      img {
        border-radius: 0.25rem;
      }

      button {
        display: flex;
        align-items: center;
      }
    }
  }
}

@media (min-width: 768px) {
  #topNav {
    flex-wrap: wrap;
    justify-content: space-between;
    .breadCrumbs {
      display: block;
    }
  }
}
</style>
