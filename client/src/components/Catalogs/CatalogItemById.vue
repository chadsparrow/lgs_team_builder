<template>
  <div class="page" v-if="dataReady">
    <div class="image-section">
      <div class="grid">
        <div v-for="image of images" :key="image.id" :id="`image${image.id}`">
          <img :src="getImgUrl(image.index, image.size)" :alt="image.alt" />
        </div>
      </div>
    </div>
    <div class="info-section">Info</div>
    <div class="button-section">buttons</div>
  </div>
</template>

<script>
export default {
  name: 'CatalogItemById',
  data() {
    return {
      dataReady: false,
      images: [
        {
          id: '1',
          index: 0,
          size: 800,
          alt: 'front_image'
        },
        {
          id: '2',
          index: 1,
          size: 300,
          alt: 'back_image'
        },
        {
          id: '3',
          index: 2,
          size: 300,
          alt: 'alt_image1'
        },
        {
          id: '4',
          index: 3,
          size: 300,
          alt: 'alt_image2'
        }
      ]
    };
  },
  computed: {
    catalog: function() {
      return this.$store.getters.currentCatalog;
    },
    catalogItem: function() {
      return this.$store.getters.currentCatalogItem;
    }
  },
  methods: {
    getImgUrl(index, size) {
      if (this.dataReady) {
        if (this.catalogItem.images.length === 0)
          return require(`@/assets/missing_item_${size}.png`);

        if (!this.catalogItem.images[index]) return require(`@/assets/missing_item_${size}.png`);

        return this.catalogItem.images[index];
      }
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('getCatalogItem', this.$route.params.id);
      await this.$store.dispatch('getCatalog', this.catalogItem.catalogId._id);
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
          text: `${this.catalogItem.nameEN}`,
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.dataReady = true;
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.grid-move {
  transition: all 0.3s;
}

.info-section {
  grid-area: info-section;
}

.button-section {
  grid-area: button-section;
}
</style>

