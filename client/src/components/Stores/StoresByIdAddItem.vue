<template>
  <div class="page" v-if="dataReady">
    <div class="catalog-list">
      <div class="form-group catalogDropDown">
        <div class="brand-logo mb-2">
          <img
            src="@/assets/garneau_logo.png"
            alt="Garneau Logo"
            v-if="store.brand === 'GARNEAU'"
          />
          <img src="@/assets/sugoi_logo.png" alt="Sugoi Logo" v-if="store.brand === 'SUGOI'" />
          <img
            src="@/assets/sombrio_logo.png"
            alt="Sombrio Logo"
            v-if="store.brand === 'SOMBRIO'"
          />
        </div>
        <small for="catalogSelection">Select your catalog</small>
        <select
          class="form-control form-control-sm"
          id="catalogSelection"
          v-model="currentCatalog"
          @change="getCatalog(catalog._id)"
        >
          <option v-for="catalog in catalogs" :key="catalog._id" :value="catalog"
            >{{ catalog.season }} -{{ catalog.year }}</option
          >
        </select>
      </div>
      <div class="form-group form-inline catalogItemsSearchbar" v-if="currentCatalog">
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
      <div class="catalogItemsList" v-if="currentCatalog">
        <ul class="list-group">
          <li class="list-group-item" v-for="item in filteredItems" :key="item._id">
            <div class="itemImage"><img :src="getImgUrl(item)" :alt="item.nameEN" /></div>
            <div class="itemInfo">
              {{ item.nameEN }}<br />
              <small class="text-muted">{{ item.productCode }} / {{ item.styleCode }}</small>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="store-items"></div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'StoresByIdAddItem',
  components: {
    draggable
  },
  data() {
    return {
      currentCatalog: {},
      catalogItemSearch: ''
    };
  },
  computed: {
    dataReady: function() {
      return this.$store.getters.dataReady;
    },
    store: function() {
      return this.$store.getters.currentStore;
    },
    catalogs: function() {
      return this.$store.getters.catalogs;
    },
    catalog: function() {
      return this.$store.getters.currentCatalog;
    },
    catalogItems: function() {
      return this.$store.getters.currentCatalogItems;
    },
    storeItems: function() {
      return this.$store.getters.currentStoreItems;
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
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('getStore', this.$route.params.id);
      await this.$store.dispatch('getCatalogsQuery', this.store.brand);
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Stores',
          link: '/dashboard/stores'
        },
        {
          text: `${this.store.name}`,
          link: `/dashboard/stores/${this.store._id}`
        },
        {
          text: 'Add Items',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getStoreItems', this.store._id);
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
    async getCatalog() {
      await this.$store.dispatch('getCatalog', this.currentCatalog._id);
      await this.$store.dispatch('getCatalogItems', this.currentCatalog._id);
    },
    getImgUrl(item) {
      if (item.images.length === 0) return require('@/assets/missing_item_800.png');
      const folderName = `${this.catalog.brand}_${this.catalog.season}_${this.catalog.year}`;
      return `/images/catalogs/${folderName}/800/${item.images[0]}_800.jpg`;
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 400px 1fr;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
  grid-template-areas: 'catalog-list store-items';

  .catalog-list {
    grid-area: catalog-list;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 105px 40px 1fr;
    grid-gap: 0.5rem;
    width: 100%;
    height: 100%;
    grid-template-areas:
      'dropdown'
      'searchbar'
      'catalogitem-list';

    .brand-logo {
      img {
        height: 40px;
      }
    }

    .catalogDropDown {
      grid-area: dropdown;
    }

    .catalogItemsSearchbar {
      grid-area: searchbar;
      .form-control {
        width: 215px;
      }
    }

    .catalogItemsList {
      grid-area: catalogitem-list;
      max-height: 730px;
      overflow-x: none;
      overflow-y: auto;

      .list-group-item {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding: 0px;
        cursor: grab;
        img {
          width: 60px;
        }

        .itemInfo {
          text-align: center;
          font-size: 0.85rem;
          width: 100%;
          font-weight: 700;
        }

        .itemImage {
          width: 60px;
        }
      }
    }
  }

  .store-items {
    grid-area: store-items;
    overflow-x: none;
    overflow-y: auto;
  }
}
</style>
