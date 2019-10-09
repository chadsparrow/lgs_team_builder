<template>
  <div class="page">
    <div class="sidebar-left" v-if="memberDetails && memberDetails.name">
      <div class="row p-1">
        <small class="col-sm-12 text-info">Your Timezone:</small>
        <span class="col-sm-12">{{ memberDetails.timezone }}</span>
        <span class="col-sm-12 text-muted timezoneHelp">Calculated using Shipping Details</span>
      </div>
      <hr />
      <div class="row">
        <span class="col-sm-12 text-danger">
          <strong>
            <em>** Important Notice **</em>
          </strong>
        </span>
        <small
          class="col-sm-12 mt-2 text-muted"
        >Changes to your profile will only update shipping details for orders that have not been processed, or for stores that are currently open.</small>
        <small
          class="col-sm-12 mt-2 text-muted"
        >Your shipping information will stay the same for already processed orders or stores that are closed as they were recorded at that time.</small>
      </div>
    </div>
    <div class="middle-section" v-if="memberDetails && memberDetails.name">
      <form>
        <div class="row">
          <div class="contactSection col-sm-4">
            <div class="section-header bg-secondary">
              <span class="text-white">Contact</span>
            </div>
            <div class="row">
              <div class="form-group col-sm-12">
                <label for="name">Name</label>
                <input
                  id="name"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.name"
                  @change="changeDetails"
                  ref="name"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="email">Email</label>
                <input
                  id="email"
                  type="email"
                  class="form-control form-control-sm"
                  v-model="memberDetails.email"
                  ref="email"
                  readonly
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="address1">Address 1</label>
                <input
                  id="address1"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.address1"
                  @change="changeDetails"
                  ref="address1"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="address2">Address 2</label>
                <input
                  id="address2"
                  type="text"
                  class="form-control form-control-sm"
                  ref="address2"
                  v-model="memberDetails.address2"
                  @change="changeDetails"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="city">City</label>
                <input
                  id="city"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.city"
                  @change="changeDetails"
                  ref="city"
                />
              </div>
              <div class="form-group col-sm-6">
                <label for="country">Country</label>
                <country-select
                  id="country"
                  v-model="memberDetails.country"
                  :country="memberDetails.country"
                  class="form-control form-control-sm"
                  @input="checkCountry"
                  ref="country"
                />
              </div>
              <div class="form-group col-sm-6">
                <label for="stateProv">State/Province</label>
                <region-select
                  id="stateProv"
                  v-model="memberDetails.stateProv"
                  :country="memberDetails.country"
                  :region="memberDetails.stateProv"
                  class="form-control form-control-sm"
                  @input="checkRegion"
                  :regionName="true"
                  ref="stateProv"
                />
              </div>

              <div class="form-group col-sm-12">
                <label for="zipPostal">Zip/Postal Code</label>
                <input
                  id="zipPostal"
                  type="text"
                  class="form-control form-control-sm"
                  ref="zipPostal"
                  v-model="memberDetails.zipPostal"
                  @change="changeDetails"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="phone">Phone</label>
                <VuePhoneNumberInput
                  v-model="memberDetails.phone"
                  id="phone"
                  :dark="false"
                  :default-country-code="memberDetails.country || null"
                  :preferred-countries="['US', 'CA']"
                  ref="phone"
                  :clearable="true"
                  :no-use-browser-locale="false"
                  @update="copyPhone"
                />
              </div>
            </div>
          </div>
          <div class="billingSection col-sm-4">
            <div class="section-header bg-secondary">
              <span class="text-white">Billing</span>
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="billingSame"
                  v-model="billingSame"
                  ref="billingSame"
                  @change="copyContacttoBilling"
                />
                <small class="form-check-label text-white" for="billingSame">Use Contact</small>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-sm-12">
                <label for="billingName">Name</label>
                <input
                  id="billingName"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.billing.name"
                  ref="billingName"
                  :readonly="billingSame"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="billingName">Email</label>
                <input
                  id="billingEmail"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.billing.email"
                  ref="billingEmail"
                  readonly
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="billingAddress1">Address 1</label>
                <input
                  id="billingAddress1"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.billing.address1"
                  ref="billingAddress1"
                  :readonly="billingSame"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="billingAddress2">Address 2</label>
                <input
                  id="billingAddress2"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.billing.address2"
                  ref="billingAddress2"
                  :readonly="billingSame"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="billingCity">City</label>
                <input
                  id="billingCity"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.billing.city"
                  ref="billingCity"
                  :readonly="billingSame"
                />
              </div>
              <div class="form-group col-sm-6">
                <label for="billingCountry">Country</label>
                <country-select
                  id="billingCountry"
                  v-model="memberDetails.billing.country"
                  :country="memberDetails.billing.country"
                  class="form-control form-control-sm"
                  :readonly="billingSame"
                  @input="checkBillingCountry"
                  ref="billingCountry"
                />
              </div>
              <div class="form-group col-sm-6">
                <label for="billingStateProv">State/Province</label>
                <region-select
                  id="billingStateProv"
                  v-model="memberDetails.billing.stateProv"
                  :country="memberDetails.billing.country"
                  :region="memberDetails.billing.stateProv"
                  class="form-control form-control-sm"
                  :readonly="billingSame"
                  :regionName="true"
                  ref="billingStateProv"
                />
              </div>

              <div class="form-group col-sm-12">
                <label for="billingZipPostal">Zip/Postal Code</label>
                <input
                  id="billingZipPostal"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.billing.zipPostal"
                  ref="billingZipPostal"
                  :readonly="billingSame"
                />
              </div>
              <div class="form-group col-sm-12" v-if="billingSame">
                <label for="billingPhone">Phone</label>
                <input
                  id="billingPhone"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.billing.phone"
                  ref="billingPhone"
                  readonly
                />
              </div>
              <div class="form-group col-sm-12" v-else>
                <label for="billingPhone">Phone</label>
                <VuePhoneNumberInput
                  v-model="memberDetails.billing.phone"
                  id="billingPhone"
                  :dark="false"
                  :default-country-code="memberDetails.billing.country || null"
                  :preferred-countries="['US', 'CA']"
                  ref="billingPhone"
                  :clearable="true"
                  :no-use-browser-locale="false"
                />
              </div>
            </div>
          </div>
          <div class="shippingSection col-sm-4">
            <div class="section-header bg-secondary">
              <span class="text-white">Shipping</span>
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="shippingSame"
                  v-model="shippingSame"
                  ref="shippingSame"
                  @change="copyContacttoShipping"
                />
                <small class="form-check-label text-white" for="shippingSame">Use Contact</small>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-sm-12">
                <label for="shippingName">Name</label>
                <input
                  id="shippingName"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.shipping.name"
                  ref="shippingName"
                  :readonly="shippingSame"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="shippingName">Email</label>
                <input
                  id="shippingEmail"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.shipping.email"
                  ref="shippingEmail"
                  readonly
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="shippingAddress1">Address 1</label>
                <input
                  id="shippingAddress1"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.shipping.address1"
                  ref="shippingAddress1"
                  :readonly="shippingSame"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="shippingAddress2">Address 2</label>
                <input
                  id="shippingAddress2"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.shipping.address2"
                  ref="shippingAddress2"
                  :readonly="shippingSame"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="shippingCity">City</label>
                <input
                  id="shippingCity"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.shipping.city"
                  ref="shippingCity"
                  @change="changeDetails"
                  :readonly="shippingSame"
                />
              </div>
              <div class="form-group col-sm-6">
                <label for="shippingCountry">Country</label>
                <country-select
                  id="shippingCountry"
                  v-model="memberDetails.shipping.country"
                  :country="memberDetails.shipping.country"
                  class="form-control form-control-sm"
                  @input="checkShippingCountry"
                  :readonly="shippingSame"
                  ref="shippingCountry"
                />
              </div>
              <div class="form-group col-sm-6">
                <label for="shippingStateProv">State/Province</label>
                <region-select
                  id="shippingStateProv"
                  v-model="memberDetails.shipping.stateProv"
                  :country="memberDetails.shipping.country"
                  :region="memberDetails.shipping.stateProv"
                  class="form-control form-control-sm"
                  @input="geoTimezone"
                  :readonly="shippingSame"
                  :regionName="true"
                  ref="shippingStateProv"
                />
              </div>

              <div class="form-group col-sm-12">
                <label for="shippingZipPostal">Zip/Postal Code</label>
                <input
                  id="shippingZipPostal"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.shipping.zipPostal"
                  ref="shippingZipPostal"
                  :readonly="shippingSame"
                />
              </div>
              <div class="form-group col-sm-12" v-if="shippingSame">
                <label for="shippingPhone">Phone</label>
                <input
                  id="shippingPhone"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="memberDetails.shipping.phone"
                  ref="shippingPhone"
                  :readonly="shippingSame"
                />
              </div>
              <div class="form-group col-sm-12" v-else>
                <label for="shippingPhone">Phone</label>
                <VuePhoneNumberInput
                  v-model="memberDetails.shipping.phone"
                  id="shippingPhone"
                  :dark="false"
                  :default-country-code="memberDetails.shipping.country || null"
                  :preferred-countries="['US', 'CA']"
                  ref="shippingPhone"
                  :clearable="true"
                  :no-use-browser-locale="false"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row my-3">
          <div class="col-sm-8">
            <button class="btn btn-block btn-info" @click.prevent="updateProfile">Update Profile</button>
          </div>
          <div class="col-sm-4">
            <router-link to="/dashboard/profile" class="btn btn-block btn-danger">Cancel</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import Switches from 'vue-switches';

export default {
  name: 'ProfilesEdit',
  components: {
    VuePhoneNumberInput,
    Switches
  },
  data() {
    return {
      shippingSame: false,
      billingSame: false,
      backupBilling: {},
      backupShipping: {},
      memberDetails: {}
    };
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    },
    invitesDisabled: function() {}
  },
  created: async function() {
    try {
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'My Profile',
          link: '/dashboard/profile'
        },
        {
          text: 'Edit',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      const res = await this.$store.dispatch('getMemberDetails', this.member._id);
      this.memberDetails = res.data.member;
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    copyDetails: function() {
      if (this.shippingSame === true) {
        this.memberDetails.shipping.name = this.memberDetails.name;
        this.memberDetails.shipping.address1 = this.memberDetails.address1;
        this.memberDetails.shipping.address2 = this.memberDetails.address2;
        this.memberDetails.shipping.city = this.memberDetails.city;
        this.memberDetails.shipping.stateProv = this.memberDetails.stateProv;
        this.memberDetails.shipping.country = this.memberDetails.country;
        this.memberDetails.shipping.zipPostal = this.memberDetails.zipPostal;
        this.memberDetails.shipping.email = this.memberDetails.email;
        this.geoTimezone();
      }
      if (this.billingSame === true) {
        this.memberDetails.billing.name = this.memberDetails.name;
        this.memberDetails.billing.address1 = this.memberDetails.address1;
        this.memberDetails.billing.address2 = this.memberDetails.address2;
        this.memberDetails.billing.city = this.memberDetails.city;
        this.memberDetails.billing.stateProv = this.memberDetails.stateProv;
        this.memberDetails.billing.country = this.memberDetails.country;
        this.memberDetails.billing.zipPostal = this.memberDetails.zipPostal;
        this.memberDetails.billing.email = this.memberDetails.email;
        this.geoTimezone();
      }
    },
    changeDetails: async function(event) {
      const target = event.target.id;
      if (target === 'shippingCity') {
        this.geoTimezone();
      }

      if (this.shippingSame) {
        if (target === 'email') {
          this.memberDetails.shipping.email = this.memberDetails.email;
        } else if (target === 'name') {
          this.memberDetails.shipping.name = this.memberDetails.name;
        } else if (target === 'address1') {
          this.memberDetails.shipping.address1 = this.memberDetails.address1;
        } else if (target === 'address2') {
          this.memberDetails.shipping.address2 = this.memberDetails.address2;
        } else if (target === 'city') {
          this.memberDetails.shipping.city = this.memberDetails.city;
          this.geoTimezone();
        } else if (target === 'zipPostal') {
          this.memberDetails.shipping.zipPostal = this.memberDetails.zipPostal;
        }
      }
      if (this.billingSame) {
        if (target === 'email') {
          this.memberDetails.billing.email = this.memberDetails.email;
        } else if (target === 'name') {
          this.memberDetails.billing.name = this.memberDetails.name;
        } else if (target === 'address1') {
          this.memberDetails.billing.address1 = this.memberDetails.address1;
        } else if (target === 'address2') {
          this.memberDetails.billing.address2 = this.memberDetails.address2;
        } else if (target === 'city') {
          this.memberDetails.billing.city = this.memberDetails.city;
        } else if (target === 'zipPostal') {
          this.memberDetails.billing.zipPostal = this.memberDetails.zipPostal;
        }
      }
    },
    copyPhone: function(event) {
      if (this.shippingSame && event.phoneNumber) {
        this.memberDetails.shipping.phone = event.phoneNumber;
      }

      if (this.billingSame && event.phoneNumber) {
        this.memberDetails.billing.phone = event.phoneNumber;
      }
    },
    copyContacttoBilling: function() {
      if (this.billingSame) {
        this.backupBilling = this.memberDetails.billing;
        this.memberDetails.billing = {
          name: this.memberDetails.name,
          email: this.memberDetails.email,
          address1: this.memberDetails.address1,
          address2: this.memberDetails.address2,
          city: this.memberDetails.city,
          stateProv: this.memberDetails.stateProv,
          country: this.memberDetails.country,
          zipPostal: this.memberDetails.zipPostal,
          phone: this.memberDetails.phone
        };
      } else {
        this.memberDetails.billing = this.backupBilling;
      }
    },
    copyContacttoShipping: function() {
      if (this.shippingSame) {
        this.backupShipping = this.memberDetails.shipping;
        this.memberDetails.shipping = {
          name: this.memberDetails.name,
          email: this.memberDetails.email,
          address1: this.memberDetails.address1,
          address2: this.memberDetails.address2,
          city: this.memberDetails.city,
          stateProv: this.memberDetails.stateProv,
          country: this.memberDetails.country,
          zipPostal: this.memberDetails.zipPostal,
          phone: this.memberDetails.phone
        };
        this.geoTimezone();
      } else {
        this.memberDetails.shipping = this.backupShipping;
        this.geoTimezone();
      }
    },
    checkRegion: function() {
      if (this.billingSame) {
        this.memberDetails.billing.stateProv = this.memberDetails.stateProv;
      }

      if (this.shippingSame) {
        this.memberDetails.shipping.stateProv = this.memberDetails.stateProv;
        this.geoTimezone();
      }
    },
    checkCountry: function() {
      this.$refs.phone.countryCode = this.memberDetails.country;
      this.memberDetails.stateProv = '';
      if (this.billingSame) {
        this.memberDetails.billing.country = this.memberDetails.country;
        this.memberDetails.billing.stateProv = '';
      }

      if (this.shippingSame) {
        this.memberDetails.shipping.country = this.memberDetails.country;
        this.memberDetails.shipping.stateProv = '';
      }
    },
    checkBillingCountry: function() {
      this.$refs.billingPhone.countryCode = this.memberDetails.billing.country;
      this.memberDetails.billing.stateProv = '';
    },
    checkShippingCountry: function() {
      this.$refs.shippingPhone.countryCode = this.memberDetails.shipping.country;
      this.memberDetails.shipping.stateProv = '';
    },
    geoTimezone: async function() {
      if (
        this.memberDetails.shipping.stateProv &&
        this.memberDetails.shipping.city &&
        this.memberDetails.shipping.country
      ) {
        const location = await this.$http.get(
          `https://www.mapquestapi.com/geocoding/v1/address?key=Psfm8OjiPQikFbEv9jZ7vCbTpD1hAOlm&inFormat=json&outFormat=json&json={"location":{"street":"${this.memberDetails.shipping.city} ${this.memberDetails.shipping.stateProv} ${this.memberDetails.shipping.country}"},"options":{"thumbMaps":false}}`
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
            this.memberDetails.timezone = response.data.zoneName;
            this.memberDetails.timezoneAbbrev = response.data.abbreviation;
          } else {
            this.memberDetails.timezone = '';
            this.memberDetails.timezoneAbbrev = '';
          }
        }
      }
    },
    updateProfile: async function() {
      const updatedMember = {
        name: this.memberDetails.name,
        phone: this.memberDetails.phone,
        address1: this.memberDetails.address1,
        address2: this.memberDetails.address2,
        city: this.memberDetails.city,
        stateProv: this.memberDetails.stateProv,
        country: this.memberDetails.country,
        zipPostal: this.memberDetails.zipPostal,
        timezone: this.memberDetails.timezone,
        timezoneAbbrev: this.memberDetails.timezoneAbbrev,
        shippingSame: this.shippingSame,
        shippingName: this.memberDetails.shipping.name,
        shippingAddress1: this.memberDetails.shipping.address1,
        shippingAddress2: this.memberDetails.shipping.address2,
        shippingCity: this.memberDetails.shipping.city,
        shippingStateProv: this.memberDetails.shipping.stateProv,
        shippingCountry: this.memberDetails.shipping.country,
        shippingZipPostal: this.memberDetails.shipping.zipPostal,
        shippingPhone: this.memberDetails.shipping.phone,
        shippingEmail: this.memberDetails.shipping.email,
        billingSame: this.billingSame,
        billingName: this.memberDetails.billing.name,
        billingAddress1: this.memberDetails.billing.address1,
        billingAddress2: this.memberDetails.billing.address2,
        billingCity: this.memberDetails.billing.city,
        billingStateProv: this.memberDetails.billing.stateProv,
        billingCountry: this.memberDetails.billing.country,
        billingZipPostal: this.memberDetails.billing.zipPostal,
        billingPhone: this.memberDetails.billing.phone,
        billingEmail: this.memberDetails.billing.email
      };

      try {
        const res = await this.$store.dispatch('updateMember', {
          updatedMember,
          id: this.member._id
        });
        this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
        this.$router.push({ name: 'profile' });
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

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
  grid-template-areas: 'sidebar-left middle-section';
}
</style>
