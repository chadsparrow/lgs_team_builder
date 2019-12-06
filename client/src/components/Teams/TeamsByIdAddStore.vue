<template>
  <div class="page" v-if="!isLoading">
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
          <small class="col-sm-12 text-info">Store Timezone:</small>
          <span class="col-sm-12">{{ team.timezone }}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Team Name:</small>
          <span class="col-sm-12">{{ team.name }}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Team ID#:</small>
          <span class="col-sm-12">{{ team.teamId }}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Team Admin:</small>
          <span class="col-sm-12">{{ team.adminId.name }}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Team Manager:</small>
          <span class="col-sm-12">{{ team.managerId.name }}</span>
        </div>
      </div>
      <div v-else>
        <div class="placeholderImg"></div>
      </div>
    </div>
    <div class="middle-section" v-if="team.managerId.name">
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
                v-model="storeName"
                ref="storeName"
              />
            </div>
          </div>
          <div class="col-sm-3">
            <div class="form-group">
              <label for="brand">Store Brand</label>
              <select class="form-control" id="brand" v-model="brand" ref="brand">
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
                v-model="storeCountry"
                :country="storeCountry"
                class="form-control"
                ref="storeCountry"
              />
            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group col">
              <label for="currency">Store Currency</label>
              <select
                class="form-control form-control-sm"
                id="currency"
                v-model="currency"
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
                v-model="refOrder"
                ref="refOrder"
              />
            </div>
            <div class="form-group col">
              <label for="currency">Store Mode:</label>
              <select
                class="form-control form-control-sm"
                id="mode"
                v-model="mode"
                ref="mode"
                @change="setOpen"
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
                v-model="openingDate"
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
                v-model="closingDate"
                :value-zone="team.timezone"
                :zone="team.timezone"
                use12-hour
                :minute-step="60"
                :phrases="{ ok: 'Continue', cancel: 'Exit' }"
                :week-start="7"
                :min-datetime="openingDate"
                title="When do you want the store to close?"
              ></datetime>
            </div>
            <div class="form-group col">
              <label for="shippingType">Shipping Type</label>
              <select
                class="form-control form-control-sm"
                id="shippingType"
                v-model="shippingType"
                ref="shippingType"
              >
                <option value="BULK">
                  BULK
                </option>
                <option value="DROP">
                  DROP-SHIP / MULTI-SHIP
                </option>
                <option value="PREPACK">
                  PRE-PACK
                </option>
              </select>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="row">
              <div class="form-group col">
                <label for="storeMessage">Initial Store Message:</label>
                <textarea
                  class="form-control form-control-sm"
                  maxlength="255"
                  id="storeMessage"
                  v-model="storeMessage"
                  rows="12"
                  ref="storeMessage"
                ></textarea>
                <small id="storeMessageInfo" class="text-muted"
                  >{{ storeMessage.length }}/255</small
                >
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-sm-6">
                <button class="btn btn-block btn-info" @click.prevent="addStore">Add Store</button>
              </div>
              <div class="col-sm-6">
                <router-link :to="`/dashboard/teams/${team._id}`" class="btn btn-block btn-danger"
                  >Cancel</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </form>
      <!-- BULK SHIPPING -->
      <div v-if="shippingType === 'BULK'">
        <div class="section-header mt-4 mb-2 bg-secondary">
          <span>Bulk Shipping Details</span>
        </div>
        <div class="row px-2">
          <span class="col">
            All orders from this store will ship to the
            <strong>Team's Bulk Shipping Address</strong>.
          </span>
        </div>
      </div>
      <!-- DROP SHIPPING -->
      <div v-else-if="shippingType === 'DROP'">
        <div class="section-header mt-4 mb-2 bg-secondary">
          <span>Drop Shipping / Multi-Shipping Details</span>
        </div>
        <div class="row px-2">
          <span class="col">
            All orders from this store will ship to the
            <strong>Team Member's Shipping Address</strong> specified in their own profile.
          </span>
        </div>
      </div>
      <!-- PRE-PACK SHIPPING -->
      <div v-else-if="shippingType === 'PREPACK'">
        <div class="section-header mt-4 mb-2 bg-secondary">
          <span>Pre-Pack Shipping Details</span>
        </div>
        <div class="row px-2">
          <span class="col">
            All orders from this store will ship to the
            <strong>Team's Bulk Shipping Address</strong> but will be individually packaged for each
            member.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';
import { mapGetters } from 'vuex';

export default {
  name: 'TeamsAddStore',
  components: {
    Avatar
  },
  data() {
    return {
      storeName: '',
      storeCountry: '',
      currency: '',
      brand: '',
      refOrder: '',
      mode: 'HOLD',
      openingDate: null,
      closingDate: null,
      storeMessage: '',
      shippingType: 'BULK'
    };
  },
  computed: {
    ...mapGetters(['isLoading', 'loggedInMember', 'currentTeam']),
    member: function() {
      return this.loggedInMember;
    },
    team: function() {
      return this.currentTeam;
    }
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      await this.$store.dispatch('getTeam', this.$route.params.id);
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Teams',
          link: '/dashboard/teams'
        },
        {
          text: `${this.team.name}`,
          link: `/dashboard/teams/${this.team._id}`
        },
        {
          text: 'Add Store',
          link: '#'
        }
      ];

      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.storeCountry = this.team.bulkShipping.country;
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    setOpen: function() {
      if (this.mode === 'OPEN') {
        this.openingDate = new Date().toISOString();
        this.closingDate = null;
      }

      if (this.mode === 'CLOSED') {
        this.closingDate = new Date().toISOString();
        this.openingDate = null;
      }
    },
    addStore: async function() {
      const newStore = {
        teamId: this.team._id,
        storeName: this.storeName,
        storeCountry: this.storeCountry,
        currency: this.currency,
        brand: this.brand,
        refOrder: this.refOrder,
        adminId: this.team.adminId._id,
        managerId: this.team.managerId._id,
        mode: this.mode,
        openingDate: this.openingDate,
        closingDate: this.closingDate,
        timezone: this.team.timezone,
        storeMessage: this.storeMessage,
        shippingType: this.shippingType
      };
      try {
        const res = await this.$store.dispatch('addTeamStore', newStore);
        this.$router.push({ name: 'teamsById', params: { id: this.team._id } });
        this.$toasted.success(res.data[0].message, { icon: 'circle-check' });
      } catch (err) {
        if (err.response.data[0].context) {
          console.log(err.response.data[0].context.key);
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    }
  }
};
</script>

<style lang="scss">
$blue-color: #17a2b8;

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
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
  grid-template-areas: 'sidebar-left middle-section';
}
</style>
