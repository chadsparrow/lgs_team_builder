<template>
  <div :class="sideCollapsed ? 'dashboard-collapsed' : 'dashboard'">
    <!-- <SideNav /> -->
    <sidebar-menu @toggle-collapse="onToggleCollapse" :menu="menu" :width="'150px'"></sidebar-menu>
    <TopNav class="topNavBar" />
    <transition name="fade" mode="out-in">
      <router-view class="mainContent"></router-view>
    </transition>
  </div>
</template>

<script>
// import SideNav from '../components/SideNav';
import TopNav from '../components/TopNav';
import { mapGetters } from 'vuex';

export default {
  name: 'Dashboard',
  components: {
    // SideNav,
    TopNav
  },
  data() {
    return {
      sideCollapsed: false
    };
  },
  computed: {
    ...mapGetters(['loggedInMember']),
    menu: function() {
      if (this.loggedInMember && this.loggedInMember.isAdmin) {
        return [
          {
            header: true,
            title: 'Team Builder',
            hiddenOnCollapse: true,
            class: 'text-center'
          },
          {
            href: { path: '/dashboard/members' },
            title: 'Members',
            icon: 'fas fa-user'
          },
          {
            href: { path: '/dashboard/teams' },
            title: 'Teams',
            icon: 'fas fa-users'
          },
          {
            href: { path: '/dashboard/stores' },
            title: 'Stores',
            icon: 'fas fa-store'
          },
          {
            href: { path: '/dashboard/orders' },
            title: 'Orders',
            icon: 'fas fa-receipt'
          },
          {
            href: { path: '/dashboard/catalogs' },
            title: 'Catalogs',
            icon: 'fas fa-book'
          }
        ];
      }

      return [
        {
          header: true,
          title: 'Team Builder',
          hiddenOnCollapse: true,
          class: 'text-center'
        },
        {
          href: { path: '/dashboard/teams' },
          title: 'My Teams',
          icon: 'fas fa-users'
        },
        {
          href: { path: '/dashboard/stores' },
          title: 'My Stores',
          icon: 'fas fa-store'
        },
        {
          href: { path: '/dashboard/orders' },
          title: 'My Orders',
          icon: 'fas fa-receipt'
        }
      ];
    }
  },
  methods: {
    onToggleCollapse(collapsed) {
      if (collapsed) this.sideCollapsed = true;
      else this.sideCollapsed = false;
    }
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
