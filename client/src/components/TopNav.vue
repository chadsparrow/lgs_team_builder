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
          <router-link to="#" tag="a" v-if="member">
            <avatar
              :username="member.name"
              :size="42"
              background-color="#E1E1E1"
              color="#000"
              :rounded="false"
              :src="avatarUrl"
            ></avatar>
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link btn btn-danger" @click="logout">Logout</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import Avatar from 'vue-avatar';

export default {
  name: 'TopNav',
  components: {
    Avatar
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },
    member: function() {
      return this.$store.getters.getCurrentMember;
    },
    avatarUrl: function() {
      return this.member.avatarUrl;
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
  grid-area: topnav;

  .nav-item {
    margin-left: 0.9rem;
  }

  .nav-link {
    color: white !important;
  }

  .navbar-nav {
    margin-right: 0.75rem;
  }
}
.vue-avatar--wrapper {
  border-radius: 0.25rem !important;
}
</style>
