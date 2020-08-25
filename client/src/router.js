import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import toast from './helpers/toast';
import get from 'lodash/get';

Vue.use(Router);

const Login = () => import('./views/Login.vue');
const Dashboard = () => import('./views/Dashboard.vue');

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Login,
      meta: {
        guest: true,
      },
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: () =>
        import(/* webpackChunkName: "Forgot" */ './views/Forgot.vue'),
      meta: {
        guest: true,
      },
    },
    {
      path: '/reset',
      name: 'reset',
      component: () =>
        import(/* webpackChunkName: "Reset" */ './views/Reset.vue'),
      meta: {
        guest: true,
      },
    },
    {
      path: '/verify',
      name: 'verify',
      component: () =>
        import(/* webpackChunkName: "Verify" */ './views/Verify.vue'),
      meta: {
        guest: true,
      },
    },
    {
      path: '/join/:id',
      name: 'jointeam',
      component: () =>
        import(/* webpackChunkName: "JoinTeam" */ './views/JoinTeam.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: 'index',
          name: 'dashboardIndex',
          component: () =>
            import(
              /* webpackChunkName: "DashboardIndex" */ './views/Dashboard/DashboardIndex.vue'
            ),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'profile',
          name: 'profile',
          component: () =>
            import(
              /* webpackChunkName: "ProfilesIndex" */ './views/Profiles/ProfilesIndex.vue'
            ),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'profile/edit',
          name: 'profileedit',
          component: () =>
            import(
              /* webpackChunkName: "ProfilesEdit" */ './views/Profiles/ProfilesEdit.vue'
            ),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'profile/password',
          name: 'profilepassword',
          component: () =>
            import(
              /* webpackChunkName: "ProfilesPassword" */ './views/Profiles/ProfilesPassword.vue'
            ),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'profile/email',
          name: 'profileemail',
          component: () =>
            import(
              /* webpackChunkName: "ProfilesEmail" */ './views/Profiles/ProfilesEmail.vue'
            ),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'cart/:id',
          name: 'cart',
          component: () =>
            import(
              /* webpackChunkName: "CartPage" */ './views/Cart/CartPage.vue'
            ),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'catalogs',
          name: 'catalogs',
          component: () =>
            import(
              /* webpackChunkName: "CatalogsIndex" */ './views/Catalogs/CatalogsIndex.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'catalogs/add',
          name: 'catalogsAdd',
          component: () =>
            import(
              /* webpackChunkName: "CatalogsAdd" */ './views/Catalogs/CatalogsAdd.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'catalogs/:id',
          name: 'catalogsById',
          component: () =>
            import(
              /* webpackChunkName: "CatalogById" */ './views/Catalogs/CatalogById.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'catalogs/:id/edit',
          name: 'catalogsByIdEdit',
          component: () =>
            import(
              /* webpackChunkName: "CatalogByIdEdit" */ './views/Catalogs/CatalogByIdEdit.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'catalogs/:id/add',
          name: 'catalogsItemsAdd',
          component: () =>
            import(
              /* webpackChunkName: "CatalogItemsAdd" */ './views/Catalogs/CatalogItemsAdd.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'catalogitems/:id',
          name: 'catalogItemById',
          component: () =>
            import(
              /* webpackChunkName: "CatalogItemById" */ './views/Catalogs/CatalogItemById.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'catalogitems/edit/:id',
          name: 'catalogItemByIdEdit',
          component: () =>
            import(
              /* webpackChunkName: "CatalogItemByIdEdit" */ './views/Catalogs/CatalogItemByIdEdit.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'orders',
          name: 'orders',
          component: () =>
            import(
              /* webpackChunkName: "OrdersIndex" */ './views/Orders/OrdersIndex.vue'
            ),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'stores',
          name: 'stores',
          component: () =>
            import(
              /* webpackChunkName: "StoresIndex" */ './views/Stores/StoresIndex.vue'
            ),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'stores/:id',
          name: 'storesById',
          component: () =>
            import(
              /* webpackChunkName: "StoresById" */ './views/Stores/StoresById.vue'
            ),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'stores/:id/edit',
          name: 'storesByIdEdit',
          component: () =>
            import(
              /* webpackChunkName: "StoresByIdEdit" */ './views/Stores/StoresByIdEdit.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'stores/:id/add',
          name: 'storesByIdAddItem',
          component: () =>
            import(
              /* webpackChunkName: "StoresByIdAddItem" */ './views/Stores/StoresByIdAddItem.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'teams',
          name: 'teams',
          component: () =>
            import(
              /* webpackChunkName: "TeamsIndex" */ './views/Teams/TeamsIndex.vue'
            ),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'teams/:id',
          name: 'teamsById',
          component: () =>
            import(
              /* webpackChunkName: "TeamsById" */ './views/Teams/TeamsById.vue'
            ),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'teams/add',
          name: 'teamsAdd',
          component: () =>
            import(
              /* webpackChunkName: "TeamsAdd" */ './views/Teams/TeamsAdd.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'teams/:id/addmember',
          name: 'teamsAddMember',
          component: () =>
            import(
              /* webpackChunkName: "TeamsAddMember" */ './views/Teams/TeamsAddMember.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'teams/:id/edit',
          name: 'teamsByIdEdit',
          component: () =>
            import(
              /* webpackChunkName: "TeamsByIdEdit" */ './views/Teams/TeamsByIdEdit.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'teams/:id/removemember',
          name: 'teamsRemoveMember',
          component: () =>
            import(
              /* webpackChunkName: "TeamsRemoveMember" */ './views/Teams/TeamsRemoveMember.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'teams/:id/addstore',
          name: 'teamsAddStore',
          component: () =>
            import(
              /* webpackChunkName: "TeamsByIdAddStore" */ './views/Teams/TeamsByIdAddStore.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'members',
          name: 'members',
          component: () =>
            import(
              /* webpackChunkName: "MembersIndex" */ './views/Members/MembersIndex.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'members/add',
          name: 'membersAdd',
          component: () =>
            import(
              /* webpackChunkName: "MembersAdd" */ './views/Members/MembersAdd.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
        {
          path: 'members/:id',
          name: 'membersById',
          component: () =>
            import(
              /* webpackChunkName: "MemberById" */ './views/Members/MemberById.vue'
            ),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'members/:id/edit',
          name: 'membersByIdEdit',
          component: () =>
            import(
              /* webpackChunkName: "MemberByIdEdit" */ './views/Members/MemberByIdEdit.vue'
            ),
          meta: {
            requiresAuth: true,
            isAdmin: true,
          },
        },
      ],
    },
    {
      path: '/500',
      name: '500',
      component: () =>
        import(/* webpackChunkName: "ServerError" */ './views/ServerError.vue'),
    },
    {
      path: '*',
      name: '404',
      component: () =>
        import(
          /* webpackChunkName: "PageNotFound" */ './views/PageNotFound.vue'
        ),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      toast.error('Access Denied');
      next({
        path: '/',
        params: { nextUrl: to.fullPath },
      });
      return;
    }

    const member = $cookies.get('tb_member') || {};

    if (to.matched.some((record) => record.meta.isAdmin)) {
      if (get(member, 'isAdmin', false)) {
        next();
      } else {
        toast.error('Access Denied');
        next({ name: from.name });
      }
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (!store.getters.isLoggedIn) {
      next();
    } else {
      next({ name: 'dashboardIndex' });
    }
  } else {
    next();
  }
});

export default router;
