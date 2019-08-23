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
  data() {
    return {};
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
}

.mainContent {
  grid-area: content;
  padding: 1rem 1.5rem;
  overflow: auto;
}

.breadcrumb {
  background-color: rgb(225, 225, 225);
}
</style>
