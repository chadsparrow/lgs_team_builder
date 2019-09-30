<template>
  <div class="container my-5">
    <h1 class="mb-4 text-center">Become a Team Builder</h1>
    <form class="mb-4">
      <div class="section-header bg-secondary mb-2">Contact Information</div>
      <div class="row">
        <div class="form-group col-sm-6">
          <label for="email">Email/Username</label>
          <input
            id="email"
            type="text"
            class="form-control form-control-sm"
            v-model="email"
            ref="email"
            @change="changeDetails"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            class="form-control form-control-sm"
            v-model="password"
            ref="password"
          />
        </div>
        <div class="form-group col-sm-12">
          <label for="name">Name</label>
          <input
            id="name"
            type="text"
            class="form-control form-control-sm"
            v-model="name"
            ref="name"
            @change="changeDetails"
          />
        </div>

        <div class="form-group col-sm-6">
          <label for="address1">Address 1</label>
          <input
            id="address1"
            type="text"
            class="form-control form-control-sm"
            v-model="address1"
            ref="address1"
            @change="changeDetails"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="address2">Address 2</label>
          <input
            id="address2"
            type="text"
            class="form-control form-control-sm"
            v-model="address2"
            ref="address2"
            @change="changeDetails"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="city">City</label>
          <input
            id="city"
            type="text"
            class="form-control form-control-sm"
            v-model="city"
            ref="city"
            @change="changeDetails"
          />
        </div>
        <div class="form-group col-sm-4">
          <label for="stateProv">State/Province</label>
          <region-select
            id="stateProv"
            v-model="stateProv"
            :country="country"
            :region="stateProv"
            class="form-control form-control-sm"
            @input="checkRegion"
            :regionName="true"
            ref="stateProv"
          />
        </div>
        <div class="form-group col-sm-2">
          <label for="country">Country</label>
          <country-select
            id="country"
            v-model="country"
            :country="country"
            class="form-control form-control-sm"
            @input="checkCountry"
            ref="country"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="zipPostal">Zip/Postal Code</label>
          <input
            id="zipPostal"
            type="text"
            class="form-control form-control-sm"
            v-model="zipPostal"
            ref="zipPostal"
            @change="changeDetails"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="phone">Phone</label>
          <VuePhoneNumberInput
            v-model="phone"
            id="phone"
            :dark="false"
            :preferred-countries="['US', 'CA']"
            ref="phone"
            :clearable="true"
            :no-use-browser-locale="false"
            @update="copyPhone"
          />
        </div>
      </div>
      <div class="section-header my-3 bg-secondary">
        <span class="text-white">Billing Details</span>
        <div class="form-check float-right">
          <input
            type="checkbox"
            class="form-check-input mt-2"
            id="billingSame"
            v-model="billingSame"
            @change="copyMembertoBilling"
            ref="billingSame"
          />
          <label class="form-check-label text-white" for="billingSame"
            >Use Contact Information for Billing</label
          >
        </div>
      </div>
      <div class="row mb-4">
        <div class="form-group col-sm-6">
          <label for="billingName">Billing Name</label>
          <input
            id="billingName"
            type="text"
            class="form-control form-control-sm"
            v-model="billingName"
            :readonly="billingSame"
            ref="billingName"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="billingName">Billing Email</label>
          <input
            id="billingEmail"
            type="text"
            class="form-control form-control-sm"
            v-model="billingEmail"
            :readonly="billingSame"
            ref="billingEmail"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="billingAddress1">Billing Address 1</label>
          <input
            id="billingAddress1"
            type="text"
            class="form-control form-control-sm"
            v-model="billingAddress1"
            :readonly="billingSame"
            ref="billingAddress1"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="billingAddress2">Billing Address 2</label>
          <input
            id="billingAddress2"
            type="text"
            class="form-control form-control-sm"
            v-model="billingAddress2"
            :readonly="billingSame"
            ref="billingAddress2"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="billingCity">Billing City</label>
          <input
            id="billingCity"
            type="text"
            class="form-control form-control-sm"
            v-model="billingCity"
            :readonly="billingSame"
            ref="billingCity"
          />
        </div>
        <div class="form-group col-sm-4">
          <label for="billingStateProv">Billing State/Province</label>
          <region-select
            id="billingStateProv"
            v-model="billingStateProv"
            :country="billingCountry"
            :region="billingStateProv"
            class="form-control form-control-sm"
            :readonly="billingSame"
            :regionName="true"
            ref="billingStateProv"
          />
        </div>
        <div class="form-group col-sm-2">
          <label for="billingCountry">Billing Country</label>
          <country-select
            id="billingCountry"
            v-model="billingCountry"
            :country="billingCountry"
            class="form-control form-control-sm"
            :readonly="billingSame"
            @input="checkBillingCountry"
            ref="billingCountry"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="billingZipPostal">Billing Zip/Postal Code</label>
          <input
            id="billingZipPostal"
            type="text"
            class="form-control form-control-sm"
            v-model="billingZipPostal"
            :readonly="billingSame"
            ref="billingZipPostal"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="billingPhone">Billing Phone</label>
          <input
            type="text"
            id="billingPhone"
            class="form-control form-control-sm"
            v-model="billingPhone"
            ref="billingPhone"
            :readonly="billingSame"
            v-if="billingSame"
          />
          <VuePhoneNumberInput
            v-model="billingPhone"
            id="billingPhone"
            :dark="false"
            :preferred-countries="['US', 'CA']"
            ref="billingPhone"
            :clearable="true"
            :no-use-browser-locale="false"
            v-else
          />
        </div>
      </div>
      <div class="section-header my-3 bg-secondary">
        <span class="text-white">Shipping Details</span>
        <div class="form-check float-right">
          <input
            type="checkbox"
            class="form-check-input mt-2"
            id="shippingSame"
            v-model="shippingSame"
            @change="copyMemberToShipping"
            ref="shippingSame"
          />
          <label class="form-check-label text-white" for="shippingSame"
            >Use Contact Information for Shipping</label
          >
        </div>
      </div>
      <div class="row mb-4">
        <div class="form-group col-sm-6">
          <label for="shippingName">Shipping Name</label>
          <input
            id="shippingName"
            type="text"
            class="form-control form-control-sm"
            v-model="shippingName"
            :readonly="shippingSame"
            ref="shippingName"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="shippingName">Shipping Email</label>
          <input
            id="shippingEmail"
            type="text"
            class="form-control form-control-sm"
            v-model="shippingEmail"
            :readonly="shippingSame"
            ref="shippingEmail"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="shippingAddress1">Shipping Address 1</label>
          <input
            id="shippingAddress1"
            type="text"
            class="form-control form-control-sm"
            v-model="shippingAddress1"
            :readonly="shippingSame"
            ref="shippingAddress1"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="shippingAddress2">Shipping Address 2</label>
          <input
            id="shippingAddress2"
            type="text"
            class="form-control form-control-sm"
            v-model="shippingAddress2"
            :readonly="shippingSame"
            ref="shippingAddress2"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="shippingCity">Shipping City</label>
          <input
            id="shippingCity"
            type="text"
            class="form-control form-control-sm"
            v-model="shippingCity"
            :readonly="shippingSame"
            ref="shippingCity"
          />
        </div>
        <div class="form-group col-sm-4">
          <label for="shippingStateProv">Shipping State/Province</label>
          <region-select
            id="shippingStateProv"
            v-model="shippingStateProv"
            :country="shippingCountry"
            :region="shippingStateProv"
            class="form-control form-control-sm"
            @input="geoTimezone"
            :readonly="shippingSame"
            :regionName="true"
            ref="shippingStateProv"
          />
        </div>
        <div class="form-group col-sm-2">
          <label for="shippingCountry">Shipping Country</label>
          <country-select
            id="shippingCountry"
            v-model="shippingCountry"
            :country="shippingCountry"
            class="form-control form-control-sm"
            @input="checkShippingCountry"
            :readonly="shippingSame"
            ref="shippingCountry"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="shippingZipPostal">Shipping Zip/Postal Code</label>
          <input
            id="shippingZipPostal"
            type="text"
            class="form-control form-control-sm"
            v-model="shippingZipPostal"
            :readonly="shippingSame"
            ref="shippingZipPostal"
          />
        </div>
        <div class="form-group col-sm-6">
          <label for="shippingPhone">Shipping Phone</label>
          <input
            type="text"
            id="shippingPhone"
            class="form-control form-control-sm"
            v-model="shippingPhone"
            ref="shippingPhone"
            :readonly="shippingSame"
            v-if="shippingSame"
          />
          <VuePhoneNumberInput
            v-model="shippingPhone"
            id="shippingPhone"
            :dark="false"
            :preferred-countries="['US', 'CA']"
            ref="shippingPhone"
            :clearable="true"
            :no-use-browser-locale="false"
            v-else
          />
        </div>
      </div>
      <div class="row mb-5">
        <div class="col-sm-8">
          <button class="btn btn-block btn-info" @click.prevent="register">Register</button>
        </div>
        <div class="col-sm-4">
          <router-link to="/login" class="btn btn-block btn-danger">Cancel</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
// import axios from 'axios';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

export default {
  name: 'Register',
  components: {
    VuePhoneNumberInput
  },
  data() {
    return {
      email: '',
      password: '',
      name: '',
      address1: '',
      address2: '',
      city: '',
      stateProv: '',
      country: '',
      zipPostal: '',
      phone: '',
      timezone: '',
      timezoneAbbrev: '',
      billingSame: true,
      billingName: '',
      billingAddress1: '',
      billingAddress2: '',
      billingCity: '',
      billingStateProv: '',
      billingCountry: '',
      billingZipPostal: '',
      billingPhone: '',
      billingEmail: '',
      shippingSame: true,
      shippingName: '',
      shippingAddress1: '',
      shippingAddress2: '',
      shippingCity: '',
      shippingStateProv: '',
      shippingCountry: '',
      shippingZipPostal: '',
      shippingPhone: '',
      shippingEmail: ''
    };
  },
  methods: {
    register: async function() {
      try {
        await this.geoTimezone();
        const member = {
          email: this.email,
          password: this.password,
          name: this.name,
          address1: this.address1,
          address2: this.address2,
          city: this.city,
          stateProv: this.stateProv,
          country: this.country,
          zipPostal: this.zipPostal,
          phone: this.phone,
          timezone: this.timezone,
          timezoneAbbrev: this.timezoneAbbrev,
          shippingSame: this.shippingSame,
          shippingName: this.shippingName,
          shippingAddress1: this.shippingAddress1,
          shippingAddress2: this.shippingAddress2,
          shippingCity: this.shippingCity,
          shippingStateProv: this.shippingStateProv,
          shippingCountry: this.shippingCountry,
          shippingZipPostal: this.shippingZipPostal,
          shippingPhone: this.shippingPhone,
          shippingEmail: this.shippingEmail,
          billingSame: this.billingSame,
          billingName: this.billingName,
          billingAddress1: this.billingAddress1,
          billingAddress2: this.billingAddress2,
          billingCity: this.billingCity,
          billingStateProv: this.billingStateProv,
          billingCountry: this.billingCountry,
          billingZipPostal: this.billingZipPostal,
          billingPhone: this.billingPhone,
          billingEmail: this.billingEmail
        };

        await this.$store.dispatch('register', member);
        this.$router.push({ name: 'login' });
        this.$toasted.success('You are now registered - go ahead and login!', {
          icon: 'check-circle'
        });
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
        if (err.response.data[0].message === 'This email already registered.') {
          this.email = '';
          this.$refs['email'].focus();
        }
      }
    },
    copyMemberToShipping: function() {
      if (this.shippingSame) {
        this.shippingName = this.name;
        this.shippingAddress1 = this.address1;
        this.shippingAddress2 = this.address2;
        this.shippingCity = this.city;
        this.shippingStateProv = this.stateProv;
        this.shippingCountry = this.country;
        this.shippingZipPostal = this.zipPostal;
        this.shippingPhone = this.phone;
        this.shippingEmail = this.email;
      } else {
        this.shippingName = '';
        this.shippingAddress1 = '';
        this.shippingAddress2 = '';
        this.shippingCity = '';
        this.shippingStateProv = '';
        this.shippingCountry = '';
        this.shippingZipPostal = '';
        this.shippingPhone = '';
        this.shippingEmail = '';
      }
    },
    copyMembertoBilling: function() {
      if (this.billingSame) {
        this.billingName = this.name;
        this.billingAddress1 = this.address1;
        this.billingAddress2 = this.address2;
        this.billingCity = this.city;
        this.billingStateProv = this.stateProv;
        this.billingCountry = this.country;
        this.billingZipPostal = this.zipPostal;
        this.billingPhone = this.phone;
        this.billingEmail = this.email;
      } else {
        this.billingName = '';
        this.billingAddress1 = '';
        this.billingAddress2 = '';
        this.billingCity = '';
        this.billingStateProv = '';
        this.billingCountry = '';
        this.billingZipPostal = '';
        this.billingPhone = '';
        this.billingEmail = '';
      }
    },
    changeDetails: async function(event) {
      const target = event.target.id;
      if (target === 'shippingCity') {
        this.geoTimezone();
      }

      if (this.shippingSame) {
        switch (target) {
          case 'email':
            this.shippingEmail = this.email;
            break;
          case 'name':
            this.shippingName = this.name;
            break;
          case 'address1':
            this.shippingAddress1 = this.address1;
            break;
          case 'address2':
            this.shippingAddress2 = this.address2;
            break;
          case 'city':
            this.shippingCity = this.city;
            break;
          case 'zipPostal':
            this.shippingZipPostal = this.zipPostal;
            break;
        }
      }
      if (this.billingSame) {
        switch (target) {
          case 'email':
            this.billingEmail = this.email;
            break;
          case 'name':
            this.billingName = this.name;
            break;
          case 'address1':
            this.billingAddress1 = this.address1;
            break;
          case 'address2':
            this.billingAddress2 = this.address2;
            break;
          case 'city':
            this.billingCity = this.city;
            break;
          case 'zipPostal':
            this.billingZipPostal = this.zipPostal;
            break;
        }
      }
    },
    copyPhone: function(event) {
      if (event.phoneNumber && this.shippingSame) {
        this.shippingPhone = event.phoneNumber;
      }

      if (event.phoneNumber && this.billingSame) {
        this.billingPhone = event.phoneNumber;
      }
    },
    checkRegion: function() {
      if (this.billingSame) {
        this.billingStateProv = this.stateProv;
      }

      if (this.shippingSame) {
        this.shippingStateProv = this.stateProv;
        this.geoTimezone();
      }
    },
    checkCountry: function() {
      this.$refs.phone.countryCode = this.country;
      this.stateProv = '';
      if (this.billingSame) {
        this.billingCountry = this.country;
        this.billingStateProv = '';
      }

      if (this.shippingSame) {
        this.shippingCountry = this.country;
        this.shippingStateProv = '';
      }
    },
    checkBillingCountry: function() {
      this.$refs.billingPhone.countryCode = this.billingCountry;
      this.billingStateProv = '';
    },
    checkShippingCountry: function() {
      this.$refs.shippingPhone.countryCode = this.shippingCountry;
      this.shippingStateProv = '';
    },
    geoTimezone: async function() {
      if (
        this.shippingCity !== '' &&
        this.shippingStateProv !== '' &&
        this.shippingCountry !== ''
      ) {
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
          } else {
            this.timezone = '';
            this.timezoneAbbrev = '';
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
.container {
  max-width: 900px;
}

.form-group {
  margin-top: 0px;
  margin-bottom: 0px;
}

.section-header {
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
}
</style>
