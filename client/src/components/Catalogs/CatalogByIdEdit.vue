<template>
  <div class="mt-4">
    <form @submit.prevent="editCatalog" novalidate class="container">
      <div class="form-group row">
        <div class="col-sm-12 mb-2">
          <label for="brand">Brand</label>
          <select
            class="form-control form-control-sm"
            id="brand"
            v-model="catalog.brand"
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
            v-model="catalog.season"
            ref="season"
          >
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
          <select class="form-control form-control-sm" id="year" v-model="catalog.year" ref="year">
            <option value="2030">2030</option>
            <option value="2029">2029</option>
            <option value="2028">2028</option>
            <option value="2027">2027</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
            <option value="2017">2017</option>
            <option value="2016">2016</option>
            <option value="2015">2015</option>
            <option value="2014">2014</option>
            <option value="2013">2013</option>
            <option value="2012">2012</option>
            <option value="2011">2011</option>
            <option value="2010">2010</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <button type="submit" class="btn btn-block btn-dark">Submit Changes</button>
        </div>
        <div class="col-sm-6">
          <router-link
            tag="a"
            class="btn btn-danger btn-block"
            :to="`/dashboard/catalogs/${id}`"
          >Cancel</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CatalogByIdEdit',
  computed: {
    catalog: function() {
      return this.$store.getters.catalog;
    },
    id: function() {
      return this.catalog._id;
    },
    breadcrumbs: function() {
      return [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Catalogs',
          link: '/dashboard/catalogs'
        },
        {
          text: `${this.catalog.brand} - ${this.catalog.season} - ${this.catalog.year}`,
          link: `/dashboard/catalogs/${this.id}`
        },
        {
          text: 'Edit',
          link: '#'
        }
      ];
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('getCatalog', this.$route.params.id);
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  methods: {
    editCatalog: async function() {
      try {
        await this.$store.dispatch('editCatalog', [
          this.id,
          {
            brand: this.catalog.brand,
            season: this.catalog.season,
            year: this.catalog.year
          }
        ]);
        this.$toasted.success('Catalog Updated');
        this.$router.push({ name: 'catalogsById', params: this.id }).catch(() => {});
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].message);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  width: 500px;
}
</style>
