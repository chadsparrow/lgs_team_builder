<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col sidebar">
        <div class="row p-1">
          <small class="col-sm-12 text-info">Member Timezone:</small>
          <span class="col-sm-12">{{timezone}}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Member Role:</small>
          <span class="col-sm-12">{{isAdmin ? 'Admin' : 'Member'}}</span>
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
      <div class="col infoSection">
        <h6 class="bg-secondary">Member Information</h6>
        <form v-if="name">
          <div class="row">
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
                default-country-code="CA"
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
                ref="country"
                @change="changeDetails"
              />
            </div>
            <div class="form-group col-sm-4">
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
            <div class="form-check col-sm-8 mt-4 text-center">
              <input
                type="checkbox"
                class="form-check-input"
                id="shippingSame"
                v-model="shippingSame"
                @change="copyDetails"
                ref="shippingSame"
              />
              <label class="form-check-label" for="shippingSame">Use Member Details for Shipping</label>
            </div>
          </div>
          <h6 class="mt-3 bg-secondary">Member Shipping Details</h6>
          <div class="row mb-4">
            <div class="form-group col-sm-6">
              <label for="shippingName">Shipping Name</label>
              <input
                id="shippingName"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.name"
                :readonly="shippingSame"
                ref="shippingName"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingPhone">Shipping Phone</label>
              <input
                type="text"
                id="shippingPhone"
                class="form-control form-control-sm"
                v-model="shipping.phone"
                ref="shippingPhone"
                :readonly="shippingSame"
                v-if="shippingSame"
              />
              <VuePhoneNumberInput
                v-model="shipping.phone"
                id="shippingPhone"
                :dark="false"
                default-country-code="CA"
                ref="shippingPhone"
                :clearable="true"
                :no-use-browser-locale="false"
                v-else
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingAddress1">Shipping Address 1</label>
              <input
                id="shippingAddress1"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.address1"
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
                v-model="shipping.address2"
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
                v-model="shipping.city"
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
                v-model="shipping.stateProv"
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
                v-model="shipping.country"
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
                v-model="shipping.zipPostal"
                :readonly="shippingSame"
                ref="shippingZipPostal"
              />
            </div>
            <div class="form-group col-sm-8">
              <label for="shippingName">Shipping Email</label>
              <input
                id="shippingEmail"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.email"
                :readonly="shippingSame"
                ref="shippingEmail"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-sm-8">
              <button
                class="btn btn-block btn-info mb-2"
                @click.prevent="updateMember"
              >Update Member</button>
            </div>
            <div class="col-sm-4">
              <router-link :to="`/dashboard/members/${id}`" class="btn btn-block btn-danger">Cancel</router-link>
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
      shipping: '',
      shippingSame: false
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
        shipping
      } = res.data;

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
        this.shipping.phone = this.phone;
        this.shipping.email = this.email;
      }
    },
    changeDetails: async function(event) {
      if (
        event.target.id === 'country' ||
        event.target.id === 'stateProv' ||
        event.target.id === 'city'
      ) {
        if (
          this.stateProv &&
          (this.stateProv !== null || this.stateProv !== '') &&
          (this.city && (this.city !== null || this.city !== '')) &&
          (this.country && (this.country !== null || this.country !== ''))
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

      if (this.shippingSame) {
        const target = event.target.id;
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
        } else if (target === 'stateProv') {
          this.shipping.stateProv = this.stateProv;
        } else if (target === 'country') {
          this.shipping.country = this.country;
        } else if (target === 'zipPostal') {
          this.shipping.zipPostal = this.zipPostal;
        }
      }
    },
    copyPhone: function(event) {
      if (this.shippingSame && event.phoneNumber) {
        this.shipping.phone = event.phoneNumber;
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
        shippingEmail: this.shipping.email
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

<style lang="scss" scoped>
.vue-avatar--wrapper {
  border-radius: 1rem !important;
}

.sidebar {
  flex: 0 0 255px;

  span {
    font-size: 0.8em;
  }
}
.infoSection {
  .form-group {
    margin-top: 1px;
    margin-bottom: 1px;
  }

  h6 {
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

