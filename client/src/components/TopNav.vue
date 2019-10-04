<template>
  <div id="topNav">
    <Breadcrumbs />
    <div class="navBar">
      <Notifications />
      <Cart class="ml-2" v-if="member && !member.isAdmin" />
      <div class="navItem ml-2">
        <router-link to="/dashboard/profile" tag="a" v-if="member">
          <Gravatar :email="member.email" default-img="mp" :size="37.29" />
        </router-link>
      </div>
      <div class="navItem ml-2">
        <button class="btn btn-danger" @click="logout">
          Logout
          <i class="fas fa-sign-out-alt ml-2"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '../components/Breadcrumbs.vue';
import Notifications from '../components/Notifications.vue';
import Cart from '../components/Cart.vue';
import Gravatar from 'vue-gravatar';

export default {
  name: 'TopNav',
  components: {
    Gravatar,
    Breadcrumbs,
    Notifications,
    Cart
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    }
  },
  methods: {
    logout: async function() {
      await this.$store.dispatch('logout');
      this.$router.push({ name: 'login' });
      this.$toasted.clear();
      this.$toasted.success('Logged Out - See ya!', { icon: 'sign-out-alt' });
    }
  }
};
</script>

<style lang="scss" scoped>
$dark-color: #111111;
$blue-color: #17a2b8;
$label-color: #999999;
$white-text: #ffffff;
$black-text: #000000;

#topNav {
  grid-area: topnav;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;

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
        flex-wrap: no-wrap;
      }
    }
  }
}
</style>
