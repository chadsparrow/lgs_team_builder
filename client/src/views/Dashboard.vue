<template>
  <div :class="sideCollapsed ? 'dashboard-collapsed' : 'dashboard'">
    <sidebar-menu
      @toggle-collapse="onToggleCollapse"
      :menu="menu"
      :width="'150px'"
      :collapsed="sideCollapsed"
      class="sidebar-menu"
    >
      <div slot="header" class="tbLogo">
        <a href="/dashboard/index"
          ><img
            src="https://teambuilder.s3.amazonaws.com/images/assets/tb_logo_white.svg"
            alt="Team Builder logo"
        /></a>
      </div>
      <span slot="toggle-icon">
        <i class="fas fa-angle-right" v-if="sideCollapsed"></i>
        <i class="fas fa-angle-left" v-else></i>
      </span>
      <div slot="footer">
        <button class="btn btn-block btn-danger logoutBtn" @click="logout">
          <span class="logoutSpan">{{ $t('menu.logout') }}</span
          ><i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </sidebar-menu>
    <TopNav class="top-nav" />
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
    TopNav,
  },
  data() {
    return {
      sideCollapsed: false,
      screenWidth: 0,
      polling: null,
    };
  },
  computed: {
    ...mapGetters(['loggedInMember', 'menu', 'isLoggedIn']),
  },
  created() {
    this.setScreenWidth();
    window.addEventListener('resize', this.setScreenWidth);
    this.$store.commit('SET_MENU', this.loggedInMember.isAdmin);
    this.polling = setInterval(() => {
      if (this.isLoggedIn) {
        const cookie = $cookies.get('tb_member');
        if (!cookie) {
          clearInterval(this.polling);
          this.$toasted.error('Token Missing', {
            icon: 'exclamation-triangle',
            duration: null,
            action: {
              text: 'CLOSE',
              onClick: (e, toastObject) => {
                this.$toasted.clear();
              },
            },
          });

          this.logout();
        } else {
          const exp = $cookies.get('tb_member').exp;
          if (Date.now() >= exp) {
            clearInterval(this.polling);
            this.$toasted.error('Token Expired', {
              icon: 'exclamation-triangle',
              duration: null,
              action: {
                text: 'CLOSE',
                onClick: (e, toastObject) => {
                  this.$toasted.clear();
                },
              },
            });

            this.logout();
          }
        }
      }
    }, 1000 * 10);
  },
  destroyed() {
    window.removeEventListener('resize', this.setScreenWidth);
    clearInterval(this.polling);
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
      this.$store.commit('LOADING_TRUE');
      clearInterval(this.polling);
      try {
        await this.$store.dispatch('logout', { id: this.loggedInMember.aud });
        this.$store.commit('LOADING_FALSE');
        this.$router.push({ path: '/' });
      } catch (err) {
        this.$store.commit('LOADING_FALSE');
        toast.error(err);
      }
    },
  },
};
</script>

<style lang="scss">
.dashboard {
  display: grid;
  grid-template-columns: 150px 1fr;
  grid-template-rows: 50px 1fr;
  grid-template-areas:
    'sidebar topnav'
    'sidebar content';
  width: 100%;
  transition: all 200ms ease;
  height: 100vh;

  background-image: linear-gradient(
    to bottom right,
    $white-text,
    $background-grey
  );

  .top-nav {
    grid-area: topnav;
    width: 100%;
    height: 100%;
  }

  .sidebar-menu {
    grid-area: sidebar;
    .logoutBtn {
      display: inline-block;
      white-space: nowrap;
      i {
        margin-left: 0.5rem;
      }

      .logoutSpan {
        display: inline-block;
      }
    }

    .tbLogo {
      width: 65%;
      padding: 0.25rem;
      margin: 0 auto;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      text-align: center;
      transition: width 0.25s;
    }
  }
}

.dashboard-collapsed {
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    'sidebar topnav'
    'sidebar content';
  height: 100vh;
  width: 100%;
  transition: all 200ms ease;

  background-image: linear-gradient(
    to bottom right,
    $white-text,
    $background-grey
  );

  .sidebar-menu {
    grid-area: sidebar;
    .logoutBtn {
      display: inline-block;
      white-space: nowrap;
      i {
        margin-left: 0;
      }

      .logoutSpan {
        display: none;
      }
    }

    .tbLogo {
      width: 85%;
      margin: 0 auto;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      text-align: center;
      transition: width 0.25s;
    }
  }
}

.mainContent {
  grid-area: content;
  padding: 0 1rem 1rem 1rem;
  overflow-x: hidden;
  overflow-y: auto;
}

.v-sidebar-menu {
  .vsm--link,
  .vsm--header {
    font-size: 0.85rem;
  }

  .vsm--link.vsm--link_exact-active {
    box-shadow: 3px 0px 0px 0px $blue-color inset;
  }

  .vsm--mobile-bg {
    background-color: $blue-color;
  }

  .vsm--link_hover,
  .vsm--link:hover {
    background-color: $blue-color;

    .vsm--icon {
      background-color: $blue-color;
    }
  }
}

.v-sidebar-menu.vsm_collapsed .vsm--link_level-1.vsm--link_hover .vsm--icon,
.v-sidebar-menu.vsm_collapsed .vsm--link_level-1:hover .vsm--icon {
  background-color: $blue-color;
}
</style>
