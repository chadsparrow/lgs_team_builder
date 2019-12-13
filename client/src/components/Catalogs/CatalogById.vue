<template>
  <div class="page" v-if="!isLoading">
    <div class="header">
      <div class="row text-center">
        <div class="col-md-12 col-lg-3">
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
        <div class="col-md-12 col-lg-9 text-center my-2">
          <div class="input-group">
            <input
              type="text"
              id="catalogItemSearch"
              v-if="currentCatalogItems.length > 0"
              class="form-control form-control-sm mx-auto text-center"
              v-model="catalogItemSearch"
              :placeholder="`${$t('search')}...`"
              ref="searchBar"
              autofocus
            />
            <button
              class="btn btn-sm bg-transparent"
              style="margin-left: -30px; z-index: 100;"
              @click.prevent="resetSearchBar"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <small class="text-muted"
            >{{ $t('showing') }}: {{ filteredCount }}/{{ currentCatalogItems.length }}</small
          >
        </div>
        <div class="col-sm-12 col-lg-6 col-xl-4">
          <div class="row">
            <div class="col-sm-12 col-md-6 mt-2">
              <router-link
                class="btn btn-sm btn-block btn-info"
                :to="`/dashboard/catalogs/${currentCatalog._id}/add`"
                tag="a"
              >
                <i class="fas fa-plus fa-lg mr-2"></i>Add Item
              </router-link>
            </div>
            <div class="col-sm-12 col-md-6 mt-2">
              <router-link
                class="btn btn-sm btn-block btn-info"
                :to="`/dashboard/catalogs/${currentCatalog._id}/edit`"
                tag="a"
              >
                <i class="fas fa-cog fa-lg mr-2"></i>Settings
              </router-link>
            </div>
          </div>
        </div>
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
          <div class="row">
            <div class="col-sm-12">
              <p>{{ item.nameEN }}</p>
            </div>
            <div class="col-sm-12 col-lg-6 col-xl-4">
              <small class="text-muted mr-4">PRODUCT : {{ item.productCode }}</small>
            </div>
            <div class="col-sm-12 col-lg-6 col-xl-4">
              <small class="text-muted" v-if="item.productCode !== item.styleCode"
                >STYLE : {{ item.styleCode }}</small
              >
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import i18n from '../../i18n';
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
        { text: i18n.t('menu.dashboard'), link: '/dashboard/index' },
        {
          text: i18n.t('menu.adminOnly.catalogs'),
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
      return `/images/catalogs/${this.currentCatalog._id}/300/${item.images[0]}_300.jpg`;
    },
    resetSearchBar() {
      this.catalogItemSearch = '';
      this.$refs.searchBar.focus();
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: minmax(40px 1fr) auto;
  width: 100%;
  height: 100%;
  grid-template-areas:
    'header'
    'gallery';

  .header {
    position: relative;
    grid-area: header;
    font-weight: 700;
    padding: 0.5rem;
    margin: 0;

    img {
      height: 35px;
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
      margin: 0 0 0.5rem 0;
      width: 100%;

      .thumbnail-img {
        margin-right: 1rem;
        min-width: 125px;
        width: 125px;
        img {
          width: 100%;
          border-radius: 5px 0 0 5px;
        }
      }

      .thumbnail-body {
        width: 100%;
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
