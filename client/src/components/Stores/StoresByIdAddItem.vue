<template>
  <div class="page" v-if="dataReady">
    <div class="catalog-list">
      <div class="form-group catalogDropDown">
        <div class="brand-logo mb-2">
          <img src="@/assets/garneau_logo.png" alt="Garneau Logo" v-if="store.brand === 'GARNEAU'" />
          <img src="@/assets/sugoi_logo.png" alt="Sugoi Logo" v-if="store.brand === 'SUGOI'" />
          <img src="@/assets/sombrio_logo.png" alt="Sombrio Logo" v-if="store.brand === 'SOMBRIO'" />
        </div>
        <small for="catalogSelection">Select your catalog</small>
        <select
          class="form-control"
          id="catalogSelection"
          v-model="currentCatalog"
          @change="getCatalog"
        >
          <option
            v-for="catalog in catalogs"
            :key="catalog._id"
            :value="catalog"
          >{{ catalog.brand }} - {{ catalog.season }} -{{ catalog.year }}</option>
        </select>
      </div>
      <div
        class="form-group form-inline catalogItemsSearchbar"
        v-if="catalogItems && catalogItems.length > 0"
      >
        <label for="catalogItemSearch" class="mr-2">Filter:</label>
        <input
          type="text"
          id="catalogItemSearch"
          v-if="catalogItems && catalogItems.length > 0"
          class="form-control form-control-sm mr-3"
          v-model="catalogItemSearch"
          placeholder="Enter any product info to filter..."
          autofocus
        />
        <small class="text-muted">Showing: {{ filteredCount }}/{{ catalogItems.length }}</small>
      </div>
      <div class="catalogItemsList" v-if="currentCatalog._id">
        <draggable
          class="list-group"
          :list="filteredItems"
          :group="{ name: 'items', pull: 'clone', put: false }"
          :clone="cloneItem"
        >
          <div class="list-group-item" v-for="item in filteredItems" :key="item._id">
            <div class="itemImage">
              <img :src="getImgUrl(item)" :alt="item.nameEN" />
            </div>
            <div class="itemInfo">
              {{ item.nameEN }}
              <br />
              <small class="text-muted">{{ item.productCode }} / {{ item.styleCode }}</small>
            </div>
          </div>
        </draggable>
      </div>
    </div>
    <div class="store-items">
      <div class="store-items-header text-center">
        <div class="row">
          <div class="col-sm-6">
            <button
              class="btn btn-block btn-success mt-2"
              @click="updateStoreList"
              :disabled="!listHasChanged"
            >Commit Changes</button>
          </div>
          <div class="col-sm-6">
            <router-link
              :to="`/dashboard/stores/${store._id}`"
              class="btn btn-block btn-danger mt-2"
            >Cancel</router-link>
          </div>
        </div>
      </div>
      <div class="store-items-list">
        <draggable
          class="dragArea list-group"
          :list="storeItems"
          group="items"
          @change="listChanged"
        >
          <div
            class="list-group-item mb-1"
            v-for="(storeItem, index) in storeItems"
            :key="storeItem._id"
          >
            <div class="itemImage">
              <img :src="getImgUrl(storeItem)" :alt="storeItem.nameEN" />
            </div>
            <div class="itemInfo">
              {{ storeItem.nameEN }}
              <br />
              <small class="text-muted">{{ storeItem.productCode }} / {{ storeItem.styleCode }}</small>
            </div>
            <div class="itemButtons">
              <button class="btn btn-block btn-sm btn-info">Edit Item</button>
              <button class="btn btn-block btn-sm btn-danger" @click="removeStoreItem(index)">Remove</button>
            </div>
          </div>
          <div class="drag-spot mb-1">Drop New Item Here</div>
        </draggable>
      </div>
    </div>
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
      catalogItemSearch: '',
      storeItems: [],
      listHasChanged: false
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
    this.$store.dispatch('setDataReadyFalse');
    try {
      await this.$store.dispatch('getStore', this.$route.params.id);
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Stores',
          link: '/dashboard/stores'
        },
        {
          text: `${this.store.storeName}`,
          link: `/dashboard/stores/${this.store._id}`
        },
        {
          text: 'Add Items',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getCatalogsQuery', this.store.brand);
      const res = await this.$store.dispatch('getStoreItems', this.store._id);
      this.storeItems = res.data;

      if (this.storeItems.length > 0) {
        await this.$store.dispatch('getCatalog', this.storeItems[0].catalogId);
      }

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
    listChanged: function() {
      this.listHasChanged = true;
    },
    updateStoreList: async function() {
      try {
        if (confirm('Are you sure?')) {
          const res = await this.$store.dispatch('updateStoreItems', {
            id: this.store._id,
            storeItems: this.storeItems
          });
          this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
          this.$router.push({ name: 'storesById', params: { id: this.store._id } }).catch(() => {});
        }
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    removeStoreItem: async function(index) {
      if (confirm('Are you sure?')) {
        this.storeItems = this.storeItems.filter((item, i) => index !== i);
        this.listHasChanged = true;
      }
    },
    cloneItem: function(item) {
      item.itemId = item._id;
      item.storeId = this.store._id;
      item.brand = this.store.brand;
      item.refNumber = '';
      return item;
    },
    async getCatalog() {
      this.$store.dispatch('setDataReadyFalse');
      await this.$store.dispatch('getCatalog', this.currentCatalog._id);
      await this.$store.dispatch('getCatalogItems', this.currentCatalog._id);
      this.$store.dispatch('setDataReadyTrue');
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
    grid-template-rows: 110px 40px 1fr;
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
        width: 240px;
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
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 50px 1fr;
    grid-gap: 0.5rem;
    width: 100%;
    height: 100%;
    grid-template-areas:
      'store-items-header'
      'store-items-list';

    .store-items-header {
      grid-area: store-items-header;
    }

    .store-items-list {
      grid-area: store-items-list;
      padding: 0.5rem;
      max-height: 840px;
      border: 2px dotted red;
      background-color: whitesmoke;
      overflow-x: hidden;
      overflow-y: auto;
    }

    .drag-spot {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: none;
      border: 2px dotted grey;
      color: grey;
      font-weight: 700;
      width: 100%;
      height: 100px;
      opacity: 0.4;
    }

    .list-group-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding: 0px;
      cursor: grab;
      img {
        width: 100px;
      }

      .itemInfo {
        text-align: center;
        font-size: 1.25rem;
        width: 100%;
        font-weight: 700;
      }

      .itemImage {
        width: 100px;
      }

      .itemButtons {
        width: 200px;
        padding: 1rem;
      }
    }
  }
}
</style>
