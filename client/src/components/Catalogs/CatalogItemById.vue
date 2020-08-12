// i18n finished // responsive finished

<template>
  <div class="page container" v-if="!isLoading">
    <div class="row">
      <div class="col-lg-6 col-xl-7 image-section">
        <div class="image-box">
          <div
            v-for="(image, index) of images"
            :key="image.id"
            :id="`image${image.id}`"
          >
            <zoom-on-hover
              :img-normal="getImgUrl(index, 'sd')"
              :img-zoom="getImgUrl(index, 'hd')"
            ></zoom-on-hover>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-xl-5 info-section">
        <div class="row">
          <div class="col-12">
            <span
              class="text-muted mr-2"
              v-for="(category, i) in currentCatalogItem.categories"
              :key="i"
              v-if="$i18n.locale === 'en'"
            >
              <span v-if="i !== 0" class="mr-2">/</span>
              {{ category }}
            </span>
            <span
              class="text-muted mr-2"
              v-for="(category, i) in currentCatalogItem.categoriesFR"
              :key="i"
              v-else-if="$i18n.locale === 'fr'"
            >
              <span v-if="i !== 0" class="mr-2">/</span>
              {{ category }}
            </span>
          </div>
          <div class="col-12">
            <h3>
              {{
                $i18n.locale === 'en'
                  ? currentCatalogItem.nameEN
                  : currentCatalogItem.nameFR
              }}
            </h3>
          </div>
          <div class="col-12 text-info">
            <span>{{ currentCatalogItem.productCode }}</span>
          </div>
          <div class="col-12 ">
            <p
              class="mt-2 text-muted text-justify"
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
          <div class="col-12">
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
          <div class="col-12">
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
          <div class="col-12">
            <span class="text-info mr-2"
              >{{ $t('formLabels.itemActive') }}:</span
            >
            <span>{{
              currentCatalogItem.isActive ? `${$t('yes')}` : `${$t('no')}`
            }}</span>
          </div>
          <div class="col-12 mt-3">
            <h5
              class="text-info"
              style="font-weight: 700; text-decoration: underline;"
            >
              {{ $t('formLabels.priceBreaks') }}:
            </h5>
            <div class="row mt-2">
              <div class="col-md-6">
                <span class="text-info">CAD</span>
                <ul class="list-group list-group-flush mt-1">
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
                <ul class="list-group list-group-flush mt-1">
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
          <div class="col-sm-12 mt-4">
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
      currentCatalog: {},
      currentCatalogItem: {},
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
    ...mapGetters(['isLoading']),
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
    getImgUrl(index, quality) {
      if (!this.isLoading) {
        if (
          this.currentCatalogItem.images.length === 0 ||
          !this.currentCatalogItem.images[index]
        )
          return `https://teambuilder.s3.amazonaws.com/images/assets/missing_item_${quality}.png`;

        return `https://teambuilder.s3.amazonaws.com/images/catalogs/${this.currentCatalog.brand.toLowerCase()}/${
          this.currentCatalogItem.images[index]
        }_${quality}.jpg`;
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
      const res = await this.$store.dispatch(
        'getCatalogItem',
        this.$route.params.id
      );
      this.currentCatalogItem = res.data;
      const imagesLength = this.currentCatalogItem.images.length;
      if (imagesLength <= 2) {
        this.images = this.images.splice(0, 2);
      } else {
        this.images = this.images.splice(0, imagesLength);
      }
      const response = await this.$store.dispatch(
        'getCatalog',
        this.currentCatalogItem.catalogId._id
      );
      this.currentCatalog = response.data;
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
  width: 100%;
  margin: 0 auto;
  .image-section {
    margin-top: 1rem;
    .image-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      grid-template-areas:
        'image1 image2'
        'image3 image4';
      grid-gap: 0.5rem;
      width: 100%;
      height: 100%;

      img {
        max-width: 100%;
      }

      #image1 {
        grid-area: image1;
        max-width: 100%;
      }
      #image2 {
        grid-area: image2;
        max-width: 100%;
      }
      #image3 {
        grid-area: image3;
        max-width: 100%;
      }
      #image4 {
        grid-area: image4;
        max-width: 100%;
      }
    }
  }

  .info-section {
    padding: 1rem 1.5rem 1rem 1rem;
    .bulletPoints {
      padding-left: 1rem;
      .bulletPoint {
        font-size: $span-font-size;
      }
    }

    .list-group-item {
      height: 2rem;
      padding: 0.25rem 1rem;

      .pricebreaks {
        font-weight: $font-weight-bold;
      }
      .prices {
        float: right;
      }
    }
  }
}

@media screen and (max-width: 992px) {
  .info-section {
    padding: 1rem 2rem 1rem 1rem;

    .usdPrices {
      margin-top: 0.5rem;
    }
  }
}
</style>
