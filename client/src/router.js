import Vue from 'vue';
import Router from 'vue-router';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Home from './views/Home.vue';
import Dashboard from './views/Dashboard.vue';
import CatalogsIndex from './components/Catalogs/CatalogsIndex.vue';
import CatalogsAdd from './components/Catalogs/CatalogsAdd.vue';
import CatalogById from './components/Catalogs/CatalogById.vue';
// import store from './store';

Vue.use(Router);

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
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
          props: true,
          meta: {
            requiresAuth: true,
            isAdmin: true
          }
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token') == null) {
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
