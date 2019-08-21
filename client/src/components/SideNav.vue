<template>
  <div class="sidenav">
    <div class="logo mb-4 mt-2 text-center">TEAM BUILDER</div>
    <router-link class="btn btn-block btn-dark" to="#" v-if="member && member.isAdmin">Members</router-link>
    <router-link class="btn btn-block btn-dark" to="#">Teams</router-link>
    <router-link class="btn btn-block btn-dark" to="#">Stores</router-link>
    <router-link class="btn btn-block btn-dark" to="#">Orders</router-link>
    <router-link
      class="btn btn-block btn-dark"
      to="/dashboard/catalogs"
      v-if="member && member.isAdmin"
    >Catalogs</router-link>

    <div class="copyright text-center">
      <small>&copy; 2019 Garneau.com</small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideNav',
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    }
  }
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

.router-link-active {
  background-color: rgb(225, 225, 225);
  color: black;
}

.copyright {
  position: absolute;
  bottom: 15px;
  left: 40px;
  color: #999;
}
</style>
