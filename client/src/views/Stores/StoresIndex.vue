<template>
  <div class="page container" v-if="!isLoading">
    <div class="header mb-2">
      <div class="form-group has-search m-0">
        <span
          class="fa fa-search form-control-feedback"
          v-if="stores.length > 0"
        ></span>
        <input
          type="text"
          id="storesSearchText"
          v-if="stores.length > 0"
          class="form-control form-control-sm"
          v-model="storesSearchText"
          :placeholder="$t('search')"
        />
      </div>
    </div>
    <h5 class="text-center" v-if="currentStores.length === 0">
      {{ $t('stores.noStores') }}
    </h5>
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr>
            <th class="priority-1" scope="col">{{ $t('formLabels.name') }}</th>
            <th class="priority-2" scope="col">
              {{ $t('catalogs.add.brand') }}
            </th>
            <th class="priority-3" scope="col">{{ $t('teams.team') }}</th>
            <th class="priority-4" scope="col" v-if="access">
              {{ $t('teams.account') }}
            </th>
            <th class="priority-5" scope="col" v-if="access">
              {{ $t('stores.order') }}
            </th>
            <th class="priority-6" scope="col" v-if="access">
              {{ $t('admin') }}
            </th>
            <th class="priority-7" scope="col">{{ $t('stores.opening') }}</th>
            <th class="priority-8" scope="col">{{ $t('stores.closing') }}</th>
            <th class="text-center priority-9" scope="col">
              {{ $t('stores.mode') }}
            </th>
            <th class="priority-10" scope="col" v-if="access">
              {{ $t('stores.totalOrders') }}
            </th>
            <th class="priority-11" scope="col" v-if="access">
              {{ $t('stores.currency') }}
            </th>
            <th class="priority-12" scope="col" v-if="access">
              {{ $t('stores.totalCollected') }}
            </th>
          </tr>
          <tr
            v-for="store of currentStores"
            :key="store._id"
            @click.prevent="loadStore(store._id)"
          >
            <td class="priority-1" scope="row">{{ store.storeName }}</td>
            <td class="priority-2" v-if="store.brand === 'GARNEAU'">
              <img
                src="https://teambuilder.s3.amazonaws.com/images/assets/garneau_logo.png"
                alt="Garneau Logo"
              />
            </td>
            <td class="priority-2" v-if="store.brand === 'SUGOI'">
              <img
                src="https://teambuilder.s3.amazonaws.com/images/assets/sugoi_logo.png"
                alt="Sugoi Logo"
              />
            </td>
            <td class="priority-2" v-if="store.brand === 'SOMBRIO'">
              <img
                src="https://teambuilder.s3.amazonaws.com/images/assets/sombrio_logo.png"
                alt="Sombrio Logo"
              />
            </td>
            <td class="priority-3">{{ store.teamId.name }}</td>
            <td class="priority-4" v-if="access">{{ store.teamId.teamId }}</td>
            <td class="priority-5" v-if="access">{{ store.refOrder }}</td>
            <td class="priority-6" v-if="access">{{ store.adminId.name }}</td>
            <td class="priority-7" v-if="store.openingDate">
              {{
                store.openingDate
                  | moment(
                    'timezone',
                    store.timezone,
                    'MMM Do YYYY / hh:mm a - z'
                  )
              }}
            </td>
            <td class="priority-7" v-else>{{ $t('stores.noOpening') }}</td>
            <td class="priority-8" v-if="store.closingDate">
              {{
                store.closingDate
                  | moment(
                    'timezone',
                    store.timezone,
                    'MMM Do YYYY / hh:mm a - z'
                  )
              }}
            </td>
            <td class="priority-8" v-else>{{ $t('stores.noClosing') }}</td>
            <td
              :class="
                store.mode === 'OPEN'
                  ? 'bg-success text-white text-center priority-9'
                  : store.mode === 'CLOSED'
                  ? 'bg-danger text-white text-center priority-9'
                  : store.mode === 'HOLD'
                  ? 'bg-warning text-white text-center priority-9'
                  : store.mode === 'SURVEY'
                  ? 'text-center'
                  : null
              "
            >
              {{ $t(`stores.${store.mode.toLowerCase()}`) }}
            </td>
            <td class="text-center priority-10" v-if="access">
              {{ store.totalOrders }}
            </td>
            <td class="priority-11" v-if="access">{{ store.currency }}</td>
            <td class="text-center priority-12" v-if="access">
              {{ store.collectedAmount | currency }}
            </td>
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
import Paginate from 'vuejs-paginate';
import Vue2Filters from 'vue2-filters';
import { mapGetters } from 'vuex';
import i18n from '../../i18n';
import toast from '../../helpers/toast';

export default {
  name: 'StoreIndex',
  mixins: [Vue2Filters.mixin],
  components: {
    Paginate,
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 12,
      storesSearchText: '',
    };
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      const breadcrumbs = [
        {
          text: i18n.t('menu.adminOnly.stores'),
          link: '#',
        },
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.commit('CLEAR_CURRENTS');
      await this.$store.dispatch('getStores');
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      toast.error(err);
    }
  },
  computed: {
    ...mapGetters(['isLoading', 'loggedInMember', 'stores']),
    member: function() {
      return this.loggedInMember;
    },
    indexOfLastItem: function() {
      return this.currentPage * this.itemsPerPage;
    },
    indexOfFirstItem: function() {
      return this.indexOfLastItem - this.itemsPerPage;
    },
    currentStores: function() {
      return this.filteredStores.slice(
        this.indexOfFirstItem,
        this.indexOfLastItem
      );
    },
    pageNumbers: function() {
      const pageArray = [];
      for (
        let i = 1;
        i <= Math.ceil(this.filteredStores.length / this.itemsPerPage);
        i++
      ) {
        pageArray.push(i);
      }
      return pageArray.length;
    },
    filteredStores: function() {
      return this.stores.filter((store) => {
        if (
          store.brand
            .toLowerCase()
            .includes(this.storesSearchText.toLowerCase()) ||
          store.storeName
            .toLowerCase()
            .includes(this.storesSearchText.toLowerCase()) ||
          store.teamId.name
            .toLowerCase()
            .includes(this.storesSearchText.toLowerCase()) ||
          store.teamId.teamId
            .toLowerCase()
            .includes(this.storesSearchText.toLowerCase()) ||
          store.refOrder
            .toLowerCase()
            .includes(this.storesSearchText.toLowerCase()) ||
          store.adminId.name
            .toLowerCase()
            .includes(this.storesSearchText.toLowerCase()) ||
          store.managerId.name
            .toLowerCase()
            .includes(this.storesSearchText.toLowerCase()) ||
          store.mode.toLowerCase().includes(this.storesSearchText.toLowerCase())
        ) {
          return store;
        }
      });
    },
    filteredCount: function() {
      return this.filteredStores.length;
    },
    access: function() {
      if (this.member && this.member.isAdmin) return true;

      return false;
    },
  },
  methods: {
    loadStore: function(id) {
      this.$router.push({ name: 'storesById', params: { id } }).catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  .header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    .has-search .form-control {
      padding-left: 2rem;
      max-width: 400px;
    }

    .has-search .form-control-feedback {
      position: absolute;
      z-index: 2;
      display: block;
      width: 2rem;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      pointer-events: none;
      color: #aaa;
    }
  }

  table {
    font-size: $span-font-size;

    td {
      img {
        max-height: 20px;
      }
    }
  }
}

/* Extra Large */
@media screen and (min-width: 993px) and (max-width: 1200px) {
  .priority-11 {
    display: none;
  }
  .priority-10 {
    display: none;
  }
  .priority-6 {
    display: none;
  }
  .priority-2 {
    display: none;
  }
}

/* Large */
@media screen and (min-width: 768px) and (max-width: 992px) {
  .priority-12 {
    display: none;
  }
  .priority-11 {
    display: none;
  }
  .priority-10 {
    display: none;
  }
  .priority-6 {
    display: none;
  }
  .priority-5 {
    display: none;
  }
  .priority-4 {
    display: none;
  }
  .priority-2 {
    display: none;
  }
}

/* Medium */
@media screen and (min-width: 576px) and (max-width: 767px) {
  .priority-12 {
    display: none;
  }
  .priority-11 {
    display: none;
  }
  .priority-10 {
    display: none;
  }
  .priority-6 {
    display: none;
  }
  .priority-5 {
    display: none;
  }
  .priority-4 {
    display: none;
  }
  .priority-3 {
    display: none;
  }
  .priority-2 {
    display: none;
  }
}

/* Small */
@media screen and (min-width: 400px) and (max-width: 575px) {
  .priority-12 {
    display: none;
  }
  .priority-11 {
    display: none;
  }
  .priority-10 {
    display: none;
  }
  .priority-6 {
    display: none;
  }
  .priority-5 {
    display: none;
  }
  .priority-4 {
    display: none;
  }
  .priority-3 {
    display: none;
  }
  .priority-2 {
    display: none;
  }
}

/* Extra Small */
@media screen and (min-width: 0px) and (max-width: 399px) {
  .header {
    .has-search .form-control {
      max-width: 100%;
    }
  }

  .priority-12 {
    display: none;
  }
  .priority-11 {
    display: none;
  }
  .priority-10 {
    display: none;
  }
  .priority-8 {
    display: none;
  }
  .priority-7 {
    display: none;
  }
  .priority-6 {
    display: none;
  }
  .priority-5 {
    display: none;
  }
  .priority-4 {
    display: none;
  }
  .priority-3 {
    display: none;
  }
  .priority-2 {
    display: none;
  }
}
</style>
