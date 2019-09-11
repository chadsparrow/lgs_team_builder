<template>
  <div class="mt-2">
    <form @submit.prevent="addCatalogItem" novalidate class="container">
      <div class="form-group row"></div>
      <div class="row">
        <div class="col-sm-6">
          <button type="submit" class="btn btn-block btn-dark">Add Catalog Item</button>
        </div>
        <div class="col-sm-6">
          <router-link tag="a" class="btn btn-danger btn-block" :to="`/dashboard/catalogs/${id}`"
            >Cancel</router-link
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CatalogItemsAdd',
  data() {
    return {};
  },
  computed: {
    catalog: function() {
      return this.$store.getters.catalog;
    },
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
          link: `/dashboard/catalogs/${this.id}`
        },
        {
          text: 'Add Item',
          link: '#'
        }
      ];
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('getCatalog', this.$route.params.id);
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
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
