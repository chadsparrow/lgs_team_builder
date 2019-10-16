<template>
  <h6>{{catalogItem.nameEN}}</h6>
</template>

<script>
export default {
  name: 'CatalogItemById',
  computed: {
    catalog: function() {
      return this.$store.getters.currentCatalog;
    },
    catalogItem: function() {
      return this.$store.getters.currentCatalogItem;
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('getCatalogItem', this.$route.params.id);
      await this.$store.dispatch('getCatalog', this.catalogItem.catalogId._id);
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Catalogs',
          link: '/dashboard/catalogs'
        },
        {
          text: `${this.catalog.brand} - ${this.catalog.season} - ${this.catalog.year}`,
          link: `/dashboard/catalogs/${this.catalog._id}`
        },
        {
          text: `${this.catalogItem.nameEN}`,
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  }
};
</script>

<style>
</style>

