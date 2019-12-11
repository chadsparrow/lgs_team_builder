<template>
  <div class="sidenav">
    <div class="logo m-auto">
      <img src="/images/assets/tb_logo_white.svg" alt="Team Builder Logo" />
    </div>
    <div class="copyright text-center">
      <small>&copy; 2019 Garneau.com</small>
    </div>
    <div class="buttons">
      <router-link
        class="btn btn-block btn-dark"
        to="/dashboard/members"
        tag="a"
        v-if="loggedInMember.isAdmin"
      >
        <i class="fas fa-user"></i>
        <span>Members</span>
      </router-link>
      <router-link
        class="btn btn-block btn-dark"
        to="/dashboard/teams"
        tag="a"
        v-if="loggedInMember.isAdmin"
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
        v-if="loggedInMember.isAdmin"
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
        v-if="loggedInMember.isAdmin"
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
        v-if="loggedInMember.isAdmin"
      >
        <i class="fas fa-book"></i>
        <span>Catalogs</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'SideNav',
  data() {
    return {
      currentDateTime: null,
      polling: null
    };
  },
  computed: {
    ...mapGetters(['loggedInMember'])
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
}

@media (min-width: 768px) {
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
  }
}
</style>
