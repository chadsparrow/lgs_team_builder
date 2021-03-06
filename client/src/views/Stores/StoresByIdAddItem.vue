<template>
  <div class="page container" v-if="!isLoading">
    <div class="catalog-list">
      <div class="form-group catalogDropDown">
        <div class="brand-logo mb-2">
          <img
            src="https://teambuilder.s3.amazonaws.com/images/assets/garneau_logo.png"
            alt="Garneau Logo"
            v-if="store.brand === 'GARNEAU'"
          />
          <img
            src="https://teambuilder.s3.amazonaws.com/images/assets/sugoi_logo.png"
            alt="Sugoi Logo"
            v-if="store.brand === 'SUGOI'"
          />
          <img
            src="https://teambuilder.s3.amazonaws.com/images/assets/sombrio_logo.png"
            alt="Sombrio Logo"
            v-if="store.brand === 'SOMBRIO'"
          />
        </div>
        <label for="catalogSelection">Select your catalog</label>
        <select
          class="form-control"
          id="catalogSelection"
          v-model="catalogPicker"
          @change="getCatalog"
        >
          <option
            v-for="catalog in catalogs"
            :key="catalog._id"
            :value="catalog._id"
            >{{ catalog.brand }} - {{ catalog.season }} -
            {{ catalog.year }}</option
          >
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
        <small class="text-muted"
          >{{ filteredCount }}/{{ catalogItems.length }}</small
        >
      </div>
      <div class="catalogItemsList" v-if="currentCatalog._id">
        <draggable
          class="list-group"
          ghost-class="catalog-item-ghost"
          :list="filteredItems"
          :clone="clone"
          :group="{ name: 'items', pull: 'clone', put: false }"
        >
          <div
            class="list-group-item"
            v-for="(item, index) in filteredItems"
            :key="index"
          >
            <div class="itemImage">
              <img :src="getImgUrl(item)" :alt="item.nameEN" loading="lazy" />
            </div>
            <div class="itemInfo">
              {{ item.nameEN }}
              <br />
              <small class="text-muted">{{ item.productCode }}</small>
            </div>
          </div>
        </draggable>
      </div>
    </div>
    <div class="store-items">
      <div class="store-items-list">
        <draggable
          class="dragArea list-group"
          ghostClass="store-item-ghost"
          :list="storeItems"
          filter=".small-btn"
          group="items"
          @change="updateStoreItems"
          animation="200"
          draggable=".list-group-item"
        >
          <div
            class="list-group-item mb-1"
            v-for="(storeItem, index) in storeItems"
            :key="index"
          >
            <div class="itemImage">
              <img
                :src="getImgUrl(storeItem)"
                :alt="storeItem.nameEN"
                loading="lazy"
              />
            </div>
            <div class="itemInfo">
              <div
                v-if="storeItem.mandatoryItem"
                class="text-danger mandatoryStar"
              >
                <span>Mandatory Item</span>
                <br />
              </div>
              {{ storeItem.nameEN }}
              <br />
              <small class="text-muted"
                >{{ storeItem.productCode }} / {{ storeItem.styleCode }}</small
              >
            </div>
            <div class="itemPricing">
              <span>{{ storeItem.storePrice | currency }}</span>
              <br />
              <label for="pbGoal">
                <small>Price Break Goal:</small>
              </label>
              <br />
              <small id="pbGoal">{{ storeItem.priceBreakGoal }} unit(s)</small>
            </div>
            <div class="itemButtons">
              <button
                class="small-btn btn-block"
                @click="showEditWindow(storeItem)"
              >
                Edit Item
              </button>
              <button
                class="small-btn danger-btn btn-block"
                @click="removeStoreItem(storeItem._id)"
              >
                Remove
              </button>
            </div>
          </div>
          <div class="drag-spot mb-1">Drop New Item Here</div>
        </draggable>
      </div>
    </div>

    <!-- EDIT ITEM MODAL WINDOW -->
    <div v-if="showModal">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">
                    Edit: {{ currentStoreItem.nameEN }}
                  </h5>
                </div>
                <div class="modal-body text-center">
                  <div class="container-fluid">
                    <div class="row">
                      <div class="col-sm-12">
                        <div class="form-group form-check mb-3">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            id="mandatoryItem"
                            v-model="currentStoreItem.mandatoryItem"
                          />
                          <label class="form-check-label" for="mandatoryItem"
                            >Mandatory Item</label
                          >
                          <p v-if="currentStoreItem.mandatoryItem">
                            <small class="text-muted"
                              >This item will be added to all member
                              orders</small
                            >
                          </p>
                        </div>
                      </div>
                      <div class="col-sm-12">
                        <div class="form-group">
                          <label for="refNumber">Order Reference #:</label>
                          <input
                            type="text"
                            class="form-control form-control-sm text-center"
                            id="refNumber"
                            v-model="currentStoreItem.refNumber"
                          />
                        </div>
                      </div>
                      <div class="col-sm-12">
                        <div class="form-group">
                          <label for="nameEN">Name (EN):</label>
                          <input
                            type="text"
                            class="form-control text-center"
                            id="nameEN"
                            placehold="Enter name..."
                            v-model="currentStoreItem.nameEN"
                          />
                        </div>
                      </div>
                      <div class="col-sm-12">
                        <div class="form-group">
                          <label for="nameFR">Name (FR):</label>
                          <input
                            type="text"
                            class="form-control text-center"
                            id="nameFR"
                            placeholder="Entrez le nom français..."
                            v-model="currentStoreItem.nameFR"
                          />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <label for="priceBreak"
                            >Price Break Goal ({{ store.currency }})</label
                          >
                          <select
                            class="form-control form-control-sm"
                            id="priceBreak"
                            v-model.number="currentStoreItem.priceBreakGoal"
                            @change="setStorePrice"
                            ref="priceBreak"
                          >
                            <option
                              v-for="(pb, index) in currentItemPriceBreaks"
                              :value="parseInt(pb.priceBreak.split('-')[0])"
                              :key="index"
                              >{{ pb.priceBreak }} unit(s) -
                              {{ pb.price | currency }}/unit</option
                            >
                            <option :value="250"
                              >250+ units - Set Price Below</option
                            >
                          </select>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="row form-group">
                          <div class="col-sm-12">
                            <label>Team UpCharge: ({{ store.currency }})</label>
                          </div>
                          <div class="col-sm-4">
                            <select
                              class="form-control form-control-sm"
                              v-model="currentStoreItem.upChargeType"
                              ref="upChargeType"
                              :readonly="currentStoreItem.overrideActualPrice"
                              @change="setStorePrice"
                            >
                              <option>$</option>
                              <option>%</option>
                            </select>
                          </div>
                          <div class="col-sm-8">
                            <currency-input
                              v-model="currentStoreItem.upChargeAmount"
                              :currency="store.currency"
                              class="form-control form-control-sm text-center"
                              v-if="currentStoreItem.upChargeType === '$'"
                              ref="upChargeAmount"
                              :auto-decimal-mode="true"
                              :precision="2"
                              @change="setStorePrice"
                              :readonly="currentStoreItem.overrideActualPrice"
                            />
                            <input
                              class="form-control form-control-sm text-center"
                              v-model.number="currentStoreItem.upChargeAmount"
                              ref="upChargeAmount"
                              @change="setStorePrice"
                              :readonly="currentStoreItem.overrideActualPrice"
                              v-else
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-12 bg-danger">
                        <div class="form-group form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            id="overrideActualPrice"
                            v-model="currentStoreItem.overrideActualPrice"
                            @change="overrideActual"
                            ref="overrideActualPrice"
                          />
                          <label
                            class="form-check-label text-white"
                            for="overrideActualPrice"
                            >Override Actual Price -
                            {{ currentStoreItem.actualPrice | currency }}</label
                          >
                        </div>
                      </div>
                      <div class="col-sm-12">
                        <div class="form-group">
                          <label for="storePrice"
                            >Store Price: ({{ store.currency }})<br /><small
                              class="text-muted"
                              v-if="!currentStoreItem.overrideActualPrice"
                              >Actual Price:
                              {{ currentStoreItem.actualPrice | currency }} +
                              Up-Charge Amount:
                              {{
                                currentStoreItem.upChargeTotal | currency
                              }}</small
                            ><small class="text-muted" v-else
                              >Please fill in desired store price</small
                            ></label
                          >
                          <currency-input
                            v-model="currentStoreItem.storePrice"
                            :currency="store.currency"
                            :auto-decimal-mode="true"
                            :precision="2"
                            class="form-control form-control-lg text-center"
                            ref="storePrice"
                            :readonly="
                              !this.currentStoreItem.overrideActualPrice
                            "
                            id="storePrice"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="small-btn danger-btn"
                    @click="closeModal"
                  >
                    Exit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';
import toast from '../../helpers/toast';

export default {
  name: 'StoresByIdAddItem',
  components: {
    draggable,
  },
  data() {
    return {
      catalogPicker: '',
      catalogItemSearch: '',
      showModal: false,
      currentItemPriceBreaks: null,
    };
  },
  computed: {
    ...mapGetters([
      'isLoading',
      'currentStore',
      'catalogs',
      'currentCatalog',
      'currentCatalogItems',
      'currentStoreItem',
      'currentStoreItems',
    ]),
    store: function() {
      return this.currentStore;
    },
    storeItems: {
      get() {
        return this.currentStoreItems;
      },
      set(value) {
        this.$store.commit('SET_CURRENT_STORE_ITEM', value);
      },
    },
    catalog: function() {
      return this.currentCatalog;
    },
    catalogItems: function() {
      return this.currentCatalogItems;
    },
    filteredItems: function() {
      return this.catalogItems.filter((item) => {
        if (
          item.categories.includes(this.catalogItemSearch.toUpperCase()) ||
          item.nameEN
            .toLowerCase()
            .includes(this.catalogItemSearch.toLowerCase()) ||
          item.nameFR
            .toLowerCase()
            .includes(this.catalogItemSearch.toLowerCase()) ||
          item.productCode
            .toLowerCase()
            .includes(this.catalogItemSearch.toLowerCase()) ||
          item.styleCode
            .toLowerCase()
            .includes(this.catalogItemSearch.toLowerCase())
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
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      await this.$store.dispatch('getStore', this.$route.params.id);
      const breadcrumbs = [
        {
          text: 'Stores',
          link: '/dashboard/stores',
        },
        {
          text: `${this.store.storeName}`,
          link: `/dashboard/stores/${this.store._id}`,
        },
        {
          text: 'Add Items',
          link: '#',
        },
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getCatalogsQuery', this.store.brand);
      await this.$store.dispatch('getStoreItems', this.store._id);

      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      toast.error(err);
    }
  },
  methods: {
    async showEditWindow(storeItem) {
      if (this.store.currency === 'CAD') {
        this.currentItemPriceBreaks = storeItem.priceBreaks.CAD;
      } else if (this.store.currency === 'USD') {
        this.currentItemPriceBreaks = storeItem.priceBreaks.USD;
      }
      this.$store.commit('SET_CURRENT_STORE_ITEM', storeItem);
      this.showModal = true;
    },
    overrideActual() {
      this.currentStoreItem.upChargeAmount = 0;
      this.currentStoreItem.storePrice = 0;
      this.setStorePrice();
    },
    setStorePrice() {
      const index = this.$refs.priceBreak.selectedIndex;
      this.currentStoreItem.priceBreakIndex = index;

      if (!this.currentStoreItem.overrideActualPrice) {
        if (index !== 6) {
          this.$refs.overrideActualPrice.disabled = false;
          this.currentStoreItem.actualPrice = this.currentItemPriceBreaks[
            index
          ].price;
          this.currentStoreItem.storePrice = this.currentStoreItem.actualPrice;
        } else {
          this.currentStoreItem.overrideActualPrice = true;
          this.$refs.overrideActualPrice.disabled = true;
          this.currentStoreItem.actualPrice = 0;
          this.currentStoreItem.storePrice = 0;
        }

        this.addUpCharge();
      } else {
        if (index !== 6) {
          this.$refs.overrideActualPrice.disabled = false;
          this.currentStoreItem.actualPrice = this.currentItemPriceBreaks[
            index
          ].price;
        } else {
          this.currentStoreItem.overrideActualPrice = true;
          this.$refs.overrideActualPrice.disabled = true;
          this.currentStoreItem.storePrice = 0;
          this.currentStoreItem.actualPrice = 0;
        }
      }
    },
    addUpCharge() {
      const upChargeType = this.$refs.upChargeType.value;
      const upChargeAmount = parseFloat(this.$refs.upChargeAmount.value);

      if (upChargeType === '$' && upChargeAmount && upChargeAmount > 0) {
        this.currentStoreItem.upChargeTotal = upChargeAmount;
        this.currentStoreItem.storePrice =
          this.currentStoreItem.actualPrice +
          this.currentStoreItem.upChargeTotal;
        return;
      }

      if (upChargeType === '%' && upChargeAmount && upChargeAmount > 0) {
        this.currentStoreItem.upChargeTotal =
          this.currentStoreItem.actualPrice * (upChargeAmount / 100);
        this.currentStoreItem.storePrice =
          this.currentStoreItem.actualPrice +
          this.currentStoreItem.upChargeTotal;
        return;
      }
    },
    closeModal() {
      this.updateStoreItems();
      this.showModal = false;
      this.currentItemPriceBreaks = null;
    },
    removeStoreItem: async function(id) {
      if (confirm('Are you sure?')) {
        this.$store.commit('REMOVE_STORE_ITEM', id);
        this.updateStoreItems();
        this.$store.dispatch('removeStoreItemFromCart', id);
      }
    },
    async updateStoreItems() {
      const items = this.storeItems;
      try {
        await this.$store.dispatch('updateStoreItems', {
          id: this.store._id,
          items,
        });
      } catch (err) {
        toast.error(err);
      }
    },
    clone: function(el) {
      let price = 0.0;
      if (this.store.currency === 'CAD') {
        price = el.priceBreaks.CAD[3].price;
      } else if (this.store.currency === 'USD') {
        price = el.priceBreaks.USD[3].price;
      }
      return {
        catalogId: el.catalogId,
        categories: el.categories,
        descriptionEN: el.descriptionEN,
        descriptionFR: el.descriptionFR,
        gender: el.gender,
        isActive: el.isActive,
        itemId: el._id,
        nameEN: el.nameEN,
        nameFR: el.nameFR,
        surveyLikedBy: [],
        images: [],
        upChargeType: '$',
        upChargeAmount: 0.0,
        upChargeTotal: 0.0,
        priceBreakGoal: 12,
        storePrice: price,
        actualPrice: price,
        productCode: el.productCode,
        priceBreaks: el.priceBreaks,
        priceBreakIndex: 3,
        sizes: el.sizes,
        styleCode: el.styleCode,
      };
    },
    async getCatalog() {
      this.$store.commit('LOADING_TRUE');
      await this.$store.dispatch('getCatalog', this.catalogPicker);
      await this.$store.dispatch('getCatalogItems', this.catalogPicker);
      this.$store.commit('LOADING_FALSE');
    },
    getImgUrl(item) {
      if (item.images.length === 0)
        return 'https://teambuilder.s3.amazonaws.com/images/assets/missing_item_sd.png';
      return `https://teambuilder.s3.amazonaws.com/images/catalogs/${this.catalog.brand.toLowerCase()}/${
        item.images[0]
      }_sd.jpg`;
    },
  },
};
</script>

<style lang="scss" scoped>
.catalog-item-ghost {
  opacity: 0.4;
  background: #c8ebfb;
  border: 1px dotted blue;
}

.store-item-ghost {
  opacity: 0.4;
  background: #c8ebfb;
  border: 2px dotted red;
}

.page {
  display: grid;
  grid-template-columns: 400px 1fr;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
  grid-template-areas: 'catalog-list store-items';
  overflow: hidden;

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
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .form-control {
        width: 240px;
      }
    }

    .catalogItemsList {
      padding: $scrollbar-padding;
      grid-area: catalogitem-list;
      overflow-x: hidden;
      overflow-y: auto;
      max-height: calc(100vh - 245px);

      .list-group-item {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding: 0px;
        cursor: move;

        &:hover {
          background-color: whitesmoke;
        }

        img {
          width: 60px;
        }

        .itemImage {
          width: 60px;
        }

        .itemInfo {
          text-align: center;
          font-size: $span-font-size;
          width: 100%;
          font-weight: $font-weight-bold;
        }
      }
    }
  }

  .store-items {
    grid-area: store-items;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-gap: 0.5rem;
    width: 100%;
    height: 100%;
    grid-template-areas: 'store-items-list';

    .store-items-list {
      grid-area: store-items-list;
      padding: 0.5rem;
      border: 1px dotted red;
      background-color: whitesmoke;
      overflow-x: hidden;
      overflow-y: auto;
      max-height: calc(100vh - 80px);
    }

    .drag-spot {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: 2px dotted grey;
      color: grey;
      font-weight: $font-weight-black;
      width: 100%;
      height: 50px;
      opacity: 0.4;
    }

    .list-group-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding: 0px;
      cursor: move;

      &:hover {
        background-color: whitesmoke;
      }

      .itemImage {
        width: 100px;
        min-height: 60px;
        img {
          max-width: 100px;
        }
      }

      .itemInfo {
        text-align: center;
        font-size: $base-font-size;
        width: 100%;
        font-weight: $font-weight-bold;

        .mandatoryStar {
          font-size: $base-font-size;
        }
      }

      .itemPricing {
        width: 250px;
        span {
          font-weight: $font-weight-bold;
          font-size: $base-font-size;
        }
      }

      .itemButtons {
        width: 200px;
        padding: 1rem;
      }
    }
  }

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    display: table;
    transition: opacity 0.5s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;

    .form-group {
      margin: 0.75rem 0;
    }
  }
}
</style>
