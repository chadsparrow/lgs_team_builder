<template>
  <div class="page" v-if="dataReady">
    <div class="sidebar-left">
      <div class="row p-1">
        <div class="col-sm-12">
          <img src="@/assets/garneau_logo.png" alt="Garneau Logo" v-if="store.brand === 'GARNEAU'" />
          <img
            src="@/assets/sombrio_logo.png"
            alt="Sombrio Logo"
            v-else-if="store.brand === 'SOMBRIO'"
          />
          <img src="@/assets/sugoi_logo.png" alt="Sugoi Logo" v-else-if="store.brand === 'SUGOI'" />
        </div>
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
          <small class="text-info">Opening Date:</small>
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
          <small class="text-info">Closing Date:</small>
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
      <div class="row p-1 mt-1" v-if="currentDateTime">
        <small class="col-sm-12 text-info">Current Store Time:</small>
        <span
          class="col-sm-12"
        >{{ currentDateTime | moment('timezone', store.timezone, 'MMM Do YYYY / hh:mm:ss a - z')}}</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Store Created:</small>
        <span class="col-sm-12">
          {{
          store.createdAt
          | moment('timezone', store.timezone, 'MMM Do YYYY / hh:mm a - z')
          }}
        </span>
      </div>
      <div class="row p-1" v-if="access">
        <div class="col-sm-6">
          <small class="text-info">Store Country:</small>
          <br />
          <span>{{ store.storeCountry }}</span>
        </div>
        <div class="col-sm-6">
          <small class="text-info">Account #:</small>
          <br />
          <span>{{ store.teamId.teamId }}</span>
        </div>
        <div class="col-sm-12">
          <small class="text-info">Order Reference:</small>
          <br />
          <span>{{ store.orderReference }}</span>
        </div>
      </div>
      <div class="row p-1" v-if="access">
        <small class="col-sm-12 text-info">Store Admin:</small>
        <span class="col-sm-12">{{ store.adminId.name }}</span>
        <span class="col-sm-12 text-muted">{{ store.adminId.email }}</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Store Manager:</small>
        <span class="col-sm-12">{{ store.managerId.name }}</span>
        <span class="col-sm-12 text-muted">{{ store.managerId.email }}</span>
        <span class="col-sm-12 text-muted">{{ store.managerId.phone }}</span>
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
    <div class="middle-section">
      <div class="header">
        <div class="form-group form-inline">
          <label for="storeItemsSearchText" class="mr-2">Search:</label>
          <input
            type="text"
            id="storeItemsSearchText"
            v-if="storeItems.length > 0"
            class="form-control form-control-sm mr-3"
            v-model="storeItemsSearchText"
            placeholder="Enter any product info..."
            autofocus
          />
          <small class="text-muted">Showing: {{filteredCount}}/{{storeItems.length}}</small>
        </div>
        <div>
          <router-link class="btn btn-sm" :to="`/dashboard/stores/${store._id}/edit`">
            <i class="fas fa-cog fa-lg mr-2"></i>
            Store Settings
          </router-link>
          <router-link class="btn btn-sm" :to="`/dashboard/stores/${store._id}/add`">
            <i class="fas fa-plus fa-lg mr-2"></i>
            Add Store Item
          </router-link>
          <button @click="addStoreExtra" class="btn btn-sm">
            <i class="fas fa-plus fa-lg mr-2"></i> Add Store Extra
          </button>
          <button @click="duplicateOrder" class="btn btn-sm">
            <i class="fas fa-clone fa-lg mr-2"></i> Duplicate Store
          </button>
        </div>
      </div>
      <h4 class="message text-success" v-if="store.storeMessage">{{store.storeMessage}}</h4>
      <div class="store-grid">StoreItems</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone';
export default {
  name: 'StoresById',
  data() {
    return {
      storeItems: [],
      storeItemsSearchText: '',
      currentDateTime: null,
      polling: null,
      openingDifference: null,
      closingDifference: null
    };
  },
  created: async function() {
    try {
      this.polling = setInterval(this.getNow, 1000);
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
      this.$store.dispatch('setDataReadyTrue');
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      this.$store.dispatch('setDataReadyTrue');
    }
  },
  beforeDestroy: function() {
    clearInterval(this.polling);
    this.$store.dispatch('setDataReadyFalse');
  },
  computed: {
    dataReady: function() {
      return this.$store.getters.dataReady;
    },
    store: function() {
      return this.$store.getters.currentStore;
    },
    member: function() {
      return this.$store.getters.loggedInMember;
    },
    orders: function() {
      return this.$store.getters.orders;
    },
    access: function() {
      if (this.member && this.member.isAdmin) return true;

      if (
        this.member &&
        this.store &&
        this.store.managerId &&
        this.member._id === this.store.managerId._id
      )
        return true;

      return false;
    },
    filteredCount: function() {
      return 1;
    }
  },
  methods: {
    getNow: async function() {
      this.currentDateTime = new Date();
      if (this.store.openingDate) {
        this.openingDifference = moment(this.store.openingDate) - moment(this.currentDateTime);
        if (this.store.mode === 'SURVEY' && this.openingDifference < 0) {
          await this.$store.dispatch('getStore', this.store._id);
        }
      }
      if (this.store.closingDate) {
        this.closingDifference = moment(this.store.closingDate) - moment(this.currentDateTime);
        if (this.store.mode === 'OPEN' && this.closingDifference < 0) {
          await this.$store.dispatch('getStore', this.store._id);
        }
      }
    },
    duplicateOrder: async function() {
      try {
        const res = await this.$store.dispatch('duplicateTeamStore', this.store._id);
        this.$router
          .push({ name: 'teamsById', params: { id: this.store.teamId._id } })
          .catch(() => {});
        this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    addStoreExtra: function() {
      // CODE
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 255px 1fr;
  grid-template-rows: 1fr;
  grid-gap: 1.5rem;
  width: 100%;
  height: 100%;
  grid-template-areas: 'sidebar-left middle-section';
}

.sidebar-left {
  grid-area: sidebar-left;
  overflow-x: hidden;
  overflow-y: auto;
  img {
    width: 100%;
  }
}

.middle-section {
  grid-area: middle-section;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 40px 50px 1fr;
  grid-gap: 1rem;
  width: 100%;
  height: 100;
  grid-template-areas:
    'header'
    'message'
    'store-grid';

  .header {
    grid-area: header;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: whitesmoke;
    padding: 0.75rem;
    border-radius: 5px;
    font-weight: 700;
    height: 40px;

    img {
      height: 35px;
      margin-right: 1.5rem;
    }

    .form-control {
      width: 500px;
    }
  }

  .store-grid {
    grid-area: store-grid;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0.25rem;

    .thumbnail {
      border-radius: 5px;
      background-color: white;
      color: black;
      height: 125px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-right: 1rem;
      margin-bottom: 1rem;

      a {
        color: black;
      }

      .info-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .thumbnail-img {
          width: 125px;
          margin-right: 1rem;
          img {
            width: 100%;
            height: 100%;
            border-radius: 5px 0 0 5px;
            object-fit: cover;
          }
        }

        .thumbnail-body {
          padding: 0.4rem;
          span {
            font-size: 1.5rem;
            font-weight: 700;
          }
        }
      }

      &:hover {
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.4);
      }
    }
  }

  .message {
    grid-area: message;
  }
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
