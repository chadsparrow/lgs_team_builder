<template>
  <div class="sidenav">
    <div class="logo mb-4 mt-2 text-center">TEAM BUILDER</div>
    <a class="btn btn-block btn-dark" href="#">Members</a>
    <a class="btn btn-block btn-dark" href="#">Teams</a>
    <a class="btn btn-block btn-dark" href="#">Stores</a>
    <a class="btn btn-block btn-dark" href="#">Orders</a>
  </div>
</template>

<script>
export default {
  name: 'SideNav'
};
</script>

<style lang="scss" scoped>
.sidenav {
  background-color: #111;
  color: white;
  padding-left: 0.5em;
  padding-right: 0.5em;
  grid-area: nav;

  .logo {
    font-size: 1.5em;
  }
}
</style>



