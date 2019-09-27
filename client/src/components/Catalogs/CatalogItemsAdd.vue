<template>
  <div class="mt-2">
    <div class="container" v-if="catalog && catalog._id">
      <form @submit.prevent="addCatalogItem" novalidate>
        <div class="form-group row"></div>
        <div class="row">
          <div class="col-sm-6">
            <button type="submit" class="btn btn-block btn-info">Add Catalog Item</button>
          </div>
          <div class="col-sm-6">
            <router-link
              tag="a"
              class="btn btn-danger btn-block"
              :to="`/dashboard/catalogs/${catalog._id}`"
            >Cancel</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CatalogItemsAdd',
  computed: {
    catalog: function() {
      return this.$store.getters.currentCatalog;
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
          link: `/dashboard/catalogs/${this.catalog._id}`
        },
        {
          text: 'Add Item',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    addCatalogItem: async function() {
      //
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  width: 500px;
}
</style>
