<template>
  <div>
    <loading
      :active.sync="isLoading"
      :is-full-page="true"
      color="#FFF"
      background-color="#000"
      :opacity="0.1"
      loader="dots"
    ></loading>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link class="active btn btn-sm" tag="a" to="/dashboard/catalogs">Catalogs</router-link>
        </li>
        <router-link to="/dashboard/catalogs/add" class="btn btn-sm btn-dark ml-auto">Add Catalog</router-link>
      </ol>
    </nav>
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
      :container-class="'pagination'"
      :page-class="'page-item'"
      :page-link-class="'page-link'"
      :prev-class="'page-item'"
      :prev-link-class="'page-link'"
      :next-class="'page-item'"
      :next-link-class="'page-link'"
      :hide-prev-next="true"
      v-if="pageNumbers >= 1"
    ></paginate>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import Paginate from 'vuejs-paginate';

export default {
  components: {
    Loading,
    Paginate
  },
  created: async function() {
    await this.$store.dispatch('getCatalogs');
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 15
    };
  },
  computed: {
    catalogs: function() {
      return this.$store.getters.catalogs;
    },
    isLoading: function() {
      return this.$store.getters.isLoading;
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
    }
  },
  methods: {
    loadCatalog: function(id) {
      this.$router.push({ name: 'catalogid', params: { id } }).catch(err => {});
    }
  }
};
</script>

