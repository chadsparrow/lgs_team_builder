<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col sidebar-left">
        <div class="row p-1">
          <small class="col-sm-12 text-info">Member Timezone: (uses shipping)</small>
          <span class="col-sm-12">{{ timezone }}</span>
        </div>
      </div>
      <div class="col middle-section">
        <form class="mb-4">
          <div class="section-header bg-secondary mb-2">Contact Information</div>
          <div class="row">
            <div class="form-group col-sm-12">
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
            <div class="form-group col-sm-4">
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
              <input
                id="stateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="stateProv"
                ref="stateProv"
                @change="changeDetails"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="country">Country</label>
              <input
                id="country"
                type="text"
                class="form-control form-control-sm"
                v-model="country"
                maxlength="2"
                ref="country"
                @change="changeDetails"
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
              <label
                class="form-check-label text-white"
                for="billingSame"
              >Use Contact Information for Billing</label>
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
            <div class="form-group col-sm-4">
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
              <input
                id="billingStateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="billingStateProv"
                :readonly="billingSame"
                ref="billingStateProv"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="billingCountry">Billing Country</label>
              <input
                id="billingCountry"
                type="text"
                class="form-control form-control-sm"
                maxlength="2"
                v-model="billingCountry"
                :readonly="billingSame"
                ref="billingCountry"
              />
            </div>
            <div class="form-group col-sm-4">
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
            <div class="form-group col-sm-4">
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
              <input
                id="shippingStateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingStateProv"
                :readonly="shippingSame"
                ref="shippingStateProv"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingCountry">Shipping Country</label>
              <input
                id="shippingCountry"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingCountry"
                maxlength="2"
                :readonly="shippingSame"
                ref="shippingCountry"
              />
            </div>
            <div class="form-group col-sm-4">
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
          <div class="row">
            <div class="col-sm-8">
              <button class="btn btn-block btn-info mb-2" @click.prevent="addMember">
                <i class="fas fa-plus mr-2" style="vertical-align: middle;"></i>Add Member
              </button>
            </div>
            <div class="col-sm-4">
              <router-link to="/dashboard/members/" class="btn btn-block btn-danger">Cancel</router-link>
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
  name: 'MembersAdd',
  components: {
    VuePhoneNumberInput
  },
  data() {
    return {
      name: '',
      email: '',
      address1: '',
      address2: '',
      city: '',
      stateProv: '',
      country: '',
      zipPostal: '',
      phone: '',
      timezone: '',
      timezoneAbbrev: '',
      shippingSame: true,
      shippingName: '',
      shippingAddress1: '',
      shippingAddress2: '',
      shippingCity: '',
      shippingStateProv: '',
      shippingCountry: '',
      shippingZipPostal: '',
      shippingPhone: '',
      shippingEmail: '',
      billingSame: true,
      billingName: '',
      billingAddress1: '',
      billingAddress2: '',
      billingCity: '',
      billingStateProv: '',
      billingCountry: '',
      billingZipPostal: '',
      billingPhone: '',
      billingEmail: ''
    };
  },
  created: async function() {
    try {
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Members',
          link: '/dashboard/members'
        },
        {
          text: 'Add Member',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    addMember: async function() {
      const member = {
        email: this.email,
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

      try {
        await this.$store.dispatch('addMember', member);
        this.$router.push({ name: 'members' });
        this.$toasted.success('Member Added', { icon: 'check-circle' });
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
        if (err.response.data[0].message === 'Member already registered.') {
          this.$refs['email'].value = '';
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
        this.geoTimezone();
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
        this.geoTimezone();
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
        this.geoTimezone();
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
        this.geoTimezone();
      }
    },
    changeDetails: async function(event) {
      const target = event.target.id;
      if (
        target === 'shippingCountry' ||
        target === 'shippingCity' ||
        target === 'shippingStateProv'
      ) {
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
            this.geoTimezone();
            break;
          case 'stateProv':
            this.shippingStateProv = this.stateProv;
            this.geoTimezone();
            break;
          case 'country':
            this.shippingCountry = this.country;
            this.geoTimezone();
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
          case 'stateProv':
            this.billingStateProv = this.stateProv;
            break;
          case 'country':
            this.billingCountry = this.country;
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
