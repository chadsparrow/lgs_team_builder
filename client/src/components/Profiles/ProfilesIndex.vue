<template>
  <div class="page container" v-if="!isLoading">
    <div class="sidebar-left">
      <div class="avatarWrapper">
        <Gravatar :email="memberDetails.email" default-img="mp" :size="200" />
        <a
          href="https://gravatar.com"
          target="_blank"
          class="small-btn btn-block mt-1"
          style="text-decoration: none;"
          >{{ $t('profiles.updateGravatar') }}</a
        >
      </div>
      <div class="row mt-2">
        <label class="col-12">{{ $t('profiles.timezone') }}:</label>
        <span class="col-12">{{ memberDetails.timezone }}</span>
      </div>
      <div class="row mt-2">
        <label class="col-12">{{ $t('members.memberSince') }}:</label>
        <span class="col-12">
          {{
            memberDetails.createdAt
              | moment(
                'timezone',
                memberDetails.timezone,
                'MMM Do YYYY - hh:mm a - z'
              )
          }}
        </span>
      </div>
      <div class="row mt-3 mx-0">
        <router-link
          tag="button"
          :to="`/dashboard/profile/edit`"
          class="small-btn btn-block"
        >
          <i class="fas fa-cog mr-2" style="vertical-align: middle;"></i
          >{{ $t('profiles.editProfile') }}
        </router-link>
        <router-link
          tag="button"
          :to="`/dashboard/profile/password`"
          class="small-btn danger-btn btn-block"
        >
          <i class="fas fa-lock mr-2" style="vertical-align: middle;"></i
          >{{ $t('profiles.changePassword') }}
        </router-link>
        <router-link
          tag="button"
          :to="`/dashboard/profile/email`"
          class="small-btn danger-btn btn-block"
        >
          <i class="fas fa-envelope mr-2" style="vertical-align: middle;"></i
          >{{ $t('profiles.updateEmail') }}
        </router-link>
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
        <div class="row info-spans mb-2">
          <InfoSpan
            labelText="formLabels.name"
            :spanText="memberDetails.name"
            name="name"
            classInfo="col-lg-6 col-xl-3"
          />
          <InfoSpan
            labelText="formLabels.company"
            :spanText="memberDetails.company || '--'"
            name="company"
            classInfo="col-lg-6 col-xl-3"
          />
          <InfoSpan
            labelText="formLabels.email"
            :spanText="memberDetails.email || '--'"
            name="email"
            classInfo="col-xl-6"
          />
          <InfoSpan
            labelText="formLabels.address1"
            :spanText="memberDetails.address1 || '--'"
            name="address1"
            classInfo="col-xl-6"
          />
          <InfoSpan
            labelText="formLabels.address2"
            :spanText="memberDetails.address2 || '--'"
            name="address2"
            classInfo="col-xl-6"
          />
          <InfoSpan
            labelText="formLabels.city"
            :spanText="memberDetails.city || '--'"
            name="city"
            classInfo="col-xl-6"
          />
          <InfoSpan
            labelText="formLabels.stateProv"
            :spanText="memberDetails.stateProv || '--'"
            name="stateProv"
            classInfo="col-lg-6 col-xl-3"
          />
          <InfoSpan
            labelText="formLabels.country"
            :spanText="memberDetails.country"
            name="country"
            classInfo="col-lg-6 col-xl-3"
          />
          <InfoSpan
            labelText="formLabels.zipPostal"
            :spanText="memberDetails.zipPostal"
            name="zipPostal"
            classInfo="col-lg-6"
          />
          <InfoSpan
            labelText="formLabels.phone"
            :spanText="memberDetails.phone"
            name="phone"
            classInfo="col-lg-6 mb-1"
          />
        </div>
      </div>

      <!-- BILLING SECTION -->
      <div class="billingSection">
        <div class="row m-0">
          <div class="section-header bg-secondary">
            <span class="text-white">{{ $t('formLabels.billing') }}</span>
          </div>
        </div>
        <div class="row info-spans mb-2">
          <InfoSpan
            labelText="formLabels.name"
            :spanText="memberDetails.billing.name"
            name="billingName"
            classInfo="col-lg-6 col-xl-3"
          />
          <InfoSpan
            labelText="formLabels.company"
            :spanText="memberDetails.billing.company || '--'"
            name="billingCompany"
            classInfo="col-lg-6 col-xl-3"
          />
          <InfoSpan
            labelText="formLabels.email"
            :spanText="memberDetails.billing.email"
            name="billingEmail"
            classInfo="col-xl-6"
          />
          <InfoSpan
            labelText="formLabels.address1"
            :spanText="memberDetails.billing.address1"
            name="billingAddress1"
            classInfo="col-xl-6"
          />
          <InfoSpan
            labelText="formLabels.address2"
            :spanText="memberDetails.billing.address2 || '--'"
            name="billingAddress2"
            classInfo="col-xl-6"
          />
          <InfoSpan
            labelText="formLabels.city"
            :spanText="memberDetails.billing.city"
            name="billingCity"
            classInfo="col-xl-6"
          />
          <InfoSpan
            labelText="formLabels.stateProv"
            :spanText="memberDetails.billing.stateProv"
            name="billingStateProv"
            classInfo="col-lg-6 col-xl-3"
          />
          <InfoSpan
            labelText="formLabels.country"
            :spanText="memberDetails.billing.country"
            name="billingCountry"
            classInfo="col-lg-6 col-xl-3"
          />
          <InfoSpan
            labelText="formLabels.zipPostal"
            :spanText="memberDetails.billing.zipPostal"
            name="billingZipPostal"
            classInfo="col-lg-6"
          />
          <InfoSpan
            labelText="formLabels.phone"
            :spanText="memberDetails.billing.phone"
            name="billingPhone"
            classInfo="col-lg-6 mb-1"
          />
        </div>
      </div>

      <!-- SHIPPING SECTION -->
      <div class="shippingSection mb-3">
        <div class="row m-0">
          <div class="section-header bg-secondary">
            <span class="text-white">{{ $t('formLabels.shipping') }}</span>
          </div>
        </div>
        <div class="row info-spans mb-2">
          <InfoSpan
            labelText="formLabels.name"
            :spanText="memberDetails.shipping.name"
            name="shippingName"
            classInfo="col-lg-6 col-xl-3"
          />
          <InfoSpan
            labelText="formLabels.company"
            :spanText="memberDetails.shipping.company || '--'"
            name="shippingCompany"
            classInfo="col-lg-6 col-xl-3"
          />
          <InfoSpan
            labelText="formLabels.email"
            :spanText="memberDetails.shipping.email || '--'"
            name="shippingEmail"
            classInfo="col-xl-6"
          />
          <InfoSpan
            labelText="formLabels.address1"
            :spanText="memberDetails.shipping.address1"
            name="shippingAddress1"
            classInfo="col-xl-6"
          />
          <InfoSpan
            labelText="formLabels.address2"
            :spanText="memberDetails.shipping.address2 || '--'"
            name="shippingAddress2"
            classInfo="col-xl-6"
          />
          <InfoSpan
            labelText="formLabels.city"
            :spanText="memberDetails.shipping.city"
            name="shippingCity"
            classInfo="col-xl-6"
          />
          <InfoSpan
            labelText="formLabels.stateProv"
            :spanText="memberDetails.shipping.stateProv"
            name="shippingStateProv"
            classInfo="col-lg-6 col-xl-3"
          />
          <InfoSpan
            labelText="formLabels.country"
            :spanText="memberDetails.shipping.country"
            name="shippingCountry"
            classInfo="col-lg-6 col-xl-3"
          />
          <InfoSpan
            labelText="formLabels.zipPostal"
            :spanText="memberDetails.shipping.zipPostal"
            name="shippingZipPostal"
            classInfo="col-lg-6"
          />
          <InfoSpan
            labelText="formLabels.phone"
            :spanText="memberDetails.shipping.phone"
            name="shippingPhone"
            classInfo="col-lg-6"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Gravatar from 'vue-gravatar';
import InfoSpan from '../Shared/InfoSpan';
import { mapGetters } from 'vuex';
import toast from '../../helpers/toast';

export default {
  name: 'ProfilesIndex',
  components: {
    Gravatar,
    InfoSpan,
  },
  computed: {
    ...mapGetters(['isLoading', 'loggedInMember']),
  },
  data() {
    return {
      memberDetails: {},
    };
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      const res = await this.$store.dispatch(
        'getMemberDetails',
        this.loggedInMember._id
      );
      this.memberDetails = res.data.member;
      const breadcrumbs = [
        {
          text: 'My Profile',
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
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
  grid-template-areas: 'sidebar-left middle-section';

  .avatarWrapper {
    width: 100%;
    max-width: 200px;
    margin: 0 auto 1rem;
  }

  .middle-section {
    padding: $scrollbar-padding;
    h3 {
      display: none;
    }

    .btn {
      display: inline-block;
      margin-bottom: 1.5rem;
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
      font-size: $base-font-size;
      margin-bottom: 1rem;
    }

    .middle-section {
      padding: $scrollbar-padding;
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
