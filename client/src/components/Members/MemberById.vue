<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col sidebar-left">
        <div v-if="member && member.name">
          <avatar
            :username="member.name"
            :size="225"
            background-color="#FFF"
            color="#000"
            :rounded="false"
            :src="member.avatarUrl"
          ></avatar>
          <div class="row p-1 mt-4">
            <small class="col-sm-12 text-info">Member Since:</small>
            <span class="col-sm-12">
              {{
              member.createdAt | moment('timezone', member.timezone, 'MMM Do YYYY / hh:mm a - z')
              }}
            </span>
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
              >{{ team.name }}</li>
            </ul>
          </div>
        </div>
        <div v-else>
          <div class="placeholderImg"></div>
        </div>
      </div>
      <div class="col middle-section" v-if="member && member.name">
        <div class="section-header mt-0 bg-secondary">
          <span class="text-white">Contact Information</span>
        </div>
        <div class="row mb-3 px-2">
          <div class="col-sm-6">
            <label class="text-info">Name</label>
            <br />
            <span>{{member.name}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">Email</label>
            <br />
            <span>{{member.email}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">Address1</label>
            <br />
            <span>{{member.address1}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">Address 2</label>
            <br />
            <span>{{member.address2 || "--"}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">City</label>
            <br />
            <span>{{member.city}}</span>
          </div>
          <div class="col-sm-4">
            <label class="text-info">State/Province</label>
            <br />
            <span>{{member.stateProv}}</span>
          </div>
          <div class="col-sm-2">
            <label class="text-info">Country</label>
            <br />
            <span>{{member.country}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">Zip/Postal Code</label>
            <br />
            <span>{{member.zipPostal}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">Phone</label>
            <br />
            <span>{{member.phone}}</span>
          </div>
        </div>
        <div class="section-header my-2 bg-secondary">
          <span class="text-white">Billing Details</span>
        </div>
        <div class="row mb-3 px-2">
          <div class="col-sm-6">
            <label class="text-info">Name</label>
            <br />
            <span>{{member.billing.name}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">Email</label>
            <br />
            <span>{{member.billing.email}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">Address1</label>
            <br />
            <span>{{member.billing.address1}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">Address 2</label>
            <br />
            <span>{{member.billing.address2 || "--"}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">City</label>
            <br />
            <span>{{member.billing.city}}</span>
          </div>
          <div class="col-sm-4">
            <label class="text-info">State/Province</label>
            <br />
            <span>{{member.billing.stateProv}}</span>
          </div>
          <div class="col-sm-2">
            <label class="text-info">Country</label>
            <br />
            <span>{{member.billing.country}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">Zip/Postal Code</label>
            <br />
            <span>{{member.billing.zipPostal}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">Phone</label>
            <br />
            <span>{{member.billing.phone}}</span>
          </div>
        </div>
        <div class="section-header my-2 bg-secondary">
          <span class="text-white">Shipping Details</span>
        </div>
        <div class="row mb-4 px-3">
          <div class="col-sm-6">
            <label class="text-info">Name</label>
            <br />
            <span>{{member.shipping.name}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">Email</label>
            <br />
            <span>{{member.shipping.email}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">Address1</label>
            <br />
            <span>{{member.shipping.address1}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">Address 2</label>
            <br />
            <span>{{member.shipping.address2 || "--"}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">City</label>
            <br />
            <span>{{member.shipping.city}}</span>
          </div>
          <div class="col-sm-4">
            <label class="text-info">State/Province</label>
            <br />
            <span>{{member.shipping.stateProv}}</span>
          </div>
          <div class="col-sm-2">
            <label class="text-info">Country</label>
            <br />
            <span>{{member.shipping.country}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">Zip/Postal Code</label>
            <br />
            <span>{{member.shipping.zipPostal}}</span>
          </div>
          <div class="col-sm-6">
            <label class="text-info">Phone</label>
            <br />
            <span>{{member.shipping.phone}}</span>
          </div>
        </div>
        <router-link :to="`/dashboard/members/${member._id}/edit`" class="btn btn-block btn-info">
          <i class="fas fa-cog mr-2" style="vertical-align: middle;"></i>Edit Member Details
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';

export default {
  name: 'MemberById',
  components: {
    Avatar
  },
  computed: {
    memberDetails: function() {
      return this.$store.getters.getMember;
    },
    member: function() {
      if (this.memberDetails) return this.memberDetails.member;
    },
    teams: function() {
      if (this.memberDetails) return this.memberDetails.teams;
    }
  },
  created: async function() {
    try {
      const res = await this.$store.dispatch('getMemberDetails', this.$route.params.id);
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
    } catch (err) {
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
label {
  margin-left: 0px;
}

.middle-section .row span {
  display: block;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 3px;
  width: 100%;
}
</style>
