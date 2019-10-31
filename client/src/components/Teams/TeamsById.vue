<template>
  <div class="teampage" v-if="dataReady">
    <!-- TEAM INFO GRID SECTION -->
    <div class="team-info">
      <div v-if="team.name">
        <avatar
          :username="team.name"
          :size="150"
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
          <small class="col-sm-12 text-info">Account #:</small>
          <span class="col-sm-12">{{ team.teamId }}</span>
        </div>

        <div class="row p-1">
          <small class="col-sm-12 text-info">Team Timezone:</small>
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

        <div class="row p-1" v-if="team.adminId.name && access">
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
            <br />
            {{ team.managerId.phone }}
          </span>
        </div>

        <button
          type="button"
          class="btn btn-sm btn-block btn-info mt-2"
          v-clipboard:copy="joinLink"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >Copy Join Link</button>
      </div>
      <div v-else>
        <div class="placeholderImg"></div>
      </div>
    </div>

    <!-- MEMBER LIST SECTION -->
    <div class="member-list">
      <div class="row p-1" v-if="team.members.length > 0">
        <small class="text-info col-sm-12 mb-1">
          Member List:
          <span class="ml-3">{{ team.members.length }}</span>
        </small>
        <div class="memberlist col-sm-12">
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
                  v-if="team.managerId._id === teammember._id"
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
    <div class="member-buttons" v-if="member.isAdmin">
      <div class="row p-1">
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
    <div class="stores-section" v-if="team.managerId.name">
      <span>
        <h2>
          Team Stores
          <router-link
            :to="`/dashboard/teams/${team._id}/addstore`"
            class="btn btn-info ml-2"
            v-if="member && member.isAdmin"
          >
            <i class="fas fa-plus mr-2"></i>Add Team Store
          </router-link>
        </h2>
      </span>

      <div class="table-responsive" v-if="stores.length > 0">
        <table class="table table-hover table-striped">
          <tbody>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Opening Date</th>
              <th scope="col">Closing Date</th>
              <th scope="col">Mode</th>
            </tr>
            <tr
              v-for="store of currentStores"
              :key="store._id"
              @click.prevent="loadStore(store._id)"
            >
              <td>{{ store.storeName }}</td>
              <td v-if="store.openingDate">
                {{
                store.openingDate | moment('timezone', team.timezone, 'MM/DD/YYYY - hh:mm a - z')
                }}
              </td>
              <td v-else>No Opening Date</td>
              <td v-if="store.closingDate">
                {{
                store.closingDate | moment('timezone', team.timezone, 'MM/DD/YYYY - hh:mm a - z')
                }}
              </td>
              <td v-else>No Closing Date</td>
              <td
                :class="
                  store.mode === 'OPEN'
                    ? 'bg-success text-white'
                    : store.mode === 'CLOSED'
                    ? 'bg-danger text-white'
                    : store.mode === 'HOLD'
                    ? 'bg-warning text-white'
                    : null
                "
              >{{ store.mode }}</td>
            </tr>
          </tbody>
        </table>
        <paginate
          v-model="currentPage"
          :page-count="pageNumbers"
          :container-class="'pagination pagination-sm'"
          :page-class="'page-item'"
          :page-link-class="'page-link'"
          :prev-class="'page-item'"
          :prev-link-class="'page-link'"
          :next-class="'page-item'"
          :next-link-class="'page-link'"
          :hide-prev-next="true"
          v-if="pageNumbers > 1"
        ></paginate>
      </div>

      <h6 v-else>No Stores</h6>
    </div>

    <!-- CONTACT BAR SECTION -->
    <div class="contact-bar">
      <div v-if="team.managerId.name">
        <div class="section-header bg-secondary">Main Contact</div>
        <div class="row info-spans">
          <div class="col-sm-12">
            <small>Name</small>
            <br />
            <span>{{ team.mainContact.name }}</span>
          </div>
          <div class="col-sm-12" v-if="team.mainContact.company">
            <small>Company</small>
            <br />
            <span>{{ team.mainContact.company }}</span>
          </div>
          <div class="col-sm-12">
            <small>Email</small>
            <br />
            <span>{{ team.mainContact.email }}</span>
          </div>
          <div class="col-sm-12" v-if="member.isAdmin">
            <small>Address 1</small>
            <br />
            <span>{{ team.mainContact.address1 }}</span>
          </div>
          <div class="col-sm-12" v-if="member.isAdmin && team.mainContact.address2">
            <small>Address 2</small>
            <br />
            <span>{{ team.mainContact.address2 }}</span>
          </div>
          <div class="col-sm-12" v-if="member.isAdmin">
            <small>City</small>
            <br />
            <span>{{ team.mainContact.city }}</span>
          </div>
          <div class="col-sm-12" v-if="member.isAdmin">
            <small>State/Province</small>
            <br />
            <span>{{ team.mainContact.stateProv }}</span>
          </div>
          <div class="col-sm-6" v-if="member.isAdmin">
            <small>Country</small>
            <br />
            <span>{{ team.mainContact.country }}</span>
          </div>
          <div class="col-sm-6" v-if="member.isAdmin">
            <small>Zip/Postal</small>
            <br />
            <span>{{ team.mainContact.zipPostal }}</span>
          </div>
          <div class="col-sm-12">
            <small>Phone</small>
            <br />
            <span>{{ team.mainContact.phone }}</span>
          </div>
        </div>
        <div class="section-header bg-secondary mt-2">Bulk Shipping</div>
        <div class="row info-spans">
          <div class="col-sm-12">
            <small>Name</small>
            <br />
            <span>{{ team.bulkShipping.name }}</span>
          </div>
          <div class="col-sm-12" v-if="team.bulkShipping.company">
            <small>Company</small>
            <br />
            <span>{{ team.bulkShipping.company }}</span>
          </div>
          <div class="col-sm-12">
            <small>Email</small>
            <br />
            <span>{{ team.bulkShipping.email }}</span>
          </div>
          <div class="col-sm-12">
            <small>Address 1</small>
            <br />
            <span>{{ team.bulkShipping.address1 }}</span>
          </div>
          <div class="col-sm-12" v-if="team.bulkShipping.address2">
            <small>Address 2</small>
            <br />
            <span>{{ team.bulkShipping.address2 }}</span>
          </div>
          <div class="col-sm-12">
            <small>City</small>
            <br />
            <span>{{ team.bulkShipping.city }}</span>
          </div>
          <div class="col-sm-12">
            <small>State/Province</small>
            <br />
            <span>{{ team.bulkShipping.stateProv }}</span>
          </div>
          <div class="col-sm-6">
            <small>Country</small>
            <br />
            <span>{{ team.bulkShipping.country }}</span>
          </div>
          <div class="col-sm-6">
            <small>Zip/Postal</small>
            <br />
            <span>{{ team.bulkShipping.zipPostal }}</span>
          </div>
          <div class="col-sm-12">
            <small>Phone</small>
            <br />
            <span>{{ team.bulkShipping.phone }}</span>
          </div>
        </div>
        <router-link
          :to="`/dashboard/teams/${team._id}/edit`"
          class="btn btn-block btn-info mt-3"
          v-if="member.isAdmin"
        >
          <i class="fas fa-cog mr-3"></i>Edit Team Details
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
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    dataReady: function(){
      return this.$store.getters.dataReady;
    },
    joinLink: function() {
      return `${window.location.origin}/join/${this.team._id}`;
    },
    member: function() {
      return this.$store.getters.loggedInMember;
    },
    team: function() {
      return this.$store.getters.currentTeam;
    },
    stores: function() {
      return this.$store.getters.teamStores;
    },
    indexOfLastItem: function() {
      return this.currentPage * this.itemsPerPage;
    },
    indexOfFirstItem: function() {
      return this.indexOfLastItem - this.itemsPerPage;
    },
    currentStores: function() {
      return this.stores.slice(this.indexOfFirstItem, this.indexOfLastItem);
    },
    access: function() {
      if (this.member && this.member.isAdmin) return true;

      if (this.member && this.team.managerId && this.member._id === this.team.managerId._id)
        return true;

      return false;
    },
    pageNumbers: function() {
      const pageArray = [];
      for (let i = 1; i <= Math.ceil(this.stores.length / this.itemsPerPage); i++) {
        pageArray.push(i);
      }
      return pageArray.length;
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
      this.$store.dispatch('setDataReadyTrue');
    } catch (err) {
      if (err.response.data[0].message !== 'Team has no stores.')
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });

      this.$store.dispatch('setDataReadyTrue');
    }
  },
  beforeDestroy: function() {
    this.$store.dispatch('setDataReadyFalse');
  },
  methods: {
    onCopy: function() {
      this.$toasted.success(`Join link copied to clipboard`, {
        icon: 'clipboard'
      });
    },
    onError: function() {
      this.$toasted.error('Error copying Join link - Try Again!', { icon: 'exclamation-triangle' });
    },
    loadMember: function(id) {
      if (this.dataReady && this.member._id === id) {
        return this.$router.push({ name: 'profile', params: { id } }).catch(() => {});
      } else if (this.access) {
        return this.$router.push({ name: 'membersById', params: { id } }).catch(() => {});
      }
    },
    removeMember: async function(id) {
      await this.$store.dispatch('removeMember', {
        teamId: this.team._id,
        memberId: id
      });
    },
    loadStore: function(id) {
      this.$router.push({ name: 'storesById', params: { id } }).catch(() => {});
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
  grid-template-columns: 255px 1fr 200px;
  grid-template-rows: 1fr 1fr 76px;
  width: 100%;
  height: 100%;
  grid-gap: 1rem;
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
  .memberlist {
    overflow-y: auto;
    overflow-x: hidden;

    .list-group {
      width: 100%;

      .list-group-item {
        font-size: 0.9rem;
        padding: 0.3rem 0.7rem;
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
          background-color: $blue-color;
          color: $white-text;
        }

        .memberIcons {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
      }
    }
  }
}

.member-buttons {
  grid-area: buttons;
}

.stores-section {
  grid-area: stores;
  font-size: 0.85rem;
}

.contact-bar {
  grid-area: right-bar;
  overflow-y: auto;
  overflow-x: hidden;

  small {
    font-size: 0.9em;
    color: $blue-color;
  }
  font-size: 0.9rem;
}
</style>
