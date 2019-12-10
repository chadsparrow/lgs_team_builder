<template>
  <div class="page" v-if="!isLoading">
    <div class="row">
      <div class="col-md-12 col-lg-6 col-xl-5 image-section">
        <div class="image-box">
          <div v-for="image of images" :key="image.id" :id="`image${image.id}`">
            <img
              :src="getImgUrl(image.index)"
              :alt="image.alt"
              @click="switchImage(image.id, image.index)"
            />
          </div>
        </div>
      </div>
      <div class="col-md-12 col-lg-6 col-xl-7 info-section">
        <div class="row">
          <div class="col-sm-12">
            <div class="form-group">
              <label for="categories">Categories (EN)</label>
              <vue-tags-input
                style="width: 100%;"
                v-model="category"
                :tags="categories"
                id="categories"
                @tags-changed="newCategories => (categories = newCategories)"
              />
            </div>
          </div>
          <div class="col-sm-12">
            <div class="form-group">
              <label for="categoriesFR">Categories (FR)</label>
              <vue-tags-input
                style="width: 100%;"
                v-model="categorie"
                :tags="categoriesFR"
                id="categoriesFR"
                @tags-changed="newCategoriesFR => (categoriesFR = newCategoriesFR)"
              />
            </div>
          </div>
          <div class="form-group col-sm-12">
            <label for="nameEN">Name (EN)</label>
            <input id="nameEN" type="text" class="form-control" v-model="nameEN" ref="nameEN" />
          </div>
          <div class="form-group col-md-12 col-lg-6">
            <label for="productCode">Product Code</label>
            <input
              id="productCode"
              type="text"
              class="form-control form-control-sm"
              v-model="productCode"
              ref="productCode"
            />
          </div>
          <div class="form-group col-md-12 col-lg-6">
            <label for="styleCode">Style Code</label>
            <input
              id="styleCode"
              type="text"
              class="form-control form-control-sm"
              v-model="styleCode"
              ref="styleCode"
            />
          </div>
          <div class="form-group col-sm-12 text-center my-3">
            <div class="mb-2">
              <span>Available Sizes</span>
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
          <div class="form-group col-sm-12">
            <label for="gender">Gender</label>
            <select class="form-control form-control" id="gender" v-model="gender" ref="gender">
              <option value="M">Mens</option>
              <option value="W">Womens</option>
              <option value="J">Junior</option>
              <option value="U">Unisex</option>
            </select>
          </div>
          <div class="form-group col-md-12 col-lg-6 mt-2">
            <label for="descriptionEN">Description (EN)</label>
            <textarea
              id="descriptionEN"
              ref="descriptionEN"
              class="form-control"
              rows="10"
              v-model="descriptionEN"
            ></textarea>
          </div>
          <div class="form-group col-md-12 col-lg-6 mt-2">
            <label for="descriptionFR">Description (FR)</label>
            <textarea
              id="descriptionFR"
              ref="descriptionFR"
              class="form-control"
              rows="10"
              v-model="descriptionFR"
            ></textarea>
          </div>
          <div class="form-group col-md-12 col-lg-6 mt-2">
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
          <div class="form-group col-md-12 col-lg-6 mt-2">
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
          <div class="col-sm-12 my-4 text-right">
            <router-link
              :to="`/dashboard/catalogitems/${currentCatalogItem._id}`"
              class="btn btn-lg btn-danger mr-2"
              >Cancel</router-link
            >
            <button class="btn btn-lg btn-success" @click.prevent="updateCatalogItem">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';
import { mapGetters } from 'vuex';

export default {
  name: 'CatalogItemByIdEdit',
  components: {
    VueTagsInput
  },
  data() {
    return {
      images: [
        {
          id: 1,
          index: 0,
          alt: 'Product Image 1'
        },
        {
          id: 2,
          index: 1,
          alt: 'Product Image 2'
        },
        {
          id: 3,
          index: 2,
          alt: 'Product Image 3'
        },
        {
          id: 4,
          index: 3,
          alt: 'Product Image 4'
        }
      ],
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
      categorie: '',
      categories: [],
      categoriesFR: [],
      isActive: true
    };
  },
  computed: {
    ...mapGetters(['isLoading', 'currentCatalog', 'currentCatalogItem']),
    description: function() {
      const desc = this.currentCatalogItem.descriptionEN;
      const descArray = desc.split('•');
      const bulletPoints = descArray.map(el => {
        el = el.replace('\n', '').trim();
        return el;
      });
      return bulletPoints;
    },
    bulletPoints: function() {
      const bulletPoints = this.description.filter((el, i) => {
        if (i > 0) return el;
      });
      return bulletPoints;
    }
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      const res = await this.$store.dispatch('getCatalogItem', this.$route.params.id);
      const {
        nameEN,
        nameFR,
        priceBreaks,
        productCode,
        sizes,
        styleCode,
        isActive,
        gender,
        descriptionEN,
        descriptionFR,
        categories,
        categoriesFR
      } = res.data;
      this.nameEN = nameEN;
      this.nameFR = nameFR;
      this.productCode = productCode;
      this.styleCode = styleCode;
      this.sizes = sizes;
      this.priceBreaks = priceBreaks;
      this.gender = gender;
      this.descriptionEN = descriptionEN;
      this.descriptionFR = descriptionFR;
      if (categories.length > 0) {
        this.categories = categories.map(el => {
          return {
            text: el
          };
        });
      }
      if (categoriesFR.length > 0) {
        this.categoriesFR = categoriesFR.map(el => {
          return {
            text: el
          };
        });
      }
      this.isActive = isActive;

      this.sizes.forEach(el => {
        this[el] = true;
      });

      await this.$store.dispatch('getCatalog', this.currentCatalogItem.catalogId._id);
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Catalogs',
          link: '/dashboard/catalogs'
        },
        {
          text: `${this.currentCatalog.brand} - ${this.currentCatalog.season} - ${this.currentCatalog.year}`,
          link: `/dashboard/catalogs/${this.currentCatalog._id}`
        },
        {
          text: `${this.currentCatalogItem.nameEN} (${this.currentCatalogItem.styleCode})`,
          link: `/dashboard/catalogitems/${this.currentCatalogItem._id}`
        },
        {
          text: 'Edit',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    updateCatalogItem: async function() {
      const mappedCategoriesEN = this.categories.map(cat => cat.text);
      const mappedCategoriesFR = this.categoriesFR.map(catFR => catFR.text);

      const updatedCatalogItem = {
        nameEN: this.nameEN,
        nameFR: this.nameFR,
        productCode: this.productCode,
        styleCode: this.styleCode,
        sizes: this.sizes,
        priceBreaks: this.priceBreaks,
        gender: this.gender,
        descriptionEN: this.descriptionEN,
        descriptionFR: this.descriptionFR,
        categories: mappedCategoriesEN,
        categoriesFR: mappedCategoriesFR
      };

      try {
        const res = await this.$store.dispatch('updateCatalogItem', {
          id: this.currentCatalogItem._id,
          updatedCatalogItem
        });
        this.$router
          .push({ name: 'catalogItemById', params: { id: this.currentCatalogItem._id } })
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
    },
    getImgUrl(index) {
      if (!this.isLoading) {
        if (this.currentCatalogItem.images.length === 0)
          return `/images/assets/missing_item_800.png`;

        if (!this.currentCatalogItem.images[index]) return `/images/assets/missing_item_800.png`;

        return `/images/catalogs/${this.currentCatalog._id}/800/${this.currentCatalogItem.images[index]}_800.jpg`;
      }
    },
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
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  padding: 0 1rem;

  .image-section {
    .image-box {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 3fr 1fr;
      grid-gap: 1rem;
      grid-template-areas:
        'image1 image1 image1'
        'image2 image3 image4';

      margin-bottom: 1rem;

      #image1 {
        grid-area: image1;
        width: 100%;
        height: 100%;
      }
      #image2 {
        grid-area: image2;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
      #image3 {
        grid-area: image3;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
      #image4 {
        grid-area: image4;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }

      img {
        width: 100%;
      }
    }
  }

  .info-section {
    label {
      font-size: 0.9rem;
    }

    .bulletPoints {
      padding-left: 1rem;
      .bulletPoint {
        font-size: 0.9rem;
      }
    }

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
  }
}
</style>
