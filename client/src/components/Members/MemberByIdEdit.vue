<template>
  <div class="page container" v-if="!isLoading">
    <div class="sidebar-left">
      <div class="avatarWrapper mb-2">
        <Gravatar :email="member.email" default-img="mp" :size="200" />
      </div>
      <div class="row p-1">
        <label class="col-12">{{ $t('members.memberTZ') }}:</label>
        <span class="col-12">{{ member.timezone }}</span>
      </div>
      <div class="row p-1">
        <label class="col-12">{{ $t('members.memberRole') }}:</label>
        <span class="col-12">{{
          member.isAdmin ? $t('admin') : $t('member')
        }}</span>
      </div>
      <hr />
      <label>{{ $t('actions') }}</label>
      <button
        class="small-btn danger-btn btn-block mt-2 mb-4"
        @click.prevent="deleteMember"
        v-if="!member.isAdmin"
      >
        {{ $t('members.deactivate') }}
      </button>
    </div>

    <!-- CONTACT SECTION -->
    <div class="middle-section">
      <h3 class="text-center">{{ $t('formLabels.information') }}</h3>
      <div class="row m-0">
        <div class="section-header bg-secondary">
          <span class="text-white">{{ $t('formLabels.contact') }}</span>
        </div>
      </div>
      <div class="row mb-2">
        <div class="form-group col-lg-6 col-xl-3">
          <label for="name">{{ $t('formLabels.name') }}</label>
          <input
            id="name"
            type="text"
            class="form-control form-control-sm"
            v-model="member.name"
            @change="changeDetails"
            ref="name"
          />
        </div>
        <div class="form-group col-lg-6 col-xl-3">
          <label for="company">{{ $t('formLabels.company') }}</label>
          <input
            id="company"
            type="text"
            class="form-control form-control-sm"
            v-model="member.company"
            @change="changeDetails"
            ref="company"
          />
        </div>
        <div class="form-group col-xl-6">
          <label for="email">{{ $t('formLabels.email') }}</label>
          <input
            id="email"
            type="email"
            class="form-control form-control-sm"
            v-model="member.email"
            ref="email"
            readonly
          />
        </div>
        <div class="form-group col-lg-6">
          <label for="address1">{{ $t('formLabels.address1') }}</label>
          <input
            id="address1"
            type="text"
            class="form-control form-control-sm"
            v-model="member.address1"
            @change="changeDetails"
            ref="address1"
          />
        </div>
        <div class="form-group col-lg-6">
          <label for="address2">{{ $t('formLabels.address2') }}</label>
          <input
            id="address2"
            type="text"
            class="form-control form-control-sm"
            ref="address2"
            v-model="member.address2"
            @change="changeDetails"
          />
        </div>
        <div class="form-group col-xl-6">
          <label for="city">{{ $t('formLabels.city') }}</label>
          <input
            id="city"
            type="text"
            class="form-control form-control-sm"
            v-model="member.city"
            @change="changeDetails"
            ref="city"
          />
        </div>
        <div class="form-group col-sm-6 col-xl-3">
          <label for="country">{{ $t('formLabels.country') }}</label>
          <country-select
            id="country"
            v-model="member.country"
            :country="member.country"
            class="form-control form-control-sm"
            @input="checkCountry"
            ref="country"
            :usei18n="false"
            :placeholder="$t('formLabels.selectCountry')"
          />
        </div>
        <div class="form-group col-sm-6 col-xl-3">
          <label for="stateProv">{{ $t('formLabels.stateProv') }}</label>
          <region-select
            id="stateProv"
            v-model="member.stateProv"
            :country="member.country"
            :region="member.stateProv"
            class="form-control form-control-sm"
            @input="checkRegion"
            :regionName="true"
            ref="stateProv"
            :usei18n="false"
            :placeholder="$t('formLabels.selectRegion')"
          />
        </div>
        <div class="form-group col-lg-6">
          <label for="zipPostal">{{ $t('formLabels.zipPostal') }}</label>
          <input
            id="zipPostal"
            type="text"
            class="form-control form-control-sm"
            ref="zipPostal"
            v-model="member.zipPostal"
            @change="changeDetails"
          />
        </div>
        <div class="form-group col-lg-6">
          <label for="phone">{{ $t('formLabels.phone') }}</label>
          <VuePhoneNumberInput
            v-model="member.phone"
            id="phone"
            size="sm"
            :default-country-code="member.country || null"
            :preferred-countries="['US', 'CA']"
            ref="phone"
            :clearable="true"
            @update="copyPhone"
          />
        </div>
      </div>

      <!-- BILLING SECTION -->
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
            <small class="form-check-label text-white" for="billingSame">
              {{ $t('formLabels.useContact') }}
            </small>
          </div>
        </div>
      </div>

      <div class="row mb-2">
        <div class="form-group col-lg-6 col-xl-3">
          <label for="billingName">{{ $t('formLabels.name') }}</label>
          <input
            id="billingName"
            type="text"
            class="form-control form-control-sm"
            v-model="member.billing.name"
            ref="billingName"
            :readonly="billingSame"
          />
        </div>
        <div class="form-group col-lg-6 col-xl-3">
          <label for="billingCompany">{{ $t('formLabels.company') }}</label>
          <input
            id="billingCompany"
            type="text"
            class="form-control form-control-sm"
            v-model="member.billing.company"
            ref="billingCompany"
            :readonly="billingSame"
          />
        </div>
        <div class="form-group col-xl-6">
          <label for="billingName">{{ $t('formLabels.email') }}</label>
          <input
            id="billingEmail"
            type="text"
            class="form-control form-control-sm"
            v-model="member.billing.email"
            ref="billingEmail"
            readonly
          />
        </div>
        <div class="form-group col-lg-6">
          <label for="billingAddress1">{{ $t('formLabels.address1') }}</label>
          <input
            id="billingAddress1"
            type="text"
            class="form-control form-control-sm"
            v-model="member.billing.address1"
            ref="billingAddress1"
            :readonly="billingSame"
          />
        </div>
        <div class="form-group col-lg-6">
          <label for="billingAddress2">{{ $t('formLabels.address2') }}</label>
          <input
            id="billingAddress2"
            type="text"
            class="form-control form-control-sm"
            v-model="member.billing.address2"
            ref="billingAddress2"
            :readonly="billingSame"
          />
        </div>
        <div class="form-group col-xl-6">
          <label for="billingCity">{{ $t('formLabels.city') }}</label>
          <input
            id="billingCity"
            type="text"
            class="form-control form-control-sm"
            v-model="member.billing.city"
            ref="billingCity"
            :readonly="billingSame"
          />
        </div>
        <div class="form-group col-sm-6 col-xl-3">
          <label for="billingCountry">{{ $t('formLabels.country') }}</label>
          <country-select
            id="billingCountry"
            v-model="member.billing.country"
            :country="member.billing.country"
            class="form-control form-control-sm"
            :readonly="billingSame"
            @input="checkBillingCountry"
            ref="billingCountry"
            :usei18n="false"
            :placeholder="$t('formLabels.selectCountry')"
          />
        </div>
        <div class="form-group col-sm-6 col-xl-3">
          <label for="billingStateProv">{{ $t('formLabels.stateProv') }}</label>
          <region-select
            id="billingStateProv"
            v-model="member.billing.stateProv"
            :country="member.billing.country"
            :region="member.billing.stateProv"
            class="form-control form-control-sm"
            :readonly="billingSame"
            :regionName="true"
            ref="billingStateProv"
            :usei18n="false"
            :placeholder="$t('formLabels.selectRegion')"
          />
        </div>
        <div class="form-group col-lg-6">
          <label for="billingZipPostal">{{ $t('formLabels.zipPostal') }}</label>
          <input
            id="billingZipPostal"
            type="text"
            class="form-control form-control-sm"
            v-model="member.billing.zipPostal"
            ref="billingZipPostal"
            :readonly="billingSame"
          />
        </div>
        <div class="form-group col-lg-6" v-if="billingSame">
          <label for="billingPhone">{{ $t('formLabels.phone') }}</label>
          <input
            id="billingPhone"
            type="text"
            class="form-control form-control-sm"
            v-model="member.billing.phone"
            ref="billingPhone"
            readonly
          />
        </div>
        <div class="form-group col-sm-12 col-lg-6" v-else>
          <label for="billingPhone">{{ $t('formLabels.phone') }}</label>
          <VuePhoneNumberInput
            v-model="member.billing.phone"
            size="sm"
            id="billingPhone"
            :default-country-code="member.billing.country || null"
            :preferred-countries="['US', 'CA']"
            ref="billingPhone"
            :clearable="true"
          />
        </div>
      </div>

      <!-- SHIPPING SECTION -->
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
            <small class="form-check-small text-white" for="shippingSame">
              {{ $t('formLabels.useContact') }}
            </small>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="form-group col-lg-6 col-xl-3">
          <label for="shippingName">{{ $t('formLabels.name') }}</label>
          <input
            id="shippingName"
            type="text"
            class="form-control form-control-sm"
            v-model="member.shipping.name"
            ref="shippingName"
            :readonly="shippingSame"
          />
        </div>
        <div class="form-group col-lg-6 col-xl-3">
          <label for="shippingCompany">{{ $t('formLabels.company') }}</label>
          <input
            id="shippingCompany"
            type="text"
            class="form-control form-control-sm"
            v-model="member.shipping.company"
            ref="shippingCompany"
            :readonly="shippingSame"
          />
        </div>
        <div class="form-group col-xl-6">
          <label for="shippingEmail">{{ $t('formLabels.email') }}</label>
          <input
            id="shippingEmail"
            type="text"
            class="form-control form-control-sm"
            v-model="member.shipping.email"
            ref="shippingEmail"
            readonly
          />
        </div>
        <div class="form-group col-lg-6">
          <label for="shippingAddress1">{{ $t('formLabels.address1') }}</label>
          <input
            id="shippingAddress1"
            type="text"
            class="form-control form-control-sm"
            v-model="member.shipping.address1"
            ref="shippingAddress1"
            :readonly="shippingSame"
          />
        </div>
        <div class="form-group col-lg-6">
          <label for="shippingAddress2">{{ $t('formLabels.address2') }}</label>
          <input
            id="shippingAddress2"
            type="text"
            class="form-control form-control-sm"
            v-model="member.shipping.address2"
            ref="shippingAddress2"
            :readonly="shippingSame"
          />
        </div>
        <div class="form-group col-xl-6">
          <label for="shippingCity">{{ $t('formLabels.city') }}</label>
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
        <div class="form-group col-sm-6 col-xl-3">
          <label for="shippingCountry">{{ $t('formLabels.country') }}</label>
          <country-select
            id="shippingCountry"
            v-model="member.shipping.country"
            :country="member.shipping.country"
            class="form-control form-control-sm"
            @input="checkShippingCountry"
            :readonly="shippingSame"
            ref="shippingCountry"
            :usei18n="false"
            :placeholder="$t('formLabels.selectCountry')"
          />
        </div>
        <div class="form-group col-sm-6 col-xl-3">
          <label for="shippingStateProv">{{
            $t('formLabels.stateProv')
          }}</label>
          <region-select
            id="shippingStateProv"
            v-model="member.shipping.stateProv"
            :country="member.shipping.country"
            :region="member.shipping.stateProv"
            class="form-control form-control-sm"
            :readonly="shippingSame"
            :regionName="true"
            ref="shippingStateProv"
            :usei18n="false"
            :placeholder="$t('formLabels.selectRegion')"
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
            v-model="member.shipping.zipPostal"
            ref="shippingZipPostal"
            :readonly="shippingSame"
          />
        </div>
        <div class="form-group col-lg-6" v-if="shippingSame">
          <label for="shippingPhone">{{ $t('formLabels.phone') }}</label>
          <input
            id="shippingPhone"
            type="text"
            class="form-control form-control-sm"
            v-model="member.shipping.phone"
            ref="shippingPhone"
            :readonly="shippingSame"
          />
        </div>
        <div class="form-group col-lg-6" v-else>
          <label for="shippingPhone">{{ $t('formLabels.phone') }}</label>
          <VuePhoneNumberInput
            v-model="member.shipping.phone"
            id="shippingPhone"
            size="sm"
            :default-country-code="member.shipping.country || null"
            :preferred-countries="['US', 'CA']"
            ref="shippingPhone"
            :clearable="true"
          />
        </div>
      </div>
      <div class="row my-4">
        <div class="col-lg-6">
          <button class="large-btn btn-block" @click.prevent="updateMember">
            {{ $t('members.updateMember') }}
          </button>
        </div>
        <div class="col-lg-6">
          <router-link
            :to="`/dashboard/members/${this.member._id}`"
            class="large-btn danger-btn btn-block"
            tag="button"
            >{{ $t('cancel') }}</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import Gravatar from 'vue-gravatar';
import { mapGetters } from 'vuex';
import i18n from '../../i18n';
import toast from '../../helpers/toast';

export default {
  name: 'MemberByIdEdit',
  components: {
    VuePhoneNumberInput,
    Gravatar,
  },
  data() {
    return {
      shippingSame: false,
      billingSame: false,
      backupBilling: {},
      backupShipping: {},
    };
  },
  computed: {
    ...mapGetters(['getMember', 'isLoading', 'phoneTranslations']),
    member: function() {
      return this.getMember.member;
    },
    teams: function() {
      return this.getMember.teams;
    },
    translations: function() {
      return this.phoneTranslations;
    },
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      await this.$store.dispatch('getMemberDetails', this.$route.params.id);
      const breadcrumbs = [
        {
          text: i18n.t('menu.adminOnly.members'),
          link: '/dashboard/members',
        },
        {
          text: `${this.member.name}`,
          link: `/dashboard/members/${this.member._id}`,
        },
        {
          text: i18n.t('edit'),
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
  methods: {
    deleteMember: async function() {
      this.$store.commit('LOADING_TRUE');
      try {
        if (confirm(i18n.t('confirm1'))) {
          if (confirm(i18n.t('confirm2'))) {
            await this.$store.dispatch('deleteMember', this.member._id);
            this.$toasted.success(i18n.t('members.successDelete'));
            this.$router.push({ name: 'members' });
          }
        }
        this.$store.commit('LOADING_FALSE');
      } catch (err) {
        this.$toasted.error(err.response.data[0].error.message, {
          icon: 'exclamation-triangle',
        });
        this.$store.commit('LOADING_FALSE');
      }
    },
    copyDetails: function() {
      if (this.shippingSame === true) {
        this.member.shipping.name = this.member.name;
        this.mmeber.shipping.company = this.member.company;
        this.member.shipping.address1 = this.member.address1;
        this.member.shipping.address2 = this.member.address2;
        this.member.shipping.city = this.member.city;
        this.member.shipping.stateProv = this.member.stateProv;
        this.member.shipping.country = this.member.country;
        this.member.shipping.zipPostal = this.member.zipPostal;
        this.member.shipping.email = this.member.email;
      }
      if (this.billingSame === true) {
        this.member.billing.name = this.member.name;
        this.member.billing.company = this.member.company;
        this.member.billing.address1 = this.member.address1;
        this.member.billing.address2 = this.member.address2;
        this.member.billing.city = this.member.city;
        this.member.billing.stateProv = this.member.stateProv;
        this.member.billing.country = this.member.country;
        this.member.billing.zipPostal = this.member.zipPostal;
        this.member.billing.email = this.member.email;
      }
    },
    changeDetails: async function(event) {
      const target = event.target.id;

      if (this.shippingSame) {
        if (target === 'email') {
          this.member.shipping.email = this.member.email;
        } else if (target === 'name') {
          this.member.shipping.name = this.member.name;
        } else if (target === 'company') {
          this.member.shipping.company = this.member.company;
        } else if (target === 'address1') {
          this.member.shipping.address1 = this.member.address1;
        } else if (target === 'address2') {
          this.member.shipping.address2 = this.member.address2;
        } else if (target === 'city') {
          this.member.shipping.city = this.member.city;
        } else if (target === 'zipPostal') {
          this.member.shipping.zipPostal = this.member.zipPostal;
        }
      }
      if (this.billingSame) {
        if (target === 'email') {
          this.member.billing.email = this.member.email;
        } else if (target === 'name') {
          this.member.billing.name = this.member.name;
        } else if (target === 'company') {
          this.member.billing.company = this.member.company;
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
          company: this.member.company,
          email: this.member.email,
          address1: this.member.address1,
          address2: this.member.address2,
          city: this.member.city,
          stateProv: this.member.stateProv,
          country: this.member.country,
          zipPostal: this.member.zipPostal,
          phone: this.member.phone,
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
          company: this.member.company,
          email: this.member.email,
          address1: this.member.address1,
          address2: this.member.address2,
          city: this.member.city,
          stateProv: this.member.stateProv,
          country: this.member.country,
          zipPostal: this.member.zipPostal,
          phone: this.member.phone,
        };
      } else {
        this.member.shipping = this.backupShipping;
      }
    },
    checkRegion: function() {
      if (this.billingSame) {
        this.member.billing.stateProv = this.member.stateProv;
      }

      if (this.shippingSame) {
        this.member.shipping.stateProv = this.member.stateProv;
      }
    },
    checkCountry: function() {
      this.$refs.phone.countryCode = this.member.country;
      this.member.stateProv = '';
      this.$refs.stateProv.$el.focus();
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
      this.$refs.billingStateProv.$el.focus();
    },
    checkShippingCountry: function() {
      this.$refs.shippingPhone.countryCode = this.member.shipping.country;
      this.member.shipping.stateProv = '';
      this.$refs.shippingStateProv.$el.focus();
    },
    updateMember: async function() {
      const updatedMember = {
        name: this.member.name,
        company: this.member.company,
        phone: this.member.phone,
        address1: this.member.address1,
        address2: this.member.address2,
        city: this.member.city,
        stateProv: this.member.stateProv,
        country: this.member.country,
        zipPostal: this.member.zipPostal,
        shippingSame: this.shippingSame,
        shippingName: this.member.shipping.name,
        shippingCompany: this.member.shipping.company,
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
        billingCompany: this.member.billing.company,
        billingAddress1: this.member.billing.address1,
        billingAddress2: this.member.billing.address2,
        billingCity: this.member.billing.city,
        billingStateProv: this.member.billing.stateProv,
        billingCountry: this.member.billing.country,
        billingZipPostal: this.member.billing.zipPostal,
        billingPhone: this.member.billing.phone,
        billingEmail: this.member.billing.email,
      };
      try {
        await this.$store.dispatch('updateMember', {
          updatedMember,
          id: this.member._id,
        });
        this.$toasted.success(i18n.t('members.successUpdate'), {
          icon: 'check-circle',
        });
        this.$router.push({
          name: 'membersById',
          params: { id: this.member._id },
        });
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].error.message, {
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
  grid-gap: 0.75rem;
  width: 100%;
  height: 100%;
  grid-template-areas: 'sidebar-left middle-section';

  .middle-section {
    padding: $scrollbar-padding;
    h3 {
      display: none;
    }

    .form-group {
      label {
        margin-top: 0.3rem;
      }
    }

    .btn {
      display: inline-block;
      margin-bottom: 0.5rem;
    }
  }
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
      text-align: center;
      margin-bottom: 1rem;
    }

    .middle-section {
      h3 {
        display: block;
      }

      .btn {
        display: block;
      }
    }
  }
}
</style>
