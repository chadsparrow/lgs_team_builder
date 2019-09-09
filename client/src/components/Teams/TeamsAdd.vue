<template>
  <div>
    <h1>Add Team</h1>
  </div>
</template>

<script>
export default {
  name: 'TeamsAdd',
  data() {
    return {
      breadcrumbs: [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Teams',
          link: '/dashboard/teams'
        },
        {
          text: 'Add Team',
          link: '#'
        }
      ]
    };
  },
  created: async function() {
    try {
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  computed: {}
};
</script>
