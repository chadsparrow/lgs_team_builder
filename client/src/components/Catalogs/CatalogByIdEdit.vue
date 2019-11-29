<template>
  <div class="mt-2" v-if="!isLoading">
    <div class="container">
      <div class="form-group row">
        <div class="col-sm-12 mb-2">
          <label for="brand">Brand</label>
          <select
            class="form-control form-control-sm"
            id="brand"
            v-model="currentCatalog.brand"
            ref="brand"
            autofocus
          >
            <option value="GARNEAU">GARNEAU</option>
            <option value="SUGOI">SUGOI</option>
            <option value="SOMBRIO">SOMBRIO</option>
            <option value="CONNEC" disabled>CONNEC</option>
          </select>
        </div>
        <div class="col-sm-12 mb-2">
          <label for="season">Season</label>
          <select
            class="form-control form-control-sm"
            id="season"
            v-model="currentCatalog.season"
            ref="season"
          >
            <option value="CUSTOM">CUSTOM</option>
            <option disabled="disabled">--------</option>
            <option value="SPRING/SUMMER">SPRING/SUMMER</option>
            <option value="FALL/WINTER">FALL/WINTER</option>
            <option disabled="disabled">--------</option>
            <option value="SPRING">SPRING</option>
            <option value="SUMMER">SUMMER</option>
            <option value="FALL">FALL</option>
            <option value="WINTER">WINTER</option>
          </select>
        </div>
        <div class="col-sm-12">
          <label for="year">Year</label>
          <input
            type="text"
            id="year"
            class="form-control form-control-sm"
            ref="year"
            v-model="currentCatalog.year"
          />
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-sm-6">
          <button class="btn btn-block btn-info" @click="editCatalog">
            Submit Changes
          </button>
        </div>
        <div class="col-sm-6">
          <router-link
            tag="a"
            class="btn btn-block btn-danger"
            :to="`/dashboard/catalogs/${currentCatalog._id}`"
            >Cancel</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'CatalogByIdEdit',
  computed: {
    ...mapGetters(['currentCatalog', 'isLoading'])
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
          link: `/dashboard/catalogs/${this.currentCatalog._id}`
        },
        {
          text: 'Edit',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    editCatalog: async function() {
      try {
        await this.$store.dispatch('editCatalog', {
          id: this.currentCatalog._id,
          catalog: {
            brand: this.currentCatalog.brand,
            season: this.currentCatalog.season,
            year: this.currentCatalog.year
          }
        });
        this.$toasted.success('Catalog Updated', { icon: 'check-circle' });
        this.$router
          .push({ name: 'catalogsById', params: this.currentCatalog._id })
          .catch(() => {});
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 500px;
}
</style>
