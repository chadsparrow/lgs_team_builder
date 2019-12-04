<template>
  <div v-if="!isLoading" class="text-center container">
    <div class="row mt-2">
      <div class="col">
        <router-link :to="`/dashboard/stores/${store._id}`" class="btn btn-lg btn-danger btn-block"
          ><i class="fas fa-arrow-left mr-2"></i>Go back to Store</router-link
        >
      </div>
    </div>
    <div class="cart-item mt-3" v-for="item in cart.items" :key="item._id">
      <div class="row">
        <div class="col-lg-3 cart-item-image">
          <img :src="getImgUrl(item)" :alt="item.nameEN" />
        </div>
        <div class="col-lg-8 cart-item-info">
          <div>
            <h3 class="text-info">{{ item.nameEN }}</h3>
            <small class="text-muted"
              >Product Code: {{ item.productCode }} / Style Code: {{ item.styleCode }}</small
            >
            <h2 class="text-muted mt-3">Price: {{ item.storePrice | currency }}</h2>
          </div>
          <div class="row mt-3">
            <div class="col">
              <label for="size">Size:</label>
              <select
                class="form-control"
                id="size"
                ref="itemSize"
                v-model="item.size"
                @change="dataChanged = true"
              >
                <option v-for="(size, index) in item.sizes" :key="index">{{ size }}</option>
              </select>
            </div>
            <div class="col">
              <label for="quantity">Quantity:</label>
              <input
                type="number"
                class="form-control"
                min="1"
                step="1"
                id="quantity"
                v-model.number="item.quantity"
                @change="dataChanged = true"
              />
            </div>
          </div>
        </div>
        <div class="col-lg-1 cart-item-removebtn">
          <button class="btn btn-block btn-danger" @click="removeItem(item._id)">
            <i class="fas fa-lg fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="cart-buttons mt-4">
      <div class="row">
        <div class="col">
          <button class="btn btn-sm btn-block btn-danger" @click="removeAllItems">
            <i class="fas fa-trash mr-2"></i>Remove All Items
          </button>
        </div>
        <div class="col" v-if="dataChanged">
          <button class="btn btn-sm btn-block btn-success" @click="updateCart">
            <i class="fas fa-pen mr-2"></i>Update Cart
          </button>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-lg-12">
          <button class="btn btn-lg btn-block btn-warning">Checkout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'CartPage',
  data() {
    return {
      dataChanged: false
    };
  },
  computed: {
    ...mapGetters(['currentStore', 'currentCart', 'loggedInMember', 'isLoading', 'orders']),
    store: function() {
      return this.currentStore;
    },
    member: function() {
      return this.loggedInMember;
    },
    cart: function() {
      return this.currentCart;
    }
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      await this.$store.dispatch('getStore', this.$route.query.storeId);
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Stores',
          link: `/dashboard/stores/`
        },
        {
          text: `${this.store.storeName}`,
          link: `/dashboard/stores/${this.store._id}`
        },
        {
          text: 'Cart',
          link: '#'
        }
      ];
      this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getMemberStoreCart', this.store._id);
      if (this.cart.items && this.cart.items.length === 0) {
        this.$router.push({ path: `/dashboard/stores/${this.store._id}` });
      }
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    getImgUrl: function(item) {
      if (item.images.length === 0) return require('@/assets/missing_item_800.png');
      return `/images/stores/${this.store._id}/800/${item.images[0].toUpperCase()}_800.jpg`;
    },
    removeItem: async function(itemId) {
      this.$store.commit('LOADING_TRUE');
      try {
        const res = await this.$store.dispatch('removeCartItem', { id: this.cart._id, itemId });
        this.$store.commit('LOADING_FALSE');
        this.$toasted.success(res.data[0].message, { icon: 'circle-check' });
        if (this.cart.items && this.cart.items.length === 0) {
          this.$router.push({ path: `/dashboard/stores/${this.store._id}` });
        }
      } catch (err) {
        this.$store.commit('LOADING_FALSE');
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    updateCart: async function() {
      this.$store.commit('LOADING_TRUE');
      try {
        const res = await this.$store.dispatch('updateCart', {
          id: this.cart._id,
          items: this.cart.items
        });
        this.$store.commit('LOADING_FALSE');
        this.$toasted.success(res.data[0].message, { icon: 'circle-check' });
        this.dataChanged = false;
      } catch (err) {
        this.$store.commit('LOADING_FALSE');
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    removeAllItems: async function() {
      try {
        if (confirm('Are you sure?')) {
          this.$store.commit('LOADING_TRUE');
          const res = await this.$store.dispatch('updateCart', {
            id: this.cart._id,
            items: []
          });
          this.$store.commit('LOADING_FALSE');
          this.$toasted.success(res.data[0].message, { icon: 'circle-check' });
          this.dataChanged = false;
          this.$router.push({ path: `/dashboard/stores/${this.store._id}` });
        }
      } catch (err) {
        this.$store.commit('LOADING_FALSE');
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    }
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
  }
};
</script>

<style lang="scss" scoped>
.cart-item {
  background-color: whitesmoke;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.25);

  .cart-item-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
</style>
