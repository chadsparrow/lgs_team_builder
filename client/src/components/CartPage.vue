<template>
  <div v-if="!isLoading" class="mt-2 container">
    <div class="row">
      <div class="col-md-12 mb-2">
        <router-link
          tag="button"
          :to="`/dashboard/stores/${store._id}`"
          class="small-btn danger-btn mb-2"
          ><i class="fas fa-arrow-left mr-2"></i>Go back to Store</router-link
        >
      </div>
      <div class="col-md-12 col-lg-8 cart-items">
        <h4 class="text-info text-center">Items</h4>
        <div class="cart-item-box">
          <div
            class="cart-item mb-2"
            v-for="item in cart.items"
            :key="item._id"
          >
            <div class="row">
              <div class="col-md-12 col-lg-3 cart-item-image">
                <img :src="getImgUrl(item)" :alt="item.nameEN" loading="lazy" />
              </div>
              <div class="col-md-12 col-lg-7 cart-item-info">
                <div>
                  <span class="text-danger" v-if="item.mandatoryItem"
                    >Mandatory Item</span
                  >
                  <h4 class="text-info">{{ item.nameEN }}</h4>
                  <small class="text-muted"
                    >Product Code: {{ item.productCode }} / Style Code:
                    {{ item.styleCode }}</small
                  >
                  <h4 class="text-muted mt-3">
                    Price: {{ item.storePrice | currency }}
                  </h4>
                </div>
                <div class="row mt-2">
                  <div class="col">
                    <label for="size">Size:</label>
                    <select
                      class="form-control"
                      id="size"
                      ref="itemSize"
                      v-model="item.size"
                      @change="dataChanged = true"
                    >
                      <option
                        v-for="(size, index) in item.sizes"
                        :key="index"
                        >{{ size }}</option
                      >
                    </select>
                  </div>
                  <div class="col">
                    <label for="quantity">Quantity:</label>
                    <input
                      type="number"
                      class="form-control"
                      min="1"
                      step="1"
                      ref="quantity"
                      id="quantity"
                      v-model.number="item.quantity"
                      @change="dataChanged = true"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-12 col-lg-2">
                <div class="row m-0 mb-3" v-if="!item.mandatoryItem">
                  <button
                    class="small-btn danger-btn btn-block"
                    @click="removeItem(item._id)"
                  >
                    <i class="fas fa-lg fa-trash mr-2"></i>Remove
                  </button>
                </div>
                <div class="row mx-0">
                  <span class="text-info"
                    >Item Total:
                    <h4>
                      {{ (item.storePrice * item.quantity) | currency }}
                    </h4></span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-12 col-lg-4 cart-info">
        <h4 class="text-info text-center">Actions</h4>
        <div class="row m-0">
          <button
            class="small-btn danger-btn btn-block"
            @click="removeAllItems"
          >
            <i class="fas fa-trash mr-2"></i>Remove All Items
          </button>
        </div>
        <div class="row m-0 mt-2" v-if="dataChanged">
          <button class="small-btn btn-block" @click="updateCart">
            <i class="fas fa-pen mr-2"></i>Update Cart
          </button>
        </div>
        <hr />
        <div class="row">
          <div class="col-md-12 text-center">
            <h5 class="text-info m-0">
              Sub-Total: {{ cartSubTotal | currency }}
            </h5>
            <small class="text-muted"
              >* before taxes, discounts, shipping &amp; extra fees</small
            >
          </div>
          <div class="col-md-12 mt-3 text-center">
            <button
              class="large-btn btn-block"
              :disabled="dataChanged"
              @click="checkout"
            >
              Checkout
            </button>
            <small class="text-muted" v-if="dataChanged"
              >You must update the cart before Checkout</small
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import toast from '../helpers/toast';
import toast from '../helpers/toast';
import { get } from 'lodash';

export default {
  name: 'CartPage',
  data() {
    return {
      dataChanged: false,
    };
  },
  computed: {
    ...mapGetters([
      'currentStore',
      'currentCart',
      'loggedInMember',
      'isLoading',
      'orders',
    ]),
    store: function() {
      return this.currentStore;
    },
    member: function() {
      return this.loggedInMember;
    },
    cart: function() {
      return this.currentCart;
    },
    cartSubTotal: function() {
      return this.cart.items.reduce((acc, obj) => {
        return acc + obj.storePrice * obj.quantity;
      }, 0);
    },
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      await this.$store.dispatch('getStore', this.$route.query.storeId);
      const breadcrumbs = [
        {
          text: 'Stores',
          link: `/dashboard/stores/`,
        },
        {
          text: `${this.store.storeName}`,
          link: `/dashboard/stores/${this.store._id}`,
        },
        {
          text: 'Cart',
          link: '#',
        },
      ];
      this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getMemberStoreCart', this.store._id);
      if (this.cart.items && this.cart.items.length === 0) {
        this.$router.push({ path: `/dashboard/stores/${this.store._id}` });
      }
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      toast.error(err);
    }
  },
  methods: {
    getImgUrl: function(item) {
      // if (item.images.length === 0) return 'https://teambuilder.s3.amazonaws.com/images/assets/missing_item_hd.png';
      return `https://teambuilder.s3.amazonaws.com/images/storesitems/${this.store._id}/${item.images[0]}_hd.jpg`;
    },
    removeItem: async function(itemId) {
      this.$store.commit('LOADING_TRUE');
      try {
        const res = await this.$store.dispatch('removeCartItem', {
          id: this.cart._id,
          itemId,
        });
        this.$store.commit('LOADING_FALSE');
        toast.success(get(res, 'data[0].message', 'Success'));
        if (this.cart.items && this.cart.items.length === 0) {
          this.$router.push({ path: `/dashboard/stores/${this.store._id}` });
        }
      } catch (err) {
        this.$store.commit('LOADING_FALSE');
        toast.error(err);
      }
    },
    updateCart: async function() {
      this.$store.commit('LOADING_TRUE');
      try {
        const res = await this.$store.dispatch('updateCart', {
          id: this.cart._id,
          items: this.cart.items,
        });
        this.$store.commit('LOADING_FALSE');
        toast.success(get(res, 'data[0].message', 'Success'));
        this.dataChanged = false;
      } catch (err) {
        this.$store.commit('LOADING_FALSE');
        toast.error(err);
      }
    },
    removeAllItems: async function() {
      try {
        if (confirm('Are you sure?')) {
          this.$store.commit('LOADING_TRUE');
          const mandatoryItems = this.cart.items.filter(
            (el) => el.mandatoryItem
          );
          const res = await this.$store.dispatch('updateCart', {
            id: this.cart._id,
            items: [...mandatoryItems],
          });
          this.$store.commit('LOADING_FALSE');
          toast.success(get(res, 'data[0].message', 'Success'));
          this.dataChanged = false;
          if (this.cart.items.length === 0) {
            this.$router.push({ path: `/dashboard/stores/${this.store._id}` });
          }
        }
      } catch (err) {
        this.$store.commit('LOADING_FALSE');
        toast.error(err);
      }
    },
    checkout: function() {
      this.cart.items.forEach((el, index) => {
        if (!el.size) {
          this.$refs.itemSize[index].focus();
          return this.$toasted.error('There are items without a chosen size', {
            icon: 'exclamation-triangle',
          });
        }
      });

      this.cart.items.forEach((el, index) => {
        if (el.quantity === 0 || !el.quantity) {
          this.$refs.quantity[index].focus();
          return this.$toasted.error('There are items without a chosen size', {
            icon: 'exclamation-triangle',
          });
        }
      });
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.dataChanged) {
      if (
        confirm(
          'Cart has not been updated in the system, if you leave, all changes will be lost.  Are you sure?'
        )
      ) {
        next();
      } else {
        next(false);
      }
    }

    next();
  },
};
</script>

<style lang="scss" scoped>
.cart-items {
  .cart-item-box {
    max-height: calc(100vh - 175px);
    overflow-x: hidden;
    overflow-y: auto;

    .cart-item {
      background-color: $white-smoke;
      padding: 1rem;
      border: 1px solid lightgray;
      border-radius: 5px;

      .cart-item-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        .form-control {
          text-align: center;
        }
      }

      .cart-item-image {
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
