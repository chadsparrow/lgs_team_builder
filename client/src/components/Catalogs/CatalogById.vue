<template>
  <div class="page" v-if="!isLoading">
    <div class="header">
      <div class="row text-center">
        <div class="col-md-12 col-lg-2 my-auto">
          <img
            src="/images/assets/garneau_logo.png"
            alt="Garneau Logo"
            v-if="currentCatalog.brand === 'GARNEAU'"
          />
          <img
            src="/images/assets/sugoi_logo.png"
            alt="Sugoi Logo"
            v-if="currentCatalog.brand === 'SUGOI'"
          />
          <img
            src="/images/assets/sombrio_logo.png"
            alt="Sombrio Logo"
            v-if="currentCatalog.brand === 'SOMBRIO'"
          />
          <br />
          {{ currentCatalog.season }} - {{ currentCatalog.year }}
        </div>
        <div class="col-md-12 col-lg-10 text-center my-auto">
          <div class="form-group">
            <input
              type="text"
              id="catalogItemSearch"
              v-if="currentCatalogItems.length > 0"
              class="form-control form-control-sm mx-auto text-center"
              v-model="catalogItemSearch"
              placeholder="search"
              autofocus
            />
            <small class="text-muted"
              >Showing: {{ filteredCount }}/{{ currentCatalogItems.length }}</small
            >
          </div>
        </div>
      </div>

      <div class="header-buttons">
        <router-link
          class="btn btn-sm"
          :to="`/dashboard/catalogs/${currentCatalog._id}/add`"
          tag="a"
        >
          <i class="fas fa-plus fa-lg"></i>
        </router-link>
        <router-link
          class="btn btn-sm"
          :to="`/dashboard/catalogs/${currentCatalog._id}/edit`"
          tag="a"
        >
          <i class="fas fa-cog fa-lg"></i>
        </router-link>
      </div>
    </div>
    <div class="galleryList" v-if="filteredItems.length > 0">
      <router-link
        class="thumbnail"
        v-for="item of filteredItems"
        :key="item._id"
        :to="`/dashboard/catalogItems/${item._id}`"
      >
        <div class="thumbnail-img" v-lazy-container="{ selector: 'img' }">
          <img :data-src="getImgUrl(item)" :alt="item.nameEN" />
        </div>

        <div class="thumbnail-body">
          <p>{{ item.nameEN }}</p>
          <small class="text-muted">PRODUCT : {{ item.productCode }}</small>
          <small class="text-muted" v-if="item.productCode !== item.styleCode">
            / STYLE : {{ item.styleCode }}</small
          >
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'CatalogById',
  data() {
    return {
      catalogItemSearch: ''
    };
  },
  computed: {
    ...mapGetters(['isLoading', 'currentCatalog', 'currentCatalogItems']),
    filteredItems: function() {
      return this.currentCatalogItems.filter(item => {
        if (
          item.categories.includes(this.catalogItemSearch.toUpperCase()) ||
          item.nameEN.toLowerCase().includes(this.catalogItemSearch.toLowerCase()) ||
          item.nameFR.toLowerCase().includes(this.catalogItemSearch.toLowerCase()) ||
          item.productCode.toLowerCase().includes(this.catalogItemSearch.toLowerCase()) ||
          item.styleCode.toLowerCase().includes(this.catalogItemSearch.toLowerCase())
        ) {
          if (
            (this.catalogItemSearch.toLowerCase() === "men's" ||
              this.catalogItemSearch.toLowerCase() === 'men') &&
            (item.nameEN.toLowerCase().includes('women') === true ||
              item.nameEN.toLowerCase().includes("women's") === true)
          ) {
            return null;
          } else {
            return item;
          }
        }
      });
    },
    filteredCount: function() {
      return this.filteredItems.length || this.currentCatalogItems.length;
    }
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      await this.$store.dispatch('getCatalog', this.$route.params.id);
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Catalogs',
          link: '/dashboard/catalogs'
        },
        {
          text: `${this.currentCatalog.brand} - ${this.currentCatalog.season} - ${this.currentCatalog.year}`,
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getCatalogItems', this.currentCatalog._id);
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    getImgUrl(item) {
      // if (item.images.length === 0) return '/images/assets/missing_item_300.png';
      return `/images/catalogs/${this.currentCatalog._id}/300/${item.images[0]}_300.jpg`;
    },
    setView(bool) {
      if (bool) this.viewGrid = true;
      if (!bool) this.viewGrid = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: minmax(40px 1fr) auto;
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
  grid-template-areas:
    'header'
    'gallery';

  .header {
    position: relative;
    grid-area: header;
    background-color: whitesmoke;
    border-radius: 5px;
    font-weight: 700;
    margin: 0;
    padding: 0.25rem;

    img {
      height: 35px;
      margin-right: 1.5rem;
    }

    .form-control {
      min-width: 250px;
      max-width: 500px;
    }

    .header-buttons {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
    }
  }

  a {
    text-decoration: none;
  }

  // LIST VIEW FOR CATALOG
  .galleryList {
    grid-area: gallery;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0.5rem;

    .thumbnail {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background-color: white;
      border-radius: 5px;
      color: black;
      margin-bottom: 0.5rem;
      width: 100%;

      .thumbnail-img {
        margin-right: 1rem;
        width: 125px;
        img {
          width: 100%;
          border-radius: 5px 0 0 5px;
        }
      }

      .thumbnail-body {
        p {
          font-size: 1.25rem;
          font-weight: 700;
        }
      }

      &:hover {
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.4);
        background: whitesmoke;
      }
    }
  }
}
</style>
