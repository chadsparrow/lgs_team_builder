<template>
  <div class="dashboard">
    <SideNav />
    <TopNav />
    <router-view class="mainContent"></router-view>
  </div>
</template>

<script>
import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';

export default {
  name: 'Register',
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

<style lang="scss" scoped>
.dashboard {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 50px auto;
  width: 100%;
  height: 100vh;
  grid-template-areas:
    'nav topnav'
    'nav content';
}

.mainContent {
  grid-area: content;
  padding: 1rem;
}
</style>
