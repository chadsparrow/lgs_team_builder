<template>
  <div class="container">
    <form @submit.prevent="register" novalidate>
      <div class="form-wrapper row">
        <div class="form-title text-center mb-4 col-sm-12">
          <h2 class="text-center">Become a Team Builder</h2>
        </div>
        <div class="left-side col-sm-6">
          <h5>Member Details</h5>
          <div class="form-group row">
            <div class="col-sm-6">
              <label for="email">Email address</label>
              <input
                type="email"
                class="form-control form-control-sm"
                id="email"
                ref="email"
                v-model="email"
                @change="changeDetails"
                autofocus
              />
            </div>
            <div class="col-sm-6">
              <label for="password">Password</label>
              <input
                type="password"
                class="form-control form-control-sm"
                id="password"
                ref="password"
                v-model="password"
              />
            </div>
          </div>

          <div class="form-group row">
            <div class="col-sm-12">
              <label for="name">Full Name</label>
              <input
                id="name"
                class="form-control form-control-sm"
                type="text"
                v-model="name"
                ref="name"
                @change="changeDetails"
              />
            </div>
            <div class="col-sm-12">
              <label for="phone">Phone</label>
              <VuePhoneNumberInput
                v-model="phone"
                id="phone"
                :dark="true"
                default-country-code="CA"
                color="white"
                ref="phone"
                :clearable="true"
                :no-use-browser-locale="true"
                @update="copyPhone"
              />
            </div>
            <div class="col-sm-12">
              <label for="address1">Address 1</label>
              <input
                id="address1"
                class="form-control form-control-sm"
                type="text"
                v-model="address1"
                ref="address1"
                @change="changeDetails"
              />
            </div>
            <div class="col-sm-12">
              <label for="address2">Address 2</label>
              <input
                id="address2"
                class="form-control form-control-sm"
                type="text"
                v-model="address2"
                ref="address2"
                @change="changeDetails"
              />
            </div>
            <div class="col-sm-6">
              <label for="city">City</label>
              <input
                id="city"
                class="form-control form-control-sm"
                type="text"
                v-model="city"
                ref="city"
                @change="changeDetails"
              />
            </div>
            <div class="col-sm-6">
              <label for="stateProv">State/Province</label>
              <input
                id="stateProv"
                class="form-control form-control-sm"
                type="text"
                v-model="stateProv"
                ref="stateProv"
                @change="changeDetails"
              />
            </div>
            <div class="col-sm-6">
              <label for="country">Country</label>
              <input
                id="country"
                class="form-control form-control-sm"
                type="text"
                v-model="country"
                ref="country"
                @change="changeDetails"
              />
            </div>
            <div class="col-sm-6">
              <label for="zipPostal">Zip/Postal</label>
              <input
                id="zipPostal"
                class="form-control form-control-sm"
                type="text"
                v-model="zipPostal"
                ref="zipPostal"
                @change="changeDetails"
              />
            </div>
            <div class="col-sm-9">
              <label for="timezone">Timezone</label>
              <input
                id="timezone"
                class="form-control form-control-sm"
                type="text"
                v-model="timezone"
                ref="timezone"
                readonly
              />
            </div>
            <div class="col-sm-3">
              <label for="timezoneAbbrev">TZ Abbr</label>
              <input
                id="timezoneAbbrev"
                class="form-control form-control-sm"
                type="text"
                v-model="timezoneAbbrev"
                ref="timezoneAbbrev"
                readonly
              />
            </div>
          </div>
        </div>
        <div class="right-side col-sm-6">
          <h5 class="mb-4">Shipping Details</h5>
          <div class="form-group">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="shippingSame"
                v-model="shippingSame"
                @change="copyDetails"
              />
              <label class="form-check-label" for="shippingSame">Use Member details for Shipping</label>
            </div>
          </div>
          <div class="shippingDetails mt-2">
            <div class="form-group row">
              <div class="col-sm-12">
                <label for="shippingName">Full Name</label>
                <input
                  id="shippingName"
                  class="form-control form-control-sm"
                  type="text"
                  v-model="shippingName"
                  ref="shippingName"
                  :readonly="shippingSame === true"
                />
              </div>
              <div class="col-sm-12">
                <label for="shippingPhone">Phone</label>
                <VuePhoneNumberInput
                  v-model="shippingPhone"
                  id="shippingPhone"
                  :dark="true"
                  default-country-code="CA"
                  color="white"
                  ref="shippingPhone"
                  :clearable="true"
                  :no-use-browser-locale="true"
                  v-if="!shippingSame"
                />
                <input
                  v-else
                  type="text"
                  id="shippingPhone"
                  class="form-control form-control-sm"
                  v-model="shippingPhone"
                  ref="shippingPhone"
                  readonly
                />
              </div>
              <div class="col-sm-12">
                <label for="shippingAddress1">Address 1</label>
                <input
                  id="shippingAddress1"
                  class="form-control form-control-sm"
                  type="text"
                  v-model="shippingAddress1"
                  ref="shippingAddress1"
                  :readonly="shippingSame === true"
                />
              </div>
              <div class="col-sm-12">
                <label for="shippingAddress2">Address 2</label>
                <input
                  id="shippingAddress2"
                  class="form-control form-control-sm"
                  type="text"
                  v-model="shippingAddress2"
                  ref="shippingAddress2"
                  :readonly="shippingSame === true"
                />
              </div>
              <div class="col-sm-6">
                <label for="shippingCity">City</label>
                <input
                  id="shippingCity"
                  class="form-control form-control-sm"
                  type="text"
                  v-model="shippingCity"
                  ref="shippingCity"
                  :readonly="shippingSame === true"
                />
              </div>
              <div class="col-sm-6">
                <label for="shippingStateProv">State/Province</label>
                <input
                  id="shippingStateProv"
                  class="form-control form-control-sm"
                  type="text"
                  v-model="shippingStateProv"
                  ref="shippingStateProv"
                  :readonly="shippingSame === true"
                />
              </div>
              <div class="col-sm-6">
                <label for="shippingCountry">Country</label>
                <input
                  id="shippingCountry"
                  class="form-control form-control-sm"
                  type="text"
                  v-model="shippingCountry"
                  ref="shippingCountry"
                  :readonly="shippingSame === true"
                />
              </div>
              <div class="col-sm-6">
                <label for="shippingZipPostal">Zip/Postal</label>
                <input
                  id="shippingZipPostal"
                  class="form-control form-control-sm"
                  type="text"
                  v-model="shippingZipPostal"
                  ref="shippingZipPostal"
                  :readonly="shippingSame === true"
                />
              </div>
              <div class="col-sm-12">
                <label for="shippingEmail">Email</label>
                <input
                  id="shippingEmail"
                  class="form-control form-control-sm"
                  type="text"
                  v-model="shippingEmail"
                  ref="shippingEmail"
                  :readonly="shippingSame === true"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-9 mt-2">
          <button type="submit" class="btn btn-block btn-dark">Register</button>
        </div>
        <div class="col-sm-3 mt-2">
          <router-link tag="a" class="btn btn-danger btn-block" to="/login">Already Registered</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

export default {
  name: 'Register',
  components: {
    VuePhoneNumberInput
  },
  data() {
    return {
      email: undefined,
      password: undefined,
      name: undefined,
      address1: undefined,
      address2: undefined,
      city: undefined,
      stateProv: undefined,
      country: undefined,
      zipPostal: undefined,
      phone: undefined,
      timezone: undefined,
      timezoneAbbrev: undefined,
      shippingSame: true,
      shippingName: undefined,
      shippingAddress1: undefined,
      shippingAddress2: undefined,
      shippingCity: undefined,
      shippingStateProv: undefined,
      shippingCountry: undefined,
      shippingZipPostal: undefined,
      shippingPhone: undefined,
      shippingEmail: undefined
    };
  },
  methods: {
    register: async function() {
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
        shippingName: this.shippingName,
        shippingAddress1: this.shippingAddress1,
        shippingAddress2: this.shippingAddress2,
        shippingCity: this.shippingCity,
        shippingStateProv: this.shippingStateProv,
        shippingCountry: this.shippingCountry,
        shippingZipPostal: this.shippingZipPostal,
        shippingPhone: this.shippingPhone,
        shippingEmail: this.shippingEmail
      };

      try {
        const res = await this.$store.dispatch('register', member);
        this.$toasted.success(res.data[0].message);
        this.$router.push({ name: 'login' });
        this.$toasted.success('Please log in');
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].message);
      }
    },
    copyDetails: function() {
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
        this.shippingName = undefined;
        this.shippingAddress1 = undefined;
        this.shippingAddress2 = undefined;
        this.shippingCity = undefined;
        this.shippingStateProv = undefined;
        this.shippingCountry = undefined;
        this.shippingZipPostal = undefined;
        this.shippingPhone = undefined;
        this.shippingEmail = undefined;
      }
    },
    changeDetails: async function(event) {
      if (event.target.id === 'country') {
        if (
          this.stateProv !== null &&
          this.stateProv !== '' &&
          this.stateProv &&
          this.city &&
          this.city !== null &&
          this.city !== '' &&
          this.country &&
          this.country !== null &&
          this.country !== ''
        ) {
          // GEO CODE on backend to get timezone
          const location = await axios.get(
            `https://www.mapquestapi.com/geocoding/v1/address?key=Psfm8OjiPQikFbEv9jZ7vCbTpD1hAOlm&inFormat=json&outFormat=json&json={"location":{"street":"${this.city} ${this.stateProv} ${this.country}"},"options":{"thumbMaps":false}}`
          );
          if (location) {
            const lat = location.data.results[0].locations[0].latLng.lat;
            const lng = location.data.results[0].locations[0].latLng.lng;
            const response = await axios.get(
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

      if (this.shippingSame) {
        switch (event.target.id) {
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
          case 'stateProv':
            this.shippingStateProv = this.stateProv;
            break;
          case 'country':
            this.shippingCountry = this.country;
            break;
          case 'zipPostal':
            this.shippingZipPostal = this.zipPostal;
            break;
        }
      }
    },
    copyPhone: function(event) {
      if (event.phoneNumber && this.shippingSame) {
        this.shippingPhone = event.phoneNumber;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  margin-bottom: 100px;
  width: 850px;
  background-color: black;
  color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

label {
  font-size: 0.9rem;
  margin-bottom: 0px;
  margin-top: 4px;
  color: #999;
}

.container {
  display: flex;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  justify-content: center;
}

#tbLogo {
  width: 150px;
}
</style>
