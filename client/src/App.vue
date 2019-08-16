<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <span v-if="isLoggedIn">
        <a @click="logout">Logout</a>
      </span>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  methods: {
    logout: async function() {
      await this.$store.dispatch('logout');
      this.$router.push({ name: 'login' });
    }
  },
  created: function() {
    this.$http.interceptors.response.use(undefined, function(err) {
      // eslint-disable-next-line
      return new Promise(function(resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch('logout');
        }
        throw err;
      });
    });
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Overpass&display=swap');

body,
html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Overpass', sans-serif;

  a {
    text-decoration: none;
    cursor: pointer;
  }
}
</style>
