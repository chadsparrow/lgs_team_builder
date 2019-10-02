<template>
  <div class="mt-2">
    <form @submit.prevent="addCatalog" novalidate class="container">
      <div class="form-group row">
        <div class="col-sm-12 mb-2">
          <label for="brand">Brand</label>
          <select
            class="form-control form-control-sm"
            id="brand"
            v-model="brand"
            ref="brand"
            autofocus
          >
            <option value="garneau">GARNEAU</option>
            <option value="sugoi">SUGOI</option>
            <option value="sombrio">SOMBRIO</option>
            <option value="connec" disabled>CONNEC</option>
          </select>
        </div>
        <div class="col-sm-12 mb-2">
          <label for="season">Season</label>
          <select class="form-control form-control-sm" id="season" v-model="season" ref="season">
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
            v-model="year"
          />
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-sm-8">
          <button type="submit" class="btn btn-block btn-info">Add Catalog</button>
        </div>
        <div class="col-sm-4">
          <router-link tag="a" class="btn btn-danger btn-block" to="/dashboard/catalogs">Cancel</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CatalogsAdd',
  data() {
    return {
      brand: '',
      season: '',
      year: '2020',
      coverImg: ''
    };
  },
  created: async function() {
    try {
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Catalogs',
          link: '/dashboard/catalogs'
        },
        {
          text: 'Add Catalog',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    addCatalog: async function() {
      try {
        await this.$store.dispatch('addCatalog', {
          brand: this.brand,
          season: this.season,
          year: this.year
        });
        this.$toasted.success('Catalog Added', { icon: 'check-circle' });
        this.$router.push({ name: 'catalogs' }).catch(() => {});
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
