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
            <small class="col-sm-12 text-info">Timezone: (uses shipping location)</small>
            <span class="col-sm-12">{{ team.timezone }}</span>
          </div>
          <div class="row p-1" v-if="team.createdAt && team.timezone">
            <small class="col-sm-12 text-info">Team Since:</small>
            <span class="col-sm-12">
              {{
              team.createdAt | moment('timezone', team.timezone, 'MMM Do YYYY / hh:mm a - z')
              }}
            </span>
          </div>
        </div>
        <div v-else>
          <div class="placeholderImg"></div>
        </div>
      </div>
      <div class="col middle-section" v-if="team && team.name">
        <form novalidate>
          <div class="row">
            <!-- ADMIN SELECTOR -->
            <div class="form-group col-sm-4">
              <label for="teamId">Team ID#</label>
              <input
                id="teamId"
                type="text"
                class="form-control form-control-sm"
                v-model="team.teamId"
                ref="teamId"
                readonly
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
                <option
                  v-for="admin of adminsList"
                  :key="admin._id"
                  :value="admin._id"
                >{{admin.name}}</option>
              </select>
            </div>
            <!-- MANAGER SELECTOR -->
            <div class="form-group col-sm-4" v-if="team.members && team.members.length > 0">
              <label for="managerId">Manager</label>
              <select
                class="form-control form-control-sm"
                id="managerId"
                v-model="team.managerId._id"
                ref="managerId"
                @change="getManagerDetails()"
              >
                <option
                  v-for="manager of team.members"
                  :key="manager._id"
                  :value="manager._id"
                >{{manager.name}}</option>
              </select>
            </div>
          </div>
          <!-- MAIN CONTACT -->
          <div class="section-header mt-3 mb-2 bg-secondary" v-if="team.managerId">
            <span>Main Contact</span>
            <div class="form-check text-center">
              <input
                type="checkbox"
                class="form-check-input mt-2"
                id="useManagerDetails"
                v-model="useManagerDetails"
                @change="copyManagertoMain"
                ref="useManagerDetails"
                :disabled="!team.managerId._id"
              />
              <label
                class="form-check-label text-white"
                for="useManagerDetails"
              >Use Manager's Contact Info</label>
            </div>
          </div>
          <div class="row px-2" v-if="team.mainContact">
            <div class="form-group col-sm-6">
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
            <div class="form-group col-sm-4">
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
            <div class="form-group col-sm-4">
              <label for="contactStateProv">State/Province</label>
              <input
                id="contactStateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="team.mainContact.stateProv"
                ref="contactStateProv"
                @change="changeDetails"
                :readonly="useManagerDetails"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="contactCountry">Country</label>
              <input
                id="contactCountry"
                type="text"
                class="form-control form-control-sm"
                v-model="team.mainContact.country"
                ref="contactCountry"
                maxlength="2"
                @change="changeDetails"
                :readonly="useManagerDetails"
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
                :dark="false"
                :preferred-countries="['US', 'CA']"
                ref="contactPhone"
                :clearable="true"
                :no-use-browser-locale="false"
                @update="copyPhone"
              />
            </div>
          </div>
          <!-- BULK SHIPPING -->
          <div class="section-header mb-2 mt-3 bg-secondary">
            <span>Bulk Shipping Details</span>
            <div class="radios">
              <div class="form-check form-check-inline mr-4">
                <input
                  class="form-check-input mt-1"
                  type="radio"
                  name="bulkUseDetails"
                  id="useAboveDetails"
                  value="above"
                  v-model="bulkUseDetails"
                  @change="copytoBulk"
                />
                <label class="form-check-label text-white" for="useAboveDetails">Use Above Details</label>
              </div>
              <div class="form-check form-check-inline mr-4">
                <input
                  class="form-check-input mt-1"
                  type="radio"
                  name="bulkUseDetails"
                  id="useManagerDetails"
                  value="manager"
                  v-model="bulkUseDetails"
                  :disabled="!team.managerId._id"
                  @change="copytoBulk"
                />
                <label
                  class="form-check-label text-white"
                  for="useManagerDetails"
                >Use Manager's Shipping Address</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input mt-1"
                  type="radio"
                  name="bulkUseDetails"
                  id="useNewDetails"
                  value="other"
                  v-model="bulkUseDetails"
                  @change="copytoBulk"
                />
                <label class="form-check-label text-white" for="useNewDetails">Use Other</label>
              </div>
            </div>
          </div>
          <div class="row px-2">
            <div class="form-group col-sm-6">
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
            <div class="form-group col-sm-6">
              <label for="shippingEmail">Shipping Email</label>
              <input
                id="shippingEmail"
                type="text"
                class="form-control form-control-sm"
                v-model="team.bulkShipping.email"
                ref="shippingEmail"
                :readonly="bulkUseDetails!== 'other'"
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
                :readonly="bulkUseDetails!== 'other'"
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
                :readonly="bulkUseDetails!== 'other'"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingCity">Shipping City</label>
              <input
                id="shippingCity"
                type="text"
                class="form-control form-control-sm"
                v-model="team.bulkShipping.city"
                @change="changeDetails"
                ref="shippingCity"
                :readonly="bulkUseDetails!== 'other'"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingStateProv">Shipping State/Province</label>
              <input
                id="shippingStateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="team.bulkShipping.stateProv"
                ref="shippingStateProv"
                @change="changeDetails"
                :readonly="bulkUseDetails!== 'other'"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingCountry">Shipping Country</label>
              <input
                id="shippingCountry"
                type="text"
                class="form-control form-control-sm"
                maxlength="2"
                v-model="team.bulkShipping.country"
                ref="shippingCountry"
                @change="changeDetails"
                :readonly="bulkUseDetails!== 'other'"
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
                :readonly="bulkUseDetails!== 'other'"
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
              <label for="contactPhone">Phone</label>
              <VuePhoneNumberInput
                v-model="team.bulkShipping.phone"
                id="shippingPhone"
                :dark="false"
                ref="shippingPhone"
                :clearable="true"
                :no-use-browser-locale="false"
              />
            </div>
          </div>
          <div class="row mt-4 mb-5">
            <div class="col-sm-6">
              <button class="btn btn-block btn-info" @click.prevent="updateTeam">Update Team Details</button>
            </div>
            <div class="col-sm-6">
              <router-link
                :to="`/dashboard/teams/${team._id}`"
                class="btn btn-block btn-danger"
              >Cancel</router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

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
    member: function() {
      return this.$store.getters.getCurrentMember;
    },
    team: function() {
      return this.$store.getters.currentTeam;
    }
  },
  created: async function() {
    try {
      const admins = await this.$store.dispatch('getAdmins');
      this.adminsList = admins.data;

      if (this.team && this.team.managerId) {
        this.getManagerDetails();
      }

      const res = await this.$store.dispatch('getTeam', this.$route.params.id);
      const teamName = res.data.name;
      const teamId = res.data._id;
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
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
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    updateTeam: async function() {
      const updatedTeam = {
        logo: this.team.logo,
        adminId: this.team.adminId._id,
        managerId: this.team.managerId._id,
        teamId: this.team.teamId,
        mainContact: this.team.mainContact,
        bulkShipping: this.team.bulkShipping,
        timezone: this.team.timezone,
        timezoneAbbrev: this.team.timezoneAbbrev
      };

      delete updatedTeam.mainContact.timezone;
      delete updatedTeam.mainContact.timezoneAbbrev;
      delete updatedTeam.mainContact.shipping;

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
      try {
        const res = await this.$store.dispatch('getMemberDetails', this.team.managerId._id);
        const manager = res.data.member;

        const {
          name,
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
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    copyManagertoMain: async function() {
      if (this.useManagerDetails) {
        this.backupContact = this.team.mainContact;
        this.team.mainContact = this.managerDetails;
        this.geoTimezone();
      } else {
        this.team.mainContact = this.backupContact;
        this.geoTimezone();
      }

      if (this.bulkUseDetails === 'above') {
        this.backupShipping = this.team.bulkShipping;
        this.team.bulkShipping = this.team.mainContact;
        this.geoTimezone();
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
        this.geoTimezone();
      } else {
        this.team.bulkShipping = this.backupBulk;
        this.geoTimezone();
      }
    },
    changeDetails: async function(event) {
      const target = event.target.id;
      let codeCountries;
      if (
        (target === 'shippingCountry' ||
          target === 'shippingStateProv' ||
          target === 'shippingCity') &&
        (this.team.bulkShipping.stateProv &&
          this.team.bulkShipping.city &&
          this.team.bulkShipping.country)
      ) {
        this.geoTimezone();
      }

      if (this.bulkUseDetails === 'above') {
        if (target === 'contactEmail') {
          this.team.bulkShipping.email = this.team.mainContact.email;
        } else if (target === 'contactName') {
          this.team.bulkShipping.name = this.team.mainContact.name;
        } else if (target === 'contactAddress1') {
          this.team.bulkShipping.address1 = this.team.mainContact.address1;
        } else if (target === 'contactAddress2') {
          this.team.bulkShipping.address2 = this.team.mainContact.address2;
        } else if (target === 'contactCity') {
          this.team.bulkShipping.city = this.team.mainContact.city;
          this.geoTimezone();
        } else if (target === 'contactStateProv') {
          this.team.bulkShipping.stateProv = this.team.mainContact.stateProv;
          this.geoTimezone();
        } else if (target === 'contactCountry') {
          this.team.bulkShipping.country = this.team.mainContact.country;
          this.geoTimezone();
        } else if (target === 'contactZipPostal') {
          this.team.bulkShipping.zipPostal = this.team.mainContact.zipPostal;
        }
      }
      let valid = false;
      if (target === 'contactCountry' && this.team.mainContact.country) {
        codeCountries = this.$refs.contactPhone.codesCountries;
        let countryCode = this.team.mainContact.country;
        countryCode = countryCode.toUpperCase();
        codeCountries.forEach(country => {
          if (country.iso2 === countryCode) {
            valid = true;
          }
        });

        if (valid) {
          this.$refs.contactPhone.countryCode = countryCode;
        } else {
          this.team.mainContact.country = '';
          this.$refs.contactCountry.focus();
          this.$toasted.error('Main Contact Country Code Invalid', {
            icon: 'exclamation-triangle'
          });
        }
      }

      if (target === 'shippingCountry' && this.team.bulkShipping.country) {
        codeCountries = this.$refs.shippingPhone.codesCountries;
        let countryCode = this.team.bulkShipping.country;
        countryCode = countryCode.toUpperCase();
        codeCountries.forEach(country => {
          if (country.iso2 === countryCode) {
            valid = true;
          }
        });

        if (valid) {
          this.$refs.shippingPhone.countryCode = countryCode;
        } else {
          this.team.bulkShipping.country = '';
          this.$refs.shippingCountry.focus();
          this.$toasted.error('Shipping Country Code Invalid', { icon: 'exclamation-triangle' });
        }
      }
    },
    copyPhone: function(event) {
      if (this.bulkUseDetails === 'above' && event.phoneNumber) {
        this.team.bulkShipping.phone = event.phoneNumber;
      }
    },
    geoTimezone: async function() {
      if (
        this.team.bulkShipping.stateProv !== '' &&
        this.team.bulkShipping.city !== '' &&
        this.team.bulkShipping.country !== ''
      ) {
        const location = await this.$http.get(
          `https://www.mapquestapi.com/geocoding/v1/address?key=Psfm8OjiPQikFbEv9jZ7vCbTpD1hAOlm&inFormat=json&outFormat=json&json={"location":{"street":"${this.team.bulkShipping.city} ${this.team.bulkShipping.stateProv} ${this.team.bulkShipping.country}"},"options":{"thumbMaps":false}}`
        );
        if (location) {
          const lat = location.data.results[0].locations[0].latLng.lat;
          const lng = location.data.results[0].locations[0].latLng.lng;
          const response = await this.$http.get(
            `http://api.timezonedb.com/v2.1/get-time-zone?key=UYO5UGHKPVBL&format=json&by=position&lat=${lat}&lng=${lng}`
          );
          if (
            response.data.zoneName &&
            response.data.zoneName !== null &&
            response.data.zoneName !== ''
          ) {
            this.team.timezone = response.data.zoneName;
            this.team.timezoneAbbrev = response.data.abbreviation;
          }
        }
      } else {
        this.team.timezone = '';
        this.team.timezoneAbbrev = '';
      }
    }
  }
};
</script>
