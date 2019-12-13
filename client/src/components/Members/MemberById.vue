<template>
  <div class="page" v-if="!isLoading">
    <div class="sidebar-left">
      <div class="avatarWrapper">
        <Gravatar :email="member.email" default-img="mp" :size="200" />
      </div>
      <div class="row p-1 mt-2">
        <small class="col-sm-12 text-info">Member Since:</small>
        <span class="col-sm-12">{{
          member.createdAt | moment('timezone', member.timezone, 'MMM Do YYYY / hh:mm a - z')
        }}</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Member Role:</small>
        <span class="col-sm-12">{{ member.isAdmin ? 'Admin' : 'Member' }}</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Member Timezone:</small>
        <span class="col-sm-12">{{ member.timezone }}</span>
      </div>
      <div v-if="teams && teams.length > 0">
        <small class="text-info ml-1 mb-2">Member of Teams:</small>
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
      <h3 class="text-info text-center">Information</h3>
      <div class="row m-0">
        <div class="section-header bg-secondary col-sm-12">
          <span class="text-white">Contact</span>
        </div>
      </div>
      <div class="row px-1 info-spans">
        <div class="col-sm-12 col-lg-6 col-xl-3">
          <label class="text-info">Name</label>
          <br />
          <span>{{ member.name }}</span>
        </div>
        <div class="col-sm-12 col-lg-6 col-xl-3">
          <label class="text-info">Company</label>
          <br />
          <span>{{ member.company || '--' }}</span>
        </div>
        <div class="col-sm-12 col-xl-6">
          <label class="text-info">Email</label>
          <br />
          <span>{{ member.email }}</span>
        </div>
        <div class="col-sm-12 col-lg-6">
          <label class="text-info">Address1</label>
          <br />
          <span>{{ member.address1 }}</span>
        </div>
        <div class="col-sm-12 col-lg-6">
          <label class="text-info">Address 2</label>
          <br />
          <span>{{ member.address2 || '--' }}</span>
        </div>
        <div class="col-sm-12 col-md-6">
          <label class="text-info">City</label>
          <br />
          <span>{{ member.city }}</span>
        </div>
        <div class="col-sm-12 col-md-4">
          <label class="text-info">State/Province</label>
          <br />
          <span>{{ member.stateProv }}</span>
        </div>
        <div class="col-sm-12 col-md-2">
          <label class="text-info">Country</label>
          <br />
          <span>{{ member.country }}</span>
        </div>
        <div class="col-sm-12 col-md-6">
          <label class="text-info">Zip/Postal Code</label>
          <br />
          <span>{{ member.zipPostal }}</span>
        </div>
        <div class="col-sm-12 col-md-6">
          <label class="text-info">Phone</label>
          <br />
          <span>{{ member.phone }}</span>
        </div>
      </div>
      <div class="row m-0">
        <div class="section-header mt-2 bg-secondary">
          <span class="text-white">Billing</span>
        </div>
      </div>
      <div class="row px-1 info-spans">
        <div class="col-sm-12 col-lg-6 col-xl-3">
          <label class="text-info">Name</label>
          <br />
          <span>{{ member.billing.name }}</span>
        </div>
        <div class="col-sm-12 col-lg-6 col-xl-3">
          <label class="text-info">Company</label>
          <br />
          <span>{{ member.billing.company || '--' }}</span>
        </div>
        <div class="col-sm-12 col-xl-6">
          <label class="text-info">Email</label>
          <br />
          <span>{{ member.billing.email }}</span>
        </div>
        <div class="col-sm-12 col-md-6">
          <label class="text-info">Address1</label>
          <br />
          <span>{{ member.billing.address1 }}</span>
        </div>
        <div class="col-sm-12 col-md-6">
          <label class="text-info">Address 2</label>
          <br />
          <span>{{ member.billing.address2 || '--' }}</span>
        </div>
        <div class="col-sm-12 col-md-6">
          <label class="text-info">City</label>
          <br />
          <span>{{ member.billing.city }}</span>
        </div>
        <div class="col-sm-12 col-md-4">
          <label class="text-info">State/Province</label>
          <br />
          <span>{{ member.billing.stateProv }}</span>
        </div>
        <div class="col-sm-12 col-md-2">
          <label class="text-info">Country</label>
          <br />
          <span>{{ member.billing.country }}</span>
        </div>
        <div class="col-sm-12 col-md-6">
          <label class="text-info">Zip/Postal Code</label>
          <br />
          <span>{{ member.billing.zipPostal }}</span>
        </div>
        <div class="col-sm-12 col-md-6">
          <label class="text-info">Phone</label>
          <br />
          <span>{{ member.billing.phone }}</span>
        </div>
      </div>
      <div class="row m-0">
        <div class="section-header mt-2 bg-secondary">
          <span class="text-white">Shipping Details</span>
        </div>
      </div>
      <div class="row mb-4 px-1 info-spans">
        <div class="col-sm-12 col-lg-6 col-xl-3">
          <label class="text-info">Name</label>
          <br />
          <span>{{ member.shipping.name }}</span>
        </div>
        <div class="col-sm-12 col-lg-6 col-xl-3">
          <label class="text-info">Company</label>
          <br />
          <span>{{ member.shipping.company || '--' }}</span>
        </div>
        <div class="col-sm-12 col-xl-6">
          <label class="text-info">Email</label>
          <br />
          <span>{{ member.shipping.email }}</span>
        </div>
        <div class="col-sm-12 col-lg-6">
          <label class="text-info">Address1</label>
          <br />
          <span>{{ member.shipping.address1 }}</span>
        </div>
        <div class="col-sm-12 col-lg-6">
          <label class="text-info">Address 2</label>
          <br />
          <span>{{ member.shipping.address2 || '--' }}</span>
        </div>
        <div class="col-sm-12 col-lg-6">
          <label class="text-info">City</label>
          <br />
          <span>{{ member.shipping.city }}</span>
        </div>
        <div class="col-sm-12 col-lg-4">
          <label class="text-info">State/Province</label>
          <br />
          <span>{{ member.shipping.stateProv }}</span>
        </div>
        <div class="col-sm-12 col-lg-2">
          <label class="text-info">Country</label>
          <br />
          <span>{{ member.shipping.country }}</span>
        </div>
        <div class="col-sm-12 col-lg-6">
          <label class="text-info">Zip/Postal Code</label>
          <br />
          <span>{{ member.shipping.zipPostal }}</span>
        </div>
        <div class="col-sm-12 col-lg-6">
          <label class="text-info">Phone</label>
          <br />
          <span>{{ member.shipping.phone }}</span>
        </div>
      </div>
      <router-link
        :to="`/dashboard/members/${member._id}/edit`"
        class="btn btn-info"
        v-if="isAdmin"
      >
        <i class="fas fa-cog mr-3"></i>Edit Member
      </router-link>
    </div>
  </div>
</template>

<script>
import Gravatar from 'vue-gravatar';
import { mapGetters } from 'vuex';

export default {
  name: 'MemberById',
  components: {
    Gravatar
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
    }
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      await this.$store.dispatch('getMemberDetails', this.$route.params.id);
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Members',
          link: '/dashboard/members'
        },
        {
          text: `${this.member.name}`,
          link: '#'
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
    loadTeam: function(id) {
      this.$router.push({ name: 'teamsById', params: { id } }).catch(() => {});
    }
  }
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
      font-size: 1.2rem;
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
