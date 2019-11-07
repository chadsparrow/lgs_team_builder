<template>
  <div class="container" v-if="dataReady">
    <form @submit.prevent="addCatalogItem" novalidate>
      <div class="row">
        <div class="form-group col-sm-6">
          <label for="nameEN">Name (EN)</label>
          <input id="nameEN" type="text" class="form-control" v-model="nameEN" ref="nameEN" />
        </div>
        <div class="form-group col-sm-6">
          <label for="nameFR">Name (FR)</label>
          <input id="nameFR" type="text" class="form-control" v-model="nameFR" ref="nameFR" />
        </div>
        <div class="form-group col-sm-6">
          <label for="productCode">ERP Product Code</label>
          <input
            id="productCode"
            type="text"
            class="form-control"
            v-model="productCode"
            ref="productCode"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="styleCode">Production Style Code</label>
          <input
            id="styleCode"
            type="text"
            class="form-control"
            v-model="styleCode"
            ref="styleCode"
          />
        </div>
        <div class="form-group col-sm-12 text-center my-3 sizesBox">
          <div class="mb-3">
            <label>Available Sizes</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              v-model="ONE"
              type="checkbox"
              id="sizeONE"
              @change="setSizes"
            />
            <label class="form-check-label" for="sizeONE">ONE SIZE</label>
          </div>
          <div class="form-check form-check-inline mx-3">
            <input
              class="form-check-input"
              v-model="XXS"
              type="checkbox"
              id="size2XS"
              :disabled="ONE"
              @change="setSizes"
            />
            <label class="form-check-label" for="size2XS">2XS</label>
          </div>
          <div class="form-check form-check-inline mx-3">
            <input
              class="form-check-input"
              v-model="XS"
              type="checkbox"
              id="sizeXS"
              :disabled="ONE"
              @change="setSizes"
            />
            <label class="form-check-label" for="sizeXS">XS</label>
          </div>
          <div class="form-check form-check-inline mx-3">
            <input
              class="form-check-input"
              v-model="S"
              type="checkbox"
              id="sizeS"
              :disabled="ONE"
              @change="setSizes"
            />
            <label class="form-check-label" for="sizeS">S</label>
          </div>
          <div class="form-check form-check-inline mx-3">
            <input
              class="form-check-input"
              v-model="M"
              type="checkbox"
              id="sizeM"
              :disabled="ONE"
              @change="setSizes"
            />
            <label class="form-check-label" for="sizeM">M</label>
          </div>
          <div class="form-check form-check-inline mx-3">
            <input
              class="form-check-input"
              v-model="L"
              type="checkbox"
              id="sizeL"
              :disabled="ONE"
              @change="setSizes"
            />
            <label class="form-check-label" for="sizeL">L</label>
          </div>
          <div class="form-check form-check-inline mx-3">
            <input
              class="form-check-input"
              v-model="XL"
              type="checkbox"
              id="sizeXL"
              :disabled="ONE"
              @change="setSizes"
            />
            <label class="form-check-label" for="sizeXL">XL</label>
          </div>
          <div class="form-check form-check-inline mx-3">
            <input
              class="form-check-input"
              v-model="XXL"
              type="checkbox"
              id="size2XL"
              :disabled="ONE"
              @change="setSizes"
            />
            <label class="form-check-label" for="size2XL">2XL</label>
          </div>
          <div class="form-check form-check-inline mx-3">
            <input
              class="form-check-input"
              v-model="XXXL"
              type="checkbox"
              id="size3XL"
              :disabled="ONE"
              @change="setSizes"
            />
            <label class="form-check-label" for="size3XL">3XL</label>
          </div>
          <div class="form-check form-check-inline mx-3">
            <input
              class="form-check-input"
              v-model="XXXXL"
              type="checkbox"
              id="size4XL"
              :disabled="ONE"
              @change="setSizes"
            />
            <label class="form-check-label" for="size4XL">4XL</label>
          </div>
        </div>
        <div class="form-group col-sm-6">
          <label for="gender">Gender</label>
          <select class="form-control form-control" id="gender" v-model="gender" ref="gender">
            <option value="M">Mens</option>
            <option value="W">Womens</option>
            <option value="J">Junior</option>
            <option value="U">Unisex</option>
          </select>
        </div>
        <div class="form-group col-sm-6">
          <label for="categories">Categories</label>
          <vue-tags-input
            style="width: 100%;"
            v-model="category"
            :tags="categories"
            @tags-changed="newCategories => (categories = newCategories)"
          />
        </div>
        <div class="form-group col-sm-3">
          <label for="descriptionEN">Description (EN)</label>
          <textarea
            id="descriptionEN"
            ref="descriptionEN"
            class="form-control"
            rows="10"
            v-model="descriptionEN"
          ></textarea>
        </div>
        <div class="form-group col-sm-3">
          <label for="descriptionFR">Description (FR)</label>
          <textarea
            id="descriptionFR"
            ref="descriptionFR"
            class="form-control"
            rows="10"
            v-model="descriptionFR"
          ></textarea>
        </div>
        <div class="form-group col-sm-3">
          <label for="priceBreaksCAD">Price Breaks (CAD)</label>
          <ul class="list-group" id="priceBreaksCAD">
            <li class="list-group-item py-1" v-for="pb of priceBreaks.CAD" :key="pb.priceBreak">
              <div>{{ pb.priceBreak }}</div>
              <input
                type="number"
                min="0"
                step="0.01"
                class="form-control form-control-sm text-center"
                v-model="pb.price"
              />
            </li>
            <li class="list-group-item py-1">250+ Contact Us</li>
          </ul>
        </div>
        <div class="form-group col-sm-3">
          <label for="priceBreaksUSD">Price Breaks (USD)</label>
          <ul class="list-group" id="priceBreaksUSD">
            <li class="list-group-item py-1" v-for="pb of priceBreaks.USD" :key="pb.priceBreak">
              <div>{{ pb.priceBreak }}</div>
              <input
                type="number"
                min="0"
                step="0.01"
                class="form-control form-control-sm text-center"
                v-model="pb.price"
              />
            </li>
            <li class="list-group-item py-1">250+ Contact Us</li>
          </ul>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-sm-6">
          <button type="submit" class="btn btn-block btn-info">Add Catalog Item</button>
        </div>
        <div class="col-sm-6">
          <router-link
            tag="a"
            class="btn btn-danger btn-block"
            :to="`/dashboard/catalogs/${catalog._id}`"
          >Cancel</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';

export default {
  name: 'CatalogItemsAdd',
  components: {
    VueTagsInput
  },
  data() {
    return {
      nameEN: '',
      nameFR: '',
      productCode: '',
      styleCode: '',
      sizes: [],
      ONE: false,
      XXS: false,
      XS: false,
      S: false,
      M: false,
      L: false,
      XL: false,
      XXL: false,
      XXXL: false,
      XXXXL: false,
      priceBreaks: {
        CAD: [
          {
            priceBreak: '1',
            price: 0.0
          },
          {
            priceBreak: '2-5',
            price: 0.0
          },
          {
            priceBreak: '6-11',
            price: 0.0
          },
          {
            priceBreak: '12-49',
            price: 0.0
          },
          {
            priceBreak: '50-99',
            price: 0.0
          },
          {
            priceBreak: '100-249',
            price: 0.0
          }
        ],
        USD: [
          {
            priceBreak: '1',
            price: 0.0
          },
          {
            priceBreak: '2-5',
            price: 0.0
          },
          {
            priceBreak: '6-11',
            price: 0.0
          },
          {
            priceBreak: '12-49',
            price: 0.0
          },
          {
            priceBreak: '50-99',
            price: 0.0
          },
          {
            priceBreak: '100-249',
            price: 0.0
          }
        ]
      },
      gender: '',
      descriptionEN: '',
      descriptionFR: '',
      category: '',
      categories: [],
      images: [],
      isActive: true
    };
  },
  computed: {
    catalog: function() {
      return this.$store.getters.currentCatalog;
    },
    dataReady: function() {
      return this.$store.getters.dataReady;
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('getCatalog', this.$route.params.id);
      this.$store.dispatch('setDataReadyTrue');
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Catalogs',
          link: '/dashboard/catalogs'
        },
        {
          text: `${this.catalog.brand} - ${this.catalog.season} - ${this.catalog.year}`,
          link: `/dashboard/catalogs/${this.catalog._id}`
        },
        {
          text: 'Add Item',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      this.$store.dispatch('setDataReadyTrue');
    }
  },
  beforeDestroy: function() {
    this.$store.dispatch('setDataReadyFalse');
  },
  methods: {
    setSizes: function() {
      const activeSizes = [];
      if (this.ONE) {
        this.XXS = false;
        this.XS = false;
        this.S = false;
        this.M = false;
        this.L = false;
        this.XL = false;
        this.XXL = false;
        this.XXXL = false;
        this.XXXXL = false;
        activeSizes.push('ONE SIZE FITS ALL');
      } else {
        if (this.XXS) activeSizes.push('2XS');
        if (this.XS) activeSizes.push('XS');
        if (this.S) activeSizes.push('S');
        if (this.M) activeSizes.push('M');
        if (this.L) activeSizes.push('L');
        if (this.XL) activeSizes.push('XL');
        if (this.XXL) activeSizes.push('2XL');
        if (this.XXXL) activeSizes.push('3XL');
        if (this.XXXXL) activeSizes.push('4XL');
      }

      this.sizes = activeSizes;
    },
    addCatalogItem: async function() {
      const mappedCategories = this.categories.map(cat => cat.text);

      const newCatalogItem = {
        catalogId: this.catalog._id,
        nameEN: this.nameEN,
        nameFR: this.nameFR,
        productCode: this.productCode,
        styleCode: this.styleCode,
        sizes: this.sizes,
        priceBreaks: this.priceBreaks,
        gender: this.gender,
        descriptionEN: this.descriptionEN,
        descriptionFR: this.descriptionFR,
        categories: mappedCategories
      };
      try {
        const res = await this.$store.dispatch('addCatalogItem', newCatalogItem);
        this.$router
          .push({ name: 'catalogsById', params: { id: this.catalog._id } })
          .catch(() => {});
        this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
        if (err.response.data[0].message === 'Product already exists.') {
          this.$refs['productCode'].value = '';
          this.$refs['styleCode'].value = '';
          this.$refs['productCode'].focus();
        } else {
          if (err.response.data[0].context.key !== 'sizes') {
            const key = err.response.data[0].context.key;
            this.$refs[key].focus();
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.list-group-item {
  font-size: 0.9rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  input {
    width: 80px;
    height: 30px;
  }
}
</style>
