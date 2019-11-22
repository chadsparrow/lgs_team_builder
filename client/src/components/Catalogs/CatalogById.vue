<template>
  <div class="page" v-if="dataReady">
    <div class="header">
      <div>
        <img
          src="@/assets/garneau_logo.png"
          alt="Garneau Logo"
          v-if="catalog.brand === 'GARNEAU'"
        />
        <img src="@/assets/sugoi_logo.png" alt="Sugoi Logo" v-if="catalog.brand === 'SUGOI'" />
        <img
          src="@/assets/sombrio_logo.png"
          alt="Sombrio Logo"
          v-if="catalog.brand === 'SOMBRIO'"
        />
        {{ catalog.season }} - {{ catalog.year }}
      </div>
      <div class="form-group form-inline">
        <label for="catalogItemSearch" class="mr-2">Search:</label>
        <input
          type="text"
          id="catalogItemSearch"
          v-if="catalogItems.length > 0"
          class="form-control form-control-sm mr-3"
          v-model="catalogItemSearch"
          placeholder="Enter any product info..."
          autofocus
        />
        <small class="text-muted">Showing: {{ filteredCount }}/{{ catalogItems.length }}</small>
      </div>
      <div>
        <router-link class="btn btn-sm" :to="`/dashboard/catalogs/${catalog._id}/add`" tag="a">
          <i class="fas fa-plus fa-lg"></i>
        </router-link>
        <router-link class="btn btn-sm" :to="`/dashboard/catalogs/${catalog._id}/edit`" tag="a">
          <i class="fas fa-cog fa-lg"></i>
        </router-link>
        <button class="btn btn-sm" @click="setView(false)">
          <i class="fas fa-align-justify fa-lg"></i>
        </button>
        <button class="btn btn-sm" @click="setView(true)">
          <i class="fas fa-grip-horizontal fa-lg"></i>
        </button>
      </div>
    </div>
    <div :class="viewGrid ? 'galleryThumb' : 'galleryList'" v-if="filteredItems.length > 0">
      <router-link
        class="thumbnail"
        v-for="item of filteredItems"
        :key="item._id"
        :to="`/dashboard/catalogItems/${item._id}`"
      >
        <div class="info-container">
          <div class="thumbnail-img">
            <img :src="getImgUrl(item)" :alt="item.nameEN" />
          </div>
          <div class="thumbnail-body">
            <span>{{ item.nameEN }}</span>
            <br />
            <small class="text-muted">PRODUCT - {{ item.productCode }}</small>
            <br />
            <small class="text-muted">STYLE - {{ item.styleCode }}</small>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CatalogById',
  data() {
    return {
      viewGrid: false,
      catalogItemSearch: ''
    };
  },
  computed: {
    dataReady: function() {
      return this.$store.getters.dataReady;
    },
    catalog: function() {
      return this.$store.getters.currentCatalog;
    },
    filteredItems: function() {
      return this.catalogItems.filter(item => {
        if (
          item.categories.includes(this.catalogItemSearch.toUpperCase()) ||
          item.nameEN.toLowerCase().includes(this.catalogItemSearch.toLowerCase()) ||
          item.nameFR.toLowerCase().includes(this.catalogItemSearch.toLowerCase()) ||
          item.productCode.toLowerCase().includes(this.catalogItemSearch.toLowerCase()) ||
          item.styleCode.toLowerCase().includes(this.catalogItemSearch.toLowerCase())
        ) {
          if (
            (this.catalogItemSearch.toLowerCase() === "men's" ||
              this.catalogItemSearch.toLowerCase() === 'men') &&
            (item.nameEN.toLowerCase().includes('women') === true ||
              item.nameEN.toLowerCase().includes("women's") === true)
          ) {
            return null;
          } else {
            return item;
          }
        }
      });
    },
    filteredCount: function() {
      return this.filteredItems.length || this.catalogItems.length;
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
      this.$store.dispatch('setDataReadyTrue');
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      this.$store.dispatch('setDataReadyTrue');
    }
  },
  beforeDestroy: function() {
    this.$store.dispatch('setDataReadyFalse');
  },
  methods: {
    getImgUrl(item) {
      if (item.images.length === 0) return require('@/assets/missing_item_800.png');
      const folderName = `${this.catalog.brand}_${this.catalog.season}_${this.catalog.year}`;
      return `/images/catalogs/${folderName}/800/${item.images[0]}_800.jpg`;
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
  grid-template-rows: 40px auto;
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
  grid-template-areas:
    'header'
    'gallery';

  .header {
    grid-area: header;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: whitesmoke;
    padding: 0.75rem;
    border-radius: 5px;
    font-weight: 700;
    height: 40px;

    img {
      height: 35px;
      margin-right: 1.5rem;
    }

    .form-control {
      width: 500px;
    }
  }

  a {
    text-decoration: none;
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

    a {
      color: black;
    }

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
    overflow-x: hidden;
    overflow-y: auto;

    .thumbnail {
      border-radius: 5px;
      background-color: white;
      color: black;
      height: 125px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-right: 1rem;
      margin-bottom: 0.75rem;

      a {
        color: black;
      }

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
}
</style>
