<template>
  <div class="dashboard">
    <SideNav />
    <TopNav />
    <div class="mainContent">
      <h1>Dashboard</h1>
    </div>
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


