// i18n finished // responsiveness finished

<template>
  <div class="page" v-if="!isLoading">
    <div class="mb-2 header">
      <router-link to="/dashboard/catalogs/add" class="btn btn-info">
        <i class="fas fa-plus mr-2"></i> {{ $t('catalogs.add.addCatalog') }}
      </router-link>
    </div>
    <div class="mb-2" v-if="currentCatalogs.length === 0">
      <span>No Catalogs Found</span>
    </div>
    <div v-else>
      <div class="table-responsive">
        <table class="table table-hover table-striped">
          <tbody>
            <tr
              v-for="catalog of currentCatalogs"
              :key="catalog._id"
              @click.prevent="loadCatalog(catalog._id)"
            >
              <td v-if="catalog.brand === 'GARNEAU'">
                <img
                  src="https://teambuilder.s3.amazonaws.com/images/assets/garneau_logo.png"
                  alt="Garneau Logo"
                />
              </td>
              <td v-if="catalog.brand === 'SUGOI'">
                <img
                  src="https://teambuilder.s3.amazonaws.com/images/assets/sugoi_logo.png"
                  alt="Sugoi Logo"
                />
              </td>
              <td v-if="catalog.brand === 'SOMBRIO'">
                <img
                  src="https://teambuilder.s3.amazonaws.com/images/assets/sombrio_logo.png"
                  alt="Sombrio Logo"
                />
              </td>
              <td>{{ catalog.year }}</td>
              <td>{{ catalog.season }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <paginate
        v-model="currentPage"
        :page-count="pageNumbers"
        :container-class="'pagination pagination-sm'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :prev-class="'page-item'"
        :prev-link-class="'page-link'"
        :next-class="'page-item'"
        :next-link-class="'page-link'"
        :hide-prev-next="true"
        :prev-text="previous"
        :next-text="next"
        v-if="pageNumbers > 1"
      ></paginate>
    </div>
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate';
import { mapGetters } from 'vuex';
import i18n from '../../i18n';

export default {
  name: 'CatalogsIndex',
  components: {
    Paginate,
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 15,
      next: i18n.t('next'),
      previous: i18n.t('previous'),
    };
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      const breadcrumbs = [
        {
          text: i18n.t('menu.adminOnly.catalogs'),
          link: '#',
        },
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getCatalogs');
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, {
        icon: 'exclamation-triangle',
      });
    }
  },
  computed: {
    ...mapGetters(['isLoading', 'catalogs']),
    indexOfLastItem: function() {
      return this.currentPage * this.itemsPerPage;
    },
    indexOfFirstItem: function() {
      return this.indexOfLastItem - this.itemsPerPage;
    },
    currentCatalogs: function() {
      return this.catalogs.slice(this.indexOfFirstItem, this.indexOfLastItem);
    },
    pageNumbers: function() {
      const pageArray = [];
      for (
        let i = 1;
        i <= Math.ceil(this.catalogs.length / this.itemsPerPage);
        i++
      ) {
        pageArray.push(i);
      }
      return pageArray.length;
    },
  },
  methods: {
    loadCatalog: function(id) {
      this.$router
        .push({ name: 'catalogsById', params: { id } })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
td {
  img {
    height: 45%;
  }
}

@media screen and (max-width: 450px) {
  .page .header {
    display: flex;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
}
</style>
