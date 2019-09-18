<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col sidebar">
        <div v-if="name">
          <avatar
            :username="name"
            :size="225"
            background-color="#FFF"
            color="#000"
            :rounded="false"
            :src="logo"
          ></avatar>
          <div class="row p-1 mt-4">
            <small class="col-sm-12 text-info">Timezone: (uses shipping location)</small>
            <span class="col-sm-12">{{ timezone }}</span>
          </div>
          <div class="row p-1" v-if="createdAt && timezone">
            <small class="col-sm-12 text-info">Team Since:</small>
            <span class="col-sm-12">
              {{
              createdAt | moment('timezone', timezone, 'MMM Do YYYY / hh:mm a - z')
              }}
            </span>
          </div>
          <div class="row p-1 mt-4" v-if="members && members.length > 0">
            <small class="col-sm-12 text-info">Member List:</small>
            <ul class="col-sm-12 list-group">
              <li class="list-group-item" v-for="membr of members" :key="membr._id">
                <i class="fas fa-certificate text-warning mr-1" v-if="managerId._id === membr._id"></i>
                {{ membr.name }}
              </li>
            </ul>
          </div>
          <div class="row p-1 mt-4" v-else>
            <small class="col-sm-12 text-info">Member List:</small>
            <span class="col-sm-12">No Members</span>
          </div>
        </div>
        <div v-else>
          <div class="placeholderImg"></div>
        </div>
      </div>
      <div class="col infoSection" v-if="name">
        <form novalidate>
          <div class="row">
            <!-- ADMIN SELECTOR -->
            <div class="form-group col-sm-4">
              <label for="teamId">Team ID#</label>
              <input
                id="teamId"
                type="text"
                class="form-control form-control-sm"
                v-model="teamId"
                ref="teamId"
                readonly
              />
            </div>
            <div class="form-group col-sm-4" v-if="member && member.isAdmin">
              <label for="adminId">Admin</label>
              <select
                class="form-control form-control-sm"
                id="adminId"
                v-model="adminId._id"
                ref="adminId"
              >
                <option
                  v-for="admin of adminsList"
                  :key="admin._id"
                  :value="admin._id"
                >{{admin.name}}</option>
              </select>
            </div>
            <div class="form-group col-sm-6" v-else-if="member && member._id === managerId._id">
              <label for="adminId">Admin</label>
              <span>{{adminId.name}} - {{adminId.email}}</span>
            </div>
            <!-- MANAGER SELECTOR -->
            <div class="form-group col-sm-4" v-if="member && member.isAdmin && members">
              <label for="managerId">Manager</label>
              <select
                class="form-control form-control-sm"
                id="managerId"
                v-model="managerId._id"
                ref="managerId"
                @change="getManagerDetails()"
              >
                <option
                  v-for="manager of members"
                  :key="manager._id"
                  :value="manager._id"
                >{{manager.name}}</option>
              </select>
            </div>
            <div class="form-group col-sm-4" v-else>
              <label for="managerId">Manager</label>
              <span v-if="managerId._id">{{managerId.name}} - {{managerId.email}}</span>
            </div>
          </div>
          <!-- MAIN CONTACT -->
          <div class="row mt-3">
            <div class="col-sm-12">
              <div class="section-header mb-2 bg-secondary text-center">
                <span>Main Contact</span>
                <div class="form-check text-center">
                  <input
                    type="checkbox"
                    class="form-check-input mt-2"
                    id="useManagerDetails"
                    v-model="useManagerDetails"
                    @change="copyManagertoMain"
                    ref="useManagerDetails"
                    :disabled="!managerId._id"
                  />
                  <label class="form-check-label" for="useManagerDetails">Use Manager's Contact Info</label>
                </div>
              </div>
            </div>
            <div class="form-group col-sm-6">
              <label for="contactName">Name</label>
              <input
                id="contactName"
                type="text"
                class="form-control form-control-sm"
                v-model="mainContact.name"
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
                v-model="mainContact.email"
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
                v-model="mainContact.address1"
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
                v-model="mainContact.address2"
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
                v-model="mainContact.city"
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
                v-model="mainContact.stateProv"
                ref="contactStateProv"
                @change="changeDetails"
                :readonly="useManagerDetails"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="contactCountry">Country - 2 digit code</label>
              <input
                id="contactCountry"
                type="text"
                class="form-control form-control-sm"
                v-model="mainContact.country"
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
                v-model="mainContact.zipPostal"
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
                v-model="mainContact.phone"
                :readonly="useManagerDetails"
              />
            </div>
            <div class="form-group col-sm-6" v-else>
              <label for="contactPhone">Phone</label>
              <VuePhoneNumberInput
                v-model="mainContact.phone"
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
          <div class="row mb-3 mt-3">
            <div class="col-sm-12">
              <div class="section-header mb-2 bg-secondary text-center">
                <span>Bulk Shipping Details</span>
                <br />
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
                    :disabled="!managerId._id"
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
            <div class="form-group col-sm-6">
              <label for="shippingName">Shipping Name</label>
              <input
                id="shippingName"
                type="text"
                class="form-control form-control-sm"
                v-model="bulkShipping.name"
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
                v-model="bulkShipping.email"
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
                v-model="bulkShipping.address1"
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
                v-model="bulkShipping.address2"
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
                v-model="bulkShipping.city"
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
                v-model="bulkShipping.stateProv"
                ref="shippingStateProv"
                @change="changeDetails"
                :readonly="bulkUseDetails!== 'other'"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingCountry">Shipping Country - 2 digit code</label>
              <input
                id="shippingCountry"
                type="text"
                class="form-control form-control-sm"
                maxlength="2"
                v-model="bulkShipping.country"
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
                v-model="bulkShipping.zipPostal"
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
                v-model="bulkShipping.phone"
                readonly
              />
            </div>
            <div class="form-group col-sm-6" v-else>
              <label for="contactPhone">Phone</label>
              <VuePhoneNumberInput
                v-model="bulkShipping.phone"
                id="shippingPhone"
                :dark="false"
                ref="shippingPhone"
                :clearable="true"
                :no-use-browser-locale="false"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <button
                class="btn btn-block btn-info mt-2"
                @click.prevent="updateTeam"
              >Update Team Details</button>
            </div>
            <div class="col-sm-6">
              <router-link
                :to="`/dashboard/teams/${id}`"
                class="btn btn-block btn-danger mt-2"
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
      id: '',
      name: '',
      logo: null,
      adminId: {},
      managerId: {},
      teamId: '',
      managerDetails: {},
      useManagerDetails: false,
      mainContact: {
        name: '',
        address1: '',
        address2: '',
        city: '',
        stateProv: '',
        country: '',
        zipPostal: '',
        email: '',
        phone: ''
      },
      bulkUseDetails: 'other',
      bulkShipping: {
        name: '',
        address1: '',
        address2: '',
        city: '',
        stateProv: '',
        country: '',
        zipPostal: '',
        email: '',
        phone: ''
      },
      members: [],
      timezone: '',
      timezoneAbbrev: '',
      createdAt: '',
      adminsList: [],
      backupContact: {},
      backupBulk: {}
    };
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    },
    breadcrumbs: function() {
      return [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Teams',
          link: '/dashboard/teams'
        },
        {
          text: `${this.name}`,
          link: `/dashboard/teams/${this.id}`
        },
        {
          text: 'Edit',
          link: '#'
        }
      ];
    }
  },
  created: async function() {
    try {
      const admins = await this.$store.dispatch('getAdmins');
      this.adminsList = admins.data;
      const res = await this.$store.dispatch('getTeam', this.$route.params.id);
      const {
        _id,
        name,
        logo,
        adminId,
        managerId,
        teamId,
        mainContact,
        bulkShipping,
        members,
        timezone,
        timezoneAbbrev,
        createdAt
      } = res.data;

      this.id = _id;
      this.name = name;
      this.teamId = teamId;
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
      this.logo = logo;
      this.timezone = timezone;
      this.timezoneAbbrev = timezoneAbbrev;
      this.createdAt = createdAt;

      this.members = members;

      if (adminId) {
        this.adminId = adminId;
      }

      if (managerId) {
        this.managerId = managerId;
        this.getManagerDetails();
      }

      if (mainContact) {
        this.mainContact = mainContact;
      }

      if (bulkShipping) {
        this.bulkShipping = bulkShipping;
      }
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  methods: {
    updateTeam: async function() {
      const updatedTeam = {
        logo: this.logo,
        adminId: this.adminId._id,
        managerId: this.managerId._id,
        teamId: this.teamId,
        mainContact: this.mainContact,
        bulkShipping: this.bulkShipping,
        timezone: this.timezone,
        timezoneAbbrev: this.timezoneAbbrev
      };

      delete updatedTeam.mainContact.timezone;
      delete updatedTeam.mainContact.timezoneAbbrev;
      delete updatedTeam.mainContact.shipping;

      try {
        const res = await this.$store.dispatch('updateTeam', {
          updatedTeam,
          id: this.id
        });
        this.$toasted.success(res.data[0].message);
        this.$router.push({ name: 'teamsById', params: { id: this.id } });
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].message);
      }
    },
    getManagerDetails: async function() {
      try {
        const res = await this.$store.dispatch('getMemberDetails', this.managerId._id);
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
        this.$toasted.error(err.response.data[0].message);
      }
    },
    copyManagertoMain: async function() {
      if (this.useManagerDetails) {
        this.backupContact = this.mainContact;
        this.mainContact = this.managerDetails;
        this.geoTimezone();
      } else {
        this.mainContact = this.backupContact;
        this.geoTimezone();
      }

      if (this.bulkUseDetails === 'above') {
        this.backupShipping = this.bulkShipping;
        this.bulkShipping = this.mainContact;
        this.geoTimezone();
      }
    },
    copytoBulk: function() {
      if (this.bulkUseDetails === 'manager') {
        this.backupBulk = this.bulkShipping;
        this.bulkShipping = this.managerDetails.shipping;
        this.timezone = this.managerDetails.timezone;
        this.timezoneAbbrev = this.managerDetails.timezoneAbbrev;
      } else if (this.bulkUseDetails === 'above') {
        this.backupBulk = this.bulkShipping;
        this.bulkShipping = this.mainContact;
        this.geoTimezone();
      } else {
        this.bulkShipping = this.backupBulk;
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
        (this.bulkShipping.stateProv && this.bulkShipping.city && this.bulkShipping.country)
      ) {
        this.geoTimezone();
      }

      if (this.bulkUseDetails === 'above') {
        if (target === 'contactEmail') {
          this.bulkShipping.email = this.mainContact.email;
        } else if (target === 'contactName') {
          this.bulkShipping.name = this.mainContact.name;
        } else if (target === 'contactAddress1') {
          this.bulkShipping.address1 = this.mainContact.address1;
        } else if (target === 'contactAddress2') {
          this.bulkShipping.address2 = this.mainContact.address2;
        } else if (target === 'contactCity') {
          this.bulkShipping.city = this.mainContact.city;
          this.geoTimezone();
        } else if (target === 'contactStateProv') {
          this.bulkShipping.stateProv = this.mainContact.stateProv;
          this.geoTimezone();
        } else if (target === 'contactCountry') {
          this.bulkShipping.country = this.mainContact.country;
          this.geoTimezone();
        } else if (target === 'contactZipPostal') {
          this.bulkShipping.zipPostal = this.mainContact.zipPostal;
        }
      }
      let valid = false;
      if (target === 'contactCountry' && this.mainContact.country) {
        codeCountries = this.$refs.contactPhone.codesCountries;
        let countryCode = this.mainContact.country;
        countryCode = countryCode.toUpperCase();
        codeCountries.forEach(country => {
          if (country.iso2 === countryCode) {
            valid = true;
          }
        });

        if (valid) {
          this.$refs.contactPhone.countryCode = countryCode;
        } else {
          this.mainContact.country = '';
          this.$refs.contactCountry.focus();
          this.$toasted.error('Main Contact Country Code Invalid');
        }
      }

      if (target === 'shippingCountry' && this.bulkShipping.country) {
        codeCountries = this.$refs.shippingPhone.codesCountries;
        let countryCode = this.bulkShipping.country;
        countryCode = countryCode.toUpperCase();
        codeCountries.forEach(country => {
          if (country.iso2 === countryCode) {
            valid = true;
          }
        });

        if (valid) {
          this.$refs.shippingPhone.countryCode = countryCode;
        } else {
          this.bulkShipping.country = '';
          this.$refs.shippingCountry.focus();
          this.$toasted.error('Shipping Country Code Invalid');
        }
      }
    },
    copyPhone: function(event) {
      if (this.bulkUseDetails === 'above' && event.phoneNumber) {
        this.bulkShipping.phone = event.phoneNumber;
      }
    },
    geoTimezone: async function() {
      if (
        this.bulkShipping.stateProv !== '' &&
        this.bulkShipping.city !== '' &&
        this.bulkShipping.country !== ''
      ) {
        const location = await this.$http.get(
          `https://www.mapquestapi.com/geocoding/v1/address?key=Psfm8OjiPQikFbEv9jZ7vCbTpD1hAOlm&inFormat=json&outFormat=json&json={"location":{"street":"${this.bulkShipping.city} ${this.bulkShipping.stateProv} ${this.bulkShipping.country}"},"options":{"thumbMaps":false}}`
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
.vue-avatar--wrapper {
  border-radius: 1rem !important;
}

.sidebar {
  flex: 0 0 255px;

  span {
    font-size: 0.8em;
  }

  .placeholderImg {
    border-radius: 1rem;
    background-color: white;
    width: 225px;
    height: 225px;
  }

  .list-group {
    width: 100%;
    overflow: auto;
    max-height: 250px;

    .list-group-item {
      height: 35px;
      padding: 5px 15px;
    }
  }
}

.infoSection {
  form {
    max-width: 800px;
  }
  .form-group {
    margin-bottom: 1px;
  }

  h6 {
    max-width: 800px;
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
  }
}

@media (max-width: 575px) {
  .sidebar {
    flex: none;
  }
}
</style>
