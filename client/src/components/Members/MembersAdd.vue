<template>
  <div class="container-fluid middle-section">
    <form class="row">
      <div class="form-group col-sm-6 mb-3">
        <label for="email">Email Address/Login</label>
        <input
          id="email"
          type="text"
          class="form-control form-control-lg"
          v-model="email"
          ref="email"
          @change="changeDetails"
        />
      </div>
      <div class="col-sm-6 mb-3"></div>
      <div class="col-sm-4 contactSection">
        <div class="section-header bg-secondary mb-2">Contact</div>
        <div class="row">
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
            <label for="address1">Company</label>
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
              :dark="false"
              :preferred-countries="['US', 'CA']"
              ref="phone"
              :clearable="true"
              :no-use-browser-locale="false"
              @update="copyPhone"
            />
          </div>
        </div>
      </div>
      <div class="col-sm-4 billingSection">
        <div class="section-header mb-2 bg-secondary">
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
            <small
              class="form-check-label text-white"
              for="billingSame"
            >Use Contact Information for Billing</small>
          </div>
        </div>
        <div class="row mb-3">
          <div class="form-group col-sm-12">
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
          <div class="form-group col-sm-12">
            <label for="billingCompany">Billing Company</label>
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
            <label for="billingEmail">Billing Email</label>
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
          <div class="form-group col-sm-12">
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
          <div class="form-group col-sm-12">
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
          <div class="form-group col-sm-6">
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
          <div class="form-group col-sm-12">
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
          <div class="form-group col-sm-12">
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
      </div>
      <div class="col-sm-4 shippingSection">
        <div class="section-header mb-2 bg-secondary">
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
            <small
              class="form-check-label text-white"
              for="shippingSame"
            >Use Contact Information for Shipping</small>
          </div>
        </div>
        <div class="row mb-3">
          <div class="form-group col-sm-12">
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
          <div class="form-group col-sm-12">
            <label for="shippingCompany">Shipping Company</label>
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
            <label for="shippingEmail">Shipping Email</label>
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
          <div class="form-group col-sm-12">
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
          <div class="form-group col-sm-12">
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
          <div class="form-group col-sm-6">
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
            <label for="shippingStateProv">Shipping State/Province</label>
            <region-select
              id="shippingStateProv"
              v-model="shippingStateProv"
              :country="shippingCountry"
              :region="shippingStateProv"
              class="form-control form-control-sm"
              :readonly="shippingSame"
              :regionName="true"
              ref="shippingStateProv"
            />
          </div>

          <div class="form-group col-sm-12">
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
          <div class="form-group col-sm-12">
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
      </div>
      <div class="col-sm-12 buttonsSection mt-4">
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
      </div>
    </form>

    <div class="row">
      <div class="col middle-section">
        <form class="mb-4"></form>
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
      company: '',
      email: '',
      address1: '',
      address2: '',
      city: '',
      stateProv: '',
      country: '',
      zipPostal: '',
      phone: '',
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
      shippingEmail: '',
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
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    addMember: async function() {
      const member = {
        email: this.email,
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
      this.$refs.shippingStateProv.$el.focus();
    }
  }
};
</script>
