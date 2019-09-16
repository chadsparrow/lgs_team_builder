<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col sidebar">
        <div class="row p-1">
          <small class="col-sm-12 text-info">Member Timezone:</small>
          <span class="col-sm-12">{{ timezone }}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Member Role:</small>
          <span class="col-sm-12">{{ isAdmin ? 'Admin' : 'Member' }}</span>
        </div>
        <hr />
        <small class="text-info">Actions</small>
        <button
          class="btn btn-sm btn-block btn-info mt-2"
          @click.prevent="toggleAdmin"
          v-if="!isAdmin"
        >Give Admin Status</button>
        <button
          class="btn btn-sm btn-block btn-info mt-2"
          @click.prevent="toggleAdmin"
          v-else
        >Revoke Admin Status</button>
        <button
          class="btn btn-sm btn-block btn-danger mt-2 mb-4"
          @click.prevent="deleteMember"
        >Delete Member</button>
      </div>
      <div class="col infoSection" v-if="name">
        <form class="mb-5">
          <div class="section-header mb-2 bg-secondary">
            <span class="text-white">Contact Information</span>
          </div>
          <div class="row mb-3">
            <div class="form-group col-sm-6">
              <label for="name">Name</label>
              <input
                id="name"
                type="text"
                class="form-control form-control-sm"
                v-model="name"
                @change="changeDetails"
                ref="name"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                class="form-control form-control-sm"
                v-model="email"
                ref="email"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="address1">Address 1</label>
              <input
                id="address1"
                type="text"
                class="form-control form-control-sm"
                v-model="address1"
                @change="changeDetails"
                ref="address1"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="address2">Address 2</label>
              <input
                id="address2"
                type="text"
                class="form-control form-control-sm"
                ref="address2"
                v-model="address2"
                @change="changeDetails"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="city">City</label>
              <input
                id="city"
                type="text"
                class="form-control form-control-sm"
                v-model="city"
                @change="changeDetails"
                ref="city"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="stateProv">State/Province</label>
              <input
                id="stateProv"
                type="text"
                class="form-control form-control-sm"
                ref="stateProv"
                v-model="stateProv"
                @change="changeDetails"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="country">Country</label>
              <input
                id="country"
                type="text"
                class="form-control form-control-sm"
                ref="country"
                v-model="country"
                @change="changeDetails"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="zipPostal">Zip/Postal Code</label>
              <input
                id="zipPostal"
                type="text"
                class="form-control form-control-sm"
                ref="zipPostal"
                v-model="zipPostal"
                @change="changeDetails"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="phone">Phone</label>
              <VuePhoneNumberInput
                v-model="phone"
                id="phone"
                :dark="false"
                :default-country-code="country || null"
                :preferred-countries="['US', 'CA']"
                ref="phone"
                :clearable="true"
                :no-use-browser-locale="false"
                @update="copyPhone"
              />
            </div>
          </div>
          <div class="section-header my-2 bg-secondary">
            <span class="text-white">Billing Details</span>
            <div class="form-check float-right">
              <input
                type="checkbox"
                class="form-check-input mt-2"
                id="billingSame"
                v-model="billingSame"
                ref="billingSame"
                @change="copyContacttoBilling"
              />
              <label
                class="form-check-label text-white"
                for="billingSame"
              >Use Contact Information for Billing</label>
            </div>
          </div>
          <div class="row mb-3">
            <div class="form-group col-sm-6">
              <label for="billingName">Billing Name</label>
              <input
                id="billingName"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.name"
                ref="billingName"
                :readonly="billingSame"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="billingName">Billing Email</label>
              <input
                id="billingEmail"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.email"
                ref="billingEmail"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="billingAddress1">Billing Address 1</label>
              <input
                id="billingAddress1"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.address1"
                ref="billingAddress1"
                :readonly="billingSame"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="billingAddress2">Billing Address 2</label>
              <input
                id="billingAddress2"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.address2"
                ref="billingAddress2"
                :readonly="billingSame"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="billingCity">Billing City</label>
              <input
                id="billingCity"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.city"
                ref="billingCity"
                :readonly="billingSame"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="billingStateProv">Billing State/Province</label>
              <input
                id="billingStateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.stateProv"
                ref="billingStateProv"
                :readonly="billingSame"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="billingCountry">Billing Country</label>
              <input
                id="billingCountry"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.country"
                ref="billingCountry"
                @change="changeDetails"
                :readonly="billingSame"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="billingZipPostal">Billing Zip/Postal Code</label>
              <input
                id="billingZipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.zipPostal"
                ref="billingZipPostal"
                :readonly="billingSame"
              />
            </div>
            <div class="form-group col-sm-6" v-if="billingSame">
              <label for="billingPhone">Billing Phone</label>
              <input
                id="billingPhone"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.phone"
                ref="billingPhone"
                readonly
              />
            </div>
            <div class="form-group col-sm-6" v-else>
              <label for="billingPhone">Billing Phone</label>
              <VuePhoneNumberInput
                v-model="billing.phone"
                id="billingPhone"
                :dark="false"
                :default-country-code="country || null"
                :preferred-countries="['US', 'CA']"
                ref="billingPhone"
                :clearable="true"
                :no-use-browser-locale="false"
              />
            </div>
          </div>
          <div class="section-header my-2 bg-secondary">
            <span class="text-white">Shipping Details</span>
            <div class="form-check float-right">
              <input
                type="checkbox"
                class="form-check-input mt-2"
                id="shippingSame"
                v-model="shippingSame"
                ref="shippingSame"
                @change="copyContacttoShipping"
              />
              <label
                class="form-check-label text-white"
                for="shippingSame"
              >Use Contact Information for Shipping</label>
            </div>
          </div>
          <div class="row mb-4">
            <div class="form-group col-sm-6">
              <label for="shippingName">Shipping Name</label>
              <input
                id="shippingName"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.name"
                ref="shippingName"
                :readonly="shippingSame"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingName">Shipping Email</label>
              <input
                id="shippingEmail"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.email"
                ref="shippingEmail"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingAddress1">Shipping Address 1</label>
              <input
                id="shippingAddress1"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.address1"
                ref="shippingAddress1"
                :readonly="shippingSame"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingAddress2">Shipping Address 2</label>
              <input
                id="shippingAddress2"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.address2"
                ref="shippingAddress2"
                :readonly="shippingSame"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingCity">Shipping City</label>
              <input
                id="shippingCity"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.city"
                ref="shippingCity"
                @change="changeDetails"
                :readonly="shippingSame"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingStateProv">Shipping State/Province</label>
              <input
                id="shippingStateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.stateProv"
                ref="shippingStateProv"
                @change="changeDetails"
                :readonly="shippingSame"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingCountry">Shipping Country</label>
              <input
                id="shippingCountry"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.country"
                ref="shippingCountry"
                @change="changeDetails"
                :readonly="shippingSame"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingZipPostal">Shipping Zip/Postal Code</label>
              <input
                id="shippingZipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.zipPostal"
                ref="shippingZipPostal"
                :readonly="shippingSame"
              />
            </div>
            <div class="form-group col-sm-6" v-if="shippingSame">
              <label for="shippingPhone">Shipping Phone</label>
              <input
                id="shippingPhone"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.phone"
                ref="shippingPhone"
                :readonly="shippingSame"
              />
            </div>
            <div class="form-group col-sm-6" v-else>
              <label for="shippingPhone">Shipping Phone</label>
              <VuePhoneNumberInput
                v-model="shipping.phone"
                id="shippingPhone"
                :dark="false"
                :preferred-countries="['US', 'CA']"
                ref="shippingPhone"
                :clearable="true"
                :no-use-browser-locale="false"
              />
            </div>
          </div>
          <div class="row my-4">
            <div class="col-sm-6">
              <button class="btn btn-block btn-info" @click="updateMember">Update Member</button>
            </div>
            <div class="col-sm-6">
              <router-link
                :to="`/dashboard/members/${this.id}`"
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
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

export default {
  name: 'MemberByIdEdit',
  components: {
    VuePhoneNumberInput
  },
  data() {
    return {
      id: '',
      timezone: '',
      timezoneAbbrev: '',
      createdAt: '',
      isAdmin: false,
      name: '',
      email: '',
      address1: '',
      address2: '',
      city: '',
      stateProv: '',
      country: '',
      zipPostal: '',
      phone: '',
      shipping: {},
      billing: {},
      shippingSame: false,
      billingSame: false,
      backupBilling: {},
      backupShipping: {}
    };
  },
  computed: {
    breadcrumbs: function() {
      return [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Members',
          link: '/dashboard/members'
        },
        {
          text: `${this.name}`,
          link: `/dashboard/members/${this.id}`
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
      const res = await this.$store.dispatch('getMemberDetails', this.$route.params.id);
      const {
        _id,
        timezone,
        timezoneAbbrev,
        createdAt,
        isAdmin,
        name,
        email,
        address1,
        address2,
        city,
        stateProv,
        country,
        zipPostal,
        phone,
        shipping,
        billing
      } = res.data.member;

      this.id = _id;
      this.timezone = timezone;
      this.timezoneAbbrev = timezoneAbbrev;
      this.createdAt = createdAt;
      this.isAdmin = isAdmin;
      this.name = name;
      this.email = email;
      this.address1 = address1;
      this.address2 = address2;
      this.city = city;
      this.stateProv = stateProv;
      this.country = country;
      this.zipPostal = zipPostal;
      this.phone = phone;
      this.shipping = shipping;
      this.billing = billing;
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  methods: {
    deleteMember: async function() {
      try {
        if (confirm('Are you sure?')) {
          if (confirm('Are you absolutely sure?')) {
            const res = await this.$store.dispatch('deleteMember', this.id);
            this.$toasted.success(res.data[0].message);
            this.$router.push({ name: 'members' });
          }
        }
      } catch (err) {
        this.$toasted.error(err.response.data[0].message);
      }
    },
    toggleAdmin: async function() {
      try {
        if (confirm('Are you sure?')) {
          const res = await this.$store.dispatch('toggleAdmin', this.id);
          this.$toasted.success(res.data[0].message);
          this.isAdmin = !this.isAdmin;
        }
      } catch (err) {
        this.$toasted.error(err.response.data[0].message);
      }
    },
    copyDetails: function() {
      if (this.shippingSame === true) {
        this.shipping.name = this.name;
        this.shipping.address1 = this.address1;
        this.shipping.address2 = this.address2;
        this.shipping.city = this.city;
        this.shipping.stateProv = this.stateProv;
        this.shipping.country = this.country;
        this.shipping.zipPostal = this.zipPostal;
        this.shipping.email = this.email;
        this.geoTimezone();
      }
      if (this.billingSame === true) {
        this.billing.name = this.name;
        this.billing.address1 = this.address1;
        this.billing.address2 = this.address2;
        this.billing.city = this.city;
        this.billing.stateProv = this.stateProv;
        this.billing.country = this.country;
        this.billing.zipPostal = this.zipPostal;
        this.billing.email = this.email;
        this.geoTimezone();
      }
    },
    changeDetails: async function(event) {
      const target = event.target.id;
      if (
        target === 'shippingCity' ||
        target === 'shippingStateProv' ||
        target === 'shippingCountry'
      ) {
        this.geoTimezone();
      }

      if (this.shippingSame) {
        if (target === 'email') {
          this.shipping.email = this.email;
        } else if (target === 'name') {
          this.shipping.name = this.name;
        } else if (target === 'address1') {
          this.shipping.address1 = this.address1;
        } else if (target === 'address2') {
          this.shipping.address2 = this.address2;
        } else if (target === 'city') {
          this.shipping.city = this.city;
          this.geoTimezone();
        } else if (target === 'stateProv') {
          this.shipping.stateProv = this.stateProv;
          this.geoTimezone();
        } else if (target === 'country') {
          this.shipping.country = this.country;
          this.geoTimezone();
        } else if (target === 'zipPostal') {
          this.shipping.zipPostal = this.zipPostal;
        }
      }
      if (this.billingSame) {
        if (target === 'email') {
          this.billing.email = this.email;
        } else if (target === 'name') {
          this.billing.name = this.name;
        } else if (target === 'address1') {
          this.billing.address1 = this.address1;
        } else if (target === 'address2') {
          this.billing.address2 = this.address2;
        } else if (target === 'city') {
          this.billing.city = this.city;
        } else if (target === 'stateProv') {
          this.billing.stateProv = this.stateProv;
        } else if (target === 'country') {
          this.billing.country = this.country;
        } else if (target === 'zipPostal') {
          this.billing.zipPostal = this.zipPostal;
        }
      }

      const codeCountries = this.$refs.phone.codesCountries;
      let valid = false;
      let countryCode = '';

      if (target === 'country' && this.country) {
        countryCode = this.country;
        countryCode = countryCode.toUpperCase();
        codeCountries.forEach(country => {
          if (country.iso2 === countryCode) {
            valid = true;
          }
        });

        if (valid) {
          this.$refs.phone.countryCode = countryCode;
          this.$refs.zipPostal.focus();
        } else {
          this.country = '';
          this.$refs.country.focus();
          this.$toasted.error('Contact Country Code Invalid');
        }
      }

      if (target === 'billingCountry' && this.billing.country) {
        valid = false;
        countryCode = this.billing.country;
        countryCode = countryCode.toUpperCase();
        codeCountries.forEach(country => {
          if (country.iso2 === countryCode) {
            valid = true;
          }
        });

        if (valid) {
          this.$refs.billingPhone.countryCode = countryCode;
          this.$refs.billingZipPostal.focus();
        } else {
          this.billing.country = '';
          this.$refs.billingCountry.focus();
          this.$toasted.error('Billing Country Code Invalid');
        }
      }

      if (target === 'shippingCountry' && this.shipping.country) {
        valid = false;
        countryCode = this.shipping.country;
        countryCode = countryCode.toUpperCase();
        codeCountries.forEach(country => {
          if (country.iso2 === countryCode) {
            valid = true;
          }
        });

        if (valid) {
          this.$refs.shippingPhone.countryCode = countryCode;
          this.$refs.shippingZipPostal.focus();
        } else {
          this.shipping.country = '';
          this.$refs.shippingCountry.focus();
          this.$toasted.error('Shipping Country Code Invalid');
        }
      }
    },
    copyPhone: function(event) {
      if (this.shippingSame && event.phoneNumber) {
        this.shipping.phone = event.phoneNumber;
      }

      if (this.billingSame && event.phoneNumber) {
        this.billing.phone = event.phoneNumber;
      }
    },
    copyContacttoBilling: function() {
      if (this.billingSame) {
        this.backupBilling = this.billing;
        this.billing = {
          name: this.name,
          email: this.email,
          address1: this.address1,
          address2: this.address2,
          city: this.city,
          stateProv: this.stateProv,
          country: this.country,
          zipPostal: this.zipPostal,
          phone: this.phone
        };
      } else {
        this.billing = this.backupBilling;
      }
    },
    copyContacttoShipping: function() {
      if (this.shippingSame) {
        this.backupShipping = this.shipping;
        this.shipping = {
          name: this.name,
          email: this.email,
          address1: this.address1,
          address2: this.address2,
          city: this.city,
          stateProv: this.stateProv,
          country: this.country,
          zipPostal: this.zipPostal,
          phone: this.phone
        };
        this.geoTimezone();
      } else {
        this.shipping = this.backupShipping;
        this.geoTimezone();
      }
    },
    geoTimezone: async function() {
      if (this.shipping.stateProv && this.shipping.city && this.shipping.country) {
        const location = await this.$http.get(
          `https://www.mapquestapi.com/geocoding/v1/address?key=Psfm8OjiPQikFbEv9jZ7vCbTpD1hAOlm&inFormat=json&outFormat=json&json={"location":{"street":"${this.shipping.city} ${this.shipping.stateProv} ${this.shipping.country}"},"options":{"thumbMaps":false}}`
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
          } else {
            this.timezone = '';
            this.timezoneAbbrev = '';
          }
        }
      }
    },
    updateMember: async function() {
      const updatedMember = {
        name: this.name,
        phone: this.phone,
        address1: this.address1,
        address2: this.address2,
        city: this.city,
        stateProv: this.stateProv,
        country: this.country,
        zipPostal: this.zipPostal,
        timezone: this.timezone,
        timezoneAbbrev: this.timezoneAbbrev,
        shippingSame: this.shippingSame,
        shippingName: this.shipping.name,
        shippingAddress1: this.shipping.address1,
        shippingAddress2: this.shipping.address2,
        shippingCity: this.shipping.city,
        shippingStateProv: this.shipping.stateProv,
        shippingCountry: this.shipping.country,
        shippingZipPostal: this.shipping.zipPostal,
        shippingPhone: this.shipping.phone,
        shippingEmail: this.shipping.email,
        billingSame: this.billingSame,
        billingName: this.billing.name,
        billingAddress1: this.billing.address1,
        billingAddress2: this.billing.address2,
        billingCity: this.billing.city,
        billingStateProv: this.billing.stateProv,
        billingCountry: this.billing.country,
        billingZipPostal: this.billing.zipPostal,
        billingPhone: this.billing.phone,
        billingEmail: this.billing.email
      };

      try {
        const res = await this.$store.dispatch('updateMember', {
          updatedMember,
          id: this.id
        });
        this.$toasted.success(res.data[0].message);
        this.$router.push({ name: 'membersById', params: { id: this.id } });
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].message);
      }
    }
  }
};
</script>
