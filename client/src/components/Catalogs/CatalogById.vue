<template>
  <div class="page">
    <div class="top-buttons" v-if="catalog && catalog._id">
      <div class="row">
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
      </div>
    </div>
    <div class="gallery" v-if="catalogItems && catalogItems.length > 0">
      <div class="card" v-for="item of catalogItems" :key="item._id">
        <img src="@/assets/missing_item.jpg" class="card-img-top" alt="item.name" />
        <div class="card-body">
          <div class="row text-center">
            <span class="card-title col-sm-12">{{item.name}}</span>
            <small class="card-subtitle text-muted col-sm-12">ERP - {{item.productCode}}</small>
            <small class="card-subtitle text-muted col-sm-12">STYLE - {{item.styleCode}}</small>
          </div>
        </div>
        <div class="card-footer">
          <router-link
            class="btn btn-sm btn-info btn-block"
            :to="`/dashboard/catalogItems/${item._id}`"
          >View/Edit</router-link>
        </div>
      </div>
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

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 40px 1fr;
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
  grid-template-areas:
    'top-buttons'
    'gallery';
}
.gallery {
  display: flex;
  flex-flow: row wrap;

  .card {
    width: 14rem;
    margin: 0.6rem;

    &:hover {
      box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.4);
    }
  }
}

.topButtons {
  grid-area: top-buttons;
}

.gallery {
  grid-area: gallery;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>

