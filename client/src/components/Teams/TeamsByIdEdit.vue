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
          <div class="row p-1">
            <small class="col-sm-12 text-info">Team Since:</small>
            <span class="col-sm-12">
              {{
              createdAt | moment('timezone', timezone, 'MMM Do YYYY / hh:ss a - z')
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
            <!-- TEAM NAME -->
            <div class="input-group input-group-sm mb-3 col-sm-12">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Team Name</span>
              </div>
              <input
                id="name"
                type="text"
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-sm"
                v-model="name"
                ref="name"
                readonly
              />
              <div class="input-group-append">
                <button class="btn btn-info" type="button" id="button-addon2">Change Name</button>
              </div>
            </div>
            <!-- ADMIN SELECTOR -->
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
            <div class="form-group col-sm-4" v-if="member && member.isAdmin">
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
            <label class="col-sm-12 mb-2 text-center bg-secondary p-1 text-white">
              <strong>
                <em>Main Contact</em>
              </strong>
              <div class="form-check text-center">
                <input
                  type="checkbox"
                  class="form-check-input mt-2"
                  id="useManagerDetails"
                  v-model="useManagerDetails"
                  @change="copyManagertoMain"
                  ref="useManagerDetails"
                  :disabled="!managerDetails.memberId"
                />
                <label
                  class="form-check-label text-white"
                  for="useManagerDetails"
                >Use Manager's Contact Info</label>
              </div>
            </label>
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
              <label for="contactCountry">Country</label>
              <input
                id="contactCountry"
                type="text"
                class="form-control form-control-sm"
                v-model="mainContact.country"
                ref="contactCountry"
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
                default-country-code="CA"
                ref="contactPhone"
                :clearable="true"
                :no-use-browser-locale="false"
                @update="copyPhone"
              />
            </div>
          </div>
          <!-- BULK SHIPPING -->
          <div class="row mb-3 mt-3">
            <label class="text-center mb-2 col-sm-12 bg-secondary p-1 text-white">
              <strong>
                <em>Bulk Shipping Details</em>
              </strong>
              <div class="form-check text-center">
                <input
                  type="checkbox"
                  class="form-check-input mt-2"
                  id="bulkUseAboveDetails"
                  v-model="bulkUseAboveDetails"
                  ref="bulkUseAboveDetails"
                  @change="copyMaintoBulk"
                />
                <label
                  class="form-check-label text-white"
                  for="useManagerDetails"
                >Use above details for Bulk Shipping</label>
              </div>
            </label>
            <div class="form-group col-sm-6">
              <label for="shippingName">Shipping Name</label>
              <input
                id="shippingName"
                type="text"
                class="form-control form-control-sm"
                v-model="bulkShipping.name"
                ref="shippingName"
                :readonly="bulkUseAboveDetails"
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
                :readonly="bulkUseAboveDetails"
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
                :readonly="bulkUseAboveDetails"
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
                :readonly="bulkUseAboveDetails"
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
                :readonly="bulkUseAboveDetails"
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
                :readonly="bulkUseAboveDetails"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingCountry">Shipping Country</label>
              <input
                id="shippingCountry"
                type="text"
                class="form-control form-control-sm"
                v-model="bulkShipping.country"
                ref="shippingCountry"
                @change="changeDetails"
                :readonly="bulkUseAboveDetails"
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
                :readonly="bulkUseAboveDetails"
              />
            </div>
            <div class="form-group col-sm-6" v-if="bulkUseAboveDetails">
              <label for="shippingPhone">Shipping Phone</label>
              <input
                id="shippingPhone"
                type="text"
                class="form-control form-control-sm"
                v-model="bulkShipping.phone"
                :readonly="bulkUseAboveDetails"
              />
            </div>
            <div class="form-group col-sm-6" v-else>
              <label for="contactPhone">Phone</label>
              <VuePhoneNumberInput
                v-model="bulkShipping.phone"
                id="shippingPhone"
                :dark="false"
                default-country-code="CA"
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
      managerDetails: {},
      useManagerDetails: false,
      mainContact: {
        memberId: '',
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
      bulkUseAboveDetails: false,
      bulkShipping: {
        memberId: '',
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
      const team = await this.$store.dispatch('getTeam', this.$route.params.id);
      const {
        _id,
        name,
        logo,
        adminId,
        managerId,
        mainContact,
        bulkShipping,
        members,
        timezone,
        timezoneAbbrev,
        createdAt
      } = team.data;

      this.id = _id;
      this.name = name;
      this.logo = logo;
      if (adminId) {
        this.adminId = adminId;
      }

      if (managerId) {
        this.managerId = managerId;
      }
      if (mainContact) {
        this.mainContact.memberId = mainContact.memberId;
        this.mainContact.name = mainContact.name;
        this.mainContact.address1 = mainContact.address1;
        this.mainContact.address2 = mainContact.address2;
        this.mainContact.city = mainContact.city;
        this.mainContact.stateProv = mainContact.stateProv;
        this.mainContact.country = mainContact.country;
        this.mainContact.zipPostal = mainContact.zipPostal;
        this.mainContact.phone = mainContact.phone;
        this.mainContact.email = mainContact.email;
      }
      if (bulkShipping) {
        this.bulkShipping.memberId = bulkShipping.memberId;
        this.bulkShipping.name = bulkShipping.name;
        this.bulkShipping.address1 = bulkShipping.address1;
        this.bulkShipping.address2 = bulkShipping.address2;
        this.bulkShipping.city = bulkShipping.city;
        this.bulkShipping.stateProv = bulkShipping.stateProv;
        this.bulkShipping.country = bulkShipping.country;
        this.bulkShipping.zipPostal = bulkShipping.zipPostal;
        this.bulkShipping.phone = bulkShipping.phone;
        this.bulkShipping.email = bulkShipping.email;
      }
      this.members = members;
      this.timezone = timezone;
      this.timezoneAbbrev = timezoneAbbrev;
      this.createdAt = createdAt;
      const admins = await this.$store.dispatch('getAdmins');
      this.adminsList = admins.data;
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  methods: {
    updateTeam: function(id) {
      // Update Team
    },
    getManagerDetails: async function() {
      try {
        const res = await this.$store.dispatch('getMemberDetails', this.managerId._id);
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
          phone
        } = manager;

        this.managerDetails = {
          memberId: _id,
          name,
          address1,
          address2,
          city,
          stateProv,
          country,
          zipPostal,
          email,
          phone
        };

        if (this.useManagerDetails) this.copyManagertoMain();
        if (this.bulkUseAboveDetails) this.copyMaintoBulk();
      } catch (err) {
        this.$toasted.error(err.response.data[0].message);
      }
    },
    copyManagertoMain: async function() {
      if (this.useManagerDetails) {
        this.backupContact = this.mainContact;
        this.mainContact = this.managerDetails;
      } else {
        this.mainContact = this.backupContact;
      }
    },
    copyMaintoBulk: function() {
      if (this.bulkUseAboveDetails) {
        this.backupBulk = this.bulkShipping;
        this.bulkShipping = this.mainContact;
      } else {
        this.bulkShipping = this.backupBulk;
      }
    },
    changeDetails: async function(event) {
      if (
        (event.target.id === 'shippingCountry' ||
          event.target.id === 'shippingStateProv' ||
          event.target.id === 'shippingCity') &&
        this.bulkUseAboveDetails
      ) {
        if (
          this.bulkShipping.stateProv &&
          (this.bulkShipping.stateProv !== null || this.bulkShipping.stateProv !== '') &&
          (this.bulkShipping.city &&
            (this.bulkShipping.city !== null || this.bulkShipping.city !== '')) &&
          (this.bulkShipping.country &&
            (this.bulkShipping.country !== null || this.bulkShipping.country !== ''))
        ) {
          // GEO CODE on backend to get timezone
          const location = await this.$http.get(
            `https://www.mapquestapi.com/geocoding/v1/address?key=Psfm8OjiPQikFbEv9jZ7vCbTpD1hAOlm&inFormat=json&outFormat=json&json={"location":{"street":"${this.city} ${this.stateProv} ${this.country}"},"options":{"thumbMaps":false}}`
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
        }
      }

      if (this.bulkUseAboveDetails) {
        const target = event.target.id;
        if (target === 'contactEmail') {
          this.bulkShipping.email = this.mainContact.email;
        } else if (target === 'contactname') {
          this.bulkShipping.name = this.mainContact.name;
        } else if (target === 'contactaddress1') {
          this.bulkShipping.address1 = this.mainContact.address1;
        } else if (target === 'contactaddress2') {
          this.bulkShipping.address2 = this.mainContact.address2;
        } else if (target === 'contactcity') {
          this.bulkShipping.city = this.mainContact.city;
        } else if (target === 'contactstateProv') {
          this.bulkShipping.stateProv = this.mainContact.stateProv;
        } else if (target === 'contactcountry') {
          this.bulkShipping.country = this.mainContact.country;
        } else if (target === 'contactzipPostal') {
          this.bulkShipping.zipPostal = this.mainContact.zipPostal;
        }
      }
    },
    copyPhone: function(event) {
      if (this.bulkUseAboveDetails && event.phoneNumber) {
        this.bulkShipping.phone = event.phoneNumber;
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
