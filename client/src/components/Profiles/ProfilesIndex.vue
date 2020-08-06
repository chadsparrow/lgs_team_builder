<template>
  <div class="page container" v-if="!isLoading">
    <div class="sidebar-left">
      <div class="avatarWrapper">
        <Gravatar :email="memberDetails.email" default-img="mp" :size="200" />
        <a
          href="https://gravatar.com"
          target="_blank"
          class="btn btn-sm btn-block btn-info mt-1"
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
          :to="`/dashboard/profile/edit`"
          class="btn btn-sm btn-block btn-info"
        >
          <i class="fas fa-cog mr-2" style="vertical-align: middle;"></i
          >{{ $t('profiles.editProfile') }}
        </router-link>
        <router-link
          :to="`/dashboard/profile/password`"
          class="btn btn-sm btn-block btn-danger"
        >
          <i class="fas fa-lock mr-2" style="vertical-align: middle;"></i
          >{{ $t('profiles.changePassword') }}
        </router-link>
        <router-link
          :to="`/dashboard/profile/email`"
          class="btn btn-sm btn-block btn-danger"
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
          <div class="col-lg-6 col-xl-3">
            <label>{{ $t('formLabels.name') }}</label>
            <br />
            <span>{{ memberDetails.name }}</span>
          </div>
          <div class="col-lg-6 col-xl-3">
            <label>{{ $t('formLabels.company') }}</label>
            <br />
            <span>{{ memberDetails.company || '--' }}</span>
          </div>
          <div class="col-xl-6">
            <label>{{ $t('formLabels.email') }}</label>
            <br />
            <span>{{ memberDetails.email }}</span>
          </div>
          <div class="col-xl-6">
            <label>{{ $t('formLabels.address1') }}</label>
            <br />
            <span>{{ memberDetails.address1 }}</span>
          </div>
          <div class="col-xl-6">
            <label>{{ $t('formLabels.address2') }}</label>
            <br />
            <span>{{ memberDetails.address2 || '--' }}</span>
          </div>
          <div class="col-xl-6">
            <label>{{ $t('formLabels.city') }}</label>
            <br />
            <span>{{ memberDetails.city }}</span>
          </div>
          <div class="col-lg-6 col-xl-3">
            <label>{{ $t('formLabels.stateProv') }}</label>
            <br />
            <span>{{ memberDetails.stateProv }}</span>
          </div>
          <div class="col-lg-6 col-xl-3">
            <label>{{ $t('formLabels.country') }}</label>
            <br />
            <span>{{ memberDetails.country }}</span>
          </div>
          <div class="col-lg-6">
            <label>{{ $t('formLabels.zipPostal') }}</label>
            <br />
            <span>{{ memberDetails.zipPostal }}</span>
          </div>
          <div class="col-lg-6 mb-1">
            <label>{{ $t('formLabels.phone') }}</label>
            <br />
            <span>{{ memberDetails.phone }}</span>
          </div>
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
          <div class="col-lg-6 col-xl-3">
            <label>{{ $t('formLabels.name') }}</label>
            <br />
            <span>{{ memberDetails.billing.name }}</span>
          </div>
          <div class="col-lg-6 col-xl-3">
            <label>{{ $t('formLabels.company') }}</label>
            <br />
            <span>{{ memberDetails.billing.company || '--' }}</span>
          </div>
          <div class="col-xl-6">
            <label>{{ $t('formLabels.email') }}</label>
            <br />
            <span>{{ memberDetails.billing.email }}</span>
          </div>
          <div class="col-xl-6">
            <label>{{ $t('formLabels.address1') }}</label>
            <br />
            <span>{{ memberDetails.billing.address1 }}</span>
          </div>
          <div class="col-xl-6">
            <label>{{ $t('formLabels.address2') }}</label>
            <br />
            <span>{{ memberDetails.billing.address2 || '--' }}</span>
          </div>
          <div class="col-xl-6">
            <label>{{ $t('formLabels.city') }}</label>
            <br />
            <span>{{ memberDetails.billing.city }}</span>
          </div>
          <div class="col-lg-6 col-xl-3">
            <label>{{ $t('formLabels.stateProv') }}</label>
            <br />
            <span>{{ memberDetails.billing.stateProv }}</span>
          </div>
          <div class="col-lg-6 col-xl-3">
            <label>{{ $t('formLabels.country') }}</label>
            <br />
            <span>{{ memberDetails.billing.country }}</span>
          </div>
          <div class="col-lg-6">
            <label>{{ $t('formLabels.zipPostal') }}</label>
            <br />
            <span>{{ memberDetails.billing.zipPostal }}</span>
          </div>
          <div class="col-lg-6 mb-1">
            <label>{{ $t('formLabels.phone') }}</label>
            <br />
            <span>{{ memberDetails.billing.phone }}</span>
          </div>
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
          <div class="col-lg-6 col-xl-3">
            <label>{{ $t('formLabels.name') }}</label>
            <br />
            <span>{{ memberDetails.shipping.name }}</span>
          </div>
          <div class="col-lg-6 col-xl-3">
            <label>{{ $t('formLabels.company') }}</label>
            <br />
            <span>{{ memberDetails.shipping.company || '--' }}</span>
          </div>
          <div class="col-xl-6">
            <label>{{ $t('formLabels.email') }}</label>
            <br />
            <span>{{ memberDetails.shipping.email }}</span>
          </div>
          <div class="col-xl-6">
            <label>{{ $t('formLabels.address1') }}</label>
            <br />
            <span>{{ memberDetails.shipping.address1 }}</span>
          </div>
          <div class="col-xl-6">
            <label>{{ $t('formLabels.address2') }}</label>
            <br />
            <span>{{ memberDetails.shipping.address2 || '--' }}</span>
          </div>
          <div class="col-xl-6">
            <label>{{ $t('formLabels.city') }}</label>
            <br />
            <span>{{ memberDetails.shipping.city }}</span>
          </div>
          <div class="col-lg-6 col-xl-3">
            <label>{{ $t('formLabels.stateProv') }}</label>
            <br />
            <span>{{ memberDetails.shipping.stateProv }}</span>
          </div>
          <div class="col-lg-6 col-xl-3">
            <label>{{ $t('formLabels.country') }}</label>
            <br />
            <span>{{ memberDetails.shipping.country }}</span>
          </div>
          <div class="col-lg-6">
            <label>{{ $t('formLabels.zipPostal') }}</label>
            <br />
            <span>{{ memberDetails.shipping.zipPostal }}</span>
          </div>
          <div class="col-lg-6">
            <label>{{ $t('formLabels.phone') }}</label>
            <br />
            <span>{{ memberDetails.shipping.phone }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Gravatar from 'vue-gravatar';
import { mapGetters } from 'vuex';

export default {
  name: 'ProfilesIndex',
  components: {
    Gravatar,
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
      this.$toasted.error(err.response.data[0].message, {
        icon: 'exclamation-triangle',
      });
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
