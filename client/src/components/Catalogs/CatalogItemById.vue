<template>
  <div class="page" v-if="!isLoading">
    <div class="row">
      <div class="col-sm-12 col-lg-6 col-xl-5 image-section">
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
            <span class="text-muted mr-2">{{ currentCatalogItem.categories[0] }}</span>
            <span class="text-muted mr-2">/ {{ currentCatalogItem.categories[1] }}</span>
            <span class="text-muted mr-2" v-if="currentCatalogItem.categories[2]"
              >/ {{ currentCatalogItem.categories[2] }}</span
            >
            <span class="text-muted mr-2" v-if="currentCatalogItem.categories[3]"
              >/ {{ currentCatalogItem.categories[3] }}</span
            >
          </div>
          <div class="col-sm-12 mt-1">
            <h1>{{ currentCatalogItem.nameEN }}</h1>
          </div>
          <div class="col-sm-12 text-info">
            <span>{{ currentCatalogItem.productCode }}</span
            ><span v-if="currentCatalogItem.productCode !== currentCatalogItem.styleCode">
              / {{ currentCatalogItem.styleCode }}</span
            >
          </div>
          <div class="col-sm-12">
            <p class="mt-3 text-muted" v-if="description[0] !== 'NA'">{{ description[0] }}</p>
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
          <div class="col-sm-12">
            <span class="text-info mr-2">Gender:</span>
            <span
              >{{ currentCatalogItem.gender }} -
              {{
                currentCatalogItem.gender === 'U'
                  ? '(Unisex)'
                  : currentCatalogItem.gender === 'M'
                  ? "(Men's)"
                  : currentCatalogItem.gender === 'F'
                  ? "(Women's)"
                  : '(Junior)'
              }}</span
            >
          </div>
          <div class="col-sm-12 mt-2">
            <span class="text-info mr-2">Sizes Offered:</span>
            <span class="mr-2" v-for="size in currentCatalogItem.sizes" :key="size">{{
              size
            }}</span>
          </div>
          <div class="col-sm-12 mt-2">
            <span class="text-info mr-2">Item Active:</span>
            <span>{{ currentCatalogItem.isActive ? 'ACTIVE' : 'INACTIVE' }}</span>
          </div>
          <div class="col-sm-12 my-4">
            <h4 class="text-info" style="font-weight: 700; text-decoration: underline;">
              Price Breaks:
            </h4>
            <div class="row mt-2">
              <div class="col-sm-12 col-md-6">
                <span class="text-info">CAD</span>
                <ul class="list-group list-group-flush">
                  <li
                    v-for="pb in currentCatalogItem.priceBreaks.CAD"
                    :key="pb.priceBreak"
                    class="list-group-item"
                  >
                    <span class="pricebreaks">{{ pb.priceBreak }}</span>
                    <span class="prices text-info">{{ pb.price | currency }}</span>
                  </li>
                  <li class="list-group-item">
                    <span class="pricebreaks">250+</span>
                    <span class="prices text-info">Negotiable</span>
                  </li>
                </ul>
              </div>
              <div class="col-sm-12 col-md-6">
                <span class="text-info">USD</span>
                <ul class="list-group list-group-flush">
                  <li
                    v-for="pb in currentCatalogItem.priceBreaks.USD"
                    :key="pb.priceBreak"
                    class="list-group-item"
                  >
                    <span class="pricebreaks">{{ pb.priceBreak }}</span>
                    <span class="prices text-info">{{ pb.price | currency }}</span>
                  </li>
                  <li class="list-group-item">
                    <span class="pricebreaks">250+</span>
                    <span class="prices text-info">Negotiable</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-sm-12 mb-4">
            <router-link
              :to="`/dashboard/catalogitems/edit/${currentCatalogItem._id}`"
              class="btn btn-block btn-lg btn-info"
              >Edit Item</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CatalogItemById',
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
      ]
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
  methods: {
    getImgUrl(index) {
      if (!this.isLoading) {
        if (this.currentCatalogItem.images.length === 0)
          return `/images/assets/missing_item_800.png`;

        if (!this.currentCatalogItem.images[index]) return `/images/assets/missing_item_800.png`;

        return `/images/catalogs/${this.currentCatalog._id}/800/${this.currentCatalogItem.images[index]}_800.jpg`;
      }
    },
    switchImage(id, ind) {
      const currentZeroIndex = this.images[0].index;
      if (id !== 1) {
        this.images[0].index = ind;
        this.images[id - 1].index = currentZeroIndex;
      }
    }
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
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
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
    .bulletPoints {
      padding-left: 1rem;
      .bulletPoint {
        font-size: 0.9rem;
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
</style>
