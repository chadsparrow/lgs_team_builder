<template>
  <div class="page container" v-if="!isLoading">
    <div class="sidebar-left">
      <div v-if="team.name">
        <avatar
          :username="team.name"
          :size="225"
          background-color="#FFF"
          color="#000"
          :rounded="false"
          :src="team.logo"
        ></avatar>
        <div class="row p-1 mt-4">
          <label class="col-sm-12">Store Timezone:</label>
          <span class="col-sm-12">{{ team.timezone }}</span>
        </div>
        <div class="row p-1">
          <label class="col-sm-12">Team Name:</label>
          <span class="col-sm-12">{{ team.name }}</span>
        </div>
        <div class="row p-1">
          <label class="col-sm-12">Team ID#:</label>
          <span class="col-sm-12">{{ team.teamId }}</span>
        </div>
        <div class="row p-1">
          <label class="col-sm-12">Team Admin:</label>
          <span class="col-sm-12">{{ team.adminId.name }}</span>
        </div>
        <div class="row p-1">
          <label class="col-sm-12">Team Manager:</label>
          <span class="col-sm-12">{{ team.managerId.name }}</span>
        </div>
      </div>
      <div v-else>
        <div class="placeholderImg"></div>
      </div>
    </div>
    <div class="middle-section">
      <form novalidate>
        <!-- STORE INFO-->
        <div class="section-header mb-2 bg-secondary">
          <span>Store Information</span>
        </div>
        <div class="row px-2">
          <div class="col-sm-6">
            <div class="form-group">
              <label for="storeName">Store Name</label>
              <input
                id="storeName"
                type="text"
                class="form-control"
                v-model="store.storeName"
                ref="storeName"
              />
            </div>
          </div>
          <div class="col-sm-3">
            <div class="form-group">
              <label for="brand">Store Brand</label>
              <select
                class="form-control"
                id="brand"
                v-model="store.brand"
                ref="brand"
              >
                <option value="GARNEAU">GARNEAU</option>
                <option value="SUGOI">SUGOI</option>
                <option value="SOMBRIO">SOMBRIO</option>
              </select>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="form-group">
              <label for="storeCountry">Store Country</label>
              <country-select
                id="storeCountry"
                v-model="store.storeCountry"
                :country="store.storeCountry"
                class="form-control"
                ref="storeCountry"
                :usei18n="false"
              />
            </div>
          </div>
          <div class="col-sm-4 mt-2">
            <div class="form-group col">
              <label for="currency">Store Currency</label>
              <select
                class="form-control form-control-sm"
                id="currency"
                v-model="store.currency"
                ref="currency"
              >
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
              </select>
            </div>
            <div class="form-group col">
              <label for="refOrder">ERP Order Reference #</label>
              <input
                id="refOrder"
                type="text"
                class="form-control form-control-sm"
                v-model="store.refOrder"
                ref="refOrder"
              />
            </div>
            <div class="form-group col">
              <label for="currency">Store Mode:</label>
              <select
                class="form-control form-control-sm"
                id="mode"
                v-model="store.mode"
                ref="mode"
                @change="setMode"
              >
                <option value="SURVEY">SURVEY</option>
                <option value="OPEN">OPEN</option>
                <option value="CLOSED">CLOSED</option>
                <option value="HOLD">HOLD</option>
              </select>
            </div>
            <div class="form-group col">
              <label for="openingDate">Opening Date/Time</label>
              <datetime
                type="datetime"
                input-id="openingDate"
                input-class="form-control form-control-sm"
                v-model="store.openingDate"
                :value-zone="team.timezone"
                :zone="team.timezone"
                :minute-step="60"
                use12-hour
                :phrases="{ ok: 'Continue', cancel: 'Exit' }"
                :week-start="7"
                title="When do you want the store to open?"
              ></datetime>
            </div>
            <div class="form-group col">
              <label for="closingDate">Closing Date/Time</label>
              <datetime
                type="datetime"
                input-id="closingDate"
                input-class="form-control form-control-sm"
                v-model="store.closingDate"
                :value-zone="team.timezone"
                :zone="team.timezone"
                use12-hour
                :minute-step="60"
                :phrases="{ ok: 'Continue', cancel: 'Exit' }"
                :week-start="7"
                :min-datetime="store.openingDate"
                title="When do you want the store to close?"
              ></datetime>
            </div>
            <div class="form-group col">
              <label for="shippingType">Shipping Type</label>
              <select
                class="form-control form-control-sm"
                id="shippingType"
                v-model="store.shippingType"
                ref="shippingType"
              >
                <option value="BULK">
                  BULK
                  <small>(default)</small>
                </option>
                <option value="DROP">
                  DROP SHIP
                  <small>(member's shipping)</small>
                </option>
              </select>
            </div>
          </div>
          <div class="col-sm-8 mt-2">
            <div class="row">
              <div class="form-group col">
                <label for="storeMessage">Initial Store Message:</label>
                <textarea
                  class="form-control form-control-sm"
                  maxlength="255"
                  id="storeMessage"
                  v-model="store.storeMessage"
                  rows="12"
                  ref="storeMessage"
                ></textarea>
                <small id="storeMessageInfo" class="text-muted"
                  >{{ store.storeMessage.length }}/255</small
                >
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-sm-6">
                <button
                  class="large-btn btn-block"
                  @click.prevent="updateStore"
                >
                  Update Store
                </button>
              </div>
              <div class="col-sm-6">
                <router-link
                  tag="button"
                  :to="`/dashboard/stores/${store._id}`"
                  class="large-btn danger-btn btn-block"
                  >Cancel</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </form>
      <!-- BULK SHIPPING -->
      <div class="bulkShipping" v-if="store.shippingType === 'BULK'">
        <div class="section-header mt-4 mb-2 bg-secondary">
          <span>
            Bulk Shipping Details
            <small class="ml-2"
              >(uses Team Bulk Shipping Details from Previous Page)</small
            >
          </span>
        </div>
        <div class="row px-2">
          <div class="col-sm-6">
            <label>Name</label>
            <br />
            <span>{{ team.bulkShipping.name }}</span>
          </div>
          <div class="col-sm-6">
            <label>Email</label>
            <br />
            <span>{{ team.bulkShipping.email }}</span>
          </div>
          <div class="col-sm-6">
            <label>Address1</label>
            <br />
            <span>{{ team.bulkShipping.address1 }}</span>
          </div>
          <div class="col-sm-6">
            <label>Address2</label>
            <br />
            <span>{{ team.bulkShipping.address2 || '--' }}</span>
          </div>
          <div class="col-sm-6">
            <label>City</label>
            <br />
            <span>{{ team.bulkShipping.city }}</span>
          </div>
          <div class="col-sm-4">
            <label>State/Province</label>
            <br />
            <span>{{ team.bulkShipping.stateProv }}</span>
          </div>
          <div class="col-sm-2">
            <label>Country</label>
            <br />
            <span>{{ team.bulkShipping.country }}</span>
          </div>
          <div class="col-sm-6">
            <label>Zip/Postal Code</label>
            <br />
            <span>{{ team.bulkShipping.zipPostal }}</span>
          </div>
          <div class="col-sm-6">
            <label>Phone</label>
            <br />
            <span>{{ team.bulkShipping.phone }}</span>
          </div>
        </div>
      </div>
      <!-- DROP SHIPPING -->
      <div class="dropShipping" v-else>
        <div class="section-header mt-4 mb-2 bg-secondary">
          <span>Drop Shipping Details</span>
        </div>
        <div class="row px-2">
          <span class="col">
            All orders from this store will ship to the
            <strong>Team Member's Shipping Address</strong> specified in their
            own profile.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';
import { mapGetters } from 'vuex';
import toast from '../../helpers/toast';
import get from 'lodash/get';

export default {
  name: 'StoresByIdEdit',
  components: {
    Avatar,
  },
  data() {
    return {
      openingDate: null,
    };
  },
  computed: {
    ...mapGetters([
      'isLoading',
      'currentStore',
      'loggedInMember',
      'currentTeam',
    ]),
    store: function() {
      return this.currentStore;
    },
    member: function() {
      return this.loggedInMember;
    },
    team: function() {
      return this.currentTeam;
    },
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      await this.$store.dispatch('getStore', this.$route.params.id);
      await this.$store.dispatch('getTeam', this.store.teamId._id);
      const breadcrumbs = [
        {
          text: 'Stores',
          link: '/dashboard/stores',
        },
        {
          text: `${this.store.storeName}`,
          link: `/dashboard/stores/${this.store._id}`,
        },
        {
          text: 'Edit Store',
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
    setMode: function() {
      if (this.store.mode === 'SURVEY') {
        this.store.openingDate = null;
        this.store.closingDate = null;
        this.store.storeMessage =
          'Click like on all the items you think you may purchase to allow for the best possible price!';
      }

      if (this.store.mode === 'OPEN') {
        this.store.openingDate = new Date().toISOString();
        this.store.closingDate = null;
      }

      if (this.store.mode === 'CLOSED') {
        this.store.openingDate = null;
        this.store.closingDate = new Date().toISOString();
      }
    },
    updateStore: async function() {
      const updatedStore = {
        teamId: this.team._id,
        storeName: this.store.storeName,
        storeCountry: this.store.storeCountry,
        currency: this.store.currency,
        brand: this.store.brand,
        refOrder: this.store.refOrder,
        adminId: this.team.adminId._id,
        managerId: this.team.managerId._id,
        mode: this.store.mode,
        openingDate: this.store.openingDate,
        closingDate: this.store.closingDate,
        timezone: this.team.timezone,
        storeMessage: this.store.storeMessage,
        shippingType: this.store.shippingType,
      };
      try {
        const res = await this.$store.dispatch('updateStore', {
          id: this.store._id,
          updatedStore,
        });
        toast.success(get(res, 'data[0].message', 'Success'));

        this.$router.push({
          name: 'storesById',
          params: { id: this.store._id },
        });
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

<style lang="scss">
.vdatetime-popup__header,
.vdatetime-calendar__month__day--selected > span > span,
.vdatetime-calendar__month__day--selected:hover > span > span {
  background: $blue-color !important;
}

.vdatetime-year-picker__item--selected,
.vdatetime-time-picker__item--selected,
.vdatetime-popup__actions__button {
  color: $blue-color !important;
}

.page {
  display: grid;
  grid-template-columns: 255px 1fr;
  grid-template-rows: 1fr;
  grid-gap: 0.5rem;
  width: 100%;
  height: 100%;
  grid-template-areas: 'sidebar-left middle-section';
}

.bulkShipping .row span {
  background-color: rgba(255, 255, 255, 0.5);
  padding: 0.4rem;
  border-radius: $border-radius;
  display: block;
}
</style>
