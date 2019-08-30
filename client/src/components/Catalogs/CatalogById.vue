<template>
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
          :to="`/dashboard/catalogs/${id}/edit`"
          class="btn btn-sm btn-dark"
        >Edit Settings</router-link>
      </div>
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
  created: async function() {
    try {
      await this.$store.dispatch('getCatalog', this.$route.params.id);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  methods: {}
};
</script>
