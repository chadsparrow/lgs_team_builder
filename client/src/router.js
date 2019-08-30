import Vue from 'vue';
import Router from 'vue-router';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Dashboard from './views/Dashboard.vue';
import PageNotFound from './views/PageNotFound.vue';
import CatalogsIndex from './components/Catalogs/CatalogsIndex.vue';
import CatalogsAdd from './components/Catalogs/CatalogsAdd.vue';
import CatalogById from './components/Catalogs/CatalogById.vue';
import CatalogByIdEdit from './components/Catalogs/CatalogByIdEdit.vue';
import OrdersIndex from './components/Orders/OrdersIndex.vue';
import MembersIndex from './components/Members/MembersIndex.vue';
import MembersAdd from './components/Members/MembersAdd.vue';
import MemberById from './components/Members/MemberById.vue';
import MemberByIdEdit from './components/Members/MemberByIdEdit.vue';
import StoresIndex from './components/Stores/StoresIndex.vue';
import TeamsIndex from './components/Teams/TeamsIndex.vue';

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
          name: 'addCatalog',
          component: CatalogsAdd,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'catalogs/:id',
          name: 'catalogid',
          component: CatalogById,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'catalogs/:id/edit',
          name: 'catalogidedit',
          component: CatalogByIdEdit,
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
          path: 'teams',
          name: 'teams',
          component: TeamsIndex,
          meta: {
            requiresAuth: true
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
          name: 'addMember',
          component: MembersAdd,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'members/:id',
          name: 'memberid',
          component: MemberById,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        },
        {
          path: 'members/:id/edit',
          name: 'memberidedit',
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
      let member = JSON.parse(sessionStorage.getItem('member'));
      if (to.matched.some(record => record.meta.isAdmin)) {
        if (member.isAdmin) {
          next();
        } else {
          Vue.toasted.error('Access Denied');
          next({ name: 'dashboard' });
        }
      } else {
        next();
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('token') == null) {
      next();
    } else {
      next({ name: 'dashboard' });
    }
  } else {
    next();
  }
});

export default router;
