<template>
  <div>
    <h1>Edit Profile</h1>
  </div>
</template>

<script>
export default {
  name: 'ProfilesEdit',
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
