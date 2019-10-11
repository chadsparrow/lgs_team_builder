<template>
  <div class="page">
    <div class="sidebar-left">
      <div v-if="currentStore && currentStore.storeName">
        <div
          :class="currentStore.mode === 'OPEN' ? 'row p-2 modeBox text-center bg-success text-white' : currentStore.mode === 'CLOSED' ? 'row p-2 modeBox text-center bg-danger text-white' : currentStore.mode === 'HOLD' ? 'row p-2 modeBox text-center bg-warning text-white' : null"
        >
          <small class="col-sm-12 text-white">
            <span>{{ currentStore.mode }}</span>
          </small>
        </div>
        <div class="row p-1 mt-2">
          <small class="col-sm-12 text-info">Store Created:</small>
          <span class="col-sm-12">
            {{
            currentStore.createdAt | moment('timezone', currentStore.timezone, 'MMM Do YYYY / hh:mm a - z')
            }}
          </span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Store Timezone:</small>
          <span class="col-sm-12">{{ currentStore.timezone }}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Store Country:</small>
          <span class="col-sm-12">{{ currentStore.storeCountry }}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Account #:</small>
          <span class="col-sm-12">{{ currentStore.teamId.teamId }}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Store Admin:</small>
          <span class="col-sm-12">{{ currentStore.adminId.name }}</span>
          <span class="col-sm-12 text-muted">{{ currentStore.adminId.email }}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Store Manager:</small>
          <span class="col-sm-12">{{ currentStore.managerId.name }}</span>
          <span class="col-sm-12 text-muted">{{ currentStore.managerId.email }}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Opening Date:</small>
          <span class="col-sm-12" v-if="currentStore.openingDate">
            {{
            currentStore.openingDate | moment('timezone', currentStore.timezone, 'MMM Do YYYY / hh:mm a - z')
            }}
          </span>
          <span class="col-sm-12" v-else>No Opening Date</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Closing Date:</small>
          <span class="col-sm-12" v-if="currentStore.closingDate">
            {{
            currentStore.closingDate | moment('timezone', currentStore.timezone, 'MMM Do YYYY / hh:mm a - z')
            }}
          </span>
          <span class="col-sm-12" v-else>No Closing Date</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Main Contact:</small>
          <span class="col-sm-12">{{ currentStore.teamId.mainContact.name }}</span>
          <span
            class="col-sm-12"
            v-if="currentStore.teamId.mainContact.company"
          >{{ currentStore.teamId.mainContact.company }}</span>
          <span class="col-sm-12">{{ currentStore.teamId.mainContact.address1 }}</span>
          <span
            class="col-sm-12"
            v-if="currentStore.teamId.mainContact.address2"
          >{{ currentStore.teamId.mainContact.address2 }}</span>
          <span
            class="col-sm-12"
          >{{ currentStore.teamId.mainContact.city }}, {{currentStore.teamId.mainContact.stateProv}}, {{currentStore.teamId.mainContact.country}}</span>
          <span class="col-sm-12">{{currentStore.teamId.mainContact.zipPostal}}</span>
          <span class="col-sm-12">{{currentStore.teamId.mainContact.phone}}</span>
          <span class="col-sm-12">{{currentStore.teamId.mainContact.email}}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Shipping Type:</small>
          <span
            class="col-sm-12"
          >{{ currentStore.shippingType == "BULK" ? "BULK SHIP" : "DROP SHIP" }}</span>
        </div>
        <div class="row p-1" v-if="currentStore.shippingType = 'BULK'">
          <small class="col-sm-12 text-info">Bulk Shipping Information:</small>
          <span class="col-sm-12">{{ currentStore.teamId.bulkShipping.name }}</span>
          <span
            class="col-sm-12"
            v-if="currentStore.teamId.bulkShipping.company"
          >{{ currentStore.teamId.bulkShipping.company }}</span>
          <span class="col-sm-12">{{ currentStore.teamId.bulkShipping.address1 }}</span>
          <span
            class="col-sm-12"
            v-if="currentStore.teamId.bulkShipping.address2"
          >{{ currentStore.teamId.bulkShipping.address2 }}</span>
          <span
            class="col-sm-12"
          >{{ currentStore.teamId.bulkShipping.city }}, {{currentStore.teamId.bulkShipping.stateProv}}, {{currentStore.teamId.bulkShipping.country}}</span>
          <span class="col-sm-12">{{currentStore.teamId.bulkShipping.zipPostal}}</span>
          <span class="col-sm-12">{{currentStore.teamId.bulkShipping.phone}}</span>
          <span class="col-sm-12">{{currentStore.teamId.bulkShipping.email}}</span>
        </div>
      </div>
    </div>
    <div class="middle-section">Store Items</div>
  </div>
</template>

<script>
export default {
  name: 'StoresById',
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
          text: `${this.currentStore.storeName}`,
          link: `/dashboard/stores/${this.currentStore._id}`
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  computed: {
    access: function() {
      if (member && member.isAdmin) return true;
      if (member && currentStore.managerId._id === member._id) return true;

      return false;
    },
    currentStore: function() {
      return this.$store.getters.currentStore;
    },
    member: function() {
      return this.$store.getters.loggedInMember;
    },
    orders: function() {
      return this.$store.getters.orders;
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 255px 1fr;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
  grid-template-areas: 'sidebar-left middle-section';
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

.modeBox {
  border-radius: 6px;
  span {
    font-size: 1.2rem;
    font-weight: 700;
  }
  margin: 0px 4px;
}
</style>
