<template>
  <div class="page container" v-if="!isLoading">
    <form @submit.prevent="addCatalogItem" novalidate>
      <div class="row">
        <div class="form-group col-sm-12 col-lg-6">
          <label for="nameEN">Name (EN)</label>
          <input
            id="nameEN"
            type="text"
            class="form-control"
            v-model="nameEN"
            ref="nameEN"
          />
        </div>
        <div class="form-group col-sm-12 col-lg-6">
          <label for="nameFR">Name (FR)</label>
          <input
            id="nameFR"
            type="text"
            class="form-control"
            v-model="nameFR"
            ref="nameFR"
          />
        </div>
        <div class="form-group col-sm-12 col-lg-6">
          <label for="productCode">ERP Product Code</label>
          <input
            id="productCode"
            type="text"
            class="form-control"
            v-model="productCode"
            ref="productCode"
          />
        </div>
        <div class="form-group col-sm-12 col-lg-6">
          <label for="styleCode">Production Style Code</label>
          <input
            id="styleCode"
            type="text"
            class="form-control"
            v-model="styleCode"
            ref="styleCode"
          />
        </div>
        <div class="form-group col-sm-12 text-center sizesBox">
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
        <div class="form-group col-sm-12 col-lg-6">
          <label for="gender">Gender</label>
          <select
            class="form-control form-control"
            id="gender"
            v-model="gender"
            ref="gender"
          >
            <option value="M">Mens</option>
            <option value="W">Womens</option>
            <option value="J">Junior</option>
            <option value="U">Unisex</option>
          </select>
        </div>
        <div class="col-sm-12 col-lg-6">
          <div class="row m-0">
            <div class="form-group col-sm-12 col-xl-6">
              <label for="categories">Categories (EN)</label>
              <vue-tags-input
                style="width: 100%;"
                v-model="category"
                :tags="categories"
                @tags-changed="(newCategories) => (categories = newCategories)"
              />
            </div>
            <div class="form-group col-sm-12 col-xl-6">
              <label for="categories">Categories (FR)</label>
              <vue-tags-input
                style="width: 100%;"
                v-model="categorie"
                :tags="categoriesFR"
                @tags-changed="
                  (newCategoriesFR) => (categoriesFR = newCategoriesFR)
                "
              />
            </div>
          </div>
        </div>
        <div class="form-group col-sm-12 col-lg-6 col-xl-3">
          <label for="descriptionEN">Description (EN)</label>
          <textarea
            id="descriptionEN"
            ref="descriptionEN"
            class="form-control"
            rows="10"
            v-model="descriptionEN"
          ></textarea>
        </div>
        <div class="form-group col-sm-12 col-lg-6 col-xl-3">
          <label for="descriptionFR">Description (FR)</label>
          <textarea
            id="descriptionFR"
            ref="descriptionFR"
            class="form-control"
            rows="10"
            v-model="descriptionFR"
          ></textarea>
        </div>
        <div class="form-group col-sm-12 col-lg-6 col-xl-3">
          <label for="priceBreaksCAD">Price Breaks (CAD)</label>
          <ul class="list-group" id="priceBreaksCAD">
            <li
              class="list-group-item py-1"
              v-for="pb of priceBreaks.CAD"
              :key="pb.priceBreak"
            >
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
        <div class="form-group col-sm-12 col-lg-6 col-xl-3">
          <label for="priceBreaksUSD">Price Breaks (USD)</label>
          <ul class="list-group" id="priceBreaksUSD">
            <li
              class="list-group-item py-1"
              v-for="pb of priceBreaks.USD"
              :key="pb.priceBreak"
            >
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
      <div class="row mt-2">
        <div class="col-sm-12 col-lg-6 mt-2">
          <button type="submit" class="small-btn btn-block">
            Add Catalog Item
          </button>
        </div>
        <div class="col-sm-12 col-lg-6 mt-2">
          <router-link
            tag="button"
            class="small-btn danger-btn btn-block"
            :to="`/dashboard/catalogs/${currentCatalog._id}`"
            >Cancel</router-link
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';
import { mapGetters } from 'vuex';

export default {
  name: 'CatalogItemsAdd',
  components: {
    VueTagsInput,
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
            price: 0.0,
          },
          {
            priceBreak: '2-5',
            price: 0.0,
          },
          {
            priceBreak: '6-11',
            price: 0.0,
          },
          {
            priceBreak: '12-49',
            price: 0.0,
          },
          {
            priceBreak: '50-99',
            price: 0.0,
          },
          {
            priceBreak: '100-249',
            price: 0.0,
          },
        ],
        USD: [
          {
            priceBreak: '1',
            price: 0.0,
          },
          {
            priceBreak: '2-5',
            price: 0.0,
          },
          {
            priceBreak: '6-11',
            price: 0.0,
          },
          {
            priceBreak: '12-49',
            price: 0.0,
          },
          {
            priceBreak: '50-99',
            price: 0.0,
          },
          {
            priceBreak: '100-249',
            price: 0.0,
          },
        ],
      },
      gender: '',
      descriptionEN: '',
      descriptionFR: '',
      category: '',
      categories: [],
      categorie: '',
      categoriesFR: [],
      isActive: true,
    };
  },
  computed: {
    ...mapGetters(['isLoading', 'currentCatalog']),
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      await this.$store.dispatch('getCatalog', this.$route.params.id);
      const breadcrumbs = [
        {
          text: 'Catalogs',
          link: '/dashboard/catalogs',
        },
        {
          text: `${this.currentCatalog.brand} - ${this.currentCatalog.season} - ${this.currentCatalog.year}`,
          link: `/dashboard/catalogs/${this.currentCatalog._id}`,
        },
        {
          text: 'Add Item',
          link: '#',
        },
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, {
        icon: 'exclamation-triangle',
      });
    }
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
        activeSizes.push('ONE');
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
      const mappedCategories = this.categories.map((cat) => cat.text);
      const mappedCategoriesFR = this.categoriesFR.map((catFR) => catFR.text);

      const newCatalogItem = {
        catalogId: this.currentCatalog._id,
        nameEN: this.nameEN,
        nameFR: this.nameFR,
        productCode: this.productCode,
        styleCode: this.styleCode,
        sizes: this.sizes,
        priceBreaks: this.priceBreaks,
        gender: this.gender,
        descriptionEN: this.descriptionEN,
        descriptionFR: this.descriptionFR,
        categories: mappedCategories,
        categoriesFR: mappedCategoriesFR,
      };
      try {
        const res = await this.$store.dispatch(
          'addCatalogItem',
          newCatalogItem
        );
        this.$router
          .push({
            name: 'catalogsById',
            params: { id: this.currentCatalog._id },
          })
          .catch(() => {});
        this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, {
          icon: 'exclamation-triangle',
        });
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
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  padding: 1rem;
  margin: 0;

  .list-group-item {
    font-size: $span-font-size;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    input {
      width: 80px;
      height: 30px;
    }
  }
}
</style>
