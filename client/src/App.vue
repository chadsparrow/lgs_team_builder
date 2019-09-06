<template>
  <div id="app">
    <loading
      :active.sync="isLoading"
      :is-full-page="true"
      color="#FFF"
      background-color="#000"
      :opacity="0.1"
      loader="dots"
    ></loading>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  components: {
    Loading
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },
    isLoading: function() {
      return this.$store.getters.isLoading;
    }
  },
  methods: {
    logout: async function() {
      await this.$store.dispatch('logout');
      this.$router.push({ name: 'login' }).catch(err => {});
    }
  },
  created: function() {
    this.$http.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        if (error.response.status !== 401) {
          return new Promise((resolve, reject) => {
            reject(error);
          });
        }

        localStorage.removeItem('token');
        localStorage.removeItem('member');
        this.$store.dispatch('logout');
        this.$router.push({ name: 'login' });

        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
    );
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Overpass:200,300,400,700,900&display=swap');

body,
html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Overpass', sans-serif;
  font-size: 16px;

  a {
    cursor: pointer;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.1s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

body {
  height: 100vh;
  width: 100vw;
  background-image: linear-gradient(to bottom right, white, #d6d6d6);
}

tr:hover {
  cursor: pointer;
}

.table > tbody > tr > td {
  vertical-align: middle;
}
.table > tbody > tr > th {
  vertical-align: middle;
}

.table-hover tbody tr:hover td,
.table-hover tbody tr:hover th,
.table-hover tbody tr:hover a {
  background-color: #111;
  color: white;
}

.pagination > .active > a {
  background-color: #111 !important;
  color: white;
  border: 0px solid grey;
}

.pagination > .page-item > a {
  color: black;
}
</style>
