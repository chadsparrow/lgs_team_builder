<template>
  <div class="page" v-if="!isLoading">
    <div class="row">
      <div class="col-md-12 col-lg-6 col-xl-5 image-section">
        <div class="image-box">
          <div v-for="image of images" :key="image.id" :id="`image${image.id}`">
            <img :src="getImgUrl(image.index)" :alt="image.alt" />
          </div>
        </div>
      </div>
      <div class="col-md-12 col-lg-6 col-xl-7 info-section">
        <div class="row">
          <div class="col-sm-12">
            <div class="form-group">
              <label for="categories"
                >{{ $t('formLabels.categories') }} (EN)</label
              >
              <vue-tags-input
                style="width: 100%;"
                :placeholder="$t('addTags')"
                :max-tags="5"
                v-model="category"
                :tags="categories"
                id="categories"
                @tags-changed="(newCategories) => (categories = newCategories)"
              />
            </div>
          </div>
          <div class="col-sm-12">
            <div class="form-group">
              <label for="categoriesFR"
                >{{ $t('formLabels.categories') }} (FR)</label
              >
              <vue-tags-input
                style="width: 100%;"
                v-model="categorie"
                :tags="categoriesFR"
                :placeholder="$t('addTags')"
                :max-tags="5"
                id="categoriesFR"
                @tags-changed="
                  (newCategoriesFR) => (categoriesFR = newCategoriesFR)
                "
              />
            </div>
          </div>
          <div class="form-group col-sm-12">
            <label for="nameEN">{{ $t('formLabels.name') }} (EN)</label>
            <input
              id="nameEN"
              type="text"
              class="form-control"
              v-model="nameEN"
              ref="nameEN"
            />
          </div>
          <div class="form-group col-sm-12">
            <label for="nameFR">{{ $t('formLabels.name') }} (FR)</label>
            <input
              id="nameFR"
              type="text"
              class="form-control"
              v-model="nameFR"
              ref="nameFR"
            />
          </div>
          <div class="form-group col-md-12 col-lg-6">
            <label for="productCode">{{ $t('formLabels.productCode') }}</label>
            <input
              id="productCode"
              type="text"
              class="form-control form-control-sm"
              v-model="productCode"
              ref="productCode"
            />
          </div>
          <div class="form-group col-md-12 col-lg-6">
            <label for="styleCode">{{ $t('formLabels.styleCode') }}</label>
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
              <span>{{ $t('formLabels.availableSizes') }}</span>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                v-model="ONE"
                type="checkbox"
                id="sizeONE"
                @change="setSizes"
              />
              <label class="form-check-label" for="sizeONE">{{
                $t('formLabels.one')
              }}</label>
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
              <label class="form-check-label" for="size2XS">{{
                $t('formLabels.xxs')
              }}</label>
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
              <label class="form-check-label" for="sizeXS">{{
                $t('formLabels.xs')
              }}</label>
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
              <label class="form-check-label" for="sizeS">{{
                $t('formLabels.s')
              }}</label>
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
              <label class="form-check-label" for="sizeM">{{
                $t('formLabels.m')
              }}</label>
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
              <label class="form-check-label" for="sizeL">{{
                $t('formLabels.l')
              }}</label>
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
              <label class="form-check-label" for="sizeXL">{{
                $t('formLabels.xl')
              }}</label>
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
              <label class="form-check-label" for="size2XL">{{
                $t('formLabels.xxl')
              }}</label>
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
              <label class="form-check-label" for="size3XL">{{
                $t('formLabels.xxxl')
              }}</label>
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
              <label class="form-check-label" for="size4XL">{{
                $t('formLabels.xxxxl')
              }}</label>
            </div>
          </div>
          <div class="form-group col-sm-12">
            <label for="gender">{{ $t('formLabels.gender') }}</label>
            <select
              class="form-control form-control"
              id="gender"
              v-model="gender"
              ref="gender"
            >
              <option value="M">{{ $t('formLabels.mens') }}</option>
              <option value="W">{{ $t('formLabels.womens') }}</option>
              <option value="J">{{ $t('formLabels.junior') }}</option>
              <option value="U">{{ $t('formLabels.unisex') }}</option>
            </select>
          </div>
          <div class="form-group col-md-12 col-lg-6 mt-2">
            <label for="descriptionEN"
              >{{ $t('formLabels.description') }} (EN)</label
            >
            <textarea
              id="descriptionEN"
              ref="descriptionEN"
              class="form-control"
              rows="10"
              v-model="descriptionEN"
            ></textarea>
          </div>
          <div class="form-group col-md-12 col-lg-6 mt-2">
            <label for="descriptionFR"
              >{{ $t('formLabels.description') }} (FR)</label
            >
            <textarea
              id="descriptionFR"
              ref="descriptionFR"
              class="form-control"
              rows="10"
              v-model="descriptionFR"
            ></textarea>
          </div>
          <div class="form-group col-md-12 col-lg-6 mt-2">
            <label for="priceBreaksCAD"
              >{{ $t('formLabels.priceBreaks') }} (CAD)</label
            >
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
              <li class="list-group-item py-1">
                {{ $t('formLabels.contactUs') }}
              </li>
            </ul>
          </div>
          <div class="form-group col-md-12 col-lg-6 mt-2">
            <label for="priceBreaksUSD"
              >{{ $t('formLabels.priceBreaks') }} (USD)</label
            >
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
              <li class="list-group-item py-1">
                {{ $t('formLabels.contactUs') }}
              </li>
            </ul>
          </div>
          <div class="col-sm-12 my-4 text-right">
            <router-link
              :to="`/dashboard/catalogitems/${currentCatalogItem._id}`"
              class="btn btn-danger mr-2"
              >{{ $t('cancel') }}</router-link
            >
            <button class="btn btn-success" @click.prevent="updateCatalogItem">
              {{ $t('saveChanges') }}
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
import i18n from '../../i18n';

export default {
  name: 'CatalogItemByIdEdit',
  components: {
    VueTagsInput,
  },
  data() {
    return {
      images: [
        {
          id: 1,
          index: 0,
          alt: 'Product Image 1',
        },
        {
          id: 2,
          index: 1,
          alt: 'Product Image 2',
        },
        {
          id: 3,
          index: 2,
          alt: 'Product Image 3',
        },
        {
          id: 4,
          index: 3,
          alt: 'Product Image 4',
        },
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
      categorie: '',
      categories: [],
      categoriesFR: [],
      isActive: true,
    };
  },
  computed: {
    ...mapGetters(['isLoading', 'currentCatalog', 'currentCatalogItem']),
    description: function() {
      const desc = this.currentCatalogItem.descriptionEN;
      const descArray = desc.split('•');
      const bulletPoints = descArray.map((el) => {
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
    },
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      const res = await this.$store.dispatch(
        'getCatalogItem',
        this.$route.params.id
      );
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
        categoriesFR,
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
        this.categories = categories.map((el) => {
          return {
            text: el,
          };
        });
      }
      if (categoriesFR.length > 0) {
        this.categoriesFR = categoriesFR.map((el) => {
          return {
            text: el,
          };
        });
      }
      this.isActive = isActive;

      this.sizes.forEach((el) => {
        this[el] = true;
      });

      await this.$store.dispatch(
        'getCatalog',
        this.currentCatalogItem.catalogId._id
      );
      const breadcrumbs = [
        {
          text: i18n.t('menu.adminOnly.catalogs'),
          link: '/dashboard/catalogs',
        },
        {
          text: `${this.currentCatalog.brand} - ${this.currentCatalog.season} - ${this.currentCatalog.year}`,
          link: `/dashboard/catalogs/${this.currentCatalog._id}`,
        },
        {
          text: `${this.currentCatalogItem.nameEN} (${this.currentCatalogItem.styleCode})`,
          link: `/dashboard/catalogitems/${this.currentCatalogItem._id}`,
        },
        {
          text: i18n.t('edit'),
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
    updateCatalogItem: async function() {
      const mappedCategoriesEN = this.categories.map((cat) => cat.text);
      const mappedCategoriesFR = this.categoriesFR.map((catFR) => catFR.text);

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
        categoriesFR: mappedCategoriesFR,
      };

      try {
        await this.$store.dispatch('updateCatalogItem', {
          id: this.currentCatalogItem._id,
          updatedCatalogItem,
        });
        this.$router
          .push({
            name: 'catalogItemById',
            params: { id: this.currentCatalogItem._id },
          })
          .catch(() => {});
        this.$toasted.success(i18n.t('catalogs.itemUpdated'), {
          icon: 'check-circle',
        });
      } catch (err) {
        if (err.response.data[0].message === 'Product already exists.') {
          this.$toasted.error(i18n.t('catalogs.productExists'), {
            icon: 'exclamation-triangle',
          });
          this.$refs['productCode'].value = '';
          this.$refs['styleCode'].value = '';
          this.$refs['productCode'].focus();
        } else {
          this.$toasted.error(err.response.data[0].message, {
            icon: 'exclamation-triangle',
          });
          if (err.response.data[0].context.key !== 'sizes') {
            const key = err.response.data[0].context.key;
            this.$refs[key].focus();
          }
        }
      }
    },
    getImgUrl(index) {
      if (!this.isLoading) {
        if (
          this.currentCatalogItem.images.length === 0 ||
          !this.currentCatalogItem.images[index]
        )
          return `https://teambuilder.s3.amazonaws.com/images/assets/missing_item_hd.png`;

        return `https://teambuilder.s3.amazonaws.com/images/catalogs/${this.currentCatalog.brand}/${this.currentCatalogItem.images[index]}_hd.jpg`;
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
    },
  },
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
