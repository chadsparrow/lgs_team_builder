<template>
  <div class="mt-2">
    <form @submit.prevent="addCatalog" novalidate class="container">
      <div class="form-group row">
        <div class="col-sm-12 mb-2">
          <label for="brand">{{ $t('catalogs.add.brand') }}</label>
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
          <label for="season">{{ $t('catalogs.add.season.season') }}</label>
          <select class="form-control form-control-sm" id="season" v-model="season" ref="season">
            <option value="CUSTOM">{{ $t('catalogs.add.season.custom') }}</option>
            <option disabled="disabled">--------</option>
            <option value="SPRING/SUMMER">{{ $t('catalogs.add.season.springSummer') }}</option>
            <option value="FALL/WINTER">{{ $t('catalogs.add.season.fallWinter') }}</option>
            <option disabled="disabled">--------</option>
            <option value="SPRING">{{ $t('catalogs.add.season.spring') }}</option>
            <option value="SUMMER">{{ $t('catalogs.add.season.summer') }}</option>
            <option value="FALL">{{ $t('catalogs.add.season.fall') }}</option>
            <option value="WINTER">{{ $t('catalogs.add.season.winter') }}</option>
          </select>
        </div>
        <div class="col-sm-12">
          <label for="year">{{ $t('catalogs.add.year') }}</label>
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
          <button type="submit" class="btn btn-block btn-info">
            {{ $t('catalogs.add.addCatalog') }}
          </button>
        </div>
        <div class="col-sm-4">
          <router-link tag="a" class="btn btn-danger btn-block" to="/dashboard/catalogs">{{
            $t('cancel')
          }}</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import i18n from '../../i18n';
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
    this.$store.commit('LOADING_TRUE');
    try {
      const breadcrumbs = [
        { text: i18n.t('menu.dashboard'), link: '/dashboard/index' },
        {
          text: i18n.t('menu.adminOnly.catalogs'),
          link: '/dashboard/catalogs'
        },
        {
          text: i18n.t('catalogs.add.addCatalog'),
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
    addCatalog: async function() {
      const catalog = { brand: this.brand, season: this.season, year: this.year };
      try {
        await this.$store.dispatch('addCatalog', catalog);
        this.$toasted.success(i18n.t('catalogs.add.success'), { icon: 'check-circle' });
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
