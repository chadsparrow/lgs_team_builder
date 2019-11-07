<template>
  <div class="page" v-if="dataReady">
    <div class="image-section">
      <div class="grid">
        <div v-for="image of images" :key="image.id" :id="`image${image.id}`">
          <img :src="getImgUrl(image.index, image.size)" :alt="image.alt" />
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
          <span class="text-info">{{item.productCode}} - {{item.productCode}}</span>
        </div>
        <div class="col-sm-12">
          <p style="white-space: pre-line;" class="mt-3 text-muted">{{item.descriptionEN}}</p>
        </div>
        <div class="col-sm-12">
          <span class="text-info mr-2">Gender:</span>
          <span>{{item.gender}} - {{item.gender==="U" ? '(Unisex)' : item.gender==="M" ? "(Men's)" : item.gender==="F" ? "(Women's)" : "(Junior)"}}</span>
        </div>
        <div class="col-sm-12">
          <span class="text-info mr-2">Sizes Offered:</span>
          <span class="mr-2" v-for="size in item.sizes" :key="size">{{size}}</span>
        </div>
      </div>
    </div>
    <div class="button-section">buttons</div>
  </div>
</template>

<script>
export default {
  name: 'CatalogItemById',
  data() {
    return {
      images: [
        {
          id: '1',
          index: 0,
          size: 800,
          alt: 'Product Image 1'
        },
        {
          id: '2',
          index: 1,
          size: 300,
          alt: 'Product Image 2'
        },
        {
          id: '3',
          index: 2,
          size: 300,
          alt: 'Product Image 3'
        },
        {
          id: '4',
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
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('getCatalogItem', this.$route.params.id);
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
  grid-template-columns: 800px 1fr;
  grid-template-rows: 1fr 40px;
  grid-gap: 1.5rem;
  width: 100%;
  height: 100%;
  grid-template-areas:
    'image-section info-section'
    'button-section info-section';
}

.image-section {
  grid-area: image-section;

  .grid {
    background-color: whitesmoke;
    display: grid;
    grid-template-columns: 600px 200px;
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
      padding: 0.5rem;
    }
    #image3 {
      grid-area: image3;
      width: 100%;
      height: 100%;
      padding: 0.5rem;
    }
    #image4 {
      grid-area: image4;
      width: 100%;
      height: 100%;
      padding: 0.5rem;
    }

    img {
      width: 100%;
    }
  }
}

.info-section {
  grid-area: info-section;
}

.button-section {
  grid-area: button-section;
}
</style>

