<template>
  <div class="container-fluid">
    <div class="row" v-if="catalog && catalog._id">
      <div class="col-sm-3">
        <router-link
          class="btn btn-block btn-info"
          :to="`/dashboard/catalogs/${catalog._id}/add`"
          tag="a"
        >
          <i class="fas fa-plus mr-2" style="vertical-align: middle;"></i> Add Catalog Item
        </router-link>
      </div>
      <div class="col-sm-3">
        <router-link
          class="btn btn-block btn-info"
          :to="`/dashboard/catalogs/${catalog._id}/edit`"
          tag="a"
        >
          <i class="fas fa-cog mr-2" style="vertical-align: middle;"></i>Edit Catalog
        </router-link>
      </div>
      <div class="col-sm-12 mt-4" v-if="catalogItems && catalogItems.length > 0">Catalog Items</div>
      <div class="col-sm-12 mt-4" v-else>No items found for this catalog</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CatalogById',
  computed: {
    catalog: function() {
      return this.$store.getters.currentCatalog;
    },
    catalogItems: function() {
      return this.$store.getters.currentCatalogItems;
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('getCatalog', this.$route.params.id);
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Catalogs',
          link: '/dashboard/catalogs'
        },
        {
          text: `${this.catalog.brand} - ${this.catalog.season} - ${this.catalog.year}`,
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getCatalogItems', this.catalog._id);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {}
};
</script>
