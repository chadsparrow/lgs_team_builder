<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col sidebar-left" v-if="member && member.name">
        <div class="row p-1">
          <small class="col-sm-12 text-info">Member Timezone:</small>
          <span class="col-sm-12">{{ member.timezone }}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Member Role:</small>
          <span class="col-sm-12">{{ member.isAdmin ? 'Admin' : 'Member' }}</span>
        </div>
        <hr />
        <small class="text-info">Actions</small>
        <button
          class="btn btn-sm btn-block btn-info mt-2"
          @click.prevent="toggleAdmin"
          v-if="!member.isAdmin"
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
      <div class="col middle-section" v-if="member && member.name">
        <form class="mb-5">
          <div class="section-header mb-2 bg-secondary">
            <span class="text-white">Contact Information</span>
          </div>
          <div class="row mb-3 px-2">
            <div class="form-group col-sm-6">
              <label for="name">Name</label>
              <input
                id="name"
                type="text"
                class="form-control form-control-sm"
                v-model="member.name"
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
                v-model="member.email"
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
                v-model="member.address1"
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
                v-model="member.address2"
                @change="changeDetails"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="city">City</label>
              <input
                id="city"
                type="text"
                class="form-control form-control-sm"
                v-model="member.city"
                @change="changeDetails"
                ref="city"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="stateProv">State/Province</label>
              <region-select
                id="stateProv"
                v-model="member.stateProv"
                :country="member.country"
                :region="member.stateProv"
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
                v-model="member.country"
                :country="member.country"
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
                ref="zipPostal"
                v-model="member.zipPostal"
                @change="changeDetails"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="phone">Phone</label>
              <VuePhoneNumberInput
                v-model="member.phone"
                id="phone"
                :dark="false"
                :default-country-code="member.country || null"
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
            <div class="form-check">
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
          <div class="row mb-3 px-2">
            <div class="form-group col-sm-6">
              <label for="billingName">Billing Name</label>
              <input
                id="billingName"
                type="text"
                class="form-control form-control-sm"
                v-model="member.billing.name"
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
                v-model="member.billing.email"
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
                v-model="member.billing.address1"
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
                v-model="member.billing.address2"
                ref="billingAddress2"
                :readonly="billingSame"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="billingCity">Billing City</label>
              <input
                id="billingCity"
                type="text"
                class="form-control form-control-sm"
                v-model="member.billing.city"
                ref="billingCity"
                :readonly="billingSame"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="billingStateProv">Billing State/Province</label>
              <region-select
                id="billingStateProv"
                v-model="member.billing.stateProv"
                :country="member.billing.country"
                :region="member.billing.stateProv"
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
                v-model="member.billing.country"
                :country="member.billing.country"
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
                v-model="member.billing.zipPostal"
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
                v-model="member.billing.phone"
                ref="billingPhone"
                readonly
              />
            </div>
            <div class="form-group col-sm-6" v-else>
              <label for="billingPhone">Billing Phone</label>
              <VuePhoneNumberInput
                v-model="member.billing.phone"
                id="billingPhone"
                :dark="false"
                :default-country-code="member.billing.country || null"
                :preferred-countries="['US', 'CA']"
                ref="billingPhone"
                :clearable="true"
                :no-use-browser-locale="false"
              />
            </div>
          </div>
          <div class="section-header my-2 bg-secondary">
            <span class="text-white">Shipping Details</span>
            <div class="form-check">
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
          <div class="row mb-4 px-2">
            <div class="form-group col-sm-6">
              <label for="shippingName">Shipping Name</label>
              <input
                id="shippingName"
                type="text"
                class="form-control form-control-sm"
                v-model="member.shipping.name"
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
                v-model="member.shipping.email"
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
                v-model="member.shipping.address1"
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
                v-model="member.shipping.address2"
                ref="shippingAddress2"
                :readonly="shippingSame"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingCity">Shipping City</label>
              <input
                id="shippingCity"
                type="text"
                class="form-control form-control-sm"
                v-model="member.shipping.city"
                ref="shippingCity"
                @change="changeDetails"
                :readonly="shippingSame"
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingStateProv">Shipping State/Province</label>
              <region-select
                id="shippingStateProv"
                v-model="member.shipping.stateProv"
                :country="member.shipping.country"
                :region="member.shipping.stateProv"
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
                v-model="member.shipping.country"
                :country="member.shipping.country"
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
                v-model="member.shipping.zipPostal"
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
                v-model="member.shipping.phone"
                ref="shippingPhone"
                :readonly="shippingSame"
              />
            </div>
            <div class="form-group col-sm-6" v-else>
              <label for="shippingPhone">Shipping Phone</label>
              <VuePhoneNumberInput
                v-model="member.shipping.phone"
                id="shippingPhone"
                :dark="false"
                :default-country-code="member.shipping.country || null"
                :preferred-countries="['US', 'CA']"
                ref="shippingPhone"
                :clearable="true"
                :no-use-browser-locale="false"
              />
            </div>
          </div>
          <div class="row my-4">
            <div class="col-sm-6">
              <button class="btn btn-block btn-info" @click.prevent="updateMember">Update Member</button>
            </div>
            <div class="col-sm-6">
              <router-link
                :to="`/dashboard/members/${this.member._id}`"
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
      shippingSame: false,
      billingSame: false,
      backupBilling: {},
      backupShipping: {}
    };
  },
  computed: {
    memberDetails: function() {
      return this.$store.getters.getMember;
    },
    member: function() {
      if (this.memberDetails) return this.memberDetails.member;
    },
    teams: function() {
      if (this.memberDetails) return this.memberDetails.teams;
    }
  },
  created: async function() {
    try {
      const res = await this.$store.dispatch('getMemberDetails', this.$route.params.id);
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Members',
          link: '/dashboard/members'
        },
        {
          text: `${this.member.name}`,
          link: `/dashboard/members/${this.member._id}`
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
    deleteMember: async function() {
      try {
        if (confirm('Are you sure?')) {
          if (confirm('Are you absolutely sure?')) {
            const res = await this.$store.dispatch('deleteMember', this.member._id);
            this.$toasted.success(res.data[0].message);
            this.$router.push({ name: 'members' });
          }
        }
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    toggleAdmin: async function() {
      try {
        if (confirm('Are you sure?')) {
          const res = await this.$store.dispatch('toggleAdmin', this.member._id);
          this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
          this.member.isAdmin = !this.member.isAdmin;
        }
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    copyDetails: function() {
      if (this.shippingSame === true) {
        this.member.shipping.name = this.member.name;
        this.member.shipping.address1 = this.member.address1;
        this.member.shipping.address2 = this.member.address2;
        this.member.shipping.city = this.member.city;
        this.member.shipping.stateProv = this.member.stateProv;
        this.member.shipping.country = this.member.country;
        this.member.shipping.zipPostal = this.member.zipPostal;
        this.member.shipping.email = this.member.email;
        this.geoTimezone();
      }
      if (this.billingSame === true) {
        this.member.billing.name = this.member.name;
        this.member.billing.address1 = this.member.address1;
        this.member.billing.address2 = this.member.address2;
        this.member.billing.city = this.member.city;
        this.member.billing.stateProv = this.member.stateProv;
        this.member.billing.country = this.member.country;
        this.member.billing.zipPostal = this.member.zipPostal;
        this.member.billing.email = this.member.email;
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
          this.member.shipping.email = this.member.email;
        } else if (target === 'name') {
          this.member.shipping.name = this.member.name;
        } else if (target === 'address1') {
          this.member.shipping.address1 = this.member.address1;
        } else if (target === 'address2') {
          this.member.shipping.address2 = this.member.address2;
        } else if (target === 'city') {
          this.member.shipping.city = this.member.city;
          this.geoTimezone();
        } else if (target === 'zipPostal') {
          this.member.shipping.zipPostal = this.member.zipPostal;
        }
      }
      if (this.billingSame) {
        if (target === 'email') {
          this.member.billing.email = this.member.email;
        } else if (target === 'name') {
          this.member.billing.name = this.member.name;
        } else if (target === 'address1') {
          this.member.billing.address1 = this.member.address1;
        } else if (target === 'address2') {
          this.member.billing.address2 = this.member.address2;
        } else if (target === 'city') {
          this.member.billing.city = this.member.city;
        } else if (target === 'zipPostal') {
          this.member.billing.zipPostal = this.member.zipPostal;
        }
      }
    },
    copyPhone: function(event) {
      if (this.shippingSame && event.phoneNumber) {
        this.member.shipping.phone = event.phoneNumber;
      }

      if (this.billingSame && event.phoneNumber) {
        this.member.billing.phone = event.phoneNumber;
      }
    },
    copyContacttoBilling: function() {
      if (this.billingSame) {
        this.backupBilling = this.member.billing;
        this.member.billing = {
          name: this.member.name,
          email: this.member.email,
          address1: this.member.address1,
          address2: this.member.address2,
          city: this.member.city,
          stateProv: this.member.stateProv,
          country: this.member.country,
          zipPostal: this.member.zipPostal,
          phone: this.member.phone
        };
      } else {
        this.member.billing = this.backupBilling;
      }
    },
    copyContacttoShipping: function() {
      if (this.shippingSame) {
        this.backupShipping = this.member.shipping;
        this.member.shipping = {
          name: this.member.name,
          email: this.member.email,
          address1: this.member.address1,
          address2: this.member.address2,
          city: this.member.city,
          stateProv: this.member.stateProv,
          country: this.member.country,
          zipPostal: this.member.zipPostal,
          phone: this.member.phone
        };
        this.geoTimezone();
      } else {
        this.member.shipping = this.backupShipping;
        this.geoTimezone();
      }
    },
    checkRegion: function() {
      if (this.billingSame) {
        this.member.billing.stateProv = this.member.stateProv;
      }

      if (this.shippingSame) {
        this.member.shipping.stateProv = this.member.stateProv;
        this.geoTimezone();
      }
    },
    checkCountry: function() {
      this.$refs.phone.countryCode = this.member.country;
      this.member.stateProv = '';
      if (this.billingSame) {
        this.member.billing.country = this.member.country;
        this.member.billing.stateProv = '';
      }

      if (this.shippingSame) {
        this.member.shipping.country = this.member.country;
        this.member.shipping.stateProv = '';
      }
    },
    checkBillingCountry: function() {
      this.$refs.billingPhone.countryCode = this.member.billing.country;
      this.member.billing.stateProv = '';
    },
    checkShippingCountry: function() {
      this.$refs.shippingPhone.countryCode = this.member.shipping.country;
      this.member.shipping.stateProv = '';
    },
    geoTimezone: async function() {
      if (
        this.member.shipping.stateProv &&
        this.member.shipping.city &&
        this.member.shipping.country
      ) {
        const location = await this.$http.get(
          `https://www.mapquestapi.com/geocoding/v1/address?key=Psfm8OjiPQikFbEv9jZ7vCbTpD1hAOlm&inFormat=json&outFormat=json&json={"location":{"street":"${this.member.shipping.city} ${this.member.shipping.stateProv} ${this.member.shipping.country}"},"options":{"thumbMaps":false}}`
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
            this.member.timezone = response.data.zoneName;
            this.member.timezoneAbbrev = response.data.abbreviation;
          } else {
            this.member.timezone = '';
            this.member.timezoneAbbrev = '';
          }
        }
      }
    },
    updateMember: async function() {
      const updatedMember = {
        name: this.member.name,
        phone: this.member.phone,
        address1: this.member.address1,
        address2: this.member.address2,
        city: this.member.city,
        stateProv: this.member.stateProv,
        country: this.member.country,
        zipPostal: this.member.zipPostal,
        timezone: this.member.timezone,
        timezoneAbbrev: this.member.timezoneAbbrev,
        shippingSame: this.shippingSame,
        shippingName: this.member.shipping.name,
        shippingAddress1: this.member.shipping.address1,
        shippingAddress2: this.member.shipping.address2,
        shippingCity: this.member.shipping.city,
        shippingStateProv: this.member.shipping.stateProv,
        shippingCountry: this.member.shipping.country,
        shippingZipPostal: this.member.shipping.zipPostal,
        shippingPhone: this.member.shipping.phone,
        shippingEmail: this.member.shipping.email,
        billingSame: this.billingSame,
        billingName: this.member.billing.name,
        billingAddress1: this.member.billing.address1,
        billingAddress2: this.member.billing.address2,
        billingCity: this.member.billing.city,
        billingStateProv: this.member.billing.stateProv,
        billingCountry: this.member.billing.country,
        billingZipPostal: this.member.billing.zipPostal,
        billingPhone: this.member.billing.phone,
        billingEmail: this.member.billing.email
      };

      try {
        const res = await this.$store.dispatch('updateMember', {
          updatedMember,
          id: this.member._id
        });
        this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
        this.$router.push({ name: 'membersById', params: { id: this.member._id } });
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
