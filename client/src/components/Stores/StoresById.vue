<template>
  <div class="page" v-if="!isLoading">
    <div class="sidebar-left">
      <div class="row p-1">
        <div class="col-sm-12">
          <img
            src="/images/assets/garneau_logo.png"
            alt="Garneau Logo"
            v-if="store.brand === 'GARNEAU'"
          />
          <img
            src="/images/assets/sombrio_logo.png"
            alt="Sombrio Logo"
            v-else-if="store.brand === 'SOMBRIO'"
          />
          <img
            src="/images/assets/sugoi_logo.png"
            alt="Sugoi Logo"
            v-else-if="store.brand === 'SUGOI'"
          />
        </div>
      </div>
      <div
        :class="
          store.mode === 'OPEN'
            ? 'row p-2 modeBox text-center bg-success text-white'
            : store.mode === 'CLOSED'
            ? 'row p-2 modeBox text-center bg-danger text-white'
            : store.mode === 'HOLD'
            ? 'row p-2 modeBox text-center bg-warning text-white'
            : store.mode === 'SURVEY'
            ? 'row p-2 modeBox text-center bg-secondary text-white'
            : null
        "
      >
        <small class="col-sm-12 text-white">
          <span>{{ store.mode }}</span>
        </small>
      </div>
      <div class="row p-1 mt-2">
        <div class="col-sm-6">
          <small class="text-info">Opening Date:</small>
          <br />
          <span v-if="store.openingDate">
            {{
              store.openingDate | moment('timezone', store.timezone, 'MMM Do YYYY - hh:mm a - z')
            }}
          </span>
          <span v-else>No Opening Date</span>
        </div>
        <div class="col-sm-6">
          <small class="text-info">Closing Date:</small>
          <br />
          <span v-if="store.closingDate">
            {{
              store.closingDate | moment('timezone', store.timezone, 'MMM Do YYYY - hh:mm a - z')
            }}
          </span>
          <span v-else>No Closing Date</span>
        </div>
      </div>
      <div class="row p-1 mt-1" v-if="currentDateTime">
        <small class="col-sm-12 text-info">Current Store Time:</small>
        <span class="col-sm-12">{{
          currentDateTime | moment('timezone', store.timezone, 'MMM Do YYYY / hh:mm:ss a - z')
        }}</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Store Created:</small>
        <span class="col-sm-12">
          {{ store.createdAt | moment('timezone', store.timezone, 'MMM Do YYYY / hh:mm a - z') }}
        </span>
      </div>
      <div class="row p-1" v-if="access">
        <div class="col-sm-6">
          <small class="text-info">Store Country:</small>
          <br />
          <span>{{ store.storeCountry }}</span>
        </div>
        <div class="col-sm-6">
          <small class="text-info">Account #:</small>
          <br />
          <span>{{ store.teamId.teamId }}</span>
        </div>
        <div class="col-sm-12">
          <small class="text-info">Order Reference:</small>
          <br />
          <span>{{ store.refOrder }}</span>
        </div>
      </div>
      <div class="row p-1" v-if="access">
        <small class="col-sm-12 text-info">Store Admin:</small>
        <span class="col-sm-12">{{ store.adminId.name }}</span>
        <span class="col-sm-12 text-muted">{{ store.adminId.email }}</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Store Manager:</small>
        <span class="col-sm-12">{{ store.managerId.name }}</span>
        <span class="col-sm-12 text-muted">{{ store.managerId.email }}</span>
        <span class="col-sm-12 text-muted">{{ store.managerId.phone }}</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Shipping Type:</small>
        <span class="col-sm-12">
          {{ store.shippingType == 'BULK' ? 'BULK SHIP' : 'DROP SHIP' }}
        </span>
      </div>
      <div class="row p-1" v-if="(store.shippingType = 'BULK')">
        <small class="col-sm-12 text-info">Bulk Shipping Information:</small>
        <span class="col-sm-12">{{ store.bulkShipping.name }}</span>
        <span class="col-sm-12" v-if="store.bulkShipping.company">
          {{ store.bulkShipping.company }}
        </span>
        <span class="col-sm-12">{{ store.bulkShipping.address1 }}</span>
        <span class="col-sm-12" v-if="store.bulkShipping.address2">
          {{ store.bulkShipping.address2 }}
        </span>
        <span class="col-sm-12">
          {{ store.bulkShipping.city }}, {{ store.bulkShipping.stateProv }},
          {{ store.bulkShipping.country }}
        </span>
        <span class="col-sm-12">{{ store.bulkShipping.zipPostal }}</span>
        <span class="col-sm-12">{{ store.bulkShipping.phone }}</span>
        <span class="col-sm-12">{{ store.bulkShipping.email }}</span>
      </div>
    </div>
    <div class="middle-section">
      <h4 class="message text-success" v-if="store.storeMessage">{{ store.storeMessage }}</h4>

      <div class="header">
        <div class="form-group form-inline">
          <label for="storeItemsSearchText" class="mr-2">Search:</label>
          <input
            type="text"
            id="storeItemsSearchText"
            v-if="storeItems.length > 0"
            class="form-control form-control-sm mr-3"
            v-model="storeItemsSearchText"
            placeholder="Enter any product info..."
            autofocus
          />
          <small class="text-muted">Showing: {{ filteredCount }}/{{ storeItems.length }}</small>
        </div>

        <div class="header-buttons" v-if="member.isAdmin">
          <router-link class="btn btn-sm btn-info mr-2" :to="`/dashboard/stores/${store._id}/edit`">
            <i class="fas fa-cog mr-2"></i>Settings
          </router-link>
          <router-link class="btn btn-sm btn-info mr-2" :to="`/dashboard/stores/${store._id}/add`">
            <i class="fas fa-pen mr-2"></i>Items
            <span class="badge badge-light ml-2" v-if="storeItems && storeItems.length > 0">
              {{ storeItems.length }}
            </span>
          </router-link>
          <button @click="displayModal" class="btn btn-sm btn-info mr-2">
            <i class="fas fa-plus mr-2"></i>Extras
            <span class="badge badge-light ml-2" v-if="extraCharges && extraCharges.length > 0">
              {{ extraCharges.length }}
            </span>
          </button>
          <button @click="duplicateOrder" class="btn btn-sm btn-info">
            <i class="fas fa-clone mr-2"></i>Duplicate
          </button>
        </div>
      </div>

      <div class="gallery-list" v-if="filteredItems.length > 0">
        <div class="card" v-for="(item, index) in filteredItems" :key="item._id">
          <div class="card-image">
            <img :src="getImgUrl(item)" :alt="item.nameEN" class="card-img-top" />
            <div class="mandatoryItem bg-danger text-white" v-if="item.mandatoryItem">
              Mandatory
            </div>
            <div class="price-box">{{ item.storePrice | currency }}</div>
          </div>
          <div class="card-body text-center">
            <h6 class="card-title mb-2">{{ item.nameEN }}</h6>
            <span class="card-text text-muted">{{ item.productCode }}</span>
            <br />
            <span class="card-text text-muted" v-if="member.isAdmin">{{ item.styleCode }}</span>
          </div>
          <div class="card-footer">
            <div class="likes-section mb-3" v-if="(store.mode === 'SURVEY' && !access) || access">
              <i
                class="fas fa-heart fa-2x text-danger"
                v-if="item.surveyLikedBy.includes(member._id)"
                @click="removeLike(item._id)"
              ></i>
              <i class="far fa-heart fa-2x text-secondary" v-else @click="addLike(item._id)"></i>
              <span class="badge badge-danger ml-1" v-if="access">{{
                item.surveyLikedBy.length
              }}</span>
            </div>
            <div
              class="cart-section mb-2"
              v-if="store.mode === 'OPEN' && !member.isAdmin && !item.mandatoryItem"
            >
              <div class="form-inline">
                <label class="mr-1" for="size">Size:</label>
                <select class="form-control form-control-sm mr-2" id="size" ref="size">
                  <option v-for="size in item.sizes" :key="size">{{ size }}</option>
                </select>
                <label class="mr-1" for="qty">Qty:</label>
                <input
                  class="form-control form-control-sm"
                  type="number"
                  name="qty"
                  :min="item.mandatoryItem ? 1 : 0"
                  step="1"
                  ref="quantity"
                />
              </div>
              <button
                class="btn btn-block btn-info mt-2"
                @click="addToCart(index)"
                v-if="!item.mandatoryItem"
              >
                Add to Cart
              </button>
            </div>
            <div class="mb-2 text-center" v-if="item.mandatoryItem && !member.isAdmin">
              <span class="text-danger">
                Item is already in your cart.
                <br />You can adjust size and quantity there.
              </span>
            </div>
            <div class="progressBar text-center" v-if="access && store.mode === 'OPEN'">
              <label for="progress" class="mt-2">Price Break Goal</label>
              <div class="progress">
                <div
                  class="progress-bar progress-bar-striped bg-danger text-center"
                  name="progress"
                  role="progressbar"
                  style="width: 25%;"
                  aria-valuenow="4"
                  aria-valuemin="0"
                  :aria-valuemax="item.priceBreakGoal"
                >
                  4/{{ item.priceBreakGoal }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h6 v-else>No Store Items found</h6>
    </div>
    <!-- EDIT ITEM MODAL WINDOW -->
    <div v-if="showExtrasModal">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">
              <div class="modal-header">
                <h5 class="modal-title">Add Extra Charges</h5>
              </div>
              <div class="modal-body">
                <div
                  class="extras-list mb-3 list-group"
                  v-if="extraCharges && extraCharges.length > 0"
                >
                  <div
                    class="row charge-row list-group-item"
                    v-for="(extra, index) in extraCharges"
                    :key="index"
                  >
                    <div class="col-md-6">
                      <label>Name</label>
                      <br />
                      <span>{{ extra.name }}</span>
                    </div>
                    <div class="col-md-5">
                      <label>Price {{ store.currency }}</label>
                      <br />
                      <span>{{ extra.amount | currency }}</span>
                    </div>
                    <div class="col-md-1">
                      <button class="btn btn-block btn-danger" @click="removeExtraCharge(index)">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="mb-3 text-center text-info" v-else>
                  No Extra Charges
                  <hr />
                </div>
                <div v-if="showNewCharge">
                  <div class="row charge-row m-0">
                    <div class="col-md-4">
                      <label for="extraSelectNew">Preset</label>
                      <select
                        class="form-control"
                        id="extraSelectNew"
                        v-model="newChargePreset"
                        @change="setPresetName"
                      >
                        <option value="Shipping Charge">Shipping Charge</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label for="extraNameNew">Name</label>
                      <input
                        type="text"
                        class="form-control"
                        id="extraNameNew"
                        v-model="newChargeName"
                        ref="newChargeName"
                      />
                    </div>
                    <div class="col-md-2">
                      <label for="extraPriceNew">Price {{ store.currency }}</label>
                      <currency-input
                        :currency="store.currency"
                        :auto-decimal-mode="true"
                        :precision="2"
                        class="form-control text-center"
                        v-model.number="newChargePrice"
                        ref="newChargePrice"
                        id="extraPriceNew"
                      />
                    </div>
                    <div class="col-md-2">
                      <button
                        class="btn btn-block btn-success"
                        :disabled="!newChargeName || newChargePrice === 0 || !newChargePrice"
                        @click="addNewCharge"
                      >
                        <i class="fas fa-check mr-2"></i>Add
                      </button>
                      <button class="btn btn-block btn-danger" @click="cancelNewCharge">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  class="btn btn-block btn-info mt-3"
                  @click="showNewCharge = true"
                  v-if="!showNewCharge"
                >
                  <i class="fas fa-plus mr-2"></i>
                  Add Extra Charge
                </button>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-success"
                  @click="closeModal"
                  :disabled="showNewCharge"
                >
                  Save Charges
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'StoresById',
  data() {
    return {
      storeItemsSearchText: '',
      currentDateTime: null,
      polling: null,
      showExtrasModal: false,
      showNewCharge: false,
      newChargePreset: '',
      newChargeName: '',
      newChargePrice: 0.0
    };
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      this.currentDateTime = new Date();
      this.polling = setInterval(this.getNow, 1000);
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
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getStoreItems', this.store._id);
      if (this.store.mode === 'OPEN' || this.store.mode === 'CLOSED') {
        await this.$store.dispatch('getMemberStoreCart', this.store._id);
        this.$store.commit('SHOW_CART');
      }
      this.$store.commit('LOADING_FALSE');
      this.addMandatoryItemsToCart();
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
    this.$store.commit('HIDE_CART');
    this.$store.commit('CLEAR_CURRENT_CART');
  },
  computed: {
    ...mapGetters([
      'currentStore',
      'currentCart',
      'loggedInMember',
      'isLoading',
      'orders',
      'currentStoreItems'
    ]),
    store: function() {
      return this.currentStore;
    },
    member: function() {
      return this.loggedInMember;
    },
    storeItems: function() {
      return this.currentStoreItems;
    },
    filteredItems: function() {
      return this.storeItems.filter(item => {
        if (
          item.categories.includes(this.storeItemsSearchText.toUpperCase()) ||
          item.nameEN.toLowerCase().includes(this.storeItemsSearchText.toLowerCase()) ||
          item.nameFR.toLowerCase().includes(this.storeItemsSearchText.toLowerCase()) ||
          item.productCode.toLowerCase().includes(this.storeItemsSearchText.toLowerCase()) ||
          item.styleCode.toLowerCase().includes(this.storeItemsSearchText.toLowerCase())
        ) {
          if (
            (this.storeItemsSearchText.toLowerCase() === "men's" ||
              this.storeItemsSearchText.toLowerCase() === 'men') &&
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
      return this.filteredItems.length;
    },
    access: function() {
      if (this.member && this.member.isAdmin) return true;

      if (
        this.member &&
        this.store &&
        this.store.managerId &&
        this.member._id === this.store.managerId._id
      )
        return true;

      return false;
    },
    extraCharges: function() {
      return this.store.extraCharges;
    }
  },
  methods: {
    getNow: async function() {
      this.currentDateTime = new Date();
      const minutes = this.currentDateTime.getMinutes();
      const seconds = this.currentDateTime.getSeconds();
      if (minutes == 0 && seconds == 0) {
        this.$store.commit('LOADING_TRUE');
        await this.$store.dispatch('getStore', this.store._id);
        if (this.store.mode === 'OPEN' || this.store.mode === 'CLOSED') {
          this.$store.commit('SHOW_CART');
        }
        this.$store.commit('LOADING_FALSE');
      }
    },
    duplicateOrder: async function() {
      if (confirm('Are you sure?')) {
        this.$store.commit('LOADING_TRUE');
        try {
          const res = await this.$store.dispatch('duplicateTeamStore', this.store._id);
          await this.$store.dispatch('getTeamStores', this.store.teamId._id);
          this.$router
            .push({ name: 'teamsById', params: { id: this.store.teamId._id } })
            .catch(() => {});
          this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
          this.$store.commit('LOADING_FALSE');
        } catch (err) {
          this.$store.commit('LOADING_FALSE');
          this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
        }
      }
    },
    displayModal: function() {
      this.showExtrasModal = true;
    },
    closeModal: async function() {
      try {
        await this.$store.dispatch('updateStoreCharges', {
          id: this.store._id,
          extraCharges: this.extraCharges
        });
        this.showExtrasModal = false;
        this.showNewCharge = false;
      } catch (err) {
        this.showNewCharge = false;
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    addNewCharge: function() {
      this.showNewCharge = false;
      this.extraCharges.push({
        name: this.newChargeName,
        amount: this.newChargePrice
      });
      this.newChargeName = '';
      this.newChargePreset = '';
      this.newChargePrice = 0.0;
    },
    cancelNewCharge: function() {
      this.showNewCharge = false;
      this.newChargeName = '';
      this.newChargePreset = '';
      this.newChargePrice = 0.0;
    },
    removeExtraCharge: async function(index) {
      if (confirm('Are you sure?')) {
        this.extraCharges.splice(index, 1);
        try {
          await this.$store.dispatch('updateStoreCharges', {
            id: this.store._id,
            extraCharges: this.extraCharges
          });
          this.$toasted.success('Extra Charge removed', { icon: 'check-circle' });
        } catch (err) {
          this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
        }
      }
    },
    setPresetName: function() {
      if (this.newChargePreset === 'Other') {
        this.newChargeName = '';
        this.newChargePrice = 0.0;
        this.$refs.newChargeName.focus();
      } else {
        this.newChargeName = this.newChargePreset;
        this.newChargePrice = 0.0;
        this.$refs.newChargePrice.$el.focus();
      }
    },
    getImgUrl: function(item) {
      if (item.images.length === 0) return '/images/assets/missing_item_800.png';
      return `/images/storeitems/${this.store._id}/800/${item.images[0].toUpperCase()}_800.jpg`;
    },
    removeLike: async function(id) {
      try {
        if (!this.member.isAdmin && this.store.mode === 'SURVEY') {
          await this.$store.dispatch('removeLike', id);
          this.storeItems.forEach(item => {
            if (item._id === id) {
              item.surveyLikedBy = item.surveyLikedBy.filter(like => like !== this.member._id);
            }
          });
        }
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    addLike: async function(id) {
      try {
        if (!this.member.isAdmin && this.store.mode === 'SURVEY') {
          await this.$store.dispatch('addLike', id);
          this.storeItems.forEach(item => {
            if (item._id === id) {
              if (!item.surveyLikedBy.includes(this.member._id)) {
                item.surveyLikedBy.push(this.member._id);
              }
            }
          });
        }
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    addToCart: async function(index) {
      if (!this.$refs.quantity[index].value || this.$refs.quantity[index].value == 0) {
        this.$toasted.error('quantity must be greater than 0', { icon: 'exclamation-triangle' });
        this.$refs.quantity[index].value = 0;
        return this.$refs.quantity[index].focus();
      }

      const {
        _id,
        images,
        nameEN,
        nameFR,
        styleCode,
        productCode,
        categories,
        sizes,
        mandatoryItem
      } = this.storeItems[index];

      const item = {
        storeItemId: _id,
        quantity: parseInt(this.$refs.quantity[index].value),
        size: this.$refs.size[index].value,
        images,
        nameEN,
        nameFR,
        styleCode,
        productCode,
        categories,
        sizes,
        mandatoryItem
      };

      try {
        const res = await this.$store.dispatch('addItemToCart', {
          storeId: this.store._id,
          item
        });
        this.$toasted.success(res.data[0].message, { icon: 'shopping-cart' });
        this.$refs.quantity[index].value = null;
      } catch (err) {
        return this.$toasted.error(err.response.data[0].message, {
          icon: 'exclamation-triangle'
        });
      }
    },
    addMandatoryItemsToCart: async function() {
      const mandatories = this.storeItems.filter(
        mandatoryItem => mandatoryItem.mandatoryItem === true
      );

      if (mandatories && mandatories.length > 0) {
        mandatories.forEach(async el => {
          try {
            if (
              this.currentCart.items &&
              this.currentCart.items.filter(e => e.storeItemId === el._id).length === 0
            ) {
              const { _id, images, nameEN, nameFR, styleCode, productCode, categories, sizes } = el;
              const item = {
                storeItemId: _id,
                quantity: 1,
                size: '',
                images,
                nameEN,
                nameFR,
                styleCode,
                productCode,
                categories,
                sizes,
                mandatoryItem: true
              };

              await this.$store.dispatch('addItemToCart', {
                storeId: this.store._id,
                item
              });
            }
          } catch (err) {
            return this.$toasted.error(err.response.data[0].message, {
              icon: 'exclamation-triangle'
            });
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 255px 1fr;
  grid-template-rows: 1fr;
  grid-gap: 1.5rem;
  width: 100%;
  height: 100%;
  grid-template-areas: 'sidebar-left middle-section';

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;

    .modal-wrapper {
      display: table-cell;
      vertical-align: middle;

      .modal-container {
        width: 100%;
        max-width: 850px;
        margin: 0px auto;
        padding: 1rem;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        transition: all 0.5s ease;
        font-size: 0.9rem;

        .modal-body {
          .charge-row {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
          }

          .form-control {
            font-size: 0.8rem;
          }

          .extras-list {
            max-height: 500px;
            overflow-x: hidden;
            overflow-y: auto;
          }
        }
      }
    }
  }
}

.sidebar-left {
  grid-area: sidebar-left;
  overflow-x: hidden;
  overflow-y: auto;
  img {
    width: 100%;
  }
}

.middle-section {
  grid-area: middle-section;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 40px 40px 1fr;
  grid-gap: 0.5rem;
  width: 100%;
  height: 100;
  grid-template-areas:
    'message'
    'header'
    'store-grid';

  .header {
    grid-area: header;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: whitesmoke;
    border-radius: 5px;
    font-weight: 700;
    height: 40px;
    padding: 0.25rem;

    img {
      height: 35px;
      margin-right: 1.5rem;
    }

    .form-control {
      width: 400px;
    }
  }

  .gallery-list {
    grid-area: store-grid;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: min-content;
    grid-gap: 1rem;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0.5rem;
    margin-bottom: 0.5rem;

    .card {
      .card-image {
        position: relative;

        .mandatoryItem {
          position: absolute;
          z-index: 2;
          padding: 0.5rem;
          color: white;
          top: 0.5rem;
          left: 0.5rem;
          border-radius: 5px;
        }

        .price-box {
          position: absolute;
          z-index: 2;
          bottom: 0.5rem;
          right: 1rem;
          font-size: 1.75rem;
          font-weight: 200;
          color: white;
          text-shadow: 2px 2px 6px rgba($color: #000000, $alpha: 0.65);
        }
      }

      .card-body {
        padding: 0.5rem;
      }

      .card-footer {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        width: 100%;

        .likes-section {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;

          i {
            cursor: pointer;
          }
          .far {
            opacity: 0.5;
          }
          .badge {
            font-size: 0.85rem;
          }
        }

        .cart-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          input {
            max-width: 45px;
          }
        }

        .progressBar {
          width: 100%;
        }

        &:empty {
          display: none;
        }
      }
    }
  }

  .message {
    grid-area: message;
  }
}

.modeBox {
  border-radius: 6px;
  span {
    font-size: 1.2rem;
    font-weight: 700;
  }
  margin: 0px 4px;
}
</style>
