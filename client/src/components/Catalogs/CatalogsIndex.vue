<template>
  <div>
    <router-link to="/dashboard/catalogs/add" class="btn btn-info">
      <i class="fas fa-plus" style="vertical-align: middle;"></i> Add Catalog
    </router-link>
    <br />
    <br />
    <span v-if="currentCatalogs && currentCatalogs.length === 0">No Catalogs Found</span>
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr
            v-for="catalog of currentCatalogs"
            :key="catalog._id"
            @click.prevent="loadCatalog(catalog._id)"
          >
            <th scope="row">{{ catalog.year }}</th>
            <td>{{ catalog.season }}</td>
            <td>{{ catalog.brand }}</td>
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
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import Paginate from 'vuejs-paginate';

export default {
  name: 'CatalogsIndex',
  components: {
    Paginate
  },
  created: async function() {
    try {
      const catalogs = await this.$store.dispatch('getCatalogs');
      this.catalogs = catalogs.data;
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 12,
      breadcrumbs: [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Catalogs',
          link: '#'
        }
      ],
      catalogs: []
    };
  },
  computed: {
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
    }
  },
  methods: {
    loadCatalog: function(id) {
      this.$router.push({ name: 'catalogsById', params: { id } }).catch(() => {});
    }
  }
};
</script>
