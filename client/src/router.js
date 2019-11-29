import Vue from 'vue';
import Router from 'vue-router';

const Login = () => import('./components/Login.vue');
const JoinTeam = () => import('./components/JoinTeam.vue');
const Dashboard = () => import('./views/Dashboard.vue');
// const DashboardIndex =()=>import ('./components/Dashboard/DashboardIndex.vue');
const PageNotFound = () => import('./views/PageNotFound.vue');
const ServerError = () => import('./views/ServerError.vue');
const ProfilesIndex = () => import('./components/Profiles/ProfilesIndex.vue');
const ProfilesEdit = () => import('./components/Profiles/ProfilesEdit.vue');
const ProfilesPassword = () => import('./components/Profiles/ProfilesPassword.vue');
const ProfilesEmail = () => import('./components/Profiles/ProfilesEmail.vue');
const CatalogsIndex = () => import('./components/Catalogs/CatalogsIndex.vue');
const CatalogsAdd = () => import('./components/Catalogs/CatalogsAdd.vue');
const CatalogById = () => import('./components/Catalogs/CatalogById.vue');
const CatalogByIdEdit = () => import('./components/Catalogs/CatalogByIdEdit.vue');
const CatalogItemsAdd = () => import('./components/Catalogs/CatalogItemsAdd.vue');
const CatalogItemById = () => import('./components/Catalogs/CatalogItemById.vue');
const OrdersIndex = () => import('./components/Orders/OrdersIndex.vue');
const MembersIndex = () => import('./components/Members/MembersIndex.vue');
const MembersAdd = () => import('./components/Members/MembersAdd.vue');
const MemberById = () => import('./components/Members/MemberById.vue');
const MemberByIdEdit = () => import('./components/Members/MemberByIdEdit.vue');
const StoresIndex = () => import('./components/Stores/StoresIndex.vue');
const StoresById = () => import('./components/Stores/StoresById.vue');
const StoresByIdEdit = () => import('./components/Stores/StoresByIdEdit.vue');
const StoresByIdAddItem = () => import('./components/Stores/StoresByIdAddItem.vue');
const TeamsIndex = () => import('./components/Teams/TeamsIndex.vue');
const TeamsAdd = () => import('./components/Teams/TeamsAdd.vue');
const TeamsAddMember = () => import('./components/Teams/TeamsAddMember.vue');
const TeamsRemoveMember = () => import('./components/Teams/TeamsRemoveMember.vue');
const TeamsById = () => import('./components/Teams/TeamsById.vue');
const TeamsByIdEdit = () => import('./components/Teams/TeamsByIdEdit.vue');
const TeamsByIdAddStore = () => import('./components/Teams/TeamsByIdAddStore.vue');

import store from './store';

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
      path: '/join/:id',
      name: 'jointeam',
      component: JoinTeam
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
          meta: {
            requiresAuth: true
          }
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
          path: 'profile/password',
          name: 'profilepassword',
          component: ProfilesPassword,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'profile/email',
          name: 'profileemail',
          component: ProfilesEmail,
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
          path: 'catalogitems/:id',
          name: 'catalogItemById',
          component: CatalogItemById,
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
          path: 'stores/:id/edit',
          name: 'storesByIdEdit',
          component: StoresByIdEdit,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'stores/:id/add',
          name: 'storesByIdAddItem',
          component: StoresByIdAddItem,
          meta: {
            requiresAuth: true,
            isAdmin: true
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
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'teams/:id/removemember',
          name: 'teamsRemoveMember',
          component: TeamsRemoveMember,
          meta: {
            requiresAuth: true,
            isAdmin: true
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
            requiresAuth: true
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
      path: '/500',
      name: '500',
      component: ServerError
    },
    {
      path: '*',
      name: '404',
      component: PageNotFound
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      Vue.toasted.error('Access Denied');
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      });
      return;
    }

    const memberId = localStorage.getItem('member');
    let member = store.getters.loggedInMember;
    if (memberId && !member.name) {
      await store.dispatch('setLoggedInMember', memberId);
      member = store.getters.loggedInMember;
      next();
    }

    if (to.matched.some(record => record.meta.isAdmin)) {
      if (member && member.isAdmin) {
        next();
      } else {
        Vue.toasted.error('Access Denied');
        next({ name: from.name });
      }
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guest)) {
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
