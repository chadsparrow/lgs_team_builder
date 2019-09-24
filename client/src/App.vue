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

.sidebar-left {
  flex: initial;
  width: 255px;

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
      padding: 5px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      &:hover {
        background-color: $blue-color;
        color: $white-text;
      }

      .memberIcons {
        display: flex;
        justify-content: flex-start;
      }
    }
  }
}

.middle-section {
  flex: 1;
  overflow: auto;
  padding: 1rem;

  .form-group {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  label {
    color: $blue-color;
  }
}

.sidebar-right {
  flex: initial;
  width: 300px;
  small {
    font-size: 0.9em;
    color: $blue-color;
  }
  font-size: 0.9rem;
  span {
    background-color: rgba(255, 255, 255, 0.5);
    padding: 0.4rem;
    border-radius: 5px;
    display: block;
  }
}

.section-header {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  color: $white-text;
  display: flex;
  align-items: center;
  justify-content: space-between;

  label {
    font-size: 0.85rem;
  }
}

::-webkit-scrollbar {
  width: 14px;
  height: 18px;
}
::-webkit-scrollbar-thumb {
  height: 10px;
  border: 3px solid rgba(0, 0, 0, 0);
  background-clip: padding-box;
  background-color: $blue-color;
  border-radius: 10px;
}

@media (max-width: 800px) {
  .sidebar-left,
  .middle-section,
  .sidebar-right {
    flex: none;
  }
}
</style>
