<template>
  <div class="container-fluid" v-if="dataReady">
    <div class="row">
      <div class="col-sm-12 mb-2">
        <router-link to="/dashboard/catalogs/add" class="btn btn-info">
          <i class="fas fa-plus mr-2"></i> Add Catalog
        </router-link>
      </div>
      <div class="col-sm-12 mb-2" v-if="currentCatalogs.length === 0">
        <span>No Catalogs Found</span>
      </div>
      <div class="col-sm-12" v-else>
        <div class="table-responsive">
          <table class="table table-hover table-striped">
            <tbody>
              <tr
                v-for="catalog of currentCatalogs"
                :key="catalog._id"
                @click.prevent="loadCatalog(catalog._id)"
              >
                <td v-if="catalog.brand === 'GARNEAU'">
                  <img src="@/assets/garneau_logo.png" alt="Garneau Logo" />
                </td>
                <td v-if="catalog.brand === 'SUGOI'">
                  <img src="@/assets/sugoi_logo.png" alt="Garneau Logo" />
                </td>
                <td v-if="catalog.brand === 'SOMBRIO'">
                  <img src="@/assets/sombrio_logo.png" alt="Garneau Logo" />
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
          v-if="pageNumbers > 1"
        ></paginate>
      </div>
    </div>
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate';

export default {
  name: 'CatalogsIndex',
  components: {
    Paginate
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 15
    };
  },
  created: async function() {
    try {
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Catalogs',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getCatalogs');
      await this.$store.commit('CLEAR_CURRENTS');
      this.$store.dispatch('setDataReadyTrue');
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      this.$store.dispatch('setDataReadyTrue');
    }
  },
  beforeDestroy: function() {
    this.$store.dispatch('setDataReadyFalse');
  },
  computed: {
    dataReady: function() {
      return this.$store.getters.dataReady;
    },
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
      for (let i = 1; i <= Math.ceil(this.catalogs.length / this.itemsPerPage); i++) {
        pageArray.push(i);
      }
      return pageArray.length;
    },
    catalogs: function() {
      return this.$store.getters.catalogs;
    }
  },
  methods: {
    loadCatalog: function(id) {
      this.$router.push({ name: 'catalogsById', params: { id } }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
td {
  img {
    height: 40%;
  }
}
</style>
