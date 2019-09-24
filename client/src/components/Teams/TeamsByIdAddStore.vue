<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col sidebar-left">
        <div v-if="team && team.name">
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
      <div class="col middle-section" v-if="team && team.managerId.name">
        <form novalidate>
          <!-- STORE INFO-->
          <div class="section-header mb-2 bg-secondary">
            <span>Store Information</span>
          </div>
          <div class="row px-2">
            <div class="col-sm-12 mb-4">
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
                <label for="orderReference">ERP Order Reference #</label>
                <input
                  id="orderReference"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="orderReference"
                  ref="orderReference"
                />
              </div>
              <div class="form-group col">
                <label for="currency">Store Mode:</label>
                <select class="form-control form-control-sm" id="mode" v-model="mode" ref="mode">
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
                  v-model="opening"
                  :value-zone="team.timezone"
                  :zone="team.timezone"
                  use12-hour
                  auto
                  :phrases="{ok: 'Continue', cancel: 'Exit'}"
                  :week-start="7"
                ></datetime>
              </div>
              <div class="form-group col">
                <label for="closingDate">Closing Date/Time</label>
                <datetime
                  type="datetime"
                  input-id="closingDate"
                  input-class="form-control form-control-sm"
                  v-model="closing"
                  :value-zone="team.timezone"
                  :zone="team.timezone"
                  use12-hour
                  auto
                  :phrases="{ok: 'Continue', cancel: 'Exit'}"
                  :week-start="7"
                  :min-datetime="opening"
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
                    <small>(default)</small>
                  </option>
                  <option value="DROP">
                    DROP SHIP
                    <small>(member's shipping)</small>
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
                  ></textarea>
                  <small id="storeMessageInfo" class="text-muted">{{storeMessage.length}}/255</small>
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-sm-6">
                  <button class="btn btn-block btn-info" @click.prevent="addStore">Add Store</button>
                </div>
                <div class="col-sm-6">
                  <router-link
                    :to="`/dashboard/teams/${team._id}`"
                    class="btn btn-block btn-danger"
                  >Cancel</router-link>
                </div>
              </div>
            </div>
          </div>
        </form>
        <!-- BULK SHIPPING -->
        <div class="bulkShipping" v-if="shippingType === 'BULK'">
          <div class="section-header mt-4 mb-2 bg-secondary">
            <span>
              Bulk Shipping Details
              <small
                class="ml-2"
              >(uses Team Bulk Shipping Details from Previous Page)</small>
            </span>
          </div>
          <div class="row px-2">
            <div class="col-sm-6">
              <label>Name</label>
              <br />
              <span>{{team.bulkShipping.name}}</span>
            </div>
            <div class="col-sm-6">
              <label>Email</label>
              <br />
              <span>{{team.bulkShipping.email}}</span>
            </div>
            <div class="col-sm-6">
              <label>Address1</label>
              <br />
              <span>{{team.bulkShipping.address1}}</span>
            </div>
            <div class="col-sm-6">
              <label>Address2</label>
              <br />
              <span>{{team.bulkShipping.address2 || '--'}}</span>
            </div>
            <div class="col-sm-6">
              <label>City</label>
              <br />
              <span>{{team.bulkShipping.city}}</span>
            </div>
            <div class="col-sm-3">
              <label>State/Province</label>
              <br />
              <span>{{team.bulkShipping.stateProv}}</span>
            </div>
            <div class="col-sm-3">
              <label>Country</label>
              <br />
              <span>{{team.bulkShipping.country}}</span>
            </div>
            <div class="col-sm-6">
              <label>Zip/Postal Code</label>
              <br />
              <span>{{team.bulkShipping.zipPostal}}</span>
            </div>
            <div class="col-sm-6">
              <label>Phone</label>
              <br />
              <span>{{team.bulkShipping.phone}}</span>
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
              <strong>Team Member's</strong> address specified in their own profile.
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';

export default {
  name: 'TeamsAddStore',
  components: {
    Avatar
  },
  data() {
    return {
      storeName: '',
      currency: '',
      orderReference: '',
      mode: 'HOLD',
      opening: null,
      closing: null,
      storeMessage: '',
      shippingType: 'BULK'
    };
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    },
    team: function() {
      return this.$store.getters.currentTeam;
    },
    minDateTime: function() {
      if (this.openingDate) {
        return this.openingDate;
      } else {
        return null;
      }
    }
  },
  created: async function() {
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
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    addStore: async function() {
      const newStore = {
        teamId: this.team._id,
        storeName: this.storeName,
        currency: this.currency,
        orderReference: this.orderReference,
        adminId: this.team.adminId._id,
        managerId: this.team.managerId._id,
        mode: this.mode,
        openingDate: this.opening,
        closingDate: this.closing,
        timezone: this.team.timezone,
        storeMessage: this.storeMessage,
        shippingType: this.shippingType
      };

      try {
        const res = await this.$store.dispatch('addTeamStore', newStore);
        this.$router.push({ name: 'teamsById', params: { id: this.team._id } });
        this.$toasted.success(res.data[0].message);
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

.bulkShipping .row span {
  background-color: rgba(255, 255, 255, 0.5);
  padding: 0.4rem;
  border-radius: 5px;
  display: block;
}
</style>
