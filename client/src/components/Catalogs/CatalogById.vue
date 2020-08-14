<template>
  <div class="page container" v-if="!isLoading">
    <div class="header">
      <div class="row text-center">
        <div class="col-lg-3">
          <img
            src="https://teambuilder.s3.amazonaws.com/images/assets/garneau_logo.png"
            alt="Garneau Logo"
            v-if="currentCatalog.brand === 'GARNEAU'"
          />
          <img
            src="https://teambuilder.s3.amazonaws.com/images/assets/sugoi_logo.png"
            alt="Sugoi Logo"
            v-if="currentCatalog.brand === 'SUGOI'"
          />
          <img
            src="https://teambuilder.s3.amazonaws.com/images/assets/sombrio_logo.png"
            alt="Sombrio Logo"
            v-if="currentCatalog.brand === 'SOMBRIO'"
          />
          <br />
          {{ currentCatalog.season }} - {{ currentCatalog.year }}
        </div>
        <div class="col-sm-6 col-lg-3 offset-sm-3 offset-lg-6">
          <div class="input-group">
            <input
              type="text"
              id="catalogItemSearch"
              v-if="currentCatalogItems.length > 0"
              class="form-control form-control-sm mx-auto text-center"
              v-model="catalogItemSearch"
              :placeholder="`${$t('search')}...`"
              ref="searchBar"
            />
            <button
              class="btn btn-sm"
              style="margin-left: -30px; z-index: 100;"
              @click.prevent="resetSearchBar"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <small class="text-muted"
            >{{ $t('showing') }}: {{ filteredCount }}/{{
              currentCatalogItems.length
            }}</small
          >
        </div>
        <div class="col-lg-6 col-xl-4 mt-2">
          <div class="row">
            <div class="col-md-6 mt-2">
              <router-link
                class="small-btn btn-block"
                :to="`/dashboard/catalogs/${currentCatalog._id}/add`"
                tag="button"
              >
                <i class="fas fa-plus fa-lg mr-2"></i>Add Item
              </router-link>
            </div>
            <div class="col-md-6 mt-2">
              <router-link
                class="small-btn btn-block"
                :to="`/dashboard/catalogs/${currentCatalog._id}/edit`"
                tag="button"
              >
                <i class="fas fa-cog fa-lg mr-2"></i>Settings
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="galleryList my-3" v-if="filteredItems.length > 0">
      <router-link
        class="galleryList__thumbnail"
        v-for="item of filteredItems"
        :key="item._id"
        :to="`/dashboard/catalogItems/${item._id}`"
      >
        <div class="img-container">
          <img
            :src="getImgUrl(item)"
            :alt="$i18n.locale === 'en' ? item.nameEN : item.nameFR"
            loading="lazy"
          />
        </div>

        <div class="thumbnail-body text-center">
          <div>
            <p class="productName mb-0">
              {{ $i18n.locale === 'en' ? item.nameEN : item.nameFR }}
            </p>
          </div>
          <div>
            <small class="text-muted">{{ item.productCode }}</small>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import i18n from '../../i18n';
import toast from '../../helpers/toast';

export default {
  name: 'CatalogById',
  data() {
    return {
      catalogItemSearch: '',
    };
  },
  computed: {
    ...mapGetters(['isLoading', 'currentCatalog', 'currentCatalogItems']),
    filteredItems: function() {
      return this.currentCatalogItems.filter((item) => {
        if (
          item.categories.includes(this.catalogItemSearch.toUpperCase()) ||
          item.nameEN
            .toLowerCase()
            .includes(this.catalogItemSearch.toLowerCase()) ||
          item.nameFR
            .toLowerCase()
            .includes(this.catalogItemSearch.toLowerCase()) ||
          item.productCode
            .toLowerCase()
            .includes(this.catalogItemSearch.toLowerCase()) ||
          item.styleCode
            .toLowerCase()
            .includes(this.catalogItemSearch.toLowerCase())
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
    },
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      await this.$store.dispatch('getCatalog', this.$route.params.id);
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
          link: '#',
        },
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getCatalogItems', this.currentCatalog._id);
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      toast.error(err);
    }
  },
  methods: {
    getImgUrl(item) {
      return `https://teambuilder.s3.amazonaws.com/images/catalogs/${this.currentCatalog.brand.toLowerCase()}/${
        item.images[0]
      }_sd.jpg`;
    },
    resetSearchBar() {
      this.catalogItemSearch = '';
      this.$refs.searchBar.focus();
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  grid-gap: 0.5rem;
  width: 100%;
  height: 100%;
  grid-template-areas:
    'header'
    'gallery';

  .header {
    position: relative;
    grid-area: header;
    font-weight: $font-weight-bold;
    margin: 0;

    img {
      height: 35px;
    }

    input {
      border-radius: $border-radius;
    }
  }

  a {
    text-decoration: none;
  }

  // LIST VIEW FOR CATALOG
  .galleryList {
    grid-area: gallery;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-template-rows: minmax(min-content, 250px);
    gap: 1rem;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 0.5rem 0 0;

    &__thumbnail {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      background-color: $white-text;
      border-radius: $border-radius;
      color: $black-text;
      width: 100%;
      max-height: min-content;

      .img-container {
        width: 100%;
        height: auto;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: $border-radius $border-radius 0 0;
        }
      }

      .thumbnail-body {
        width: 100%;
        padding: 1rem;
        p {
          font-size: $span-font-size;
          font-weight: $font-weight-bold;
        }
        .text-muted {
          font-size: $label-font-size;
        }
      }

      &:hover {
        box-shadow: $box-shadow;
        background: $white-smoke;
      }
    }
  }
}

@media screen and (min-width: 0px) and (max-width: 449px) {
  .thumbnail-body {
    .text-muted {
      display: none;
    }
  }
}

@media screen and (min-width: 450px) and (max-width: 700px) {
  .thumbnail-body {
    .text-muted {
      font-size: $muted-font-size !important;
      margin: 0;
    }
  }
}
</style>
