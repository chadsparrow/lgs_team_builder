import Vue from 'vue';
import Router from 'vue-router';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Dashboard from './views/Dashboard.vue';
import DashboardIndex from './components/Dashboard/DashboardIndex.vue';
import PageNotFound from './views/PageNotFound.vue';
import ProfilesIndex from './components/Profiles/ProfilesIndex.vue';
import ProfilesEdit from './components/Profiles/ProfilesEdit.vue';
import CatalogsIndex from './components/Catalogs/CatalogsIndex.vue';
import CatalogsAdd from './components/Catalogs/CatalogsAdd.vue';
import CatalogById from './components/Catalogs/CatalogById.vue';
import CatalogByIdEdit from './components/Catalogs/CatalogByIdEdit.vue';
import CatalogItemsAdd from './components/Catalogs/CatalogItemsAdd.vue';
import OrdersIndex from './components/Orders/OrdersIndex.vue';
import MembersIndex from './components/Members/MembersIndex.vue';
import MembersAdd from './components/Members/MembersAdd.vue';
import MemberById from './components/Members/MemberById.vue';
import MemberByIdEdit from './components/Members/MemberByIdEdit.vue';
import StoresIndex from './components/Stores/StoresIndex.vue';
import StoresById from './components/Stores/StoresById.vue';
import TeamsIndex from './components/Teams/TeamsIndex.vue';
import TeamsAdd from './components/Teams/TeamsAdd.vue';
import TeamsAddMember from './components/Teams/TeamsAddMember.vue';
import TeamsRemoveMember from './components/Teams/TeamsRemoveMember.vue';
import TeamsById from './components/Teams/TeamsById.vue';
import TeamsByIdEdit from './components/Teams/TeamsByIdEdit.vue';
import TeamsByIdAddStore from './components/Teams/TeamsByIdAddStore.vue';

Vue.use(Router);

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        guest: true
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'index',
          name: 'dashboardIndex',
          component: ProfilesIndex,
          meta: { requiresAuth: true }
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfilesIndex,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'profile/edit',
          name: 'profileedit',
          component: ProfilesEdit,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'catalogs',
          name: 'catalogs',
          component: CatalogsIndex,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'catalogs/add',
          name: 'catalogsAdd',
          component: CatalogsAdd,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'catalogs/:id',
          name: 'catalogsById',
          component: CatalogById,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'catalogs/:id/edit',
          name: 'catalogsByIdEdit',
          component: CatalogByIdEdit,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'catalogs/:id/add',
          name: 'catalogsItemsAdd',
          component: CatalogItemsAdd,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'orders',
          name: 'orders',
          component: OrdersIndex,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'stores',
          name: 'stores',
          component: StoresIndex,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'stores/:id',
          name: 'storesById',
          component: StoresById,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'teams',
          name: 'teams',
          component: TeamsIndex,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'teams/add',
          name: 'teamsAdd',
          component: TeamsAdd,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'teams/:id',
          name: 'teamsById',
          component: TeamsById,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'teams/:id/edit',
          name: 'teamsByIdEdit',
          component: TeamsByIdEdit,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'teams/:id/addmember',
          name: 'teamsAddMember',
          component: TeamsAddMember,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'teams/:id/removemember',
          name: 'teamsRemoveMember',
          component: TeamsRemoveMember,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'teams/:id/addstore',
          name: 'teamsAddStore',
          component: TeamsByIdAddStore,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'members',
          name: 'members',
          component: MembersIndex,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'members/add',
          name: 'membersAdd',
          component: MembersAdd,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'members/:id',
          name: 'membersById',
          component: MemberById,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'members/:id/edit',
          name: 'membersByIdEdit',
          component: MemberByIdEdit,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        }
      ]
    },
    {
      path: '*',
      name: '404',
      component: PageNotFound
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token') == null) {
      Vue.toasted.error('Access Denied');
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      });
    } else {
      let member = JSON.parse(localStorage.getItem('member'));
      if (to.matched.some(record => record.meta.isAdmin)) {
        if (member.isAdmin) {
          next();
        } else {
          Vue.toasted.error('Access Denied');
          next({ name: from.name });
        }
      } else {
        next();
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('token') == null) {
      next();
    } else {
      next({ name: 'dashboardIndex' });
    }
  } else {
    next();
  }
});

export default router;
