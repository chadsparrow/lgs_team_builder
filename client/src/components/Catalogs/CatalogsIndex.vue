<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link class="active btn btn-sm btn-dark" tag="a" to="/dashboard/catalogs">Catalogs</router-link>
        </li>
        <router-link to="/dashboard/catalogs/add" class="btn btn-sm btn-dark ml-auto">Add Catalog</router-link>
      </ol>
    </nav>

    <span v-if="!catalogs">No Catalogs Found.</span>
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr
            v-for="(catalog, index) of catalogs"
            :key="catalog._id"
            @click.prevent="loadCatalog(catalog._id)"
          >
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ catalog.brand }}</td>
            <td>{{ catalog.year }}</td>
            <td>{{ catalog.season }}</td>
            <td style="width: 100px;">
              <router-link
                class="btn btn-sm btn-info"
                :to="`/dashboard/catalogs/${catalog._id}`"
              >View/Edit</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  created: async function() {
    await this.$store.dispatch('getCatalogs');
  },
  computed: {
    catalogs: function() {
      return this.$store.getters.catalogs;
    }
  },
  methods: {
    loadCatalog: function(id) {
      this.$router.push({ name: 'catalogid', params: { id } });
    }
  }
};
</script>

<style lang="scss" scoped>
tr:hover {
  cursor: pointer;
}

.catalogCover {
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  height: 65vh;
  min-width: 200px;
}
</style>
