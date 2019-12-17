<template>
  <div v-if="!isLoading">
    <div class="bg-dark headerBlock mb-3">
      <div class="container">
        <div class="row text-white p-4">
          <div class="col-sm-3 text-center">
            <img id="tbLogo" src="/images/assets/tb_logo_white.svg" alt="Team Builder Logo" />
          </div>
          <div class="col-sm-9 text-center">
            <h1>{{ currentTeam.name }} Welcomes You!</h1>
            <small>Please fill in your information to join the team.</small>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <form>
        <div class="row p1 mb-4">
          <div class="form-group col-sm-6">
            <label for="email">Email/Username</label>
            <input
              id="email"
              type="text"
              class="form-control form-control-lg"
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
              class="form-control form-control-lg"
              v-model="password"
              ref="password"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-sm-4 contactInfo mb-2">
            <div class="section-header bg-secondary">Contact</div>
            <div class="row p-1">
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
              <div class="form-group col-sm-12">
                <label for="company">Company</label>
                <input
                  id="company"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="company"
                  ref="company"
                  @change="changeDetails"
                />
              </div>
              <div class="form-group col-sm-12">
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
              <div class="form-group col-sm-12">
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
              <div class="form-group col-sm-12">
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
              <div class="form-group col-sm-6">
                <label for="country">Country</label>
                <country-select
                  id="country"
                  v-model="country"
                  :country="country"
                  class="form-control form-control-sm"
                  @input="checkCountry"
                  ref="country"
                  :usei18n="false"
                />
              </div>
              <div class="form-group col-sm-6">
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
                  :usei18n="false"
                />
              </div>
              <div class="form-group col-sm-12">
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
              <div class="form-group col-sm-12">
                <label for="phone">Phone</label>
                <VuePhoneNumberInput
                  v-model="phone"
                  id="phone"
                  size="sm"
                  :preferred-countries="['US', 'CA']"
                  ref="phone"
                  :clearable="true"
                  :no-use-browser-locale="false"
                  @update="copyPhone"
                />
              </div>
            </div>
          </div>
          <div class="col-sm-4 billingInfo mb-2">
            <div class="section-header bg-secondary">
              <span class="text-white">Billing</span>
              <div class="form-check float-right">
                <input
                  type="checkbox"
                  class="form-check-input mt-2"
                  id="billingSame"
                  v-model="billingSame"
                  @change="copyMembertoBilling"
                  ref="billingSame"
                />
                <small class="form-check-small text-white" for="billingSame">Use Contact</small>
              </div>
            </div>
            <div class="row p-1">
              <div class="form-group col-sm-12">
                <label for="billingName">Name</label>
                <input
                  id="billingName"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="billingName"
                  :readonly="billingSame"
                  ref="billingName"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="billingCompany">Company</label>
                <input
                  id="billingCompany"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="billingCompany"
                  :readonly="billingSame"
                  ref="billingCompany"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="billingEmail">Email</label>
                <input
                  id="billingEmail"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="billingEmail"
                  :readonly="billingSame"
                  ref="billingEmail"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="billingAddress1">Address 1</label>
                <input
                  id="billingAddress1"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="billingAddress1"
                  :readonly="billingSame"
                  ref="billingAddress1"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="billingAddress2">Address 2</label>
                <input
                  id="billingAddress2"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="billingAddress2"
                  :readonly="billingSame"
                  ref="billingAddress2"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="billingCity">City</label>
                <input
                  id="billingCity"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="billingCity"
                  :readonly="billingSame"
                  ref="billingCity"
                />
              </div>
              <div class="form-group col-sm-6">
                <label for="billingCountry">Country</label>
                <country-select
                  id="billingCountry"
                  v-model="billingCountry"
                  :country="billingCountry"
                  class="form-control form-control-sm"
                  :readonly="billingSame"
                  @input="checkBillingCountry"
                  ref="billingCountry"
                  :usei18n="false"
                />
              </div>
              <div class="form-group col-sm-6">
                <label for="billingStateProv">State/Province</label>
                <region-select
                  id="billingStateProv"
                  v-model="billingStateProv"
                  :country="billingCountry"
                  :region="billingStateProv"
                  class="form-control form-control-sm"
                  :readonly="billingSame"
                  :regionName="true"
                  ref="billingStateProv"
                  :usei18n="false"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="billingZipPostal">Zip/Postal Code</label>
                <input
                  id="billingZipPostal"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="billingZipPostal"
                  :readonly="billingSame"
                  ref="billingZipPostal"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="billingPhone">Phone</label>
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
                  size="sm"
                  :preferred-countries="['US', 'CA']"
                  ref="billingPhone"
                  :clearable="true"
                  :no-use-browser-locale="false"
                  v-else
                />
              </div>
            </div>
          </div>
          <div class="col-sm-4 shippingInfo mb-2">
            <div class="section-header bg-secondary">
              <span class="text-white">Shipping</span>
              <div class="form-check float-right">
                <input
                  type="checkbox"
                  class="form-check-input mt-2"
                  id="shippingSame"
                  v-model="shippingSame"
                  @change="copyMemberToShipping"
                  ref="shippingSame"
                />
                <small class="form-check-label text-white" for="shippingSame">Use Contact</small>
              </div>
            </div>
            <div class="row p-1">
              <div class="form-group col-sm-12">
                <label for="shippingName">Name</label>
                <input
                  id="shippingName"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="shippingName"
                  :readonly="shippingSame"
                  ref="shippingName"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="shippingCompany">Company</label>
                <input
                  id="shippingCompany"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="shippingCompany"
                  :readonly="shippingSame"
                  ref="shippingCompany"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="shippingEmail">Email</label>
                <input
                  id="shippingEmail"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="shippingEmail"
                  :readonly="shippingSame"
                  ref="shippingEmail"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="shippingAddress1">Address 1</label>
                <input
                  id="shippingAddress1"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="shippingAddress1"
                  :readonly="shippingSame"
                  ref="shippingAddress1"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="shippingAddress2">Address 2</label>
                <input
                  id="shippingAddress2"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="shippingAddress2"
                  :readonly="shippingSame"
                  ref="shippingAddress2"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="shippingCity">City</label>
                <input
                  id="shippingCity"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="shippingCity"
                  :readonly="shippingSame"
                  ref="shippingCity"
                />
              </div>
              <div class="form-group col-sm-6">
                <label for="shippingCountry">Country</label>
                <country-select
                  id="shippingCountry"
                  v-model="shippingCountry"
                  :country="shippingCountry"
                  class="form-control form-control-sm"
                  @input="checkShippingCountry"
                  :readonly="shippingSame"
                  ref="shippingCountry"
                  :usei18n="false"
                />
              </div>
              <div class="form-group col-sm-6">
                <label for="shippingStateProv">State/Province</label>
                <region-select
                  id="shippingStateProv"
                  v-model="shippingStateProv"
                  :country="shippingCountry"
                  :region="shippingStateProv"
                  class="form-control form-control-sm"
                  :readonly="shippingSame"
                  :regionName="true"
                  ref="shippingStateProv"
                  :usei18n="false"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="shippingZipPostal">Zip/Postal Code</label>
                <input
                  id="shippingZipPostal"
                  type="text"
                  class="form-control form-control-sm"
                  v-model="shippingZipPostal"
                  :readonly="shippingSame"
                  ref="shippingZipPostal"
                />
              </div>
              <div class="form-group col-sm-12">
                <label for="shippingPhone">Phone</label>
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
                  size="sm"
                  :preferred-countries="['US', 'CA']"
                  ref="shippingPhone"
                  :clearable="true"
                  :no-use-browser-locale="false"
                  v-else
                />
              </div>
            </div>
          </div>
        </div>
        <div class="row mb-5 mt-2">
          <div class="col-sm-8 mb-2">
            <button class="btn btn-block btn-info" @click.prevent="register">Join Team</button>
          </div>
          <div class="col-sm-4">
            <router-link to="/login" class="btn btn-block btn-danger">Cancel</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import { mapGetters } from 'vuex';

export default {
  name: 'JoinTeam',
  components: {
    VuePhoneNumberInput
  },
  data() {
    return {
      email: '',
      password: '',
      name: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      stateProv: '',
      country: '',
      zipPostal: '',
      phone: '',
      billingSame: true,
      billingName: '',
      billingCompany: '',
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
      shippingCompany: '',
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
  created: async function() {
    try {
      this.$store.commit('LOADING_TRUE');
      await this.$store.dispatch('getTeamForRegister', this.$route.params.id);
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      this.$store.commit('LOADING_FALSE');
    }
  },
  computed: {
    ...mapGetters(['currentTeam', 'isLoading'])
  },
  methods: {
    register: async function() {
      try {
        const member = {
          email: this.email,
          password: this.password,
          name: this.name,
          company: this.company,
          address1: this.address1,
          address2: this.address2,
          city: this.city,
          stateProv: this.stateProv,
          country: this.country,
          zipPostal: this.zipPostal,
          phone: this.phone,
          shippingSame: this.shippingSame,
          shippingName: this.shippingName,
          shippingCompany: this.shippingCompany,
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
          billingCompany: this.billingCompany,
          billingAddress1: this.billingAddress1,
          billingAddress2: this.billingAddress2,
          billingCity: this.billingCity,
          billingStateProv: this.billingStateProv,
          billingCountry: this.billingCountry,
          billingZipPostal: this.billingZipPostal,
          billingPhone: this.billingPhone,
          billingEmail: this.billingEmail
        };

        await this.$store.dispatch('joinTeam', { member, teamId: this.currentTeam._id });
        this.$router.push({ name: 'home' });
        this.$toasted.success('You are now registered - go ahead and login!', {
          icon: 'check-circle'
        });
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
        if (err.response.data[0].message === 'Member already registered.') {
          this.email = '';
          this.$refs['email'].focus();
        }
      }
    },
    copyMemberToShipping: function() {
      if (this.shippingSame) {
        this.shippingName = this.name;
        this.shippingCompany = this.company;
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
        this.shippingCompany = '';
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
        this.billingCompany = this.company;
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
        this.billingCompany = '';
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

      if (this.shippingSame) {
        switch (target) {
          case 'email':
            this.shippingEmail = this.email;
            break;
          case 'name':
            this.shippingName = this.name;
            break;
          case 'company':
            this.shippingCompany = this.company;
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
          case 'company':
            this.billingCompany = this.company;
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
      }
    },
    checkCountry: function() {
      this.$refs.phone.countryCode = this.country;
      this.stateProv = '';
      this.$refs.stateProv.$el.focus();
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
      this.$refs.billingStateProv.$el.focus();
    },
    checkShippingCountry: function() {
      this.$refs.shippingPhone.countryCode = this.shippingCountry;
      this.shippingStateProv = '';
      this.$refs.billingStateProv.$el.focus();
    }
  }
};
</script>

<style lang="scss" scoped>
.form-group {
  margin-top: 0px;
  margin-bottom: 0px;
}

.section-header {
  color: $white-text;
  padding: 0.5rem;
  border-radius: 4px;
}

#tbLogo {
  width: 200px;
}
</style>
