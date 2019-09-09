<template>
  <h1>Stores</h1>
</template>

<script>
export default {
  name: 'StoresIndex',
  data() {
    return {
      breadcrumbs: [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Stores',
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
  }
};
</script>

<style></style>
