<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#topNav"
      aria-controls="topNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="topNav">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link class="nav-link btn btn-dark" to="#">Profile</router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link btn btn-dark" @click="logout">Logout</a>
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
    },
    member: function() {
      return this.$store.getters.getCurrentMember;
    }
  },
  methods: {
    logout: async function() {
      await this.$store.dispatch('logout');
      this.$router.push({ name: 'login' });
      this.$toasted.clear();
      this.$toasted.success('Logged Out');
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  background-color: #222 !important;
  color: white;
  padding: 0.6em;
  padding-right: 1.85em;
  grid-area: topnav;

  .nav-item {
    margin-left: 0.5em;

    a {
      color: white;
    }
  }
}
</style>
