<template>
  <div class="page container" v-if="!isLoading">
    <div class="form-group mt-4">
      <div class="row">
        <div class="col-12">
          <label for="brand">{{ $t('catalogs.add.brand') }}</label>
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
        <div class="col-12 mt-2">
          <label for="season">{{ $t('catalogs.add.season.season') }}</label>
          <select
            class="form-control form-control-sm"
            id="season"
            v-model="currentCatalog.season"
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
        <div class="col-12 mt-2">
          <label for="year">{{ $t('catalogs.add.year') }}</label>
          <input
            type="text"
            id="year"
            class="form-control form-control-sm"
            ref="year"
            v-model="currentCatalog.year"
          />
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-lg-8 mt-2">
          <button class="small-btn btn-block" @click="editCatalog">
            {{ $t('submit') }}
          </button>
        </div>
        <div class="col-lg-4 mt-2">
          <router-link
            tag="button"
            class="small-btn danger-btn btn-block"
            :to="`/dashboard/catalogs/${currentCatalog._id}`"
            >{{ $t('cancel') }}</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import i18n from '../../i18n';
import toast from '../../helpers/toast';
import { get } from 'lodash';

export default {
  name: 'CatalogByIdEdit',
  computed: {
    ...mapGetters(['currentCatalog', 'isLoading']),
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      await this.$store.dispatch('getCatalog', this.$route.params.id);
      const breadcrumbs = [
        {
          text: i18n.t('menu.adminOnly.catalogs'),
          link: '/dashboard/catalogs',
        },
        {
          text: `${this.currentCatalog.brand} - ${i18n
            .t(
              `catalogs.add.season.${this.currentCatalog.season.toLowerCase()}`
            )
            .toUpperCase()} - ${this.currentCatalog.year}`,
          link: `/dashboard/catalogs/${this.currentCatalog._id}`,
        },
        {
          text: i18n.t('edit'),
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
    editCatalog: async function() {
      try {
        await this.$store.dispatch('editCatalog', {
          id: this.currentCatalog._id,
          catalog: {
            brand: this.currentCatalog.brand,
            season: this.currentCatalog.season,
            year: this.currentCatalog.year,
          },
        });
        toast.success(i18n.t('catalogs.add.updated'));

        this.$router
          .push({ name: 'catalogsById', params: this.currentCatalog._id })
          .catch(() => {});
      } catch (err) {
        if (get(err.response, 'data[0].context')) {
          const key = err.response.data[0].context.key;
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
  .form-group {
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>
