<template>
  <div class="page container" v-if="!isLoading">
    <div class="sidebar-left">
      <div class="avatarWrapper">
        <Gravatar
          :email="member.email"
          default-img="mp"
          :size="200"
          class="avatar"
        />
      </div>
      <div class="row p-1 mt-2">
        <label class="col-12">{{ $t('members.memberSince') }}:</label>
        <span class="col-12">{{
          member.createdAt
            | moment('timezone', member.timezone, 'MMM Do YYYY / hh:mm a - z')
        }}</span>
      </div>
      <div class="row p-1">
        <label class="col-12">{{ $t('members.memberRole') }}:</label>
        <span class="col-12">{{
          member.isAdmin ? $t('admin') : $t('member')
        }}</span>
      </div>
      <div class="row p-1">
        <label class="col-12">{{ $t('members.memberTZ') }}:</label>
        <span class="col-12">{{ member.timezone }}</span>
      </div>
      <div v-if="teams && teams.length > 0">
        <label class="ml-1 mb-2">{{ $t('members.memberOf') }}</label>
        <ul class="list-group">
          <li
            class="list-group-item list-group-item-action"
            v-for="team of teams"
            :key="team._id"
            @click.prevent="loadTeam(team._id)"
          >
            {{ team.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="middle-section">
      <h3 class="text-center">{{ $t('formLabels.information') }}</h3>
      <div class="row m-0">
        <div class="section-header bg-secondary col-sm-12">
          <span class="text-white">{{ $t('formLabels.contact') }}</span>
        </div>
      </div>
      <div class="row px-1 info-spans">
        <InfoSpan
          labelText="formLabels.name"
          :spanText="member.name"
          name="name"
          classInfo="col-lg-6 col-xl-3"
        />
        <InfoSpan
          labelText="formLabels.company"
          :spanText="member.company || '--'"
          name="company"
          classInfo="col-lg-6 col-xl-3"
        />
        <InfoSpan
          labelText="formLabels.email"
          :spanText="member.email"
          name="email"
          classInfo="col-xl-6"
        />
        <InfoSpan
          labelText="formLabels.address1"
          :spanText="member.address1"
          name="address1"
          classInfo="col-lg-6"
        />
        <InfoSpan
          labelText="formLabels.address2"
          :spanText="member.address2 || '--'"
          name="address2"
          classInfo="col-lg-6"
        />
        <InfoSpan
          labelText="formLabels.city"
          :spanText="member.city"
          name="city"
          classInfo="col-sm-6"
        />
        <InfoSpan
          labelText="formLabels.stateProv"
          :spanText="member.stateProv"
          name="stateProv"
          classInfo="col-sm-4"
        />
        <InfoSpan
          labelText="formLabels.country"
          :spanText="member.country"
          name="country"
          classInfo="col-sm-2"
        />
        <InfoSpan
          labelText="formLabels.zipPostal"
          :spanText="member.zipPostal"
          name="zipPostal"
          classInfo="col-md-6"
        />
        <InfoSpan
          labelText="formLabels.phone"
          :spanText="member.phone"
          name="phone"
          classInfo="col-md-6"
        />
      </div>
      <div class="row m-0">
        <div class="section-header mt-2 bg-secondary">
          <span class="text-white">{{ $t('formLabels.billing') }}</span>
        </div>
      </div>
      <div class="row px-1 info-spans">
        <InfoSpan
          labelText="formLabels.name"
          :spanText="member.billing.name"
          name="billingName"
          classInfo="col-lg-6 col-xl-3"
        />
        <InfoSpan
          labelText="formLabels.company"
          :spanText="member.billing.company || '--'"
          name="billingCompany"
          classInfo="col-lg-6 col-xl-3"
        />
        <InfoSpan
          labelText="formLabels.email"
          :spanText="member.billing.email"
          name="billingEmail"
          classInfo="col-xl-6"
        />
        <InfoSpan
          labelText="formLabels.address1"
          :spanText="member.billing.address1"
          name="billingAddress1"
          classInfo="col-lg-6"
        />
        <InfoSpan
          labelText="formLabels.address2"
          :spanText="member.billing.address2 || '--'"
          name="billingAddress2"
          classInfo="col-lg-6"
        />
        <InfoSpan
          labelText="formLabels.city"
          :spanText="member.billing.city"
          name="billingCity"
          classInfo="col-sm-6"
        />
        <InfoSpan
          labelText="formLabels.stateProv"
          :spanText="member.billing.stateProv"
          name="billingStateProv"
          classInfo="col-sm-4"
        />
        <InfoSpan
          labelText="formLabels.country"
          :spanText="member.billing.country"
          name="billingCountry"
          classInfo="col-sm-2"
        />
        <InfoSpan
          labelText="formLabels.zipPostal"
          :spanText="member.billing.zipPostal"
          name="billingZipPostal"
          classInfo="col-md-6"
        />
        <InfoSpan
          labelText="formLabels.phone"
          :spanText="member.billing.phone"
          name="billingPhone"
          classInfo="col-md-6"
        />
      </div>
      <div class="row m-0">
        <div class="section-header mt-2 bg-secondary">
          <span class="text-white">{{ $t('formLabels.shipping') }}</span>
        </div>
      </div>
      <div class="row mb-3 px-1 info-spans">
        <InfoSpan
          labelText="formLabels.name"
          :spanText="member.shipping.name"
          name="shippingName"
          classInfo="col-lg-6 col-xl-3"
        />
        <InfoSpan
          labelText="formLabels.company"
          :spanText="member.shipping.company || '--'"
          name="shippingCompany"
          classInfo="col-lg-6 col-xl-3"
        />
        <InfoSpan
          labelText="formLabels.email"
          :spanText="member.shipping.email"
          name="shippingEmail"
          classInfo="col-xl-6"
        />
        <InfoSpan
          labelText="formLabels.address1"
          :spanText="member.shipping.address1"
          name="shippingAddress1"
          classInfo="col-lg-6"
        />
        <InfoSpan
          labelText="formLabels.address2"
          :spanText="member.shipping.address2 || '--'"
          name="shippingAddress2"
          classInfo="col-lg-6"
        />
        <InfoSpan
          labelText="formLabels.city"
          :spanText="member.shipping.city"
          name="shippingCity"
          classInfo="col-sm-6"
        />
        <InfoSpan
          labelText="formLabels.stateProv"
          :spanText="member.shipping.stateProv"
          name="shippingStateProv"
          classInfo="col-sm-4"
        />
        <InfoSpan
          labelText="formLabels.country"
          :spanText="member.shipping.country"
          name="shippingCountry"
          classInfo="col-sm-2"
        />
        <InfoSpan
          labelText="formLabels.zipPostal"
          :spanText="member.shipping.zipPostal"
          name="shippingZipPostal"
          classInfo="col-md-6"
        />
        <InfoSpan
          labelText="formLabels.phone"
          :spanText="member.billing.phone"
          name="billingPhone"
          classInfo="col-md-6"
        />
      </div>
      <router-link
        :to="`/dashboard/members/${member._id}/edit`"
        class="btn btn-info"
        v-if="isAdmin"
      >
        <i class="fas fa-cog mr-3"></i>{{ $t('members.editMember') }}
      </router-link>
    </div>
  </div>
</template>

<script>
import Gravatar from 'vue-gravatar';
import { mapGetters } from 'vuex';
import i18n from '../../i18n';
import InfoSpan from '../Shared/InfoSpan';

export default {
  name: 'MemberById',
  components: {
    Gravatar,
    InfoSpan,
  },
  computed: {
    ...mapGetters(['loggedInMember', 'getMember', 'isLoading']),
    isAdmin: function() {
      return this.loggedInMember.isAdmin;
    },
    member: function() {
      return this.getMember.member;
    },
    teams: function() {
      return this.getMember.teams;
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
  methods: {
    loadTeam: function(id) {
      this.$router.push({ name: 'teamsById', params: { id } }).catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 1fr;
  grid-gap: 0.5rem;
  width: 100%;
  height: 100%;
  grid-template-areas: 'sidebar-left middle-section';

  .middle-section {
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
