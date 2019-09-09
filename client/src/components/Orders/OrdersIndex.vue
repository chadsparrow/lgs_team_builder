<template>
  <h1>Orders</h1>
</template>

<script>
export default {
  name: 'OrdersIndex',
  data() {
    return {
      breadcrumbs: [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Orders',
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
