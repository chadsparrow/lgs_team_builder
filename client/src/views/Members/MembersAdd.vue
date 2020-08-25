<template>
  <div class="page container">
    <div class="middle-section">
      <div class="row">
        <div class="form-group col mb-3">
          <label for="email"
            >{{ $t('formLabels.emailAddress') }} /
            {{ $t('formLabels.login') }}</label
          >
          <input
            id="email"
            type="text"
            class="form-control form-control-lg"
            v-model="email"
            ref="email"
            @change="changeDetails"
          />
        </div>

        <!-- CONTACT SECTION -->
        <div class="col-12 contactSection mb-2">
          <div class="section-header bg-secondary">
            {{ $t('formLabels.contact') }}
          </div>
          <div class="row">
            <div class="form-group col-lg-6">
              <label for="name">{{ $t('formLabels.name') }}</label>
              <input
                id="name"
                type="text"
                class="form-control form-control-sm"
                v-model="name"
                ref="name"
                @change="changeDetails"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="address1">{{ $t('formLabels.company') }}</label>
              <input
                id="company"
                type="text"
                class="form-control form-control-sm"
                v-model="company"
                ref="company"
                @change="changeDetails"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="address1">{{ $t('formLabels.address1') }}</label>
              <input
                id="address1"
                type="text"
                class="form-control form-control-sm"
                v-model="address1"
                ref="address1"
                @change="changeDetails"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="address2">{{ $t('formLabels.address2') }}</label>
              <input
                id="address2"
                type="text"
                class="form-control form-control-sm"
                v-model="address2"
                ref="address2"
                @change="changeDetails"
              />
            </div>
            <div class="form-group col-xl-6">
              <label for="city">{{ $t('formLabels.city') }}</label>
              <input
                id="city"
                type="text"
                class="form-control form-control-sm"
                v-model="city"
                ref="city"
                @change="changeDetails"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3">
              <label for="country">{{ $t('formLabels.country') }}</label>
              <country-select
                id="country"
                v-model="country"
                :country="country"
                class="form-control form-control-sm"
                @input="checkCountry"
                :placeholder="$t('formLabels.selectCountry')"
                ref="country"
                :usei18n="false"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3">
              <label for="stateProv">{{ $t('formLabels.stateProv') }}</label>
              <region-select
                id="stateProv"
                v-model="stateProv"
                :country="country"
                :region="stateProv"
                class="form-control form-control-sm"
                @input="checkRegion"
                :regionName="true"
                :placeholder="$t('formLabels.selectRegion')"
                ref="stateProv"
                :usei18n="false"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="zipPostal">{{ $t('formLabels.zipPostal') }}</label>
              <input
                id="zipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="zipPostal"
                ref="zipPostal"
                @change="changeDetails"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="phone">{{ $t('formLabels.phone') }}</label>
              <VuePhoneNumberInput
                v-model="phone"
                id="phone"
                size="sm"
                :preferred-countries="['US', 'CA']"
                ref="phone"
                :clearable="true"
                :no-use-browser-locale="true"
                :translations="translations"
                @update="copyPhone"
              />
            </div>
          </div>
        </div>

        <!-- BILLING SECTION -->
        <div class="col-12 billingSection mb-2">
          <div class="section-header bg-secondary">
            <span class="text-white">{{ $t('formLabels.billing') }}</span>
            <div class="form-check float-right">
              <input
                type="checkbox"
                class="form-check-input"
                id="billingSame"
                v-model="billingSame"
                @change="copyMembertoBilling"
                ref="billingSame"
              />
              <small class="form-check-label text-white" for="billingSame">
                {{ $t('formLabels.useContact') }}
              </small>
            </div>
          </div>
          <div class="row">
            <div class="form-group col-lg-6 col-xl-3">
              <label for="billingName">{{ $t('formLabels.name') }}</label>
              <input
                id="billingName"
                type="text"
                class="form-control form-control-sm"
                v-model="billingName"
                :readonly="billingSame"
                ref="billingName"
              />
            </div>
            <div class="form-group col-lg-6 col-xl-3">
              <label for="billingCompany">{{ $t('formLabels.company') }}</label>
              <input
                id="billingCompany"
                type="text"
                class="form-control form-control-sm"
                v-model="billingCompany"
                :readonly="billingSame"
                ref="billingCompany"
              />
            </div>
            <div class="form-group col-xl-6">
              <label for="billingEmail">{{ $t('formLabels.email') }}</label>
              <input
                id="billingEmail"
                type="text"
                class="form-control form-control-sm"
                v-model="billingEmail"
                :readonly="billingSame"
                ref="billingEmail"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="billingAddress1">{{
                $t('formLabels.address1')
              }}</label>
              <input
                id="billingAddress1"
                type="text"
                class="form-control form-control-sm"
                v-model="billingAddress1"
                :readonly="billingSame"
                ref="billingAddress1"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="billingAddress2">{{
                $t('formLabels.address2')
              }}</label>
              <input
                id="billingAddress2"
                type="text"
                class="form-control form-control-sm"
                v-model="billingAddress2"
                :readonly="billingSame"
                ref="billingAddress2"
              />
            </div>
            <div class="form-group col-xl-6">
              <label for="billingCity">{{ $t('formLabels.city') }}</label>
              <input
                id="billingCity"
                type="text"
                class="form-control form-control-sm"
                v-model="billingCity"
                :readonly="billingSame"
                ref="billingCity"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-if="!billingSame">
              <label for="billingCountry">{{ $t('formLabels.country') }}</label>
              <country-select
                id="billingCountry"
                v-model="billingCountry"
                :country="billingCountry"
                class="form-control form-control-sm"
                :readonly="billingSame"
                @input="checkBillingCountry"
                :placeholder="$t('formLabels.selectCountry')"
                ref="billingCountry"
                :usei18n="false"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-else>
              <label for="billingCountry">{{ $t('formLabels.country') }}</label>
              <input
                id="billingCountry"
                type="text"
                class="form-control form-control-sm"
                v-model="billingCountry"
                :readonly="billingSame"
                ref="billingCountry"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-if="!billingSame">
              <label for="billingStateProv">{{
                $t('formLabels.stateProv')
              }}</label>
              <region-select
                id="billingStateProv"
                v-model="billingStateProv"
                :country="billingCountry"
                :region="billingStateProv"
                class="form-control form-control-sm"
                :readonly="billingSame"
                :regionName="true"
                :placeholder="$t('formLabels.selectRegion')"
                ref="billingStateProv"
                :usei18n="false"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-else>
              <label for="billingStateProv">{{
                $t('formLabels.stateProv')
              }}</label>
              <input
                id="billingStateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="billingStateProv"
                :readonly="billingSame"
                ref="billingStateProv"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="billingZipPostal">{{
                $t('formLabels.zipPostal')
              }}</label>
              <input
                id="billingZipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="billingZipPostal"
                :readonly="billingSame"
                ref="billingZipPostal"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="billingPhone">{{ $t('formLabels.phone') }}</label>
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
                :no-use-browser-locale="true"
                :translations="translations"
                v-else
              />
            </div>
          </div>
        </div>

        <!-- SHIPPING SECTION -->
        <div class="col-12 shippingSection mb-3">
          <div class="section-header bg-secondary">
            <span class="text-white">{{ $t('formLabels.shipping') }}</span>
            <div class="form-check float-right">
              <input
                type="checkbox"
                class="form-check-input"
                id="shippingSame"
                v-model="shippingSame"
                @change="copyMemberToShipping"
                ref="shippingSame"
              />
              <small class="form-check-label text-white" for="shippingSame">
                {{ $t('formLabels.useContact') }}
              </small>
            </div>
          </div>
          <div class="row">
            <div class="form-group col-lg-6 col-xl-3">
              <label for="shippingName">{{ $t('formLabels.name') }}</label>
              <input
                id="shippingName"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingName"
                :readonly="shippingSame"
                ref="shippingName"
              />
            </div>
            <div class="form-group col-lg-6 col-xl-3">
              <label for="shippingCompany">{{
                $t('formLabels.company')
              }}</label>
              <input
                id="shippingCompany"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingCompany"
                :readonly="shippingSame"
                ref="shippingCompany"
              />
            </div>
            <div class="form-group col-xl-6">
              <label for="shippingEmail">{{ $t('formLabels.email') }}</label>
              <input
                id="shippingEmail"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingEmail"
                :readonly="shippingSame"
                ref="shippingEmail"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="shippingAddress1">{{
                $t('formLabels.address1')
              }}</label>
              <input
                id="shippingAddress1"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingAddress1"
                :readonly="shippingSame"
                ref="shippingAddress1"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="shippingAddress2">{{
                $t('formLabels.address2')
              }}</label>
              <input
                id="shippingAddress2"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingAddress2"
                :readonly="shippingSame"
                ref="shippingAddress2"
              />
            </div>
            <div class="form-group col-xl-6">
              <label for="shippingCity">{{ $t('formLabels.city') }}</label>
              <input
                id="shippingCity"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingCity"
                :readonly="shippingSame"
                ref="shippingCity"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-if="!shippingSame">
              <label for="shippingCountry">{{
                $t('formLabels.country')
              }}</label>
              <country-select
                id="shippingCountry"
                v-model="shippingCountry"
                :country="shippingCountry"
                class="form-control form-control-sm"
                @input="checkShippingCountry"
                :readonly="shippingSame"
                ref="shippingCountry"
                :usei18n="false"
                :placeholder="$t('formLabels.selectCountry')"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-else>
              <label for="shippingCountry">{{
                $t('formLabels.country')
              }}</label>
              <input
                id="shippingCountry"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingCountry"
                :readonly="shippingSame"
                ref="shippingCountry"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-if="!shippingSame">
              <label for="shippingStateProv">{{
                $t('formLabels.stateProv')
              }}</label>
              <region-select
                id="shippingStateProv"
                v-model="shippingStateProv"
                :country="shippingCountry"
                :region="shippingStateProv"
                class="form-control form-control-sm"
                :readonly="shippingSame"
                :regionName="true"
                ref="shippingStateProv"
                :placeholder="$t('formLabels.selectRegion')"
                :usei18n="false"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-else>
              <label for="shippingStateProv">{{
                $t('formLabels.stateProv')
              }}</label>
              <input
                id="shippingStateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingStateProv"
                :readonly="shippingSame"
                ref="shippingStateProv"
              />
            </div>

            <div class="form-group col-lg-6">
              <label for="shippingZipPostal">{{
                $t('formLabels.zipPostal')
              }}</label>
              <input
                id="shippingZipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingZipPostal"
                :readonly="shippingSame"
                ref="shippingZipPostal"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="shippingPhone">{{ $t('formLabels.phone') }}</label>
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
                v-else
                :translations="translations"
              />
            </div>
          </div>
        </div>
        <div class="col-12 buttonsSection">
          <div class="row">
            <div class="col-lg-8">
              <button
                class="large-btn btn-block mb-2"
                @click.prevent="addMember"
              >
                <i class="fas fa-plus mr-2" style="vertical-align: middle;"></i>
                {{ $t('members.addMember') }}
              </button>
            </div>
            <div class="col-lg-4">
              <router-link
                to="/dashboard/members/"
                class="large-btn danger-btn btn-block"
                tag="button"
              >
                {{ $t('cancel') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import i18n from '../../i18n';
import toast from '../../helpers/toast';
import get from 'lodash/get';

export default {
  name: 'MembersAdd',
  components: {
    VuePhoneNumberInput,
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
      billingEmail: '',
    };
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      const breadcrumbs = [
        {
          text: i18n.t('menu.adminOnly.members'),
          link: '/dashboard/members',
        },
        {
          text: i18n.t('members.addMember'),
          link: '#',
        },
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      toast.error(err);
    }
  },
  computed: {
    translations: function() {
      return this.$store.getters.phoneTranslations;
    },
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
        billingEmail: this.billingEmail,
      };
      try {
        await this.$store.dispatch('addMember', member);
        this.$router.push({ name: 'members' });
        toast.success(i18n.t('members.successAdd'));
      } catch (err) {
        if (get(err.response, 'data[0].context')) {
          const key = get(err.response, 'data[0].context.key');
          this.$refs[key].focus();
        }
        toast.error(err);
        if (
          get(err.response, 'data[0].error.message') ===
          'Member already registered.'
        ) {
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
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  .middle-section {
    padding: $scrollbar-padding;
  }
}

.form-group {
  label {
    margin-top: 0.3rem !important;
  }
}
</style>
