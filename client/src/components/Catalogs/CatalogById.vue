<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link tag="a" class="btn btn-sm" to="/dashboard/catalogs">Catalogs</router-link>
      </li>
      <li class="breadcrumb-item">
        <router-link
          class="btn btn-sm active"
          tag="a"
          :to="`/dashboard/catalogs/${id}`"
        >{{ catalog.brand }} - {{ catalog.season }} - {{ catalog.year }}</router-link>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  computed: {
    catalog: function() {
      return this.$store.getters.catalog;
    },
    id: function() {
      return this.catalog._id;
    }
  },
  created: function() {
    this.$store.dispatch('getCatalog', this.$route.params.id);
  }
};
</script>


