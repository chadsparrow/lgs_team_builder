<template>
  <div class="page container">
    <form @submit.prevent="addCatalog" novalidate>
      <div class="row mb-3">
        <div class="form-group col-sm-12 mb-2">
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
        <div class="form-group col-sm-12 mb-2">
          <label for="season">{{ $t('catalogs.add.season.season') }}</label>
          <select
            class="form-control form-control-sm"
            id="season"
            v-model="season"
            ref="season"
          >
            <option value="CUSTOM">{{
              $t('catalogs.add.season.custom')
            }}</option>
            <option disabled="disabled">--------</option>
            <option value="SPRING/SUMMER">{{
              $t('catalogs.add.season.springSummer')
            }}</option>
            <option value="FALL/WINTER">{{
              $t('catalogs.add.season.fallWinter')
            }}</option>
            <option disabled="disabled">--------</option>
            <option value="SPRING">{{
              $t('catalogs.add.season.spring')
            }}</option>
            <option value="SUMMER">{{
              $t('catalogs.add.season.summer')
            }}</option>
            <option value="FALL">{{ $t('catalogs.add.season.fall') }}</option>
            <option value="WINTER">{{
              $t('catalogs.add.season.winter')
            }}</option>
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
      <div class="row">
        <div class="col-sm-12 col-lg-8 mt-2">
          <button type="submit" class="small-btn btn-block">
            {{ $t('catalogs.add.addCatalog') }}
          </button>
        </div>
        <div class="col-sm-12 col-lg-4 mt-2">
          <router-link
            tag="button"
            class="small-btn danger-btn btn-block"
            to="/dashboard/catalogs"
            >{{ $t('cancel') }}</router-link
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import i18n from '../../i18n';
import toast from '../../helpers/toast';
import { get } from 'lodash';

export default {
  name: 'CatalogsAdd',
  data() {
    return {
      brand: '',
      season: '',
      year: '2020',
      coverImg: '',
    };
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      const breadcrumbs = [
        {
          text: i18n.t('menu.adminOnly.catalogs'),
          link: '/dashboard/catalogs',
        },
        {
          text: i18n.t('catalogs.add.addCatalog'),
          link: '#',
        },
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      toast.error(err);
    }
  },
  methods: {
    addCatalog: async function() {
      const catalog = {
        brand: this.brand,
        season: this.season,
        year: this.year,
      };
      try {
        await this.$store.dispatch('addCatalog', catalog);
        toast.success(i18n.t('catalogs.success'));
        this.$router.push({ name: 'catalogs' }).catch(() => {});
      } catch (err) {
        if (get(err.response, 'data[0].context')) {
          const key = get(err.response, 'data[0].context.key');
          this.$refs[key].focus();
        }
        toast.error(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  padding: 1rem;

  form {
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>
