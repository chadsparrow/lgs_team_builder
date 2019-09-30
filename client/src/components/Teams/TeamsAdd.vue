<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col middle-section">
        <form novalidate>
          <div class="row">
            <div class="form-group col-sm-8">
              <label for="name">Team Name</label>
              <input id="name" type="text" class="form-control" v-model="name" ref="name" />
            </div>
            <div class="col-sm-4">
              <label>Team Timezone:</label>
              <br />
              <small class="timezoneBox">
                <strong class="text-info">{{ timezone || 'Waiting for Shipping Details' }}</strong>
              </small>
            </div>

            <!-- ADMIN SELECTOR -->
            <div class="form-group col-sm-2">
              <label for="teamId">Team ID#</label>
              <input
                id="teamId"
                type="text"
                class="form-control form-control-sm"
                v-model="teamId"
                ref="teamId"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="adminId">Team Admin (ISR)</label>
              <select
                class="form-control form-control-sm"
                id="adminId"
                v-model="adminId"
                ref="adminId"
              >
                <option v-for="admin of adminsList" :key="admin._id" :value="admin._id">{{
                  admin.name
                }}</option>
              </select>
            </div>
            <!-- MANAGER SELECTOR -->
            <div class="form-group col-sm-6" v-if="members && members.length > 0">
              <label for="managerId">Team Manager</label>
              <vSelect
                id="managerId"
                v-model="chosenMember"
                label="email"
                :options="members"
                @input="getManagerDetails"
                ref="managerId"
              ></vSelect>
            </div>
          </div>
          <!-- MAIN CONTACT -->
          <div class="section-header mt-3 mb-2 bg-secondary">
            <span>Main Contact</span>
            <div class="form-check text-center">
              <input
                type="checkbox"
                class="form-check-input mt-2"
                id="useManagerDetails"
                v-model="useManagerDetails"
                @change="copyManagertoMain"
                ref="useManagerDetails"
                :disabled="!managerId || chosenMember === null"
              />
              <label class="form-check-label text-white" for="useManagerDetails"
                >Use Manager's Contact Info</label
              >
            </div>
          </div>
          <div class="row px-2">
            <div class="form-group col-sm-6">
              <label for="contactName">Name</label>
              <input
                id="contactName"
                type="text"
                class="form-control form-control-sm"
                v-model="contactName"
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
                v-model="contactEmail"
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
                v-model="contactAddress1"
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
                v-model="contactAddress2"
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
                v-model="contactCity"
                ref="contactCity"
                @change="changeDetails"
                :readonly="useManagerDetails"
              />
            </div>
            <div class="form-group col-sm-3">
              <label for="contactStateProv">State/Province</label>
              <region-select
                id="contactStateProv"
                v-model="contactStateProv"
                :country="contactCountry"
                :region="contactStateProv"
                class="form-control form-control-sm"
                @input="checkRegion"
                :readonly="useManagerDetails"
                :regionName="true"
                ref="contactStateProv"
              />
            </div>
            <div class="form-group col-sm-3">
              <label for="contactCountry">Country</label>
              <country-select
                id="contactCountry"
                v-model="contactCountry"
                :country="contactCountry"
                class="form-control form-control-sm"
                @input="checkCountry"
                :readonly="useManagerDetails"
                ref="contactCountry"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="contactZipPostal">Zip/Postal Code</label>
              <input
                id="contactZipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="contactZipPostal"
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
                v-model="contactPhone"
                :readonly="useManagerDetails"
              />
            </div>
            <div class="form-group col-sm-6" v-else>
              <label for="contactPhone">Phone</label>
              <VuePhoneNumberInput
                v-model="contactPhone"
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
                <label class="form-check-label text-white" for="useAboveDetails"
                  >Use Above Details</label
                >
              </div>
              <div class="form-check form-check-inline mr-4">
                <input
                  class="form-check-input mt-1"
                  type="radio"
                  name="bulkUseDetails"
                  id="useManagerDetails"
                  value="manager"
                  v-model="bulkUseDetails"
                  :disabled="!managerId || chosenMember === null"
                  @change="copytoBulk"
                />
                <label class="form-check-label text-white" for="useManagerDetails"
                  >Use Manager's Shipping Address</label
                >
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
                v-model="shippingName"
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
                v-model="shippingEmail"
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
                v-model="shippingAddress1"
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
                v-model="shippingAddress2"
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
                v-model="shippingCity"
                @change="changeDetails"
                ref="shippingCity"
                :readonly="bulkUseDetails !== 'other'"
              />
            </div>
            <div class="form-group col-sm-3">
              <label for="shippingStateProv">Shipping State/Province</label>
              <region-select
                id="shippingStateProv"
                v-model="shippingStateProv"
                :country="shippingCountry"
                :region="shippingStateProv"
                class="form-control form-control-sm"
                :regionName="true"
                @input="geoTimezone"
                :readonly="bulkUseDetails !== 'other'"
              />
            </div>
            <div class="form-group col-sm-3">
              <label for="shippingCountry">Shipping Country</label>
              <country-select
                id="shippingCountry"
                v-model="shippingCountry"
                :country="shippingCountry"
                class="form-control form-control-sm"
                @input="checkShippingCountry"
                :readonly="bulkUseDetails !== 'other'"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingZipPostal">Shipping Zip/Postal Code</label>
              <input
                id="shippingZipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingZipPostal"
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
                v-model="shippingPhone"
                readonly
              />
            </div>
            <div class="form-group col-sm-6" v-else>
              <label for="contactPhone">Phone</label>
              <VuePhoneNumberInput
                v-model="shippingPhone"
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
              <button class="btn btn-block btn-info" @click.prevent="addTeam">Add Team</button>
            </div>
            <div class="col-sm-6">
              <router-link to="/dashboard/teams" class="btn btn-block btn-danger"
                >Cancel</router-link
              >
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

export default {
  name: 'TeamsAdd',
  components: {
    VuePhoneNumberInput,
    vSelect
  },
  data() {
    return {
      name: '',
      logo: null,
      adminId: '',
      managerId: '',
      teamId: '',
      contactName: '',
      contactAddress1: '',
      contactAddress2: '',
      contactCity: '',
      contactStateProv: '',
      contactCountry: '',
      contactZipPostal: '',
      contactPhone: '',
      contactEmail: '',
      shippingName: '',
      shippingAddress1: '',
      shippingAddress2: '',
      shippingCity: '',
      shippingStateProv: '',
      shippingCountry: '',
      shippingZipPostal: '',
      shippingPhone: '',
      shippingEmail: '',
      managerDetails: {},
      useManagerDetails: false,
      bulkUseDetails: 'other',
      adminsList: [],
      backupContact: {},
      backupShipping: {},
      timezone: '',
      timezoneAbbrev: '',
      chosenMember: ''
    };
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    },
    members: function() {
      return this.$store.getters.allMembers;
    }
  },
  created: async function() {
    try {
      const admins = await this.$store.dispatch('getAdmins');
      this.adminsList = admins.data;

      await this.$store.dispatch('getMembers');
      this.adminId = this.member._id;

      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Teams',
          link: '/dashboard/teams'
        },
        {
          text: `Add`,
          link: `#`
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.$refs.teamId.focus();
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    addTeam: async function() {
      const newTeam = {
        name: this.name,
        logo: this.logo,
        adminId: this.adminId,
        managerId: this.managerId,
        teamId: this.teamId,
        contactName: this.contactName,
        contactAddress1: this.contactAddress1,
        contactAddress2: this.contactAddress2,
        contactCity: this.contactCity,
        contactStateProv: this.contactStateProv,
        contactCountry: this.contactCountry,
        contactZipPostal: this.contactZipPostal,
        contactPhone: this.contactPhone,
        contactEmail: this.contactEmail,
        shippingName: this.shippingName,
        shippingAddress1: this.shippingAddress1,
        shippingAddress2: this.shippingAddress2,
        shippingCity: this.shippingCity,
        shippingStateProv: this.shippingStateProv,
        shippingCountry: this.shippingCountry,
        shippingZipPostal: this.shippingZipPostal,
        shippingPhone: this.shippingPhone,
        shippingEmail: this.shippingEmail,
        timezone: this.timezone,
        timezoneAbbrev: this.timezoneAbbrev
      };

      try {
        const res = await this.$store.dispatch('addTeam', newTeam);
        this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
        this.$router.push({ name: 'teams' });
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
        if (this.chosenMember !== null) {
          const res = await this.$store.dispatch('getMemberDetails', this.chosenMember._id);
          const manager = res.data.member;

          const {
            _id,
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

          this.managerId = _id;

          if (this.useManagerDetails) this.copyManagertoMain();
          if (this.bulkUseDetails === 'manager') this.copytoBulk();
        } else {
          this.useManagerDetails = false;
          this.bulkUseDetails = 'other';
        }
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    copyManagertoMain: async function() {
      if (this.useManagerDetails) {
        this.backupContact = {
          name: this.contactName,
          address1: this.contactAddress1,
          address2: this.contactAddress2,
          city: this.contactCity,
          stateProv: this.contactStateProv,
          country: this.contactCountry,
          zipPostal: this.contactZipPostal,
          phone: this.contactPhone,
          email: this.contactEmail
        };

        const {
          name,
          address1,
          address2,
          city,
          stateProv,
          country,
          zipPostal,
          email,
          phone
        } = this.managerDetails;
        this.contactName = name;
        this.contactAddress1 = address1;
        this.contactAddress2 = address2;
        this.contactCity = city;
        this.contactStateProv = stateProv;
        this.contactCountry = country;
        this.contactZipPostal = zipPostal;
        this.contactPhone = phone;
        this.contactEmail = email;

        this.geoTimezone();
      } else {
        const {
          name,
          address1,
          address2,
          city,
          stateProv,
          country,
          zipPostal,
          phone,
          email
        } = this.backupContact;
        this.contactName = name;
        this.contactAddress1 = address1;
        this.contactAddress2 = address2;
        this.contactCity = city;
        this.contactStateProv = stateProv;
        this.contactCountry = country;
        this.contactZipPostal = zipPostal;
        this.contactPhone = phone;
        this.contactEmail = email;

        this.geoTimezone();
      }

      if (this.bulkUseDetails === 'above') {
        this.backupShipping = {
          name: this.shippingName,
          address1: this.shippingAddress1,
          address2: this.shippingAddress2,
          city: this.shippingCity,
          stateProv: this.shippingStateProv,
          country: this.shippingCountry,
          zipPostal: this.shippingZipPostal,
          phone: this.shippingPhone,
          email: this.shippingEmail
        };

        this.shippingName = this.contactName;
        this.shippingAddress1 = this.contactAddress1;
        this.shippingAddress2 = this.contactAddress2;
        this.shippingCity = this.contactCity;
        this.shippingStateProv = this.contactStateProv;
        this.shippingCountry = this.contactCountry;
        this.shippingZipPostal = this.contactZipPostal;
        this.shippingPhone = this.contactPhone;
        this.shippingEmail = this.contactEmail;

        this.geoTimezone();
      }
    },
    copytoBulk: function() {
      if (this.bulkUseDetails === 'manager') {
        const { shipping, timezone, timezoneAbbrev } = this.managerDetails;
        this.backupShipping = {
          name: this.shippingName,
          address1: this.shippingAddress1,
          address2: this.shippingAddress2,
          city: this.shippingCity,
          stateProv: this.shippingStateProv,
          country: this.shippingCountry,
          zipPostal: this.shippingZipPostal,
          phone: this.shippingPhone,
          email: this.shippingEmail
        };
        this.shippingName = shipping.name;
        this.shippingAddress1 = shipping.address1;
        this.shippingAddress2 = shipping.address2;
        this.shippingCity = shipping.city;
        this.shippingStateProv = shipping.stateProv;
        this.shippingCountry = shipping.country;
        this.shippingZipPostal = shipping.zipPostal;
        this.shippingPhone = shipping.phone;
        this.shippingEmail = shipping.email;
        this.timezone = timezone;
        this.timezoneAbbrev = timezoneAbbrev;
      } else if (this.bulkUseDetails === 'above') {
        this.backupShipping = {
          name: this.shippingName,
          address1: this.shippingAddress1,
          address2: this.shippingAddress2,
          city: this.shippingCity,
          stateProv: this.shippingStateProv,
          country: this.shippingCountry,
          zipPostal: this.shippingZipPostal,
          phone: this.shippingPhone,
          email: this.shippingEmail
        };
        this.shippingName = this.contactName;
        this.shippingAddress1 = this.contactAddress1;
        this.shippingAddress2 = this.contactAddress2;
        this.shippingCity = this.contactCity;
        this.shippingStateProv = this.contactStateProv;
        this.shippingCountry = this.contactCountry;
        this.shippingZipPostal = this.contactZipPostal;
        this.shippingPhone = this.contactPhone;
        this.shippingEmail = this.contactEmail;
        this.geoTimezone();
      } else {
        const {
          name,
          address1,
          address2,
          city,
          stateProv,
          country,
          zipPostal,
          phone,
          email
        } = this.backupShipping;
        this.shippingName = name;
        this.shippingAddress1 = address1;
        this.shippingAddress2 = address2;
        this.shippingCity = city;
        this.shippingStateProv = stateProv;
        this.shippingCountry = country;
        this.shippingZipPostal = zipPostal;
        this.shippingPhone = phone;
        this.shippingEmail = email;
        this.$refs.shippingName.focus();
        this.geoTimezone();
      }
    },
    changeDetails: function(event) {
      if (event.target) {
        const target = event.target.id;
        if (
          target === 'shippingCity' &&
          (this.shippingStateProv && this.shippingCity && this.shippingCountry)
        ) {
          this.geoTimezone();
        }

        if (this.bulkUseDetails === 'above') {
          if (target === 'contactEmail') {
            this.shippingEmail = this.contactEmail;
          } else if (target === 'contactName') {
            this.shippingName = this.contactName;
          } else if (target === 'contactAddress1') {
            this.shippingAddress1 = this.contactAddress1;
          } else if (target === 'contactAddress2') {
            this.shippingAddress2 = this.contactAddress2;
          } else if (target === 'contactCity') {
            this.shippingCity = this.contactCity;
            this.geoTimezone();
          } else if (target === 'contactZipPostal') {
            this.shippingZipPostal = this.contactZipPostal;
          }
        }
      }
    },
    copyPhone: function() {
      if (this.bulkUseDetails === 'above' && event.phoneNumber) {
        this.shippingPhone = event.phoneNumber;
      }
    },
    checkRegion: function() {
      if (this.bulkUseDetails === 'above') {
        this.shippingStateProv = this.contactStateProv;
        this.geoTimezone();
      }
    },
    checkCountry: function() {
      this.$refs.contactPhone.countryCode = this.contactCountry;
      this.contactStateProv = '';

      if (this.bulkUseDetails === 'above') {
        this.shippingCountry = this.contactCountry;
        this.shippingStateProv = '';
      }
    },
    checkShippingCountry: function() {
      this.$refs.shippingPhone.countryCode = this.shippingCountry;
      this.geoTimezone();
    },
    geoTimezone: async function() {
      if (this.shippingStateProv && this.shippingCity && this.shippingCountry) {
        const location = await this.$http.get(
          `https://www.mapquestapi.com/geocoding/v1/address?key=Psfm8OjiPQikFbEv9jZ7vCbTpD1hAOlm&inFormat=json&outFormat=json&json={"location":{"street":"${this.shippingCity} ${this.shippingStateProv} ${this.shippingCountry}"},"options":{"thumbMaps":false}}`
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
            this.timezone = response.data.zoneName;
            this.timezoneAbbrev = response.data.abbreviation;
          }
        }
      } else {
        this.timezone = '';
        this.timezoneAbbrev = '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  max-width: 800px;
  margin: 0 auto;

  .timezoneBox {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.75rem;
  }
}
</style>
