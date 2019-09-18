<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col sidebar">
        <div v-if="name">
          <avatar
            :username="name"
            :size="225"
            background-color="#FFF"
            color="#000"
            :rounded="false"
            :src="logo"
          ></avatar>
          <div class="row p-1 mt-4">
            <small class="col-sm-12 text-info">Timezone: (uses shipping location)</small>
            <span class="col-sm-12">{{ timezone }}</span>
          </div>
          <div class="row p-1" v-if="createdAt && timezone">
            <small class="col-sm-12 text-info">Team Since:</small>
            <span class="col-sm-12">
              {{
              createdAt | moment('timezone', timezone, 'MMM Do YYYY / hh:mm a - z')
              }}
            </span>
          </div>
          <div class="row p-1" v-if="adminId.name">
            <small class="col-sm-12 text-info">Team Admin:</small>
            <span class="col-sm-12">
              {{ adminId.name }}
              <br />
              {{ adminId.email }}
            </span>
          </div>
          <div class="row p-1" v-if="managerId.name">
            <small class="col-sm-12 text-info">Team Manager:</small>
            <span class="col-sm-12">
              {{ managerId.name }}
              <br />
              {{ managerId.email }}
            </span>
          </div>
          <div class="row p-1 mt-3" v-if="members && members.length > 0">
            <div class="col-sm-12">
              <small class="text-info">Member List:</small>
              <br />
              <ul class="list-group">
                <li
                  class="list-group-item list-group-item-action"
                  v-for="membr of members"
                  :key="membr._id"
                  @click.prevent="loadMember(membr._id)"
                >
                  <i
                    class="fas fa-certificate text-warning mr-1"
                    v-if="managerId._id === membr._id"
                  ></i>
                  {{ membr.name }}
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
          <div class="row p-1 mt-1" v-if="access">
            <div class="col-sm-12">
              <router-link
                :to="`/dashboard/teams/${id}/addmember`"
                class="btn btn-block btn-info"
              >Add Member</router-link>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="placeholderImg"></div>
        </div>
      </div>
      <div class="col infoSection" v-if="name">
        <form novalidate>
          <div class="row">
            <div class="form-group col-sm-6">
              <label for="teamId">Team ID#</label>
              <input
                id="teamId"
                type="text"
                class="form-control form-control-sm"
                v-model="teamId"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="name">Team Name</label>
              <input
                id="name"
                type="text"
                class="form-control form-control-sm"
                v-model="name"
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
                v-model="mainContact.name"
                readonly
              />
            </div>
            <div class="form-group col-sm-6 mt-2">
              <label for="contactEmail">Email</label>
              <input
                id="contactEmail"
                type="email"
                class="form-control form-control-sm"
                v-model="mainContact.email"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="contactAddress1">Address 1</label>
              <input
                id="contactAddress1"
                type="text"
                class="form-control form-control-sm"
                v-model="mainContact.address1"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="contactAddress2">Address 2</label>
              <input
                id="contactAddress2"
                type="text"
                class="form-control form-control-sm"
                v-model="mainContact.address2"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="contactCity">City</label>
              <input
                id="contactCity"
                type="text"
                class="form-control form-control-sm"
                v-model="mainContact.city"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="stateProv">State/Province</label>
              <input
                id="stateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="mainContact.stateProv"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="country">Country</label>
              <input
                id="country"
                type="text"
                class="form-control form-control-sm"
                v-model="mainContact.country"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="zipPostal">Zip/Postal Code</label>
              <input
                id="zipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="mainContact.zipPostal"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="phone">Phone</label>
              <input
                id="phone"
                type="text"
                class="form-control form-control-sm"
                v-model="mainContact.phone"
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
                v-model="bulkShipping.name"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingName">Shipping Email</label>
              <input
                id="shippingEmail"
                type="text"
                class="form-control form-control-sm"
                v-model="bulkShipping.email"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingAddress1">Shipping Address 1</label>
              <input
                id="shippingAddress1"
                type="text"
                class="form-control form-control-sm"
                v-model="bulkShipping.address1"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingAddress2">Shipping Address 2</label>
              <input
                id="shippingAddress2"
                type="text"
                class="form-control form-control-sm"
                v-model="bulkShipping.address2"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingCity">Shipping City</label>
              <input
                id="shippingCity"
                type="text"
                class="form-control form-control-sm"
                v-model="bulkShipping.city"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingStateProv">Shipping State/Province</label>
              <input
                id="shippingStateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="bulkShipping.stateProv"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingCountry">Shipping Country</label>
              <input
                id="shippingCountry"
                type="text"
                class="form-control form-control-sm"
                v-model="bulkShipping.country"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingZipPostal">Shipping Zip/Postal Code</label>
              <input
                id="shippingZipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="bulkShipping.zipPostal"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingPhone">Shipping Phone</label>
              <input
                id="shippingPhone"
                type="text"
                class="form-control form-control-sm"
                v-model="bulkShipping.phone"
                readonly
              />
            </div>
          </div>
          <router-link
            :to="`/dashboard/teams/${id}/edit`"
            class="btn btn-block btn-info mt-4"
            v-if="access"
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
  data() {
    return {
      id: '',
      name: '',
      teamId: '',
      logo: null,
      adminId: {},
      managerId: '',
      mainContact: {},
      bulkShipping: {},
      members: [],
      timezone: '',
      timezoneAbbrev: '',
      createdAt: ''
    };
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    },
    breadcrumbs: function() {
      return [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Teams',
          link: '/dashboard/teams'
        },
        {
          text: `${this.name}`,
          link: '#'
        }
      ];
    },
    access: function() {
      if (this.member && this.member.isAdmin) return true;
      if (this.managerId.id === this.member._id) return true;

      return false;
    }
  },
  created: async function() {
    try {
      const res = await this.$store.dispatch('getTeam', this.$route.params.id);
      const {
        _id,
        name,
        logo,
        adminId,
        teamId,
        managerId,
        mainContact,
        bulkShipping,
        members,
        timezone,
        timezoneAbbrev,
        createdAt
      } = res.data;

      this.id = _id;
      this.name = name;
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
      this.timezone = timezone;
      this.timezoneAbbrev = timezoneAbbrev;
      this.logo = logo;
      this.createdAt = createdAt;
      this.teamId = teamId;

      this.members = members;
      if (adminId) {
        this.adminId = adminId;
      }

      if (managerId) {
        this.managerId = managerId;
      }

      if (mainContact) {
        this.mainContact = mainContact;
      }

      if (bulkShipping) {
        this.bulkShipping = bulkShipping;
      }
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  methods: {
    loadMember: function(id) {
      if (this.member._id === id) {
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
