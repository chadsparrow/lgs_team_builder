<template>
  <div class="page" v-if="dataReady">
    <div class="image-section">
      <div class="grid">
        <div v-for="image of images" :key="image.id" :id="`image${image.id}`">
          <img
            :src="getImgUrl(image.index, image.size)"
            :alt="image.alt"
            @click="switchImage(image.id, image.index)"
          />
        </div>
      </div>
    </div>
    <div class="info-section">
      <div class="row">
        <div class="col-sm-12">
          <span class="text-muted mr-2">{{item.categories[0]}}</span>
          <span class="text-muted mr-2">/ {{item.categories[1]}}</span>
          <span class="text-muted mr-2" v-if="item.categories[2]">/ {{item.categories[2]}}</span>
          <span class="text-muted mr-2" v-if="item.categories[3]">/ {{item.categories[3]}}</span>
        </div>
        <div class="col-sm-12">
          <h3>{{item.nameEN}}</h3>
        </div>
        <div class="col-sm-12">
          <span class="text-info">{{item.productCode}} / {{item.productCode}}</span>
        </div>
        <div class="col-sm-12">
          <p class="mt-3 text-muted">{{description[0]}}</p>
          <ul class="bulletPoints">
            <li
              v-for="(bulletPoint, index) in bulletPoints"
              :key="index"
              class="text-muted bulletPoint"
            >{{bulletPoint}}</li>
          </ul>
        </div>
        <div class="col-sm-12">
          <span class="text-info mr-2">Gender:</span>
          <span>{{item.gender}} - {{item.gender==="U" ? '(Unisex)' : item.gender==="M" ? "(Men's)" : item.gender==="F" ? "(Women's)" : "(Junior)"}}</span>
        </div>
        <div class="col-sm-12 mt-2">
          <span class="text-info mr-2">Sizes Offered:</span>
          <span class="mr-2" v-for="size in item.sizes" :key="size">{{size}}</span>
        </div>
        <div class="col-sm-12 mt-2">
          <span class="text-info mr-2">Item Active:</span>
          <span>{{item.isActive ? 'ACTIVE' : 'INACTIVE'}}</span>
        </div>
        <div class="col-sm-12 my-4">
          <h4 class="text-info" style="font-weight: 700; text-decoration: underline;">Price Breaks:</h4>
          <div class="row mt-2">
            <div class="col-sm-6">
              <span class="text-info">CAD</span>
              <ul class="list-group list-group-flush">
                <li v-for="pb in item.priceBreaks.CAD" :key="pb.priceBreak" class="list-group-item">
                  <span class="pricebreaks">{{pb.priceBreak}}</span>
                  <span class="prices text-info">{{pb.price}}</span>
                </li>
                <li class="list-group-item">
                  <span class="pricebreaks">250+</span>
                  <span class="prices text-info">Negotiable</span>
                </li>
              </ul>
            </div>
            <div class="col-sm-6">
              <span class="text-info">USD</span>
              <ul class="list-group list-group-flush">
                <li v-for="pb in item.priceBreaks.USD" :key="pb.priceBreak" class="list-group-item">
                  <span class="pricebreaks">{{pb.priceBreak}}</span>
                  <span class="prices text-info">{{pb.price}}</span>
                </li>
                <li class="list-group-item">
                  <span class="pricebreaks">250+</span>
                  <span class="prices text-info">Negotiable</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-sm-12">Buttons</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CatalogItemById',
  data() {
    return {
      images: [
        {
          id: 1,
          index: 0,
          size: 800,
          alt: 'Product Image 1'
        },
        {
          id: 2,
          index: 1,
          size: 300,
          alt: 'Product Image 2'
        },
        {
          id: 3,
          index: 2,
          size: 300,
          alt: 'Product Image 3'
        },
        {
          id: 4,
          index: 3,
          size: 300,
          alt: 'Product Image 4'
        }
      ]
    };
  },
  computed: {
    catalog: function() {
      return this.$store.getters.currentCatalog;
    },
    item: function() {
      return this.$store.getters.currentCatalogItem;
    },
    dataReady: function() {
      return this.$store.getters.dataReady;
    },
    description: function() {
      const desc = this.item.descriptionEN;
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
    getImgUrl(index, size) {
      if (this.dataReady) {
        if (this.item.images.length === 0) return require(`@/assets/missing_item_${size}.png`);

        if (!this.item.images[index]) return require(`@/assets/missing_item_${size}.png`);
        const folderName = `${this.catalog.brand}_${this.catalog.season}_${this.catalog.year}`;

        return `/images/catalogs/${folderName}/${size}/${this.item.images[index]}_${size}.jpg`;
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
    try {
      await this.$store.dispatch('getCatalogItem', this.$route.params.id);
      const imagesLength = this.item.images.length;
      if (imagesLength <= 2) {
        this.images = this.images.splice(0, 2);
      } else {
        this.images = this.images.splice(0, imagesLength);
      }
      await this.$store.dispatch('getCatalog', this.item.catalogId._id);
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
          text: `${this.item.nameEN} (${this.item.styleCode})`,
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.$store.dispatch('setDataReadyTrue');
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      this.$store.dispatch('setDataReadyTrue');
    }
  },
  beforeDestroy: function() {
    this.$store.dispatch('setDataReadyFalse');
  }
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 1000px 1fr;
  grid-template-rows: 1fr;
  grid-gap: 2rem;
  width: 100%;
  height: 100%;
  grid-template-areas: 'image-section info-section';
}

.image-section {
  grid-area: image-section;

  .grid {
    background-color: whitesmoke;
    display: grid;
    grid-template-columns: 800px 200px;
    grid-template-rows: 200px 200px 200px;
    grid-template-areas:
      'image1 image2'
      'image1 image3'
      'image1 image4';

    #image1 {
      grid-area: image1;
      width: 100%;
      height: 100%;
      padding: 0.5rem;
    }
    #image2 {
      grid-area: image2;
      width: 100%;
      height: 100%;
      padding: 0.5rem 0.5rem 0.5rem 0;
      cursor: pointer;
    }
    #image3 {
      grid-area: image3;
      width: 100%;
      height: 100%;
      padding: 0.5rem 0.5rem 0 0;
      cursor: pointer;
    }
    #image4 {
      grid-area: image4;
      width: 100%;
      height: 100%;
      padding: 0.5rem 0.5rem 0 0;
      cursor: pointer;
    }

    img {
      width: 100%;
    }
  }
}

.info-section {
  grid-area: info-section;
  padding-right: 50px;

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
      &::before {
        content: '$';
      }
    }
  }
}
</style>

