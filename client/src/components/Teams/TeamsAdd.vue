<template>
  <div class="container-fluid" v-if="!isLoading">
    <div class="row">
      <div class="col middle-section">
        <form novalidate>
          <div class="row mb-3">
            <div class="form-group col-12 mb-2">
              <label for="name">{{ $t('teams.teamName') }}</label>
              <input
                id="name"
                type="text"
                class="form-control form-control-lg"
                v-model="name"
                ref="name"
                autofocus
              />
            </div>

            <!-- ADMIN SELECTOR -->
            <div class="form-group col-md-2">
              <label for="teamId">{{ $t('teams.erpId') }}</label>
              <input
                id="teamId"
                type="text"
                class="form-control form-control-sm"
                v-model="teamId"
                ref="teamId"
              />
            </div>
            <div class="form-group col-md-4">
              <label for="adminId">{{ $t('teams.teamAdmin') }}</label>
              <select
                class="form-control form-control-sm"
                id="adminId"
                v-model="adminId"
                ref="adminId"
              >
                <option v-for="admin of adminsList" :key="admin._id" :value="admin._id">{{
                  admin.name
                }}</option>
              </select>
            </div>
            <!-- MANAGER SELECTOR -->
            <div class="form-group col-md-6" v-if="members.length > 0">
              <label for="managerId">{{ $t('teams.teamManager') }}</label>
              <vSelect
                id="managerId"
                v-model="chosenMember"
                label="email"
                :options="members"
                @input="getManagerDetails"
                ref="managerId"
              ></vSelect>
            </div>
          </div>
          <!-- MAIN CONTACT -->
          <div class="section-header bg-secondary">
            <span>{{ $t('formLabels.mainContact') }}</span>
            <div class="form-check text-center">
              <input
                type="checkbox"
                class="form-check-input"
                id="useManagerDetails"
                v-model="useManagerDetails"
                @change="copyManagertoMain"
                ref="useManagerDetails"
                :disabled="!managerId || chosenMember === null"
              />
              <small class="form-check-label text-white" for="useManagerDetails">{{
                $t('formLabels.useManager')
              }}</small>
            </div>
          </div>
          <div class="row px-2 mb-3">
            <div class="form-group col-sm-6 col-xl-3">
              <label for="contactName">{{ $t('formLabels.name') }}</label>
              <input
                id="contactName"
                type="text"
                class="form-control form-control-sm"
                v-model="contactName"
                ref="contactName"
                @change="changeDetails"
                :readonly="useManagerDetails"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3">
              <label for="contactCompany">{{ $t('formLabels.company') }}</label>
              <input
                id="contactCompany"
                type="text"
                class="form-control form-control-sm"
                v-model="contactCompany"
                ref="contactCompany"
                @change="changeDetails"
                :readonly="useManagerDetails"
              />
            </div>
            <div class="form-group col-xl-6">
              <label for="contactEmail">{{ $t('formLabels.email') }}</label>
              <input
                id="contactEmail"
                type="email"
                class="form-control form-control-sm"
                v-model="contactEmail"
                ref="contactEmail"
                @change="changeDetails"
                :readonly="useManagerDetails"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="contactAddress1">{{ $t('formLabels.address1') }}</label>
              <input
                id="contactAddress1"
                type="text"
                class="form-control form-control-sm"
                v-model="contactAddress1"
                ref="contactAddress1"
                @change="changeDetails"
                :readonly="useManagerDetails"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="contactAddress2">{{ $t('formLabels.address2') }}</label>
              <input
                id="contactAddress2"
                type="text"
                class="form-control form-control-sm"
                v-model="contactAddress2"
                ref="contactAddress2"
                @change="changeDetails"
                :readonly="useManagerDetails"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="contactCity">{{ $t('formLabels.city') }}</label>
              <input
                id="contactCity"
                type="text"
                class="form-control form-control-sm"
                v-model="contactCity"
                ref="contactCity"
                @change="changeDetails"
                :readonly="useManagerDetails"
              />
            </div>
            <div class="form-group col-sm-6 col-lg-3">
              <label for="contactCountry">{{ $t('formLabels.country') }}</label>
              <country-select
                id="contactCountry"
                v-model="contactCountry"
                :country="contactCountry"
                class="form-control form-control-sm"
                @input="checkCountry"
                :readonly="useManagerDetails"
                ref="contactCountry"
                :usei18n="false"
                :placeholder="$t('formLabels.selectCountry')"
              />
            </div>
            <div class="form-group col-sm-6 col-lg-3">
              <label for="contactStateProv">{{ $t('formLabels.stateProv') }}</label>
              <region-select
                id="contactStateProv"
                v-model="contactStateProv"
                :country="contactCountry"
                :region="contactStateProv"
                class="form-control form-control-sm"
                @input="checkRegion"
                :readonly="useManagerDetails"
                :regionName="true"
                ref="contactStateProv"
                :usei18n="false"
                :placeholder="$t('formLabels.selectRegion')"
              />
            </div>

            <div class="form-group col-md-6">
              <label for="contactZipPostal">{{ $t('formLabels.zipPostal') }}</label>
              <input
                id="contactZipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="contactZipPostal"
                ref="contactZipPostal"
                @change="changeDetails"
                :readonly="useManagerDetails"
              />
            </div>
            <div class="form-group col-md-6" v-if="useManagerDetails">
              <label for="contactPhone">{{ $t('formLabels.phone') }}</label>
              <input
                id="contactPhone"
                type="text"
                class="form-control form-control-sm"
                v-model="contactPhone"
                :readonly="useManagerDetails"
              />
            </div>
            <div class="form-group col-md-6" v-else>
              <label for="contactPhone">{{ $t('formLabels.phone') }}</label>
              <VuePhoneNumberInput
                v-model="contactPhone"
                id="contactPhone"
                size="sm"
                :preferred-countries="['US', 'CA']"
                ref="contactPhone"
                :clearable="true"
                :no-use-browser-locale="true"
                @update="copyPhone"
                :translations="phoneTranslations"
              />
            </div>
          </div>
          <!-- BULK SHIPPING -->
          <div class="section-header bg-secondary">
            <span class="mr-4">{{ $t('formLabels.bulkShipping') }}</span>
            <div class="radios m-0">
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="bulkUseDetails"
                  id="useAboveDetails"
                  value="above"
                  v-model="bulkUseDetails"
                  @change="copytoBulk"
                />
                <small class="form-check-label text-white" for="useAboveDetails">{{
                  $t('formLabels.useAbove')
                }}</small>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="bulkUseDetails"
                  id="useManagerDetails2"
                  value="manager"
                  v-model="bulkUseDetails"
                  :disabled="!managerId || chosenMember === null"
                  @change="copytoBulk"
                />
                <small class="form-check-label text-white" for="useManagerDetails2">{{
                  $t('formLabels.useManagerShipping')
                }}</small>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="bulkUseDetails"
                  id="useNewDetails"
                  value="other"
                  v-model="bulkUseDetails"
                  @change="copytoBulk"
                />
                <small class="form-check-label text-white" for="useNewDetails">{{
                  $t('formLabels.useOther')
                }}</small>
              </div>
            </div>
          </div>
          <div class="row px-2">
            <div class="form-group col-sm-6 col-xl-3">
              <label for="shippingName">{{ $t('formLabels.name') }}</label>
              <input
                id="shippingName"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingName"
                ref="shippingName"
                :readonly="bulkUseDetails !== 'other'"
              />
            </div>
            <div class="form-group col-sm-6 col-xl-3">
              <label for="shippingCompany">{{ $t('formLabels.company') }}</label>
              <input
                id="shippingCompany"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingCompany"
                ref="shippingCompany"
                :readonly="bulkUseDetails !== 'other'"
              />
            </div>
            <div class="form-group col-xl-6">
              <label for="shippingEmail">{{ $t('formLabels.email') }}</label>
              <input
                id="shippingEmail"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingEmail"
                ref="shippingEmail"
                :readonly="bulkUseDetails !== 'other'"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="shippingAddress1">{{ $t('formLabels.address1') }}</label>
              <input
                id="shippingAddress1"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingAddress1"
                ref="shippingAddress1"
                :readonly="bulkUseDetails !== 'other'"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="shippingAddress2">{{ $t('formLabels.address2') }}</label>
              <input
                id="shippingAddress2"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingAddress2"
                ref="shippingAddress2"
                :readonly="bulkUseDetails !== 'other'"
              />
            </div>
            <div class="form-group col-lg-6">
              <label for="shippingCity">{{ $t('formLabels.city') }}</label>
              <input
                id="shippingCity"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingCity"
                @change="changeDetails"
                ref="shippingCity"
                :readonly="bulkUseDetails !== 'other'"
              />
            </div>
            <div class="form-group col-sm-6 col-lg-3">
              <label for="shippingCountry">{{ $t('formLabels.country') }}</label>
              <country-select
                id="shippingCountry"
                v-model="shippingCountry"
                :country="shippingCountry"
                class="form-control form-control-sm"
                @input="checkShippingCountry"
                :readonly="bulkUseDetails !== 'other'"
                :usei18n="false"
                :placeholder="$t('formLabels.selectCountry')"
              />
            </div>
            <div class="form-group col-sm-6 col-lg-3">
              <label for="shippingStateProv">{{ $t('formLabels.stateProv') }}</label>
              <region-select
                id="shippingStateProv"
                v-model="shippingStateProv"
                :country="shippingCountry"
                :region="shippingStateProv"
                class="form-control form-control-sm"
                :regionName="true"
                :readonly="bulkUseDetails !== 'other'"
                :usei18n="false"
                :placeholder="$t('formLabels.selectRegion')"
              />
            </div>

            <div class="form-group col-md-6">
              <label for="shippingZipPostal">{{ $t('formLabels.zipPostal') }}</label>
              <input
                id="shippingZipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingZipPostal"
                ref="shippingZipPostal"
                :readonly="bulkUseDetails !== 'other'"
              />
            </div>
            <div class="form-group col-md-6" v-if="bulkUseDetails !== 'other'">
              <label for="shippingPhone">{{ $t('formLabels.phone') }}</label>
              <input
                id="shippingPhone"
                type="text"
                class="form-control form-control-sm"
                v-model="shippingPhone"
                readonly
              />
            </div>
            <div class="form-group col-md-6" v-else>
              <label for="contactPhone">{{ $t('formLabels.phone') }}</label>
              <VuePhoneNumberInput
                v-model="shippingPhone"
                id="shippingPhone"
                size="sm"
                ref="shippingPhone"
                :clearable="true"
                :no-use-browser-locale="true"
                :translations="phoneTranslations"
              />
            </div>
          </div>
          <div class="row mt-4 mb-5">
            <div class="col-sm-6">
              <button class="btn btn-block btn-info" @click.prevent="addTeam">
                {{ $t('teams.addTeam') }}
              </button>
            </div>
            <div class="col-sm-6">
              <router-link to="/dashboard/teams" class="btn btn-block btn-danger">{{
                $t('cancel')
              }}</router-link>
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
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { mapGetters } from 'vuex';
import i18n from '../../i18n';

export default {
  name: 'TeamsAdd',
  components: {
    VuePhoneNumberInput,
    vSelect
  },
  data() {
    return {
      name: '',
      logo: null,
      adminId: '',
      managerId: '',
      teamId: '',
      contactName: '',
      contactCompany: '',
      contactAddress1: '',
      contactAddress2: '',
      contactCity: '',
      contactStateProv: '',
      contactCountry: '',
      contactZipPostal: '',
      contactPhone: '',
      contactEmail: '',
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
      managerDetails: {},
      useManagerDetails: false,
      bulkUseDetails: 'other',
      adminsList: [],
      backupContact: {},
      backupShipping: {},
      chosenMember: ''
    };
  },
  computed: {
    ...mapGetters(['isLoading', 'loggedInMember', 'allMembers', 'phoneTranslations']),
    member: function() {
      return this.loggedInMember;
    },
    members: function() {
      return this.allMembers;
    }
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      const admins = await this.$store.dispatch('getAdmins');
      this.adminsList = admins.data;

      await this.$store.dispatch('getMembers');
      this.adminId = this.member._id;
      const breadcrumbs = [
        {
          text: i18n.t('menu.adminOnly.teams'),
          link: '/dashboard/teams'
        },
        {
          text: i18n.t('teams.addTeam'),
          link: `#`
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    addTeam: async function() {
      const newTeam = {
        name: this.name,
        logo: this.logo,
        adminId: this.adminId,
        managerId: this.managerId,
        teamId: this.teamId,
        contactName: this.contactName,
        contactCompany: this.contactCompany,
        contactAddress1: this.contactAddress1,
        contactAddress2: this.contactAddress2,
        contactCity: this.contactCity,
        contactStateProv: this.contactStateProv,
        contactCountry: this.contactCountry,
        contactZipPostal: this.contactZipPostal,
        contactPhone: this.contactPhone,
        contactEmail: this.contactEmail,
        shippingName: this.shippingName,
        shippingCompany: this.shippingCompany,
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
        const res = await this.$store.dispatch('addTeam', newTeam);
        this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
        this.$router.push({ name: 'teams' });
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    getManagerDetails: async function() {
      try {
        if (this.chosenMember !== null) {
          const res = await this.$store.dispatch('getMemberDetails', this.chosenMember._id);
          const manager = res.data.member;

          const {
            _id,
            name,
            company,
            address1,
            address2,
            city,
            stateProv,
            country,
            zipPostal,
            email,
            phone,
            timezone,
            shipping
          } = manager;

          this.managerDetails = {
            name,
            company,
            address1,
            address2,
            city,
            stateProv,
            country,
            zipPostal,
            email,
            phone,
            timezone,
            shipping
          };

          this.managerId = _id;

          if (this.useManagerDetails) this.copyManagertoMain();
          if (this.bulkUseDetails === 'manager') this.copytoBulk();
        } else {
          this.useManagerDetails = false;
          this.bulkUseDetails = 'other';
        }
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    copyManagertoMain: async function() {
      if (this.useManagerDetails) {
        this.backupContact = {
          name: this.contactName,
          company: this.contactCompany,
          address1: this.contactAddress1,
          address2: this.contactAddress2,
          city: this.contactCity,
          stateProv: this.contactStateProv,
          country: this.contactCountry,
          zipPostal: this.contactZipPostal,
          phone: this.contactPhone,
          email: this.contactEmail
        };

        const {
          name,
          company,
          address1,
          address2,
          city,
          stateProv,
          country,
          zipPostal,
          email,
          phone
        } = this.managerDetails;
        this.contactName = name;
        this.contactCompany = company;
        this.contactAddress1 = address1;
        this.contactAddress2 = address2;
        this.contactCity = city;
        this.contactStateProv = stateProv;
        this.contactCountry = country;
        this.contactZipPostal = zipPostal;
        this.contactPhone = phone;
        this.contactEmail = email;
      } else {
        const {
          name,
          company,
          address1,
          address2,
          city,
          stateProv,
          country,
          zipPostal,
          phone,
          email
        } = this.backupContact;
        this.contactName = name;
        this.contactCompany = company;
        this.contactAddress1 = address1;
        this.contactAddress2 = address2;
        this.contactCity = city;
        this.contactStateProv = stateProv;
        this.contactCountry = country;
        this.contactZipPostal = zipPostal;
        this.contactPhone = phone;
        this.contactEmail = email;
      }

      if (this.bulkUseDetails === 'above') {
        this.backupShipping = {
          name: this.shippingName,
          company: this.shippingCompany,
          address1: this.shippingAddress1,
          address2: this.shippingAddress2,
          city: this.shippingCity,
          stateProv: this.shippingStateProv,
          country: this.shippingCountry,
          zipPostal: this.shippingZipPostal,
          phone: this.shippingPhone,
          email: this.shippingEmail
        };

        this.shippingName = this.contactName;
        this.shippingCompany = this.contactCompany;
        this.shippingAddress1 = this.contactAddress1;
        this.shippingAddress2 = this.contactAddress2;
        this.shippingCity = this.contactCity;
        this.shippingStateProv = this.contactStateProv;
        this.shippingCountry = this.contactCountry;
        this.shippingZipPostal = this.contactZipPostal;
        this.shippingPhone = this.contactPhone;
        this.shippingEmail = this.contactEmail;
      }
    },
    copytoBulk: function() {
      if (this.bulkUseDetails === 'manager') {
        const { shipping, timezone } = this.managerDetails;
        this.backupShipping = {
          name: this.shippingName,
          company: this.shippingCompany,
          address1: this.shippingAddress1,
          address2: this.shippingAddress2,
          city: this.shippingCity,
          stateProv: this.shippingStateProv,
          country: this.shippingCountry,
          zipPostal: this.shippingZipPostal,
          phone: this.shippingPhone,
          email: this.shippingEmail
        };
        this.shippingName = shipping.name;
        this.shippingCompany = shipping.company;
        this.shippingAddress1 = shipping.address1;
        this.shippingAddress2 = shipping.address2;
        this.shippingCity = shipping.city;
        this.shippingStateProv = shipping.stateProv;
        this.shippingCountry = shipping.country;
        this.shippingZipPostal = shipping.zipPostal;
        this.shippingPhone = shipping.phone;
        this.shippingEmail = shipping.email;
        this.timezone = timezone;
      } else if (this.bulkUseDetails === 'above') {
        this.backupShipping = {
          name: this.shippingName,
          company: this.shippingCompany,
          address1: this.shippingAddress1,
          address2: this.shippingAddress2,
          city: this.shippingCity,
          stateProv: this.shippingStateProv,
          country: this.shippingCountry,
          zipPostal: this.shippingZipPostal,
          phone: this.shippingPhone,
          email: this.shippingEmail
        };
        this.shippingName = this.contactName;
        this.shippingCompany = this.contactCompany;
        this.shippingAddress1 = this.contactAddress1;
        this.shippingAddress2 = this.contactAddress2;
        this.shippingCity = this.contactCity;
        this.shippingStateProv = this.contactStateProv;
        this.shippingCountry = this.contactCountry;
        this.shippingZipPostal = this.contactZipPostal;
        this.shippingPhone = this.contactPhone;
        this.shippingEmail = this.contactEmail;
      } else {
        const {
          name,
          company,
          address1,
          address2,
          city,
          stateProv,
          country,
          zipPostal,
          phone,
          email
        } = this.backupShipping;
        this.shippingName = name;
        this.shippingCompany = company;
        this.shippingAddress1 = address1;
        this.shippingAddress2 = address2;
        this.shippingCity = city;
        this.shippingStateProv = stateProv;
        this.shippingCountry = country;
        this.shippingZipPostal = zipPostal;
        this.shippingPhone = phone;
        this.shippingEmail = email;
        this.$refs.shippingName.focus();
      }
    },
    changeDetails: function(event) {
      if (event.target) {
        const target = event.target.id;

        if (this.bulkUseDetails === 'above') {
          if (target === 'contactEmail') {
            this.shippingEmail = this.contactEmail;
          } else if (target === 'contactName') {
            this.shippingName = this.contactName;
          } else if (target === 'contactCompany') {
            this.shippingCompany = this.contactCompany;
          } else if (target === 'contactAddress1') {
            this.shippingAddress1 = this.contactAddress1;
          } else if (target === 'contactAddress2') {
            this.shippingAddress2 = this.contactAddress2;
          } else if (target === 'contactCity') {
            this.shippingCity = this.contactCity;
          } else if (target === 'contactZipPostal') {
            this.shippingZipPostal = this.contactZipPostal;
          }
        }
      }
    },
    copyPhone: function() {
      if (this.bulkUseDetails === 'above' && event.phoneNumber) {
        this.shippingPhone = event.phoneNumber;
      }
    },
    checkRegion: function() {
      if (this.bulkUseDetails === 'above') {
        this.shippingStateProv = this.contactStateProv;
      }
    },
    checkCountry: function() {
      this.$refs.contactPhone.countryCode = this.contactCountry;
      this.contactStateProv = '';

      if (this.bulkUseDetails === 'above') {
        this.shippingCountry = this.contactCountry;
        this.shippingStateProv = '';
      }
    },
    checkShippingCountry: function() {
      this.$refs.shippingPhone.countryCode = this.shippingCountry;
    }
  }
};
</script>

<style lang="scss" scoped>
.form-group {
  margin-top: 0.3rem;
}
</style>
