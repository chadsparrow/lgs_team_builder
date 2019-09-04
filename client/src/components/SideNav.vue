<template>
  <div class="sidenav">
    <div class="logo m-auto">
      <img src="@/assets/tb_logo_white.svg" alt="Team Builder Logo" />
    </div>
    <hr />
    <router-link
      class="btn btn-block btn-dark"
      to="/dashboard/members"
      tag="a"
      v-if="member && member.isAdmin"
    >
      <i class="fas fa-user"></i>
      <span>Members</span>
    </router-link>
    <router-link
      class="btn btn-block btn-dark"
      to="/dashboard/teams"
      tag="a"
      v-if="member && member.isAdmin"
    >
      <i class="fas fa-users"></i>
      <span>Teams</span>
    </router-link>
    <router-link class="btn btn-block btn-dark" to="/dashboard/teams" tag="a" v-else>
      <i class="fas fa-users"></i>
      <span>My Teams</span>
    </router-link>
    <router-link
      class="btn btn-block btn-dark"
      to="/dashboard/stores"
      tag="a"
      v-if="member && member.isAdmin"
    >
      <i class="fas fa-store"></i>
      <span>Stores</span>
    </router-link>
    <router-link class="btn btn-block btn-dark" to="/dashboard/stores" tag="a" v-else>
      <i class="fas fa-store"></i>
      <span>My Stores</span>
    </router-link>
    <router-link
      class="btn btn-block btn-dark"
      to="/dashboard/orders"
      tag="a"
      v-if="member && member.isAdmin"
    >
      <i class="fas fa-receipt"></i>
      <span>Orders</span>
    </router-link>
    <router-link class="btn btn-block btn-dark" to="/dashboard/orders" tag="a" v-else>
      <i class="fas fa-receipt"></i>
      <span>My Orders</span>
    </router-link>
    <router-link
      class="btn btn-block btn-dark"
      to="/dashboard/catalogs"
      tag="a"
      v-if="member && member.isAdmin"
    >
      <i class="fas fa-book"></i>
      <span>Catalogs</span>
    </router-link>

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
  padding-left: 1em;
  padding-right: 1em;
  padding-top: 2em;
  padding-bottom: 2em;
  grid-area: nav;

  a {
    i {
      margin-right: 1rem;
    }
  }

  .logo {
    width: 70%;
  }
  .router-link-active {
    background-color: rgb(225, 225, 225);
    color: black;
  }
  .copyright {
    position: absolute;
    bottom: 1em;
    left: 40px;
    color: #999;
  }
}

@media (max-width: 575px) {
  .sidenav {
    padding-left: 0.5em;
    padding-right: 0.5em;
    .logo {
      display: none;
    }

    a {
      span {
        display: none;
      }

      i {
        margin-right: 0rem;
      }
    }

    .copyright {
      display: none;
    }
  }
}
</style>
