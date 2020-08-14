<template>
  <div class="page container" v-if="!isLoading">
    <div class="sidebar-left">
      <div class="row p-1">
        <label class="col-sm-12">{{ $t('profiles.timezone') }}:</label>
        <span class="col-sm-12">{{ memberDetails.timezone }}</span>
      </div>
      <hr />
      <div class="row">
        <span class="col-sm-12 text-danger text-center">
          <strong>
            <em>** {{ $t('profiles.importantNotice') }} **</em>
          </strong>
        </span>
        <small class="col-sm-12 mt-2 text-muted text-justify">{{
          $t('profiles.changes')
        }}</small>
        <small class="col-sm-12 mt-2 text-muted text-justify">{{
          $t('profiles.shippingInfo')
        }}</small>
      </div>
    </div>
    <div class="middle-section">
      <!-- CONTACT SECTION -->
      <div class="contactSection">
        <div class="row m-0">
          <div class="section-header bg-secondary">
            <span class="text-white">{{ $t('formLabels.contact') }}</span>
          </div>
        </div>
        <div class="row p-1">
          <div class="form-group col-sm-12 col-lg-6 col-xl-3">
            <label for="name">{{ $t('formLabels.name') }}</label>
            <input
              id="name"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.name"
              @change="changeDetails"
              ref="name"
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6 col-xl-3">
            <label for="company">{{ $t('formLabels.company') }}</label>
            <input
              id="company"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.company"
              @change="changeDetails"
              ref="company"
            />
          </div>
          <div class="form-group col-sm-12 col-xl-6">
            <label for="email">{{ $t('formLabels.email') }}</label>
            <input
              id="email"
              type="email"
              class="form-control form-control-sm"
              v-model="memberDetails.email"
              ref="email"
              readonly
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6">
            <label for="address1">{{ $t('formLabels.address1') }}</label>
            <input
              id="address1"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.address1"
              @change="changeDetails"
              ref="address1"
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6">
            <label for="address2">{{ $t('formLabels.address2') }}</label>
            <input
              id="address2"
              type="text"
              class="form-control form-control-sm"
              ref="address2"
              v-model="memberDetails.address2"
              @change="changeDetails"
            />
          </div>
          <div class="form-group col-sm-12 col-xl-6">
            <label for="city">{{ $t('formLabels.city') }}</label>
            <input
              id="city"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.city"
              @change="changeDetails"
              ref="city"
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6 col-xl-3">
            <label for="country">{{ $t('formLabels.country') }}</label>
            <country-select
              id="country"
              v-model="memberDetails.country"
              :country="memberDetails.country"
              class="form-control form-control-sm"
              @input="checkCountry"
              ref="country"
              :usei18n="false"
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6 col-xl-3">
            <label for="stateProv">{{ $t('formLabels.stateProv') }}</label>
            <region-select
              id="stateProv"
              v-model="memberDetails.stateProv"
              :country="memberDetails.country"
              :region="memberDetails.stateProv"
              class="form-control form-control-sm"
              @input="checkRegion"
              :regionName="true"
              ref="stateProv"
              :usei18n="false"
            />
          </div>

          <div class="form-group col-sm-12 col-lg-6">
            <label for="zipPostal">{{ $t('formLabels.zipPostal') }}</label>
            <input
              id="zipPostal"
              type="text"
              class="form-control form-control-sm"
              ref="zipPostal"
              v-model="memberDetails.zipPostal"
              @change="changeDetails"
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6">
            <label for="phone">{{ $t('formLabels.phone') }}</label>
            <VuePhoneNumberInput
              v-model="memberDetails.phone"
              id="phone"
              size="sm"
              :default-country-code="memberDetails.country || 'CA'"
              :preferred-countries="['US', 'CA']"
              ref="phone"
              :clearable="true"
              @update="copyPhone"
            />
          </div>
        </div>
      </div>

      <!-- BILLING SECTION -->
      <div class="billingSection">
        <div class="row m-0">
          <div class="section-header bg-secondary">
            <span class="text-white">{{ $t('formLabels.billing') }}</span>
            <div class="form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="billingSame"
                v-model="billingSame"
                ref="billingSame"
                @change="copyContacttoBilling"
              />
              <small class="form-check-label text-white" for="billingSame">{{
                $t('formLabels.useContact')
              }}</small>
            </div>
          </div>
        </div>
        <div class="row p-1 mb-2">
          <div class="form-group col-sm-12 col-lg-6 col-xl-3">
            <label for="billingName">{{ $t('formLabels.name') }}</label>
            <input
              id="billingName"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.billing.name"
              ref="billingName"
              :readonly="billingSame"
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6 col-xl-3">
            <label for="billingCompany">{{ $t('formLabels.company') }}</label>
            <input
              id="billingCompany"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.billing.company"
              ref="billingCompany"
              :readonly="billingSame"
            />
          </div>
          <div class="form-group col-sm-12 col-xl-6">
            <label for="billingEmail">{{ $t('formLabels.email') }}</label>
            <input
              id="billingEmail"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.billing.email"
              ref="billingEmail"
              readonly
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6">
            <label for="billingAddress1">{{ $t('formLabels.address1') }}</label>
            <input
              id="billingAddress1"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.billing.address1"
              ref="billingAddress1"
              :readonly="billingSame"
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6">
            <label for="billingAddress2">{{ $t('formLabels.address2') }}</label>
            <input
              id="billingAddress2"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.billing.address2"
              ref="billingAddress2"
              :readonly="billingSame"
            />
          </div>
          <div class="form-group col-sm-12 col-xl-6">
            <label for="billingCity">{{ $t('formLabels.city') }}</label>
            <input
              id="billingCity"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.billing.city"
              ref="billingCity"
              :readonly="billingSame"
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6 col-xl-3">
            <label for="billingCountry">{{ $t('formLabels.country') }}</label>
            <country-select
              id="billingCountry"
              v-model="memberDetails.billing.country"
              :country="memberDetails.billing.country"
              class="form-control form-control-sm"
              :readonly="billingSame"
              @input="checkBillingCountry"
              ref="billingCountry"
              :usei18n="false"
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6 col-xl-3">
            <label for="billingStateProv">{{
              $t('formLabels.stateProv')
            }}</label>
            <region-select
              id="billingStateProv"
              v-model="memberDetails.billing.stateProv"
              :country="memberDetails.billing.country"
              :region="memberDetails.billing.stateProv"
              class="form-control form-control-sm"
              :readonly="billingSame"
              :regionName="true"
              ref="billingStateProv"
              :usei18n="false"
            />
          </div>

          <div class="form-group col-sm-12 col-lg-6">
            <label for="billingZipPostal">{{
              $t('formLabels.zipPostal')
            }}</label>
            <input
              id="billingZipPostal"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.billing.zipPostal"
              ref="billingZipPostal"
              :readonly="billingSame"
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6" v-if="billingSame">
            <label for="billingPhone">{{ $t('formLabels.phone') }}</label>
            <input
              id="billingPhone"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.billing.phone"
              ref="billingPhone"
              readonly
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6" v-else>
            <label for="billingPhone">{{ $t('formLabels.phone') }}</label>
            <VuePhoneNumberInput
              v-model="memberDetails.billing.phone"
              id="billingPhone"
              size="sm"
              :default-country-code="memberDetails.billing.country || 'CA'"
              :preferred-countries="['US', 'CA']"
              ref="billingPhone"
              :clearable="true"
            />
          </div>
        </div>
      </div>

      <!-- SHIPPING SECTION -->
      <div class="shippingSection">
        <div class="row m-0">
          <div class="section-header bg-secondary">
            <span class="text-white">{{ $t('formLabels.shipping') }}</span>
            <div class="form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="shippingSame"
                v-model="shippingSame"
                ref="shippingSame"
                @change="copyContacttoShipping"
              />
              <small class="form-check-label text-white" for="shippingSame">{{
                $t('formLabels.useContact')
              }}</small>
            </div>
          </div>
        </div>
        <div class="row p-1 mb-2">
          <div class="form-group col-sm-12 col-lg-6 col-xl-3">
            <label for="shippingName">{{ $t('formLabels.name') }}</label>
            <input
              id="shippingName"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.shipping.name"
              ref="shippingName"
              :readonly="shippingSame"
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6 col-xl-3">
            <label for="shippingCompany">{{ $t('formLabels.company') }}</label>
            <input
              id="shippingCompany"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.shipping.company"
              ref="shippingCompany"
              :readonly="shippingSame"
            />
          </div>
          <div class="form-group col-sm-12 col-xl-6">
            <label for="shippingEmail">{{ $t('formLabels.email') }}</label>
            <input
              id="shippingEmail"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.shipping.email"
              ref="shippingEmail"
              readonly
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6">
            <label for="shippingAddress1">{{
              $t('formLabels.address1')
            }}</label>
            <input
              id="shippingAddress1"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.shipping.address1"
              ref="shippingAddress1"
              :readonly="shippingSame"
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6">
            <label for="shippingAddress2">{{
              $t('formLabels.address2')
            }}</label>
            <input
              id="shippingAddress2"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.shipping.address2"
              ref="shippingAddress2"
              :readonly="shippingSame"
            />
          </div>
          <div class="form-group col-sm-12 col-xl-6">
            <label for="shippingCity">{{ $t('formLabels.city') }}</label>
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
          <div class="form-group col-sm-12 col-lg-6 col-xl-3">
            <label for="shippingCountry">{{ $t('formLabels.country') }}</label>
            <country-select
              id="shippingCountry"
              v-model="memberDetails.shipping.country"
              :country="memberDetails.shipping.country"
              class="form-control form-control-sm"
              @input="checkShippingCountry"
              :readonly="shippingSame"
              ref="shippingCountry"
              :usei18n="false"
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6 col-xl-3">
            <label for="shippingStateProv">{{
              $t('formLabels.stateProv')
            }}</label>
            <region-select
              id="shippingStateProv"
              v-model="memberDetails.shipping.stateProv"
              :country="memberDetails.shipping.country"
              :region="memberDetails.shipping.stateProv"
              class="form-control form-control-sm"
              :readonly="shippingSame"
              :regionName="true"
              ref="shippingStateProv"
              :usei18n="false"
            />
          </div>

          <div class="form-group col-sm-12 col-lg-6">
            <label for="shippingZipPostal">{{
              $t('formLabels.zipPostal')
            }}</label>
            <input
              id="shippingZipPostal"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.shipping.zipPostal"
              ref="shippingZipPostal"
              :readonly="shippingSame"
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6" v-if="shippingSame">
            <label for="shippingPhone">{{ $t('formLabels.phone') }}</label>
            <input
              id="shippingPhone"
              type="text"
              class="form-control form-control-sm"
              v-model="memberDetails.shipping.phone"
              ref="shippingPhone"
              :readonly="shippingSame"
            />
          </div>
          <div class="form-group col-sm-12 col-lg-6" v-else>
            <label for="shippingPhone">{{ $t('formLabels.phone') }}</label>
            <VuePhoneNumberInput
              v-model="memberDetails.shipping.phone"
              id="shippingPhone"
              size="sm"
              :default-country-code="memberDetails.shipping.country || 'CA'"
              :preferred-countries="['US', 'CA']"
              ref="shippingPhone"
              :clearable="true"
            />
          </div>
        </div>
      </div>

      <div class="buttonsSection my-2">
        <div class="row">
          <div class="col-sm-6 mt-2">
            <button class="small-btn btn-block" @click.prevent="updateProfile">
              {{ $t('profiles.updateProfile') }}
            </button>
          </div>
          <div class="col-sm-6 mt-2">
            <router-link
              tag="button"
              to="/dashboard/profile"
              class="small-btn danger-btn btn-block"
              >{{ $t('cancel') }}</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import { mapGetters } from 'vuex';
import i18n from '../../i18n';

export default {
  name: 'ProfilesEdit',
  components: {
    VuePhoneNumberInput,
  },
  data() {
    return {
      shippingSame: false,
      billingSame: false,
      backupBilling: {},
      backupShipping: {},
      memberDetails: {},
    };
  },
  computed: {
    ...mapGetters(['loggedInMember', 'isLoading']),
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      const breadcrumbs = [
        {
          text: i18n.t('profiles.myProfile'),
          link: '/dashboard/profile',
        },
        {
          text: i18n.t('edit'),
          link: '#',
        },
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      const res = await this.$store.dispatch(
        'getMemberDetails',
        this.loggedInMember._id
      );
      this.memberDetails = res.data.member;
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, {
        icon: 'exclamation-triangle',
      });
    }
  },
  methods: {
    copyDetails: function() {
      if (this.shippingSame === true) {
        this.memberDetails.shipping.name = this.memberDetails.name;
        this.memberDetails.shipping.company = this.memberDetails.company;
        this.memberDetails.shipping.address1 = this.memberDetails.address1;
        this.memberDetails.shipping.address2 = this.memberDetails.address2;
        this.memberDetails.shipping.city = this.memberDetails.city;
        this.memberDetails.shipping.stateProv = this.memberDetails.stateProv;
        this.memberDetails.shipping.country = this.memberDetails.country;
        this.memberDetails.shipping.zipPostal = this.memberDetails.zipPostal;
        this.memberDetails.shipping.email = this.memberDetails.email;
      }
      if (this.billingSame === true) {
        this.memberDetails.billing.name = this.memberDetails.name;
        this.memberDetails.billing.company = this.memberDetails.company;
        this.memberDetails.billing.address1 = this.memberDetails.address1;
        this.memberDetails.billing.address2 = this.memberDetails.address2;
        this.memberDetails.billing.city = this.memberDetails.city;
        this.memberDetails.billing.stateProv = this.memberDetails.stateProv;
        this.memberDetails.billing.country = this.memberDetails.country;
        this.memberDetails.billing.zipPostal = this.memberDetails.zipPostal;
        this.memberDetails.billing.email = this.memberDetails.email;
      }
    },
    changeDetails: async function(event) {
      const target = event.target.id;

      if (this.shippingSame) {
        if (target === 'email') {
          this.memberDetails.shipping.email = this.memberDetails.email;
        } else if (target === 'name') {
          this.memberDetails.shipping.name = this.memberDetails.name;
        } else if (target === 'company') {
          this.memberDetails.shipping.company = this.memberDetails.company;
        } else if (target === 'address1') {
          this.memberDetails.shipping.address1 = this.memberDetails.address1;
        } else if (target === 'address2') {
          this.memberDetails.shipping.address2 = this.memberDetails.address2;
        } else if (target === 'city') {
          this.memberDetails.shipping.city = this.memberDetails.city;
        } else if (target === 'zipPostal') {
          this.memberDetails.shipping.zipPostal = this.memberDetails.zipPostal;
        }
      }
      if (this.billingSame) {
        if (target === 'email') {
          this.memberDetails.billing.email = this.memberDetails.email;
        } else if (target === 'name') {
          this.memberDetails.billing.name = this.memberDetails.name;
        } else if (target === 'company') {
          this.memberDetails.billing.company = this.memberDetails.company;
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
          company: this.memberDetails.company,
          email: this.memberDetails.email,
          address1: this.memberDetails.address1,
          address2: this.memberDetails.address2,
          city: this.memberDetails.city,
          stateProv: this.memberDetails.stateProv,
          country: this.memberDetails.country,
          zipPostal: this.memberDetails.zipPostal,
          phone: this.memberDetails.phone,
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
          company: this.memberDetails.company,
          email: this.memberDetails.email,
          address1: this.memberDetails.address1,
          address2: this.memberDetails.address2,
          city: this.memberDetails.city,
          stateProv: this.memberDetails.stateProv,
          country: this.memberDetails.country,
          zipPostal: this.memberDetails.zipPostal,
          phone: this.memberDetails.phone,
        };
      } else {
        this.memberDetails.shipping = this.backupShipping;
      }
    },
    checkRegion: function() {
      if (this.billingSame) {
        this.memberDetails.billing.stateProv = this.memberDetails.stateProv;
      }

      if (this.shippingSame) {
        this.memberDetails.shipping.stateProv = this.memberDetails.stateProv;
      }
    },
    checkCountry: function() {
      if (this.billingSame) {
        this.memberDetails.billing.country = this.memberDetails.country;
        this.memberDetails.billing.stateProv = '';
      }

      if (this.shippingSame) {
        this.memberDetails.shipping.country = this.memberDetails.country;
        this.memberDetails.shipping.stateProv = '';
        this.$refs.stateProv.$el.focus();
      }

      this.memberDetails.stateProv = '';
      this.$refs.stateProv.$el.focus();
    },
    checkBillingCountry: function() {
      this.memberDetails.billing.stateProv = '';
      this.$refs.billingStateProv.$el.focus();
    },
    checkShippingCountry: function() {
      this.memberDetails.shipping.stateProv = '';
      this.$refs.shippingStateProv.$el.focus();
    },
    updateProfile: async function() {
      const updatedMember = {
        name: this.memberDetails.name,
        company: this.memberDetails.company,
        phone: this.memberDetails.phone,
        address1: this.memberDetails.address1,
        address2: this.memberDetails.address2,
        city: this.memberDetails.city,
        stateProv: this.memberDetails.stateProv,
        country: this.memberDetails.country,
        zipPostal: this.memberDetails.zipPostal,
        shippingSame: this.shippingSame,
        shippingName: this.memberDetails.shipping.name,
        shippingCompany: this.memberDetails.shipping.company,
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
        billingCompany: this.memberDetails.billing.company,
        billingAddress1: this.memberDetails.billing.address1,
        billingAddress2: this.memberDetails.billing.address2,
        billingCity: this.memberDetails.billing.city,
        billingStateProv: this.memberDetails.billing.stateProv,
        billingCountry: this.memberDetails.billing.country,
        billingZipPostal: this.memberDetails.billing.zipPostal,
        billingPhone: this.memberDetails.billing.phone,
        billingEmail: this.memberDetails.billing.email,
      };
      try {
        const res = await this.$store.dispatch('updateMember', {
          updatedMember,
          id: this.loggedInMember._id,
        });
        this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
        this.$router.push({ name: 'profile' });
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].message, {
          icon: 'exclamation-triangle',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 1fr;
  grid-gap: 1.5rem;
  width: 100%;
  height: 100%;
  grid-template-areas: 'sidebar-left middle-section';
}

/* Small devices (landscape phones, 576px and up) */
@media (max-width: 768px) {
  .page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    .sidebar-left {
      width: 100%;
      max-width: 400px;
      text-align: center;
      margin: 0 auto 2rem;
    }
  }
}
</style>
