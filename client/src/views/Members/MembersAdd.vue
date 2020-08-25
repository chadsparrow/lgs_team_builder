<template>
  <div class="page container">
    <div class="middle-section">
      <div class="row">
        <div class="form-group col mb-3">
          <InputField
            name="email"
            label="formLabels.emailAddress"
            v-model="contact.email"
            inputType="email"
            ref="email"
            classNames="form-control form-control-lg"
            :readOnly="false"
          />
        </div>

        <!-- CONTACT SECTION -->
        <div class="col-12 contactSection mb-2">
          <div class="section-header bg-secondary">
            {{ $t('formLabels.contact') }}
          </div>
          <div class="row">
            <div class="form-group col-lg-6">
              <InputField
                name="name"
                label="formLabels.name"
                v-model="contact.name"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="false"
              />
            </div>
            <div class="form-group col-lg-6">
              <InputField
                name="company"
                label="formLabels.company"
                v-model="contact.company"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="false"
              />
            </div>
            <div class="form-group col-lg-6">
              <InputField
                name="address1"
                label="formLabels.address1"
                v-model="contact.address1"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="false"
              />
            </div>
            <div class="form-group col-lg-6">
              <InputField
                name="address2"
                label="formLabels.address2"
                v-model="contact.address2"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="false"
              />
            </div>
            <div class="form-group col-xl-6">
              <InputField
                name="city"
                label="formLabels.city"
                v-model="contact.city"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="false"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3">
              <label for="country">{{ $t('formLabels.country') }}</label>
              <country-select
                id="country"
                v-model="contact.country"
                :country="contact.country"
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
                v-model="contact.stateProv"
                :country="contact.country"
                :region="contact.stateProv"
                class="form-control form-control-sm"
                :regionName="true"
                :placeholder="$t('formLabels.selectRegion')"
                ref="stateProv"
                :usei18n="false"
              />
            </div>
            <div class="form-group col-lg-6">
              <InputField
                name="zipPostal"
                label="formLabels.zipPostal"
                v-model="contact.zipPostal"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="false"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="phone">{{ $t('formLabels.phone') }}</label>
              <VuePhoneNumberInput
                v-model="contact.phone"
                id="phone"
                size="sm"
                :preferred-countries="['US', 'CA']"
                ref="phone"
                :clearable="true"
                :no-use-browser-locale="true"
                valid-color="#168091"
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
                ref="billingSame"
              />
              <small class="form-check-label text-white" for="billingSame">
                {{ $t('formLabels.useContact') }}
              </small>
            </div>
          </div>
          <div class="row">
            <div class="form-group col-lg-6 col-xl-3">
              <InputField
                name="billingName"
                label="formLabels.name"
                v-model="billing.name"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="billingSame"
              />
            </div>
            <div class="form-group col-lg-6 col-xl-3">
              <InputField
                name="billingCompany"
                label="formLabels.company"
                v-model="billing.company"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="billingSame"
              />
            </div>
            <div class="form-group col-xl-6">
              <InputField
                name="billingEmail"
                label="formLabels.email"
                v-model="billing.email"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="billingSame"
              />
            </div>
            <div class="form-group col-lg-6">
              <InputField
                name="billingAddress1"
                label="formLabels.address1"
                v-model="billing.address1"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="billingSame"
              />
            </div>
            <div class="form-group col-lg-6">
              <InputField
                name="billingAddress2"
                label="formLabels.address2"
                v-model="billing.address2"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="billingSame"
              />
            </div>
            <div class="form-group col-xl-6">
              <InputField
                name="billingCity"
                label="formLabels.city"
                v-model="billing.city"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="billingSame"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-if="!billingSame">
              <label for="billingCountry">{{ $t('formLabels.country') }}</label>
              <country-select
                id="billingCountry"
                v-model="billing.country"
                :country="billing.country"
                class="form-control form-control-sm"
                :readonly="billingSame"
                @input="checkBillingCountry"
                :placeholder="$t('formLabels.selectCountry')"
                ref="billingCountry"
                :usei18n="false"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-else>
              <InputField
                name="billingCountry"
                label="formLabels.country"
                v-model="billing.country"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="billingSame"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-if="!billingSame">
              <label for="billingStateProv">{{
                $t('formLabels.stateProv')
              }}</label>
              <region-select
                id="billingStateProv"
                v-model="billing.stateProv"
                :country="billing.country"
                :region="billing.stateProv"
                class="form-control form-control-sm"
                :readonly="billingSame"
                :regionName="true"
                :placeholder="$t('formLabels.selectRegion')"
                ref="billingStateProv"
                :usei18n="false"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-else>
              <InputField
                name="billingStateProv"
                label="formLabels.stateProv"
                v-model="billing.stateProv"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="billingSame"
              />
            </div>
            <div class="form-group col-lg-6">
              <InputField
                name="billingZipPostal"
                label="formLabels.zipPostal"
                v-model="billing.zipPostal"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="billingSame"
              />
            </div>
            <div class="form-group col-lg-6">
              <InputField
                name="billingPhone"
                label="formLabels.phone"
                v-model="billing.phone"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="billingSame"
                v-show="billingSame"
              />
              <label for="billingPhone" v-if="!billingSame">{{
                $t('formLabels.phone')
              }}</label>
              <VuePhoneNumberInput
                v-model="billing.phone"
                id="billingPhone"
                size="sm"
                :preferred-countries="['US', 'CA']"
                ref="billingPhone"
                :clearable="true"
                :no-use-browser-locale="true"
                v-show="!billingSame"
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
                ref="shippingSame"
              />
              <small class="form-check-label text-white" for="shippingSame">
                {{ $t('formLabels.useContact') }}
              </small>
            </div>
          </div>
          <div class="row">
            <div class="form-group col-lg-6 col-xl-3">
              <InputField
                name="shippingName"
                label="formLabels.name"
                v-model="shipping.name"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="shippingSame"
              />
            </div>
            <div class="form-group col-lg-6 col-xl-3">
              <InputField
                name="shippingCompany"
                label="formLabels.company"
                v-model="shipping.company"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="shippingSame"
              />
            </div>
            <div class="form-group col-xl-6">
              <InputField
                name="shippingEmail"
                label="formLabels.email"
                v-model="shipping.email"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="shippingSame"
              />
            </div>
            <div class="form-group col-lg-6">
              <InputField
                name="shippingAddress1"
                label="formLabels.address1"
                v-model="shipping.address1"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="shippingSame"
              />
            </div>
            <div class="form-group col-lg-6">
              <InputField
                name="shippingAddress2"
                label="formLabels.address2"
                v-model="shipping.address2"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="shippingSame"
              />
            </div>
            <div class="form-group col-xl-6">
              <InputField
                name="shippingCity"
                label="formLabels.city"
                v-model="shipping.city"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="shippingSame"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-if="!shippingSame">
              <label for="shippingCountry">{{
                $t('formLabels.country')
              }}</label>
              <country-select
                id="shippingCountry"
                v-model="shipping.country"
                :country="shipping.country"
                class="form-control form-control-sm"
                @input="checkShippingCountry"
                :readonly="shippingSame"
                ref="shippingCountry"
                :usei18n="false"
                :placeholder="$t('formLabels.selectCountry')"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-else>
              <InputField
                name="shippingCountry"
                label="formLabels.country"
                v-model="shipping.country"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="shippingSame"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-if="!shippingSame">
              <label for="shippingStateProv">{{
                $t('formLabels.stateProv')
              }}</label>
              <region-select
                id="shippingStateProv"
                v-model="shipping.stateProv"
                :country="shipping.country"
                :region="shipping.stateProv"
                class="form-control form-control-sm"
                :readonly="shippingSame"
                :regionName="true"
                ref="shippingStateProv"
                :placeholder="$t('formLabels.selectRegion')"
                :usei18n="false"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3" v-else>
              <InputField
                name="shippingStateProv"
                label="formLabels.stateProv"
                v-model="shipping.stateProv"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="shippingSame"
              />
            </div>
            <div class="form-group col-lg-6">
              <InputField
                name="shippingZipPostal"
                label="formLabels.zipPostal"
                v-model="shipping.zipPostal"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="shippingSame"
              />
            </div>
            <div class="form-group col-lg-6">
              <InputField
                name="shippingPhone"
                label="formLabels.phone"
                v-model="shipping.phone"
                inputType="text"
                classNames="form-control form-control-sm"
                :readOnly="shippingSame"
                v-show="shippingSame"
              />
              <label for="shippingPhone" v-show="!shippingSame">{{
                $t('formLabels.phone')
              }}</label>
              <VuePhoneNumberInput
                v-model="shipping.phone"
                id="shippingPhone"
                size="sm"
                :preferred-countries="['US', 'CA']"
                ref="shippingPhone"
                :clearable="true"
                :no-use-browser-locale="true"
                v-show="!shippingSame"
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
import clone from 'lodash/clone';
import mapValues from 'lodash/mapValues';
import InputField from '../../components/Shared/InputField';

export default {
  name: 'MembersAdd',
  components: {
    VuePhoneNumberInput,
    InputField,
  },
  data() {
    return {
      contact: {
        name: '',
        company: '',
        address1: '',
        address2: '',
        city: '',
        stateProv: '',
        country: '',
        zipPostal: '',
        phone: '',
        email: '',
      },
      billingSame: true,
      billing: {
        name: '',
        company: '',
        address1: '',
        address2: '',
        city: '',
        stateProv: '',
        country: '',
        zipPostal: '',
        phone: '',
        email: '',
      },
      shippingSame: true,
      shipping: {
        name: '',
        company: '',
        address1: '',
        address2: '',
        city: '',
        stateProv: '',
        country: '',
        zipPostal: '',
        phone: '',
        email: '',
      },
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
  watch: {
    billingSame(val) {
      if (val) {
        this.billing = clone(this.contact);
      } else {
        this.billing = mapValues(this.billing, (v) => '');
      }
    },
    shippingSame(val) {
      if (val) {
        this.shipping = clone(this.billing);
      } else {
        this.shipping = mapValues(this.shipping, (v) => '');
      }
    },
    contact: {
      deep: true,
      handler() {
        if (this.billingSame) {
          this.billing = clone(this.contact);
        }

        if (this.shippingSame) {
          this.shipping = clone(this.contact);
        }
      },
    },
  },
  methods: {
    addMember: async function() {
      const member = {
        contact: this.contact,
        billingSame: this.billingSame,
        billing: this.billing,
        shippingSame: this.shippingSame,
        shipping: this.shipping,
      };

      this.$store.commit('LOADING_TRUE');
      try {
        await this.$store.dispatch('addMember', member);
        this.$router.push({ name: 'members' });
        toast.success(i18n.t('members.successAdd'));
        this.$store.commit('LOADING_FALSE');
      } catch (err) {
        this.$store.commit('LOADING_FALSE');
        if (get(err.response, 'data[0].context')) {
          const key = get(err.response, 'data[0].context.key');
          this.$refs[key].focus();
        }
        toast.error(err);
        if (
          get(err.response, 'data[0].error.message') ===
          'Member already registered.'
        ) {
          this.contact.email = '';
        }
      }
    },
    checkCountry: function() {
      this.$refs.phone.countryCode = this.contact.country;
      this.contact.stateProv = '';
      this.$refs.stateProv.$el.focus();
      if (this.billingSame) {
        this.billing.stateProv = '';
      }

      if (this.shippingSame) {
        this.shipping.stateProv = '';
      }
    },
    checkBillingCountry: function() {
      this.$refs.billingPhone.countryCode = this.billing.country;
      this.billing.stateProv = '';
      this.$refs.billingStateProv.$el.focus();
    },
    checkShippingCountry: function() {
      this.$refs.shippingPhone.countryCode = this.shipping.country;
      this.shipping.stateProv = '';
      this.$refs.shippingStateProv.$el.focus();
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  .middle-section {
    padding: 0 0.25rem;
  }
}

.form-group {
  label {
    margin-top: 0.3rem !important;
  }
}
</style>
