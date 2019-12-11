<template>
  <div :class="sideCollapsed ? 'dashboard-collapsed' : 'dashboard'">
    <!-- <SideNav /> -->
    <sidebar-menu
      @toggle-collapse="onToggleCollapse"
      :menu="menu"
      :width="'150px'"
      :collapsed="sideCollapsed"
    >
      <div slot="header" class="tbLogo">
        <img src="/images/assets/tb_logo_white.svg" alt="Team Builder logo" />
      </div>
      <span slot="toggle-icon">
        <i class="fas fa-angle-right" v-if="sideCollapsed"></i>
        <i class="fas fa-angle-left" v-else></i>
      </span>
      <div slot="footer">
        <button class="btn btn-block btn-danger logoutBtn" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </sidebar-menu>
    <TopNav class="topNavBar" />
    <transition name="fade" mode="out-in">
      <router-view class="mainContent"></router-view>
    </transition>
  </div>
</template>

<script>
import TopNav from '../components/TopNav';
import { mapGetters } from 'vuex';

export default {
  name: 'Dashboard',
  components: {
    TopNav
  },
  data() {
    return {
      sideCollapsed: false,
      screenWidth: 0
    };
  },
  created() {
    this.setScreenWidth();
    window.addEventListener('resize', this.setScreenWidth);
    this.$store.commit('SET_MENU', this.loggedInMember.isAdmin);
  },
  destroyed() {
    window.removeEventListener('resize', this.setScreenWidth);
  },
  methods: {
    onToggleCollapse(collapsed) {
      if (collapsed) this.sideCollapsed = true;
      else this.sideCollapsed = false;
    },
    setScreenWidth() {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth < 768) {
        this.sideCollapsed = true;
      } else {
        this.sideCollapsed = false;
      }
    },
    logout: async function() {
      this.$store.commit('LOADING_FALSE');
      await this.$store.dispatch('logout');
      this.$router.push({ name: 'login' });
      this.$toasted.clear();
      this.$toasted.success('Logged Out - See ya!', { icon: 'sign-out-alt' });
    }
  },
  computed: {
    ...mapGetters(['loggedInMember', 'menu'])
  }
};
</script>

<style lang="scss">
.dashboard {
  display: grid;
  // grid-template-columns: 50px 1fr;
  grid-template-rows: 60px 1fr;
  margin-left: 150px;
  width: calc(100% - 150px);
  transition: width 1s;
  height: 100vh;
  grid-template-areas:
    'topnav'
    'content';

  background-image: linear-gradient(to bottom right, white, #d6d6d6);

  .logoutBtn {
    display: inline-block;
    white-space: nowrap;
    i {
      margin-left: 0.5rem;
    }

    &::before {
      content: 'Logout';
    }
  }

  .tbLogo {
    display: block;
    width: 100%;
    padding: 1rem;
    margin: 0 auto;
    text-align: center;
  }
}

.dashboard-collapsed {
  display: grid;
  grid-template-rows: 60px 1fr;
  margin-left: 50px;
  height: 100vh;
  width: calc(100%-50px);
  transition: width 1s;
  grid-template-areas:
    'topnav'
    'content';

  background-image: linear-gradient(to bottom right, white, #d6d6d6);

  .logoutBtn {
    display: inline-block;
    white-space: nowrap;
    i {
      margin-left: 0;
    }

    &::before {
      content: none;
    }
  }

  .tbLogo {
    width: 100%;
    padding: 0.25rem;
    margin: 0 auto;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }
}

.mainContent {
  grid-area: content;
  padding: 0 1rem 1rem 1rem;
  overflow-x: hidden;
  overflow-y: auto;
}

.v-sidebar-menu {
  .vsm--link.vsm--link_exact-active {
    box-shadow: 3px 0px 0px 0px #18a2b8 inset;
  }

  .vsm--mobile-bg {
    background-color: #18a2b8;
  }

  .vsm--link_hover,
  .vsm--link:hover {
    background-color: #18a2b8;

    .vsm--icon {
      background-color: #18a2b8;
    }
  }
}

.v-sidebar-menu.vsm_collapsed .vsm--link_level-1.vsm--link_hover .vsm--icon,
.v-sidebar-menu.vsm_collapsed .vsm--link_level-1:hover .vsm--icon {
  background-color: #18a2b8;
}
</style>
