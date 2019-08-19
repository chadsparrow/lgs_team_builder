<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarsExample02"
      aria-controls="navbarsExample02"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse">
      <ul class="navbar-nav ml-auto notifications">
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item">
          <span class="nav-link" v-if="isLoggedIn">
            <a @click="logout">Logout</a>
          </span>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TopNav',
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
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  background-color: #222;
  color: white;
  padding: 0.6em;
  padding-right: 2em;
  grid-area: topnav;
}
</style>

