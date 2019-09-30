<template>
  <nav class="navbar navbar-expand navbar-dark p-4">
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
      <Breadcrumbs />
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/dashboard/profile" tag="a" v-if="member">
            <avatar
              :username="member.name"
              :size="42"
              background-color="#FFF"
              color="#000"
              :rounded="false"
              :src="member.avatarUrl"
            ></avatar>
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link btn btn-danger" @click="logout">
            <span>Logout</span>
            <i class="fas fa-sign-out-alt"></i>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import Avatar from 'vue-avatar';
import Breadcrumbs from '../components/Breadcrumbs.vue';

export default {
  name: 'TopNav',
  components: {
    Avatar,
    Breadcrumbs
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    }
  },
  methods: {
    logout: async function() {
      await this.$store.dispatch('logout');
      this.$router.push({ name: 'login' });
      this.$toasted.clear();
      this.$toasted.success('Logged Out - See ya!', { icon: 'sign-out-alt' });
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  grid-area: topnav;

  .nav-item {
    margin-left: 0.9rem;
  }

  .nav-link {
    color: white !important;
  }

  a {
    i {
      margin-left: 0.5rem;
    }
  }
}

.vue-avatar--wrapper {
  border-radius: 0.25rem !important;
}
</style>
