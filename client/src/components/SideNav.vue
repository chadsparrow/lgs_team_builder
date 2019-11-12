<template>
  <div class="sidenav">
    <div class="logo m-auto">
      <img src="@/assets/tb_logo_white.svg" alt="Team Builder Logo" />
    </div>
    <div class="copyright text-center mb-4">
      <small>&copy; 2019 Garneau.com</small>
    </div>
    <router-link class="btn btn-block btn-dark" to="/dashboard/members" tag="a" v-if="adminStatus">
      <i class="fas fa-user"></i>
      <span>Members</span>
    </router-link>
    <router-link class="btn btn-block btn-dark" to="/dashboard/teams" tag="a" v-if="adminStatus">
      <i class="fas fa-users"></i>
      <span>Teams</span>
    </router-link>
    <router-link class="btn btn-block btn-dark" to="/dashboard/teams" tag="a" v-else>
      <i class="fas fa-users"></i>
      <span>My Teams</span>
    </router-link>
    <router-link class="btn btn-block btn-dark" to="/dashboard/stores" tag="a" v-if="adminStatus">
      <i class="fas fa-store"></i>
      <span>Stores</span>
    </router-link>
    <router-link class="btn btn-block btn-dark" to="/dashboard/stores" tag="a" v-else>
      <i class="fas fa-store"></i>
      <span>My Stores</span>
    </router-link>
    <router-link class="btn btn-block btn-dark" to="/dashboard/orders" tag="a" v-if="adminStatus">
      <i class="fas fa-receipt"></i>
      <span>Orders</span>
    </router-link>
    <router-link class="btn btn-block btn-dark" to="/dashboard/orders" tag="a" v-else>
      <i class="fas fa-receipt"></i>
      <span>My Orders</span>
    </router-link>
    <router-link class="btn btn-block btn-dark" to="/dashboard/catalogs" tag="a" v-if="adminStatus">
      <i class="fas fa-book"></i>
      <span>Catalogs</span>
    </router-link>
    <div class="row text-center mt-4" v-if="currentDateTime">
      <small class="col-sm-12">Current Date/Time:</small>
      <small
        class="col-sm-12 currentTime text-warning"
      >{{ currentDateTime | moment('timezone', member.timezone, 'MMM Do YYYY \n hh:mm:ss A z')}}</small>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone';

export default {
  name: 'SideNav',
  data() {
    return {
      currentDateTime: null,
      polling: null
    };
  },
  computed: {
    member: function() {
      return this.$store.getters.loggedInMember;
    },
    adminStatus: function() {
      if (this.member) return this.member.isAdmin;
    }
  },
  created: function() {
    this.polling = setInterval(this.getNow, 1000);
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
  },
  methods: {
    getNow: function() {
      this.currentDateTime = new Date();
    }
  }
};
</script>

<style lang="scss" scoped>
.sidenav {
  background-color: #111;
  color: white;
  padding: 1rem;
  grid-area: nav;

  a {
    i {
      margin-right: 1rem;
    }
  }

  .currentTime {
    font-size: 0.7rem;
  }

  .logo {
    width: 70%;
  }
  .router-link-active {
    background-color: rgb(225, 225, 225);
    color: black;
  }
  .copyright {
    color: #999;
  }
}

@media (max-width: 575px) {
  .sidenav {
    padding: 0.5rem;
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
