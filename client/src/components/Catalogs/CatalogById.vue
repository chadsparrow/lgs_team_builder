<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-2">
        <router-link class="btn btn-block btn-info" :to="`/dashboard/catalogs/${id}/add`" tag="a">
          <i class="fas fa-plus mr-2" style="vertical-align: middle;"></i> Add Catalog Item
        </router-link>
      </div>
      <div class="col-sm-2">
        <router-link class="btn btn-block btn-info" :to="`/dashboard/catalogs/${id}/edit`" tag="a">
          <i class="fas fa-cog mr-2" style="vertical-align: middle;"></i>Edit Catalog
        </router-link>
      </div>
      <div
        class="col-sm-12 mt-4"
        v-if="catalogItems && catalogItems.length === 0"
      >No items found for this catalog</div>
      <div class="col-sm-12 mt-4" v-else>Catalog Items</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CatalogById',
  data() {
    return {
      catalog: {},
      catalogItems: []
    };
  },
  computed: {
    id: function() {
      return this.catalog._id;
    },
    breadcrumbs: function() {
      return [
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
    }
  },
  created: async function() {
    try {
      const catalog = await this.$store.dispatch('getCatalog', this.$route.params.id);
      this.catalog = catalog.data;
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);

      const catalogItems = await this.$store.dispatch('getCatalogItems', this.catalog._id);
      this.catalogItems = catalogItems.data;
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  methods: {}
};
</script>
