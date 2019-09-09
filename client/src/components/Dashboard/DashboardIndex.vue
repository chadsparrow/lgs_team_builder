<template>
  <h1>DASHBOARD INDEX</h1>
</template>

<script>
export default {
  data() {
    return {
      breadcrumbs: [{ text: 'Dashboard', link: '/dashboard/index' }]
    };
  },
  created: async function() {
    await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
  }
};
</script>
