<template>
  <div class="page" v-if="dataReady">
    <div class="sidebar-left">
      <div class="row p-1 mb-2" v-if="currentDateTime">
        <small class="col-sm-12 text-info">Current Store Time:</small>
        <span
          class="col-sm-12"
        >{{ currentDateTime | moment('timezone', store.timezone, 'MMM Do YYYY / hh:mm:ss a - z')}}</span>
      </div>
      <div
        :class="
            store.mode === 'OPEN'
              ? 'row p-2 modeBox text-center bg-success text-white'
              : store.mode === 'CLOSED'
              ? 'row p-2 modeBox text-center bg-danger text-white'
              : store.mode === 'HOLD'
              ? 'row p-2 modeBox text-center bg-warning text-white'
              : store.mode === 'SURVEY'
              ? 'row p-2 modeBox text-center bg-secondary text-white'
              : null
          "
      >
        <small class="col-sm-12 text-white">
          <span>{{ store.mode }}</span>
        </small>
      </div>
      <div class="row p-1 mt-2">
        <div class="col-sm-6">
          <small class="text-info">Opening:</small>
          <br />
          <span v-if="store.openingDate">
            {{
            store.openingDate
            | moment('timezone', store.timezone, 'MMM Do YYYY - hh:mm a - z')
            }}
            <br />
            <small class="text-secondary">({{ openingDifference | duration('humanize', true) }})</small>
          </span>
          <span v-else>No Opening Date</span>
        </div>
        <div class="col-sm-6">
          <small class="text-info">Closing:</small>
          <br />
          <span v-if="store.closingDate">
            {{
            store.closingDate
            | moment('timezone', store.timezone, 'MMM Do YYYY - hh:mm a - z')
            }}
            <br />
            <small class="text-secondary">({{ closingDifference | duration('humanize', true) }})</small>
          </span>
          <span v-else>No Closing Date</span>
        </div>
      </div>
      <div class="row p-1 mt-1">
        <small class="col-sm-12 text-info">Store Created:</small>
        <span class="col-sm-12">
          {{
          store.createdAt
          | moment('timezone', store.timezone, 'MMM Do YYYY / hh:mm a - z')
          }}
        </span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Store Timezone:</small>
        <span class="col-sm-12">{{ store.timezone }}</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Store Country:</small>
        <span class="col-sm-12">{{ store.storeCountry }}</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Account #:</small>
        <span class="col-sm-12">{{ store.teamId.teamId }}</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Store Admin:</small>
        <span class="col-sm-12">{{ store.adminId.name }}</span>
        <span class="col-sm-12 text-muted">{{ store.adminId.email }}</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Store Manager:</small>
        <span class="col-sm-12">{{ store.managerId.name }}</span>
        <span class="col-sm-12 text-muted">{{ store.managerId.email }}</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Main Contact:</small>
        <span class="col-sm-12">{{ store.teamId.mainContact.name }}</span>
        <span class="col-sm-12" v-if="store.teamId.mainContact.company">
          {{
          store.teamId.mainContact.company
          }}
        </span>
        <span class="col-sm-12">{{ store.teamId.mainContact.address1 }}</span>
        <span class="col-sm-12" v-if="store.teamId.mainContact.address2">
          {{
          store.teamId.mainContact.address2
          }}
        </span>
        <span class="col-sm-12">
          {{ store.teamId.mainContact.city }},
          {{ store.teamId.mainContact.stateProv }},
          {{ store.teamId.mainContact.country }}
        </span>
        <span class="col-sm-12">{{ store.teamId.mainContact.zipPostal }}</span>
        <span class="col-sm-12">{{ store.teamId.mainContact.phone }}</span>
        <span class="col-sm-12">{{ store.teamId.mainContact.email }}</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Shipping Type:</small>
        <span class="col-sm-12">
          {{
          store.shippingType == 'BULK' ? 'BULK SHIP' : 'DROP SHIP'
          }}
        </span>
      </div>
      <div class="row p-1" v-if="(store.shippingType = 'BULK')">
        <small class="col-sm-12 text-info">Bulk Shipping Information:</small>
        <span class="col-sm-12">{{ store.bulkShipping.name }}</span>
        <span class="col-sm-12" v-if="store.bulkShipping.company">
          {{
          store.bulkShipping.company
          }}
        </span>
        <span class="col-sm-12">{{ store.bulkShipping.address1 }}</span>
        <span class="col-sm-12" v-if="store.bulkShipping.address2">
          {{
          store.bulkShipping.address2
          }}
        </span>
        <span class="col-sm-12">
          {{ store.bulkShipping.city }},
          {{ store.bulkShipping.stateProv }},
          {{ store.bulkShipping.country }}
        </span>
        <span class="col-sm-12">{{ store.bulkShipping.zipPostal }}</span>
        <span class="col-sm-12">{{ store.bulkShipping.phone }}</span>
        <span class="col-sm-12">{{ store.bulkShipping.email }}</span>
      </div>
    </div>
    <div class="middle-section">Store Items</div>
    <div class="button-section" v-if="member.isAdmin">
      <div class="row">
        <div class="col-sm-4">
          <router-link
            class="btn btn-info btn-block"
            :to="`/dashboard/stores/${store._id}/add`"
            tag="a"
          >
            <i class="fas fa-plus fa-lg"></i>
            Add Store Item
          </router-link>
        </div>
        <div class="col-sm-4">
          <router-link
            class="btn btn-info btn-block"
            :to="`/dashboard/catalogs/${store._id}/edit`"
            tag="a"
          >
            <i class="fas fa-cog fa-lg"></i>
            Store Settings
          </router-link>
        </div>
        <div class="col-sm-4">
          <button @click="duplicateOrder" class="btn btn-info btn-block">
            <i class="fas fa-clone fa-lg"></i> Duplicate Store
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone';
export default {
  name: 'StoresById',
  data() {
    return {
      dataReady: false,
      currentDateTime: null,
      polling: null,
      openingDifference: null,
      closingDifference: null
    };
  },
  created: async function() {
    try {
      await this.$store.dispatch('getStore', this.$route.params.id);
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Stores',
          link: '/dashboard/stores'
        },
        {
          text: `${this.store.storeName}`,
          link: `/dashboard/stores/${this.store._id}`
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.dataReady = true;
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      this.dataReady = true;
    }
  },
  mounted: function() {
    this.polling = setInterval(this.getNow, 1000);
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
  },
  computed: {
    store: function() {
      return this.$store.getters.currentStore;
    },
    member: function() {
      return this.$store.getters.loggedInMember;
    },
    orders: function() {
      return this.$store.getters.orders;
    }
  },
  methods: {
    getNow: function() {
      this.currentDateTime = new Date();
      if (this.store.openingDate) {
        this.openingDifference = moment(this.store.openingDate) - moment(this.currentDateTime);
      }
      if (this.store.closingDate) {
        this.closingDifference = moment(this.store.closingDate) - moment(this.currentDateTime);
      }
    },
    duplicateOrder: async function() {
      try {
        const res = await this.$store.dispatch('duplicateTeamStore', this.store._id);
        // duplicate Store items
        this.$router
          .push({ name: 'teamsById', params: { id: this.store.teamId._id } })
          .catch(() => {});
        this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 255px 1fr;
  grid-template-rows: 1fr 40px;
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
  grid-template-areas:
    'sidebar-left middle-section'
    'sidebar-left button-section';
}

.sidebar-left {
  grid-area: sidebar-left;
  overflow-x: hidden;
  overflow-y: auto;
}

.middle-section {
  grid-area: middle-section;
  overflow-x: hidden;
  overflow-y: auto;
  display: grid;
}

.button-section {
  grid-area: button-section;
  overflow: hidden;
}

.modeBox {
  border-radius: 6px;
  span {
    font-size: 1.2rem;
    font-weight: 700;
  }
  margin: 0px 4px;
}
</style>
