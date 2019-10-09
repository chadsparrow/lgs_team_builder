<template>
  <div class="dashboard">
    <SideNav />
    <TopNav />
    <transition name="fade" mode="out-in">
      <router-view class="mainContent"></router-view>
    </transition>
  </div>
</template>

<script>
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';

export default {
  name: 'Dashboard',
  components: {
    SideNav,
    TopNav
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  methods: {}
};
</script>

<style lang="scss">
.dashboard {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 60px auto;
  width: 100%;
  height: 100vh;
  grid-template-areas:
    'nav topnav'
    'nav content';

  background-image: linear-gradient(to bottom right, white, #d6d6d6);
}

.mainContent {
  grid-area: content;
  padding: 0 1rem 1rem 1rem;
  overflow-x: hidden;
  overflow-y: auto;
}

@media (max-width: 575px) {
  .dashboard {
    grid-template-columns: 60px 1fr;
  }
}
</style>
