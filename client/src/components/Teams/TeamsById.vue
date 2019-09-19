<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col sidebar">
        <div v-if="team && team.name">
          <avatar
            :username="team.name"
            :size="225"
            background-color="#FFF"
            color="#000"
            :rounded="false"
            :src="team.logo"
          ></avatar>
          <div class="row p-1 mt-4">
            <small class="col-sm-12 text-info">Timezone: (uses shipping location)</small>
            <span class="col-sm-12">{{ team.timezone }}</span>
          </div>
          <div class="row p-1" v-if="team.createdAt && team.timezone">
            <small class="col-sm-12 text-info">Team Since:</small>
            <span class="col-sm-12">
              {{
              team.createdAt | moment('timezone', team.timezone, 'MMM Do YYYY / hh:mm a - z')
              }}
            </span>
          </div>
          <div class="row p-1" v-if="team.adminId.name">
            <small class="col-sm-12 text-info">Team Admin:</small>
            <span class="col-sm-12">
              {{ team.adminId.name }}
              <br />
              {{ team.adminId.email }}
            </span>
          </div>
          <div class="row p-1" v-if="team.managerId.name">
            <small class="col-sm-12 text-info">Team Manager:</small>
            <span class="col-sm-12">
              {{ team.managerId.name }}
              <br />
              {{ team.managerId.email }}
            </span>
          </div>
          <div class="row p-1 mt-3" v-if="team.members && team.members.length > 0">
            <div class="col-sm-12">
              <small class="text-info">Member List:</small>
              <br />
              <ul class="list-group">
                <li
                  class="list-group-item list-group-item-action"
                  v-for="teammember of team.members"
                  :key="teammember._id"
                  @click.prevent="loadMember(teammember._id)"
                >
                  <i
                    class="fas fa-certificate text-warning mr-1"
                    v-if="team && member && team.managerId._id === member._id"
                  ></i>
                  {{ teammember.name }}
                </li>
              </ul>
            </div>
          </div>
          <div class="row p-1 mt-3" v-else>
            <div class="col-sm-12">
              <small class="text-info">Member List:</small>
              <br />
              <span>No Members</span>
            </div>
          </div>
          <div class="row p-1 mt-1" v-if="access && team">
            <div class="col-sm-12">
              <router-link
                :to="`/dashboard/teams/${team._id}/addmember`"
                class="btn btn-block btn-info"
              >Add Member</router-link>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="placeholderImg"></div>
        </div>
      </div>
      <div class="col infoSection" v-if="team && team.name">
        <form novalidate>
          <div class="row">
            <div class="form-group col-sm-6">
              <label for="teamId">Team ID#</label>
              <input
                id="teamId"
                type="text"
                class="form-control form-control-sm"
                v-model="team.teamId"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="name">Team Name</label>
              <input
                id="name"
                type="text"
                class="form-control form-control-sm"
                v-model="team.name"
                readonly
              />
            </div>
          </div>
          <hr />
          <h5>Contact Information</h5>
          <div class="row">
            <div class="form-group col-sm-6">
              <label for="contactName">Name</label>
              <input
                id="contactName"
                type="text"
                class="form-control form-control-sm"
                v-model="team.mainContact.name"
                readonly
              />
            </div>
            <div class="form-group col-sm-6 mt-2">
              <label for="contactEmail">Email</label>
              <input
                id="contactEmail"
                type="email"
                class="form-control form-control-sm"
                v-model="team.mainContact.email"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="contactAddress1">Address 1</label>
              <input
                id="contactAddress1"
                type="text"
                class="form-control form-control-sm"
                v-model="team.mainContact.address1"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="contactAddress2">Address 2</label>
              <input
                id="contactAddress2"
                type="text"
                class="form-control form-control-sm"
                v-model="team.mainContact.address2"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="contactCity">City</label>
              <input
                id="contactCity"
                type="text"
                class="form-control form-control-sm"
                v-model="team.mainContact.city"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="stateProv">State/Province</label>
              <input
                id="stateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="team.mainContact.stateProv"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="country">Country</label>
              <input
                id="country"
                type="text"
                class="form-control form-control-sm"
                v-model="team.mainContact.country"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="zipPostal">Zip/Postal Code</label>
              <input
                id="zipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="team.mainContact.zipPostal"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="phone">Phone</label>
              <input
                id="phone"
                type="text"
                class="form-control form-control-sm"
                v-model="team.mainContact.phone"
                readonly
              />
            </div>
          </div>
          <hr />
          <h5>Bulk Shipping Information</h5>
          <div class="row">
            <div class="form-group col-sm-6">
              <label for="shippingName">Shipping Name</label>
              <input
                id="shippingName"
                type="text"
                class="form-control form-control-sm"
                v-model="team.bulkShipping.name"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingName">Shipping Email</label>
              <input
                id="shippingEmail"
                type="text"
                class="form-control form-control-sm"
                v-model="team.bulkShipping.email"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingAddress1">Shipping Address 1</label>
              <input
                id="shippingAddress1"
                type="text"
                class="form-control form-control-sm"
                v-model="team.bulkShipping.address1"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingAddress2">Shipping Address 2</label>
              <input
                id="shippingAddress2"
                type="text"
                class="form-control form-control-sm"
                v-model="team.bulkShipping.address2"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingCity">Shipping City</label>
              <input
                id="shippingCity"
                type="text"
                class="form-control form-control-sm"
                v-model="team.bulkShipping.city"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingStateProv">Shipping State/Province</label>
              <input
                id="shippingStateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="team.bulkShipping.stateProv"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingCountry">Shipping Country</label>
              <input
                id="shippingCountry"
                type="text"
                class="form-control form-control-sm"
                v-model="team.bulkShipping.country"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingZipPostal">Shipping Zip/Postal Code</label>
              <input
                id="shippingZipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="team.bulkShipping.zipPostal"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingPhone">Shipping Phone</label>
              <input
                id="shippingPhone"
                type="text"
                class="form-control form-control-sm"
                v-model="team.bulkShipping.phone"
                readonly
              />
            </div>
          </div>
          <router-link
            :to="`/dashboard/teams/${team._id}/edit`"
            class="btn btn-block btn-info mt-4"
            v-if="access && team"
          >
            <i class="fas fa-cog mr-2" style="vertical-align: middle;"></i>Edit Team Details
          </router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';

export default {
  name: 'TeamById',
  components: {
    Avatar
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    },
    access: function() {
      if (this.member && this.member.isAdmin) return true;
      if (this.member && this.team && this.team.managerId._id === this.member._id) return true;

      return false;
    },
    team: function() {
      return this.$store.getters.currentTeam;
    }
  },
  created: async function() {
    try {
      const res = await this.$store.dispatch('getTeam', this.$route.params.id);
      const teamName = res.data.name;
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Teams',
          link: '/dashboard/teams'
        },
        {
          text: `${teamName}`,
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  methods: {
    loadMember: function(id) {
      if (this.member && this.member._id === id) {
        return this.$router.push({ name: 'profile', params: { id } }).catch(() => {});
      } else {
        return this.$router.push({ name: 'membersById', params: { id } }).catch(() => {});
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.vue-avatar--wrapper {
  border-radius: 1rem !important;
}

.sidebar {
  flex: 0 0 255px;

  span {
    font-size: 0.8em;
  }

  .placeholderImg {
    border-radius: 1rem;
    background-color: white;
    width: 225px;
    height: 225px;
  }

  .list-group {
    width: 100%;
    overflow: auto;
    max-height: 250px;

    .list-group-item {
      height: 35px;
      padding: 5px 15px;
      &:hover {
        background-color: #17a2b8;
        color: white;
        cursor: pointer;
      }
    }
  }
}

.infoSection {
  form {
    max-width: 800px;
  }
  .form-group {
    margin-bottom: 1px;
  }

  h6 {
    max-width: 800px;
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
  }
}

@media (max-width: 575px) {
  .sidebar {
    flex: none;
  }
}
</style>
