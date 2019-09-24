<template>
  <div class="mt-2">
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
            <option v-for="date of daterange" :key="date" :value="date">{{ date }}</option>
          </select>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-sm-6">
          <button type="submit" class="btn btn-block btn-info">Submit Changes</button>
        </div>
        <div class="col-sm-6">
          <router-link
            tag="a"
            class="btn btn-block btn-danger"
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
      return this.$store.getters.currentCatalog;
    },
    daterange: function() {
      let daterangeStart = 1975;
      let daterangeEnd = 2030;

      let dateArray = [];

      for (let i = daterangeStart; i <= daterangeEnd; i++) {
        dateArray.push(i.toString());
      }

      return dateArray.reverse();
    },
    id: function() {
      return this.catalog._id;
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('getCatalog', this.$route.params.id);
      const breadcrumbs = [
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
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
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
        this.$toasted.success('Catalog Updated', { icon: 'check-circle' });
        this.$router.push({ name: 'catalogsById', params: this.id }).catch(() => {});
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
form {
  width: 500px;
}
</style>
