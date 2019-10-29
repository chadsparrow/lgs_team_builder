<template>
  <div class="page" v-if="dataReady">
    <div class="sidebar-left">
      <div
        :class="
            store.mode === 'OPEN'
              ? 'row p-2 modeBox text-center bg-success text-white'
              : store.mode === 'CLOSED'
              ? 'row p-2 modeBox text-center bg-danger text-white'
              : store.mode === 'HOLD'
              ? 'row p-2 modeBox text-center bg-warning text-white'
              : null
          "
      >
        <small class="col-sm-12 text-white">
          <span>{{ store.mode }}</span>
        </small>
      </div>
      <div class="row p-1 mt-2">
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
        <small class="col-sm-12 text-info">Opening Date:</small>
        <span class="col-sm-12" v-if="store.openingDate">
          {{
          store.openingDate
          | moment('timezone', store.timezone, 'MMM Do YYYY / hh:mm a - z')
          }}
        </span>
        <span class="col-sm-12" v-else>No Opening Date</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Closing Date:</small>
        <span class="col-sm-12" v-if="store.closingDate">
          {{
          store.closingDate
          | moment('timezone', store.timezone, 'MMM Do YYYY / hh:mm a - z')
          }}
        </span>
        <span class="col-sm-12" v-else>No Closing Date</span>
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
        <span class="col-sm-12">{{ store.teamId.bulkShipping.name }}</span>
        <span class="col-sm-12" v-if="store.teamId.bulkShipping.company">
          {{
          store.teamId.bulkShipping.company
          }}
        </span>
        <span class="col-sm-12">{{ store.teamId.bulkShipping.address1 }}</span>
        <span class="col-sm-12" v-if="store.teamId.bulkShipping.address2">
          {{
          store.teamId.bulkShipping.address2
          }}
        </span>
        <span class="col-sm-12">
          {{ store.teamId.bulkShipping.city }},
          {{ store.teamId.bulkShipping.stateProv }},
          {{ store.teamId.bulkShipping.country }}
        </span>
        <span class="col-sm-12">{{ store.teamId.bulkShipping.zipPostal }}</span>
        <span class="col-sm-12">{{ store.teamId.bulkShipping.phone }}</span>
        <span class="col-sm-12">{{ store.teamId.bulkShipping.email }}</span>
      </div>
    </div>
    <div class="middle-section">Store Items</div>
    <div class="button-section" v-if="member.isAdmin">
      <div class="row">
        <div class="col-sm-6">
          <router-link
            class="btn btn-info btn-block"
            :to="`/dashboard/stores/${store._id}/add`"
            tag="a"
          >
            <i class="fas fa-plus fa-lg"></i>
            Add Store Item
          </router-link>
        </div>
        <div class="col-sm-6">
          <router-link
            class="btn btn-info btn-block"
            :to="`/dashboard/catalogs/${store._id}/edit`"
            tag="a"
          >
            <i class="fas fa-cog fa-lg"></i>
            Store Settings
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoresById',
  data() {
    return {
      dataReady: false
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
