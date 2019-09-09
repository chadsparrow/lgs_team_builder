<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link class="btn btn-sm" tag="a" to="/dashboard/profile">My Profile</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link class="btn btn-sm" tag="a" to="/dashboard/profile">{{member.name}}</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link class="btn btn-sm" tag="a" to="#">Edit</router-link>
        </li>
        <div class="ml-auto">
          <router-link to="#" class="btn btn-sm btn-danger">
            <i class="fas fa-trash" style="vertical-align: middle;"></i>
          </router-link>
        </div>
      </ol>
    </nav>
    <span>Edit Profile</span>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';

export default {
  name: 'ProfilesEdit',
  components: {
    Avatar
  },
  data() {
    return {
      breadcrumbs: [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'My Profile',
          link: '/dashboard/profile'
        },
        {
          text: 'Edit',
          link: '#'
        }
      ]
    };
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  }
};
</script>

<style lang="scss" scoped>
.vue-avatar--wrapper {
  border-radius: 1rem !important;
}
</style>