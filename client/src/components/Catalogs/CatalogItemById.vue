// i18n finished // responsive finished

<template>
  <div class="page container" v-if="!isLoading">
    <div class="row">
      <div class="col-lg-6 col-xl-5 image-section">
        <div class="image-box">
          <div v-for="image of images" :key="image.id" :id="`image${image.id}`">
            <img
              :src="getImgUrl(image.index)"
              :alt="image.alt"
              loading="lazy"
              @click="switchImage(image.id, image.index)"
            />
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-xl-7 info-section">
        <div class="row">
          <div class="col-12">
            <span class="text-muted mr-2">
              {{
                $i18n.locale === 'en'
                  ? currentCatalogItem.categories[0]
                  : currentCatalogItem.categoriesFR[0]
              }}
            </span>
            <span class="text-muted mr-2">
              /
              {{
                $i18n.locale === 'en'
                  ? currentCatalogItem.categories[1]
                  : currentCatalogItem.categoriesFR[1]
              }}
            </span>
            <span
              class="text-muted mr-2"
              v-if="
                currentCatalogItem.categories[2] ||
                  currentCatalogItem.categoriesFR[2]
              "
            >
              /
              {{
                $i18n.locale === 'en'
                  ? currentCatalogItem.categories[2]
                  : currentCatalogItem.categoriesFR[2]
              }}
            </span>
            <span
              class="text-muted mr-2"
              v-if="
                currentCatalogItem.categories[3] ||
                  currentCatalogItem.categoriesFR[3]
              "
            >
              /
              {{
                $i18n.locale === 'en'
                  ? currentCatalogItem.categories[3]
                  : currentCatalogItem.categoriesFR[3]
              }}
            </span>
          </div>
          <div class="col-12 mt-1">
            <h1>
              {{
                $i18n.locale === 'en'
                  ? currentCatalogItem.nameEN
                  : currentCatalogItem.nameFR
              }}
            </h1>
          </div>
          <div class="col-12 text-info">
            <span
              >{{ $t('catalogs.product') }}:
              {{ currentCatalogItem.productCode }}</span
            >
            <span
              v-if="
                currentCatalogItem.productCode !== currentCatalogItem.styleCode
              "
              >/ {{ $t('catalogs.style') }}:
              {{ currentCatalogItem.styleCode }}</span
            >
          </div>
          <div class="col-12">
            <p
              class="mt-3 text-muted text-justify"
              v-if="description[0] !== 'NA'"
            >
              {{ description[0] }}
            </p>
            <ul class="bulletPoints" v-if="bulletPoints">
              <li
                v-for="(bulletPoint, index) in bulletPoints"
                :key="index"
                class="text-muted bulletPoint"
              >
                {{ bulletPoint }}
              </li>
            </ul>
          </div>
          <div class="col-12 mt-3">
            <span class="text-info mr-2">{{ $t('formLabels.gender') }}:</span>
            <span>
              {{
                $t(`catalogs.gender.${currentCatalogItem.gender.toLowerCase()}`)
              }}
              -
              {{
                currentCatalogItem.gender === 'U'
                  ? `(${$t('formLabels.unisex')})`
                  : currentCatalogItem.gender === 'M'
                  ? `(${$t('formLabels.mens')})`
                  : currentCatalogItem.gender === 'W'
                  ? `(${$t('formLabels.womens')})`
                  : `(${$t('formLabels.junior')})`
              }}
            </span>
          </div>
          <div class="col-12 mt-2">
            <span class="text-info mr-2"
              >{{ $t('formLabels.availableSizes') }}:</span
            >
            <span
              class="mr-2"
              v-for="size in currentCatalogItem.sizes"
              :key="size"
            >
              {{ size }}
            </span>
          </div>
          <div class="col-12 mt-2">
            <span class="text-info mr-2"
              >{{ $t('formLabels.itemActive') }}:</span
            >
            <span>{{
              currentCatalogItem.isActive ? `${$t('yes')}` : `${$t('no')}`
            }}</span>
          </div>
          <div class="col-12 my-5">
            <h4
              class="text-info"
              style="font-weight: 700; text-decoration: underline;"
            >
              {{ $t('formLabels.priceBreaks') }}:
            </h4>
            <div class="row mt-2">
              <div class="col-md-6">
                <span class="text-info">CAD</span>
                <ul class="list-group list-group-flush">
                  <li
                    v-for="pb in currentCatalogItem.priceBreaks.CAD"
                    :key="pb.priceBreak"
                    class="list-group-item"
                  >
                    <span class="pricebreaks">{{ pb.priceBreak }}</span>
                    <span class="prices text-info">{{
                      pb.price | currency
                    }}</span>
                  </li>
                  <li class="list-group-item">
                    <span class="pricebreaks">250+</span>
                    <span class="prices text-info">Negotiable</span>
                  </li>
                </ul>
              </div>
              <div class="col-sm-12 col-md-6 usdPrices">
                <span class="text-info">USD</span>
                <ul class="list-group list-group-flush">
                  <li
                    v-for="pb in currentCatalogItem.priceBreaks.USD"
                    :key="pb.priceBreak"
                    class="list-group-item"
                  >
                    <span class="pricebreaks">{{ pb.priceBreak }}</span>
                    <span class="prices text-info">{{
                      pb.price | currency
                    }}</span>
                  </li>
                  <li class="list-group-item">
                    <span class="pricebreaks">250+</span>
                    <span class="prices text-info">{{
                      $t('formLabels.negotiable')
                    }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-sm-12 mb-4">
            <router-link
              :to="`/dashboard/catalogitems/edit/${currentCatalogItem._id}`"
              class="btn btn-block btn-lg btn-info"
              >{{ $t('editItem') }}</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import i18n from '../../i18n';

export default {
  name: 'CatalogItemById',
  data() {
    return {
      images: [
        {
          id: 1,
          index: 0,
          alt: i18n.t('catalogs.page.productImage1'),
        },
        {
          id: 2,
          index: 1,
          alt: i18n.t('catalogs.page.productImage2'),
        },
        {
          id: 3,
          index: 2,
          alt: i18n.t('catalogs.page.productImage3'),
        },
        {
          id: 4,
          index: 3,
          alt: i18n.t('catalogs.page.productImage4'),
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['isLoading', 'currentCatalog', 'currentCatalogItem']),
    description: function() {
      let desc = '';
      if (i18n.locale === 'fr') {
        desc = this.currentCatalogItem.descriptionFR;
      } else {
        desc = this.currentCatalogItem.descriptionEN;
      }

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
  methods: {
    getImgUrl(index) {
      if (!this.isLoading) {
        if (
          this.currentCatalogItem.images.length === 0 ||
          !this.currentCatalogItem.images[index]
        )
          return `https://teambuilder.s3.amazonaws.com/images/assets/missing_item_${
            index > 0 ? 'sd' : 'hd'
          }.png`;

        return `https://teambuilder.s3.amazonaws.com/images/catalogs/${this.currentCatalog.brand.toLowerCase()}/${
          this.currentCatalogItem.images[index]
        }_${index > 0 ? 'sd' : 'hd'}.jpg`;
      }
    },
    switchImage(id, ind) {
      const currentZeroIndex = this.images[0].index;
      if (id !== 1) {
        this.images[0].index = ind;
        this.images[id - 1].index = currentZeroIndex;
      }
    },
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      await this.$store.dispatch('getCatalogItem', this.$route.params.id);
      const imagesLength = this.currentCatalogItem.images.length;
      if (imagesLength <= 2) {
        this.images = this.images.splice(0, 2);
      } else {
        this.images = this.images.splice(0, imagesLength);
      }
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
          text: `${this.currentCatalog.brand} - ${i18n
            .t(
              `catalogs.add.season.${this.currentCatalog.season.toLowerCase()}`
            )
            .toUpperCase()} - ${this.currentCatalog.year}`,
          link: `/dashboard/catalogs/${this.currentCatalog._id}`,
        },
        {
          text: `${this.currentCatalogItem.nameEN} (${this.currentCatalogItem.styleCode})`,
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
};
</script>

<style lang="scss" scoped>
.page {
  .image-section {
    max-width: 550px;
    margin-top: 1rem;
    .image-box {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 3fr 1fr;
      grid-gap: 0.75rem;
      grid-template-areas:
        'image1 image1 image1'
        'image2 image3 image4';

      #image1 {
        grid-area: image1;
        max-width: 100%;
      }
      #image2 {
        grid-area: image2;
        max-width: 100%;
        cursor: pointer;
      }
      #image3 {
        grid-area: image3;
        max-width: 100%;
        cursor: pointer;
      }
      #image4 {
        grid-area: image4;
        max-width: 100%;
        cursor: pointer;
      }

      img {
        max-width: 100%;
      }
    }
  }

  .info-section {
    padding: 2rem;
    .bulletPoints {
      padding-left: 1rem;
      .bulletPoint {
        font-size: 0.85rem;
      }
    }

    .list-group-item {
      height: 2rem;
      padding: 0.25rem 1rem;

      .pricebreaks {
        font-weight: 700;
      }
      .prices {
        float: right;
      }
    }
  }
}

@media screen and (min-width: 992px) {
  .info-section {
    padding-right: 2rem;
  }
}
</style>
