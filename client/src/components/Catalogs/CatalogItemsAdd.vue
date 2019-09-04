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
        <li class="breadcrumb-item">
          <router-link tag="a" :to="`/dashboard/catalogs/${id}/add`" class="btn btn-sm">Add Item</router-link>
        </li>
      </ol>
    </nav>
    <form @submit.prevent="addCatalogItem" novalidate class="container">
      <div class="form-group row"></div>
      <div class="row">
        <div class="col-sm-6">
          <button type="submit" class="btn btn-block btn-dark">Add Catalog Item</button>
        </div>
        <div class="col-sm-6">
          <router-link
            tag="a"
            class="btn btn-danger btn-block"
            :to="`/dashboard/catalogs/${id}`"
          >Cancel</router-link>
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
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('getCatalog', this.$route.params.id);
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
  margin-top: 40px;
  width: 500px;
  font-weight: 200;
}

label {
  font-size: 0.9rem;
  margin-bottom: 0px;
}
</style>
