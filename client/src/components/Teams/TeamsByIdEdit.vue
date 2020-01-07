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
          <small class="col-sm-12 text-info">Timezone: (uses shipping location)</small>
          <span class="col-sm-12">{{ team.timezone }}</span>
        </div>
        <div class="row p-1" v-if="team.createdAt && team.timezone">
          <small class="col-sm-12 text-info">Team Since:</small>
          <span class="col-sm-12">
            {{ team.createdAt | moment('timezone', team.timezone, 'MMM Do YYYY / hh:mm a - z') }}
          </span>
        </div>
      </div>
      <div v-else>
        <div class="placeholderImg"></div>
      </div>
    </div>
    <div class="middle-section" v-if="team.name">
      <form novalidate>
        <div class="row">
          <div class="form-group col-sm-12">
            <label for="name">Team Name</label>
            <input id="name" type="text" class="form-control" v-model="team.name" ref="name" />
          </div>
          <!-- ADMIN SELECTOR -->
          <div class="form-group col-sm-4">
            <label for="teamId">Team ID#</label>
            <input
              id="teamId"
              type="text"
              class="form-control form-control-sm"
              v-model="team.teamId"
              ref="teamId"
            />
          </div>
          <div class="form-group col-sm-4" v-if="team.adminId">
            <label for="adminId">Admin</label>
            <select
              class="form-control form-control-sm"
              id="adminId"
              v-model="team.adminId._id"
              ref="adminId"
            >
              <option v-for="admin of adminsList" :key="admin._id" :value="admin._id">{{
                admin.name
              }}</option>
            </select>
          </div>
          <!-- MANAGER SELECTOR -->
          <div class="form-group col-sm-4" v-if="team.members.length > 0">
            <label for="managerId">Manager</label>
            <select
              class="form-control form-control-sm"
              id="managerId"
              v-model="team.managerId._id"
              ref="managerId"
              @change="getManagerDetails()"
            >
              <option v-for="manager of team.members" :key="manager._id" :value="manager._id">{{
                manager.name
              }}</option>
            </select>
          </div>
        </div>
        <!-- MAIN CONTACT -->
        <div class="section-header bg-secondary" v-if="team.managerId">
          <span>Main Contact</span>
          <div class="form-check text-center">
            <input
              type="checkbox"
              class="form-check-input"
              id="useManagerDetails"
              v-model="useManagerDetails"
              @change="copyManagertoMain"
              ref="useManagerDetails"
              :disabled="!team.managerId._id"
            />
            <small class="form-check-label text-white" for="useManagerDetails"
              >Use Manager's Contact Info</small
            >
          </div>
        </div>
        <div class="row px-2" v-if="team.mainContact">
          <div class="form-group col-sm-3">
            <label for="contactName">Name</label>
            <input
              id="contactName"
              type="text"
              class="form-control form-control-sm"
              v-model="team.mainContact.name"
              ref="contactName"
              @change="changeDetails"
              :readonly="useManagerDetails"
            />
          </div>
          <div class="form-group col-sm-3">
            <label for="contactCompany">Company</label>
            <input
              id="contactCompany"
              type="text"
              class="form-control form-control-sm"
              v-model="team.mainContact.company"
              ref="contactCompany"
              @change="changeDetails"
              :readonly="useManagerDetails"
            />
          </div>
          <div class="form-group col-sm-6">
            <label for="contactEmail">Email</label>
            <input
              id="contactEmail"
              type="email"
              class="form-control form-control-sm"
              v-model="team.mainContact.email"
              ref="contactEmail"
              @change="changeDetails"
              :readonly="useManagerDetails"
            />
          </div>
          <div class="form-group col-sm-6">
            <label for="contactAddress1">Address 1</label>
            <input
              id="contactAddress1"
              type="text"
              class="form-control form-control-sm"
              v-model="team.mainContact.address1"
              ref="contactAddress1"
              @change="changeDetails"
              :readonly="useManagerDetails"
            />
          </div>
          <div class="form-group col-sm-6">
            <label for="contactAddress2">Address 2</label>
            <input
              id="contactAddress2"
              type="text"
              class="form-control form-control-sm"
              v-model="team.mainContact.address2"
              ref="contactAddress2"
              @change="changeDetails"
              :readonly="useManagerDetails"
            />
          </div>
          <div class="form-group col-sm-6">
            <label for="contactCity">City</label>
            <input
              id="contactCity"
              type="text"
              class="form-control form-control-sm"
              v-model="team.mainContact.city"
              ref="contactCity"
              @change="changeDetails"
              :readonly="useManagerDetails"
            />
          </div>
          <div class="form-group col-sm-3">
            <label for="contactCountry">Country</label>
            <country-select
              id="contactCountry"
              v-model="team.mainContact.country"
              :country="team.mainContact.country"
              class="form-control form-control-sm"
              :readonly="useManagerDetails"
              @input="checkCountry"
              :usei18n="false"
            />
          </div>
          <div class="form-group col-sm-3">
            <label for="contactStateProv">State/Province</label>
            <region-select
              id="contactStateProv"
              v-model="team.mainContact.stateProv"
              :country="team.mainContact.country"
              :region="team.mainContact.stateProv"
              class="form-control form-control-sm"
              :readonly="useManagerDetails"
              :regionName="true"
              @input="checkRegion"
              :usei18n="false"
            />
          </div>
          <div class="form-group col-sm-6">
            <label for="contactZipPostal">Zip/Postal Code</label>
            <input
              id="contactZipPostal"
              type="text"
              class="form-control form-control-sm"
              v-model="team.mainContact.zipPostal"
              ref="contactZipPostal"
              @change="changeDetails"
              :readonly="useManagerDetails"
            />
          </div>
          <div class="form-group col-sm-6" v-if="useManagerDetails">
            <label for="contactPhone">Phone</label>
            <input
              id="contactPhone"
              type="text"
              class="form-control form-control-sm"
              v-model="team.mainContact.phone"
              :readonly="useManagerDetails"
            />
          </div>
          <div class="form-group col-sm-6" v-else>
            <label for="contactPhone">Phone</label>
            <VuePhoneNumberInput
              v-model="team.mainContact.phone"
              id="contactPhone"
              size="sm"
              :preferred-countries="['US', 'CA']"
              ref="contactPhone"
              :clearable="true"
              :no-use-browser-locale="true"
              @update="copyPhone"
            />
          </div>
        </div>
        <!-- BULK SHIPPING -->
        <div class="section-header bg-secondary">
          <span>Bulk Shipping Details</span>
          <div class="radios">
            <div class="form-check form-check-inline mr-4">
              <input
                class="form-check-input"
                type="radio"
                name="bulkUseDetails"
                id="useAboveDetails"
                value="above"
                v-model="bulkUseDetails"
                @change="copytoBulk"
              />
              <small class="form-check-label text-white" for="useAboveDetails"
                >Use Above Details</small
              >
            </div>
            <div class="form-check form-check-inline mr-4">
              <input
                class="form-check-input"
                type="radio"
                name="bulkUseDetails"
                id="useManagerDetails"
                value="manager"
                v-model="bulkUseDetails"
                :disabled="!team.managerId._id"
                @change="copytoBulk"
              />
              <small class="form-check-label text-white" for="useManagerDetails"
                >Use Manager's Shipping Address</small
              >
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="bulkUseDetails"
                id="useNewDetails"
                value="other"
                v-model="bulkUseDetails"
                @change="copytoBulk"
              />
              <small class="form-check-label text-white" for="useNewDetails">Use Other</small>
            </div>
          </div>
        </div>
        <div class="row px-2">
          <div class="form-group col-sm-3">
            <label for="shippingName">Shipping Name</label>
            <input
              id="shippingName"
              type="text"
              class="form-control form-control-sm"
              v-model="team.bulkShipping.name"
              ref="shippingName"
              :readonly="bulkUseDetails !== 'other'"
            />
          </div>
          <div class="form-group col-sm-3">
            <label for="shippingCompany">Shipping Company</label>
            <input
              id="shippingCompany"
              type="text"
              class="form-control form-control-sm"
              v-model="team.bulkShipping.company"
              ref="shippingCompany"
              :readonly="bulkUseDetails !== 'other'"
            />
          </div>
          <div class="form-group col-sm-6">
            <label for="shippingEmail">Shipping Email</label>
            <input
              id="shippingEmail"
              type="text"
              class="form-control form-control-sm"
              v-model="team.bulkShipping.email"
              ref="shippingEmail"
              :readonly="bulkUseDetails !== 'other'"
            />
          </div>
          <div class="form-group col-sm-6">
            <label for="shippingAddress1">Shipping Address 1</label>
            <input
              id="shippingAddress1"
              type="text"
              class="form-control form-control-sm"
              v-model="team.bulkShipping.address1"
              ref="shippingAddress1"
              :readonly="bulkUseDetails !== 'other'"
            />
          </div>
          <div class="form-group col-sm-6">
            <label for="shippingAddress2">Shipping Address 2</label>
            <input
              id="shippingAddress2"
              type="text"
              class="form-control form-control-sm"
              v-model="team.bulkShipping.address2"
              ref="shippingAddress2"
              :readonly="bulkUseDetails !== 'other'"
            />
          </div>
          <div class="form-group col-sm-6">
            <label for="shippingCity">Shipping City</label>
            <input
              id="shippingCity"
              type="text"
              class="form-control form-control-sm"
              v-model="team.bulkShipping.city"
              @change="changeDetails"
              ref="shippingCity"
              :readonly="bulkUseDetails !== 'other'"
            />
          </div>
          <div class="form-group col-sm-3">
            <label for="shippingCountry">Shipping Country</label>
            <country-select
              id="shippingCountry"
              v-model="team.bulkShipping.country"
              :country="team.bulkShipping.country"
              class="form-control form-control-sm"
              :readonly="bulkUseDetails !== 'other'"
              @input="checkShippingCountry"
              :usei18n="false"
            />
          </div>
          <div class="form-group col-sm-3">
            <label for="shippingStateProv">Shipping State/Province</label>
            <region-select
              id="shippingStateProv"
              v-model="team.bulkShipping.stateProv"
              :country="team.bulkShipping.country"
              :region="team.bulkShipping.stateProv"
              class="form-control form-control-sm"
              :readonly="bulkUseDetails !== 'other'"
              :regionName="true"
              :usei18n="false"
            />
          </div>
          <div class="form-group col-sm-6">
            <label for="shippingZipPostal">Shipping Zip/Postal Code</label>
            <input
              id="shippingZipPostal"
              type="text"
              class="form-control form-control-sm"
              v-model="team.bulkShipping.zipPostal"
              ref="shippingZipPostal"
              :readonly="bulkUseDetails !== 'other'"
            />
          </div>

          <div class="form-group col-sm-6" v-if="bulkUseDetails !== 'other'">
            <label for="shippingPhone">Shipping Phone</label>
            <input
              id="shippingPhone"
              type="text"
              class="form-control form-control-sm"
              v-model="team.bulkShipping.phone"
              readonly
            />
          </div>
          <div class="form-group col-sm-6" v-else>
            <label for="shippingPhone">Phone</label>
            <VuePhoneNumberInput
              v-model="team.bulkShipping.phone"
              id="shippingPhone"
              size="sm"
              ref="shippingPhone"
              :clearable="true"
              :no-use-browser-locale="true"
            />
          </div>
        </div>
        <div class="row my-4">
          <div class="col-sm-6">
            <button class="btn btn-block btn-info" @click.prevent="updateTeam">
              Update Team Details
            </button>
          </div>
          <div class="col-sm-6">
            <router-link :to="`/dashboard/teams/${team._id}`" class="btn btn-block btn-danger"
              >Cancel</router-link
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import { mapGetters } from 'vuex';

export default {
  name: 'TeamByIdEdit',
  components: {
    Avatar,
    VuePhoneNumberInput
  },
  data() {
    return {
      managerDetails: {},
      useManagerDetails: false,
      bulkUseDetails: 'other',
      adminsList: [],
      backupContact: {},
      backupBulk: {}
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
      const admins = await this.$store.dispatch('getAdmins');
      this.adminsList = admins.data;

      const res = await this.$store.dispatch('getTeam', this.$route.params.id);
      const teamName = res.data.name;
      const teamId = res.data._id;

      if (this.team && this.team.managerId) {
        this.getManagerDetails();
      }

      const breadcrumbs = [
        {
          text: 'Teams',
          link: '/dashboard/teams'
        },
        {
          text: `${teamName}`,
          link: `/dashboard/teams/${teamId}`
        },
        {
          text: 'Edit',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    updateTeam: async function() {
      const updatedTeam = {
        name: this.team.name,
        logo: this.team.logo,
        adminId: this.team.adminId._id,
        managerId: this.team.managerId._id,
        teamId: this.team.teamId,
        contactName: this.team.mainContact.name,
        contactCompany: this.team.mainContact.company,
        contactAddress1: this.team.mainContact.address1,
        contactAddress2: this.team.mainContact.address2,
        contactCity: this.team.mainContact.city,
        contactStateProv: this.team.mainContact.stateProv,
        contactCountry: this.team.mainContact.country,
        contactZipPostal: this.team.mainContact.zipPostal,
        contactPhone: this.team.mainContact.phone,
        contactEmail: this.team.mainContact.email,
        shippingName: this.team.bulkShipping.name,
        shippingCompany: this.team.bulkShipping.company,
        shippingAddress1: this.team.bulkShipping.address1,
        shippingAddress2: this.team.bulkShipping.address2,
        shippingCity: this.team.bulkShipping.city,
        shippingStateProv: this.team.bulkShipping.stateProv,
        shippingCountry: this.team.bulkShipping.country,
        shippingZipPostal: this.team.bulkShipping.zipPostal,
        shippingPhone: this.team.bulkShipping.phone,
        shippingEmail: this.team.bulkShipping.email
      };
      try {
        const res = await this.$store.dispatch('updateTeam', {
          updatedTeam,
          id: this.team._id
        });
        this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
        this.$router.push({ name: 'teamsById', params: { id: this.team._id } });
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    getManagerDetails: async function() {
      this.$store.commit('LOADING_TRUE');
      try {
        const res = await this.$store.dispatch('getMemberDetails', this.team.managerId._id);
        const manager = res.data.member;

        const {
          name,
          company,
          address1,
          address2,
          city,
          stateProv,
          country,
          zipPostal,
          email,
          phone,
          timezone,
          timezoneAbbrev,
          shipping
        } = manager;

        this.managerDetails = {
          name,
          company,
          address1,
          address2,
          city,
          stateProv,
          country,
          zipPostal,
          email,
          phone,
          timezone,
          timezoneAbbrev,
          shipping
        };

        if (this.useManagerDetails) this.copyManagertoMain();
        if (this.bulkUseDetails === 'manager') this.copytoBulk();
        this.$store.commit('LOADING_FALSE');
      } catch (err) {
        this.$store.commit('LOADING_FALSE');
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    copyManagertoMain: async function() {
      if (this.useManagerDetails) {
        this.backupContact = this.team.mainContact;
        this.team.mainContact = this.managerDetails;
      } else {
        this.team.mainContact = this.backupContact;
      }

      if (this.bulkUseDetails === 'above') {
        this.backupShipping = this.team.bulkShipping;
        this.team.bulkShipping = this.team.mainContact;
      }
    },
    copytoBulk: function() {
      if (this.bulkUseDetails === 'manager') {
        this.backupBulk = this.team.bulkShipping;
        this.team.bulkShipping = this.managerDetails.shipping;
        this.team.timezone = this.managerDetails.timezone;
        this.team.timezoneAbbrev = this.managerDetails.timezoneAbbrev;
      } else if (this.bulkUseDetails === 'above') {
        this.backupBulk = this.team.bulkShipping;
        this.team.bulkShipping = this.team.mainContact;
        this.team.bulkShipping.company = this.backupBulk.company;
      } else {
        this.team.bulkShipping = this.backupBulk;
      }
    },
    changeDetails: async function(event) {
      const target = event.target.id;

      if (this.bulkUseDetails === 'above') {
        if (target === 'contactEmail') {
          this.team.bulkShipping.email = this.team.mainContact.email;
        } else if (target === 'contactName') {
          this.team.bulkShipping.name = this.team.mainContact.name;
        } else if (target === 'contactCompany') {
          this.team.bulkShipping.company = this.team.mainContact.company;
        } else if (target === 'contactAddress1') {
          this.team.bulkShipping.address1 = this.team.mainContact.address1;
        } else if (target === 'contactAddress2') {
          this.team.bulkShipping.address2 = this.team.mainContact.address2;
        } else if (target === 'contactCity') {
          this.team.bulkShipping.city = this.team.mainContact.city;
        } else if (target === 'contactZipPostal') {
          this.team.bulkShipping.zipPostal = this.team.mainContact.zipPostal;
        }
      }
    },
    copyPhone: function(event) {
      if (this.bulkUseDetails === 'above' && event.phoneNumber) {
        this.team.bulkShipping.phone = event.phoneNumber;
      }
    },
    checkRegion: function() {
      if (this.bulkUseDetails === 'above') {
        this.team.bulkShipping.stateProv = this.team.mainContact.stateProv;
      }
    },
    checkCountry: function() {
      this.$refs.contactPhone.countryCode = this.team.mainContact.country;
      this.team.mainContact.stateProv = '';
      this.$refs.contactStateProv.$el.focus();

      if (this.bulkUseDetails === 'above') {
        this.team.bulkShipping.country = this.team.mainContact.country;
        this.team.bulkShipping.stateProv = '';
      }
    },
    checkShippingCountry: function() {
      this.$refs.shippingPhone.countryCode = this.team.bulkShipping.country;
      this.team.bulkShipping.stateProv = '';
      this.$refs.shippingStateProv.$el.focus();
    }
  }
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
</style>
