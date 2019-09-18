<template>
  <div id="app">
    <loading
      :active.sync="isLoading"
      :is-full-page="true"
      color="#111"
      background-color="#000"
      :opacity="0.0"
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
      this.$router.push({ name: 'login' }).catch(() => {});
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

    this.$http.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token && config.url.includes('/api/v1')) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
      },
      err => {
        return Promise.reject(err);
      }
    );
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Overpass:200,300,400,700,900&display=swap');

$dark-color: #111111;
$blue-color: #17a2b8;
$label-color: #999999;
$white-text: #ffffff;
$black-text: #000000;

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

.table > tbody > tr > td,
.table > tbody > tr > th {
  vertical-align: middle;
}

.table-hover {
  tbody {
    tr:hover {
      td {
        background-color: $blue-color;
        color: $white-text;
        cursor: pointer;
      }
    }
  }
}

.pagination {
  .active {
    a {
      background-color: $blue-color !important;
      color: $white-text;
      border: 0px solid grey;
    }
  }
  .page-item {
    a {
      color: $black-text;
    }
  }
}

label {
  font-size: 0.9rem;
  margin-bottom: 0px;
  margin-top: 4px;
  color: $label-color;
  margin-left: 4px;
}

.vue-avatar--wrapper {
  border-radius: 1rem !important;
}

.sidebar {
  flex: 0 0 255px;

  span {
    font-size: 0.8em;
  }

  .placeholderImg {
    border-radius: 1rem;
    background-color: $white-text;
    width: 225px;
    height: 225px;
  }

  .list-group {
    width: 100%;
    overflow: auto;
    max-height: 250px;

    .list-group-item {
      height: 35px;
      padding: 5px 15px;
      &:hover {
        background-color: $blue-color;
        color: $white-text;
        cursor: pointer;
      }
    }
  }
}

.infoSection {
  form {
    max-width: 800px;
    .form-group {
      margin-top: 0px;
      margin-bottom: 0px;
    }
    .section-header {
      color: $white-text;
      padding: 0.5rem;
      border-radius: 4px;

      label {
        color: $white-text;
      }
    }
  }
}

@media (max-width: 575px) {
  .sidebar {
    flex: none;
  }
}
</style>
