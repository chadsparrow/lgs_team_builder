<template>
  <div class="page">
    <div class="header" v-if="catalog">
      <div>{{catalog.brand}} - {{catalog.season}} - {{catalog.year}}</div>
      <div>
        <button class="btn btn-sm" @click="setView(true)">
          <i class="fas fa-grip-horizontal fa-lg"></i>
        </button>
        <button class="btn btn-sm" @click="setView(false)">
          <i class="fas fa-align-justify fa-lg"></i>
        </button>
      </div>
    </div>
    <div
      :class="viewGrid ? 'galleryThumb' : 'galleryList'"
      v-if="catalogItems && catalogItems.length > 0"
    >
      <div class="thumbnail" v-for="item of catalogItems" :key="item._id">
        <div class="info-container">
          <div class="thumbnail-img">
            <img :src="getImgUrl(item)" :alt="item.name" />
          </div>
          <div class="thumbnail-body">
            <span>{{item.name}}</span>
            <br />
            <small class="text-muted">PRODUCT - {{item.productCode}}</small>
            <br />
            <small class="text-muted">STYLE - {{item.styleCode}}</small>
          </div>
        </div>
      </div>
    </div>
    <div class="buttonGroup" v-if="catalog && catalog._id">
      <div class="row">
        <div class="col-md-6 mb-2">
          <router-link
            class="btn btn-block btn-success"
            :to="`/dashboard/catalogs/${catalog._id}/add`"
            tag="a"
          >Add Item</router-link>
        </div>
        <div class="col-md-6">
          <router-link
            class="btn btn-block btn-success"
            :to="`/dashboard/catalogs/${catalog._id}/edit`"
            tag="a"
          >
            <i class="fas fa-cog mr-2" style="vertical-align: middle;"></i>Settings
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CatalogById',
  data() {
    return {
      viewGrid: true
    };
  },
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
  methods: {
    getImgUrl(item) {
      if (item.images.length === 0) return require('@/assets/missing_item_800.png');

      return require(`${item.images[0]}`);
    },
    setView(bool) {
      if (bool) this.viewGrid = true;
      if (!bool) this.viewGrid = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 35px 1fr 40px;
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
  grid-template-areas:
    'header'
    'gallery'
    'footer';

  .header {
    grid-area: header;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: whitesmoke;
    padding: 0.75rem;
    border-radius: 5px;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .galleryThumb {
    grid-area: gallery;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    grid-auto-rows: min-content;
    grid-gap: 0.75rem;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0.25rem;

    .thumbnail {
      position: relative;
      border-radius: 5px;
      background-color: white;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 100%;

      .thumbnail-img {
        img {
          width: 100%;
          border-radius: 5px 5px 0 0;
          object-fit: cover;
        }
      }

      .thumbnail-body {
        text-align: center;
        padding: 0.4rem;
      }

      &:hover {
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.4);
      }
    }
  }

  .galleryList {
    grid-area: gallery;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 0.75rem;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0.25rem;

    .thumbnail {
      border-radius: 5px;
      background-color: white;
      height: 125px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-right: 1rem;

      .info-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .thumbnail-img {
          width: 125px;
          margin-right: 1rem;
          img {
            width: 100%;
            height: 100%;
            border-radius: 5px 0 0 5px;
            object-fit: cover;
          }
        }

        .thumbnail-body {
          padding: 0.4rem;
          span {
            font-size: 1.5rem;
            font-weight: 700;
          }
        }
      }

      &:hover {
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.4);
      }
    }
  }

  .buttonGroup {
    grid-area: footer;
  }
}
</style>

