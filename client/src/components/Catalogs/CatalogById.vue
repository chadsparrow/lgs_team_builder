<template>
  <div class="page" v-if="!isLoading">
    <div class="header">
      <div>
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
        {{ currentCatalog.season }} - {{ currentCatalog.year }}
      </div>
      <div class="form-group form-inline">
        <label for="catalogItemSearch" class="mr-2">Search:</label>
        <input
          type="text"
          id="catalogItemSearch"
          v-if="currentCatalogItems.length > 0"
          class="form-control form-control-sm mr-3"
          v-model="catalogItemSearch"
          placeholder="Enter any product info..."
          autofocus
        />
        <small class="text-muted"
          >Showing: {{ filteredCount }}/{{ currentCatalogItems.length }}</small
        >
      </div>
      <div>
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
        <button class="btn btn-sm" @click="setView(false)">
          <i class="fas fa-align-justify fa-lg"></i>
        </button>
        <button class="btn btn-sm" @click="setView(true)">
          <i class="fas fa-grip-horizontal fa-lg"></i>
        </button>
      </div>
    </div>
    <div :class="viewGrid ? 'galleryThumb' : 'galleryList'" v-if="filteredItems.length > 0">
      <router-link
        class="thumbnail"
        v-for="item of filteredItems"
        :key="item._id"
        :to="`/dashboard/catalogItems/${item._id}`"
      >
        <div class="info-container">
          <div class="thumbnail-img">
            <img :src="getImgUrl(item)" :alt="item.nameEN" />
          </div>
          <div class="thumbnail-body">
            <span>{{ item.nameEN }}</span>
            <br />
            <small class="text-muted">PRODUCT - {{ item.productCode }}</small>
            <br v-if="item.productCode !== item.styleCode" />
            <small class="text-muted" v-if="item.productCode !== item.styleCode"
              >STYLE - {{ item.styleCode }}</small
            >
          </div>
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
      viewGrid: false,
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
      if (item.images.length === 0) return '/images/assets/missing_item_300.png';
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
  grid-template-rows: 40px auto;
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
  grid-template-areas:
    'header'
    'gallery';

  .header {
    grid-area: header;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: whitesmoke;
    padding: 0.75rem;
    border-radius: 5px;
    font-weight: 700;
    height: 40px;

    img {
      height: 35px;
      margin-right: 1.5rem;
    }

    .form-control {
      width: 500px;
    }
  }

  a {
    text-decoration: none;
  }

  .galleryThumb {
    grid-area: gallery;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    grid-auto-rows: min-content;
    grid-gap: 0.75rem;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0.25rem;

    a {
      color: black;
    }

    .thumbnail {
      position: relative;
      border-radius: 5px;
      background-color: white;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 100%;

      .thumbnail-img {
        img {
          width: 100%;
          border-radius: 5px 5px 0 0;
          object-fit: cover;
        }
      }

      .thumbnail-body {
        text-align: center;
        padding: 0.4rem;
      }

      &:hover {
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.4);
      }
    }
  }

  .galleryList {
    grid-area: gallery;
    overflow-x: hidden;
    overflow-y: auto;

    .thumbnail {
      border-radius: 5px;
      background-color: white;
      color: black;
      height: 125px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-right: 1rem;
      margin-bottom: 0.75rem;

      a {
        color: black;
      }

      .info-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .thumbnail-img {
          width: 125px;
          margin-right: 1rem;
          img {
            width: 100%;
            height: 100%;
            border-radius: 5px 0 0 5px;
            object-fit: cover;
          }
        }

        .thumbnail-body {
          padding: 0.4rem;
          span {
            font-size: 1.5rem;
            font-weight: 700;
          }
        }
      }

      &:hover {
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.4);
      }
    }
  }
}
</style>
