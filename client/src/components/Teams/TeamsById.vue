<template>
  <div class="teampage">
    <!-- TEAM INFO GRID SECTION -->
    <div class="team-info">
      <div v-if="team && team.name">
        <avatar
          :username="team.name"
          :size="225"
          background-color="#FFF"
          color="#000"
          :rounded="false"
          :src="team.logo"
        ></avatar>

        <div class="row p-1 mt-3">
          <small class="col-sm-12 text-info">Team Name:</small>
          <span class="col-sm-12">{{ team.name }}</span>
        </div>

        <div class="row p-1">
          <small class="col-sm-12 text-info">Team ID#:</small>
          <span class="col-sm-12">{{ team.teamId }}</span>
        </div>

        <div class="row p-1">
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
      </div>
      <div v-else>
        <div class="placeholderImg"></div>
      </div>
    </div>

    <!-- MEMBER LIST SECTION -->
    <div class="member-list">
      <div class="row p-1" v-if="team && team.members && team.members.length > 0">
        <div class="col-sm-12">
          <small class="text-info">Member List: {{team.members.length}}</small>
          <br />
          <ul class="list-group">
            <li
              class="list-group-item list-group-item-action"
              v-for="teammember of team.members"
              :key="teammember._id"
              @click.prevent="loadMember(teammember._id)"
            >
              <div class="memberIcons">
                <i
                  class="fas fa-certificate text-warning mr-2"
                  v-if="team && member && team.managerId._id === teammember._id"
                ></i>
                <span>{{ teammember.name }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="row p-1" v-else>
        <div class="col-sm-12">
          <small class="text-info">Member List:</small>
          <br />
          <span>No Members</span>
        </div>
      </div>
    </div>

    <!-- MEMBER BUTTONS SECTION -->
    <div class="member-buttons" v-if="team && team.managerId.name">
      <div class="row p-1" v-if="access">
        <div class="col-sm-12">
          <router-link
            :to="`/dashboard/teams/${team._id}/addmember`"
            class="btn btn-sm btn-block btn-info"
          >Add Members</router-link>
        </div>
        <div class="col-sm-12 mt-2">
          <router-link
            :to="`/dashboard/teams/${team._id}/removemember`"
            class="btn btn-sm btn-block btn-danger"
          >Remove Members</router-link>
        </div>
      </div>
    </div>

    <!-- STORES SECTION -->
    <div class="stores-section px-3" v-if="team && team.managerId.name">
      <router-link :to="`/dashboard/teams/${team._id}/addstore`" class="btn btn-info mb-2">
        <i class="fas fa-plus mr-2"></i>Add Team Store
      </router-link>
      <h5 v-if="stores && stores.length >0">Show Stores</h5>
      <h5 else>No Stores</h5>
    </div>

    <!-- CONTACT BAR SECTION -->
    <div class="contact-bar">
      <div v-if="team && team.managerId.name">
        <div class="section-header bg-secondary mb-2">Main Contact Information</div>
        <div class="row">
          <div class="col-sm-12">
            <small>Name</small>
            <br />
            <span>{{team.mainContact.name}}</span>
          </div>
          <div class="col-sm-12">
            <small>Email</small>
            <br />
            <span>{{team.mainContact.email}}</span>
          </div>
          <div class="col-sm-12">
            <small>Address 1</small>
            <br />
            <span>{{team.mainContact.address1}}</span>
          </div>
          <div class="col-sm-12" v-if="team.address2">
            <small>Address 2</small>
            <br />
            <span>{{team.mainContact.address2}}</span>
          </div>
          <div class="col-sm-12">
            <small>City</small>
            <br />
            <span>{{team.mainContact.city}}</span>
          </div>
          <div class="col-sm-6">
            <small>State/Province</small>
            <br />
            <span>{{team.mainContact.stateProv}}</span>
          </div>
          <div class="col-sm-6">
            <small>Country</small>
            <br />
            <span>{{team.mainContact.country}}</span>
          </div>
          <div class="col-sm-6">
            <small>Zip/Postal Code</small>
            <br />
            <span>{{team.mainContact.zipPostal}}</span>
          </div>
          <div class="col-sm-6">
            <small>Phone</small>
            <br />
            <span>{{team.mainContact.phone}}</span>
          </div>
        </div>
        <div class="section-header bg-secondary mb-2 mt-2">Bulk Shipping Information</div>
        <div class="row">
          <div class="col-sm-12">
            <small>Name</small>
            <br />
            <span>{{team.bulkShipping.name}}</span>
          </div>
          <div class="col-sm-12">
            <small>Email</small>
            <br />
            <span>{{team.bulkShipping.email}}</span>
          </div>
          <div class="col-sm-12">
            <small>Address 1</small>
            <br />
            <span>{{team.bulkShipping.address1}}</span>
          </div>
          <div class="col-sm-12" v-if="team.bulkShipping.address2">
            <small>Address 2</small>
            <br />
            <span>{{team.bulkShipping.address2}}</span>
          </div>
          <div class="col-sm-12">
            <small>City</small>
            <br />
            <span>{{team.bulkShipping.city}}</span>
          </div>
          <div class="col-sm-6">
            <small>State/Province</small>
            <br />
            <span>{{team.bulkShipping.stateProv}}</span>
          </div>
          <div class="col-sm-6">
            <small>Country</small>
            <br />
            <span>{{team.bulkShipping.country}}</span>
          </div>
          <div class="col-sm-6">
            <small>Zip/Postal Code</small>
            <br />
            <span>{{team.bulkShipping.zipPostal}}</span>
          </div>
          <div class="col-sm-6">
            <small>Phone</small>
            <br />
            <span>{{team.bulkShipping.phone}}</span>
          </div>
        </div>
        <router-link
          :to="`/dashboard/teams/${team._id}/edit`"
          class="btn btn-block btn-info mt-4"
          v-if="access && team"
        >
          <i class="fas fa-cog mr-2" style="vertical-align: middle;"></i>Edit Team Details
        </router-link>
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
    },
    stores: function() {
      return this.$store.getters.teamStores;
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
      await this.$store.dispatch('getTeamStores', this.$route.params.id);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    loadMember: function(id) {
      if (this.member && this.member._id === id) {
        return this.$router.push({ name: 'profile', params: { id } }).catch(() => {});
      } else {
        return this.$router.push({ name: 'membersById', params: { id } }).catch(() => {});
      }
    },
    removeMember: async function(id) {
      if (this.access) {
        const res = await this.$store.dispatch('removeMember', {
          teamId: this.team._id,
          memberId: id
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$dark-color: #111111;
$blue-color: #17a2b8;
$label-color: #999999;
$white-text: #ffffff;
$black-text: #000000;

.teampage {
  display: grid;
  grid-template-columns: 255px 1fr 300px;
  grid-template-rows: 560px 1fr 76px;
  width: 100%;
  height: 100%;
  grid-template-areas:
    'left-bar stores right-bar'
    'members stores right-bar'
    'buttons stores right-bar';
}

.team-info {
  grid-area: left-bar;
  span {
    font-size: 0.8em;
  }
  .placeholderImg {
    border-radius: 1rem;
    background-color: white;
    width: 225px;
    height: 225px;
  }
}

.member-list {
  grid-area: members;
  overflow-y: auto;
  overflow-x: hidden;

  .list-group {
    width: 100%;

    .list-group-item {
      height: 35px;
      padding: 5px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      &:hover {
        background-color: $blue-color;
        color: $white-text;
      }

      .memberIcons {
        display: flex;
        justify-content: flex-start;
      }
    }
  }
}
.member-buttons {
  grid-area: buttons;
}

.stores-section {
  grid-area: stores;
}

.contact-bar {
  grid-area: right-bar;

  small {
    font-size: 0.9em;
    color: $blue-color;
  }
  font-size: 0.9rem;
  span {
    background-color: rgba(255, 255, 255, 0.5);
    padding: 0.4rem;
    border-radius: 5px;
    display: block;
  }
}
</style>
