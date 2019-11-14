<template>
  <div class="sidenav">
    <div class="logo m-auto">
      <img src="@/assets/tb_logo_white.svg" alt="Team Builder Logo" />
    </div>
    <div class="copyright text-center">
      <small>&copy; 2019 Garneau.com</small>
    </div>
    <div class="buttons">
      <router-link
        class="btn btn-block btn-dark"
        to="/dashboard/members"
        tag="a"
        v-if="adminStatus"
      >
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
      <router-link
        class="btn btn-block btn-dark"
        to="/dashboard/catalogs"
        tag="a"
        v-if="adminStatus"
      >
        <i class="fas fa-book"></i>
        <span>Catalogs</span>
      </router-link>
    </div>
    <div class="row text-center mt-4 timeDisplay" v-if="currentDateTime">
      <small class="col-sm-12">Current Date/Time:</small>
      <br />
      <small class="col-sm-12 currentTime text-warning" v-if="member && member.timezone">
        {{
        currentDateTime | moment('timezone', member.timezone, 'MMM Do YYYY \n hh:mm:ss A z')
        }}
      </small>
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
  padding: 0.5rem;
  grid-area: nav;
  height: 100%;
  width: 100%;

  a {
    i {
      margin-right: 0rem;
    }
    span {
      display: none;
    }
  }

  .logo {
    width: 100%;
  }

  .copyright {
    display: none;
    color: #999;
  }

  .buttons {
    margin-top: 0.5rem;
    .router-link-active {
      background-color: rgb(225, 225, 225);
      color: black;
    }

    a {
      i {
        margin-right: 0rem;
      }
      span {
        display: none;
      }
    }
  }

  .timeDisplay {
    display: none;

    .currentTime {
      font-size: 0.7rem;
    }
  }
}

@media (min-width: 576px) {
  .sidenav {
    padding: 1rem;
    .logo {
      width: 70%;
    }

    .copyright {
      display: block;
      margin-bottom: 0.5rem;
    }

    .buttons {
      margin-top: 1rem;
      a {
        i {
          margin-right: 1rem;
        }
        span {
          display: inline-block;
        }
      }
    }

    .timeDisplay {
      display: block;
    }
  }
}
</style>
