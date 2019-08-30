<template>
  <div class="sidenav">
    <div class="logo m-auto">
      <img src="@/assets/tb_logo_white.svg" alt="Team Builder Logo" />
    </div>
    <hr />
    <router-link
      class="btn btn-block btn-dark"
      to="/dashboard/members"
      v-if="member && member.isAdmin"
    >Members</router-link>
    <router-link
      class="btn btn-block btn-dark"
      to="/dashboard/teams"
      v-if="member && member.isAdmin"
    >Teams</router-link>
    <router-link class="btn btn-block btn-dark" to="/dashboard/teams" v-else>My Teams</router-link>
    <router-link
      class="btn btn-block btn-dark"
      to="/dashboard/stores"
      v-if="member && member.isAdmin"
    >Stores</router-link>
    <router-link class="btn btn-block btn-dark" to="/dashboard/stores" v-else>My Stores</router-link>
    <router-link
      class="btn btn-block btn-dark"
      to="/dashboard/orders"
      v-if="member && member.isAdmin"
    >Orders</router-link>
    <router-link class="btn btn-block btn-dark" to="/dashboard/orders" v-else>My Orders</router-link>
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
  padding-left: 0.75em;
  padding-right: 0.75em;
  padding-top: 0.75em;
  grid-area: nav;

  .logo {
    width: 60%;
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
