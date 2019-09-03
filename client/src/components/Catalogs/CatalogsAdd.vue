<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link tag="a" class="btn btn-sm" to="/dashboard/catalogs">Catalogs</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link tag="a" to="/dashboard/catalogs/add" class="btn btn-sm">Add Catalog</router-link>
        </li>
      </ol>
    </nav>
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
          <select class="form-control form-control-sm" id="year" v-model="year" ref="year">
            <option v-for="y in years" :key="y">{{y}}</option>
          </select>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-sm-8">
          <button type="submit" class="btn btn-block btn-dark">Add Catalog</button>
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
  name: 'catalogsadd',
  data() {
    return {
      brand: '',
      season: '',
      year: '2020',
      coverImg: '',
      years: [
        '2010',
        '2011',
        '2012',
        '2013',
        '2014',
        '2015',
        '2016',
        '2017',
        '2018',
        '2019',
        '2020',
        '2021',
        '2022',
        '2023',
        '2024',
        '2025',
        '2026',
        '2027',
        '2028',
        '2029',
        '2030'
      ]
    };
  },
  methods: {
    addCatalog: async function() {
      try {
        await this.$store.dispatch('addCatalog', {
          brand: this.brand,
          season: this.season,
          year: this.year
        });
        this.$toasted.success('Catalog Added');
        this.$router.push({ name: 'catalogs' }).catch(() => {});
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
  margin-top: 40px;
  width: 500px;
  font-weight: 200;
}

label {
  font-size: 0.9rem;
  margin-bottom: 0px;
}
</style>
