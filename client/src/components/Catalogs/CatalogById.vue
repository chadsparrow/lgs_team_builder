<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link tag="a" class="btn btn-sm" to="/dashboard/catalogs">Catalogs</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link
            class="btn btn-sm"
            tag="a"
            :to="`/dashboard/catalogs/${id}`"
          >{{ catalog.brand }} - {{ catalog.season }} - {{ catalog.year }}</router-link>
        </li>
        <div class="ml-auto">
          <router-link
            class="btn btn-sm btn-dark mr-2"
            tag="a"
            :to="`/dashboard/catalogs/${id}/add`"
          >
            <i class="fas fa-plus" style="vertical-align: middle;"></i>
          </router-link>
          <router-link class="btn btn-sm btn-dark" tag="a" :to="`/dashboard/catalogs/${id}/edit`">
            <i class="fas fa-cog" style="vertical-align: middle;"></i>
          </router-link>
        </div>
      </ol>
    </nav>

    <span v-if="catalogItems && catalogItems.length === 0">No items found for this catalog</span>
    <span v-else>Catalog Items</span>
  </div>
</template>

<script>
export default {
  name: 'CatalogById',
  computed: {
    catalog: function() {
      return this.$store.getters.catalog;
    },
    id: function() {
      return this.catalog._id;
    },
    catalogItems: function() {
      return this.$store.getters.catalogItems;
    }
  },
  beforeCreate: async function() {
    try {
      await this.$store.dispatch('getCatalog', this.$route.params.id);
      await this.$store.dispatch('getCatalogItems', this.$route.params.id);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  methods: {}
};
</script>

