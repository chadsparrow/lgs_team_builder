<template>
  <div class="page" v-if="!isLoading">
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

        <button
          type="button"
          class="btn btn-sm btn-block btn-info mt-3"
          v-clipboard:copy="joinLink"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >
          {{ $t('teams.copyJoinLink') }}
        </button>
      </div>
      <div v-else>
        <div class="placeholderImg"></div>
      </div>

      <!-- MEMBER LIST SECTION -->
      <div class="member-list mt-3">
        <div class="row p-1" v-if="team.members.length > 0">
          <small class="text-info col-sm-12 mb-1">
            {{ $t('teams.membersList') }}:
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
            <small class="text-info">{{ $t('teams.membersList') }}:</small>
            <br />
            <span>{{ $t('teams.noMembers') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MEMBER BUTTONS SECTION -->
    <div class="member-buttons" v-if="access">
      <div class="row p-1">
        <div class="col-sm-12">
          <router-link
            :to="`/dashboard/teams/${team._id}/addmember`"
            class="btn btn-sm btn-block btn-info"
            >{{ $t('members.addMember') }}</router-link
          >
        </div>
        <div class="col-sm-12 mt-2">
          <router-link
            :to="`/dashboard/teams/${team._id}/removemember`"
            class="btn btn-sm btn-block btn-danger"
            >Remove Members</router-link
          >
        </div>
      </div>
    </div>

    <!-- STORES SECTION -->
    <div class="main-section">
      <div class="stores">
        <div class="header">
          <div>
            <h5>{{ $t('menu.adminOnly.stores') }}</h5>
          </div>
          <div v-if="access">
            <router-link
              :to="`/dashboard/teams/${team._id}/addstore`"
              class="btn btn-sm btn-info"
            >
              <i class="fas fa-plus mr-2"></i>
              {{ $t('stores.addStore') }}
            </router-link>
          </div>
        </div>
        <div class="table-responsive-xl" v-if="stores.length > 0">
          <table class="table table-hover table-striped">
            <tbody>
              <tr>
                <th scope="col">{{ $t('formLabels.name') }}</th>
                <th scope="col">{{ $t('catalogs.add.brand') }}</th>
                <th scope="col">{{ $t('stores.opening') }}</th>
                <th scope="col">{{ $t('stores.closing') }}</th>
                <th scope="col">{{ $t('stores.mode') }}</th>
              </tr>
              <tr
                v-for="store of currentStores"
                :key="store._id"
                @click.prevent="loadStore(store._id)"
              >
                <td>{{ store.storeName }}</td>
                <td v-if="store.brand === 'GARNEAU'">
                  <img
                    src="https://teambuilder.s3.amazonaws.com/images/assets/garneau_logo.png"
                    alt="Garneau Logo"
                  />
                </td>
                <td v-if="store.brand === 'SUGOI'">
                  <img
                    src="https://teambuilder.s3.amazonaws.com/images/assets/sugoi_logo.png"
                    alt="Sugoi Logo"
                  />
                </td>
                <td v-if="store.brand === 'SOMBRIO'">
                  <img
                    src="https://teambuilder.s3.amazonaws.com/images/assets/sombrio_logo.png"
                    alt="Sombrio Logo"
                  />
                </td>
                <td v-if="store.openingDate">
                  {{
                    store.openingDate
                      | moment(
                        'timezone',
                        team.timezone,
                        'MM/DD/YYYY - hh:mm a - z'
                      )
                  }}
                </td>
                <td v-else>{{ $t('stores.noOpening') }}</td>
                <td v-if="store.closingDate">
                  {{
                    store.closingDate
                      | moment(
                        'timezone',
                        team.timezone,
                        'MM/DD/YYYY - hh:mm a - z'
                      )
                  }}
                </td>
                <td v-else>{{ $t('stores.noClosing') }}</td>
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
                >
                  {{ $t(`stores.${store.mode}`) }}
                </td>
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
            :prev-text="$t('previous')"
            :next-text="$t('next')"
            v-if="pageNumbers > 1"
          ></paginate>
        </div>

        <h5 v-else>{{ $t('stores.noStores') }}</h5>
      </div>

      <!-- CONTACT BAR SECTION -->
      <div class="contact-bar">
        <div class="team-info">
          <button
            class="btn btn-sm btn-outline-info mb-1"
            @click="showTeamInfo = true"
            v-if="!showTeamInfo"
          >
            {{ $t('teams.showTeamInfo') }}
          </button>
        </div>

        <div class="row teamInfo" v-if="showTeamInfo">
          <div class="col-lg-6 mainContactInfo" v-if="member.isAdmin">
            <div class="section-header bg-secondary">
              {{ $t('formLabels.mainContact') }}
              <router-link
                :to="`/dashboard/teams/${team._id}/edit`"
                v-if="member.isAdmin"
              >
                <i class="fas fa-edit text-white"></i>
              </router-link>
            </div>
            <div>
              <span>{{ team.mainContact.name }}</span>
              <br />
              <span v-if="team.mainContact.company">{{
                team.mainContact.company
              }}</span>
              <br v-if="team.mainContact.company" />
              <span>{{ team.mainContact.email }}</span>
              <br />
              <span>{{ team.mainContact.address1 }}</span>
              <br />
              <span v-if="team.mainContact.address2">{{
                team.mainContact.address2 || '--'
              }}</span>
              <br v-if="team.mainContact.address2" />
              <span
                >{{ team.mainContact.city }}, {{ team.mainContact.stateProv }},
                {{ team.mainContact.country }}</span
              >
              <br />
              <span>{{ team.mainContact.zipPostal }}</span>
              <br />
              <span>{{ team.mainContact.phone }}</span>
            </div>
          </div>
          <div class="col-lg-6 bulkShippingInfo">
            <div class="section-header bg-secondary">
              {{ $t('formLabels.bulkShipping') }}
              <router-link
                :to="`/dashboard/teams/${team._id}/edit`"
                v-if="member.isAdmin"
              >
                <i class="fas fa-edit text-white"></i>
              </router-link>
            </div>
            <div>
              <span>{{ team.bulkShipping.name }}</span>
              <br />
              <span v-if="team.bulkShipping.company">{{
                team.bulkShipping.company || '--'
              }}</span>
              <br v-if="team.bulkShipping.company" />
              <span>{{ team.bulkShipping.email }}</span>
              <br />
              <span>{{ team.bulkShipping.address1 }}</span>
              <br />
              <span v-if="team.bulkShipping.address2">{{
                team.bulkShipping.address2 || '--'
              }}</span>
              <br v-if="team.bulkShipping.address2" />
              <span
                >{{ team.bulkShipping.city }},
                {{ team.bulkShipping.stateProv }},
                {{ team.bulkShipping.country }}</span
              >
              <br />
              <span>{{ team.bulkShipping.zipPostal }}</span>
              <br />
              <span>{{ team.bulkShipping.phone }}</span>
            </div>
          </div>
          <div class="col-12 mt-2">
            <div class="row">
              <div class="col-12">
                <button
                  class="btn btn-sm btn-block btn-outline-info"
                  @click="showTeamInfo = false"
                  v-if="showTeamInfo"
                >
                  {{ $t('teams.hideTeamInfo') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';
import { mapGetters } from 'vuex';
import i18n from '../../i18n';

export default {
  name: 'TeamById',
  components: {
    Avatar,
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 5,
      showTeamInfo: false,
    };
  },
  computed: {
    ...mapGetters(['isLoading', 'loggedInMember', 'currentTeam', 'teamStores']),
    joinLink: function() {
      return `${window.location.origin}/join/${this.team._id}`;
    },
    member: function() {
      return this.loggedInMember;
    },
    team: function() {
      return this.currentTeam;
    },
    stores: function() {
      return this.teamStores;
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
      if (this.member.isAdmin) return true;

      return false;
    },
    pageNumbers: function() {
      const pageArray = [];
      for (
        let i = 1;
        i <= Math.ceil(this.stores.length / this.itemsPerPage);
        i++
      ) {
        pageArray.push(i);
      }
      return pageArray.length;
    },
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      const res = await this.$store.dispatch('getTeam', this.$route.params.id);
      const teamName = res.data.name;
      const breadcrumbs = [
        {
          text: i18n.t('menu.adminOnly.teams'),
          link: '/dashboard/teams',
        },
        {
          text: `${teamName}`,
          link: '#',
        },
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getTeamStores', this.$route.params.id);
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      if (err.response.data[0].message !== 'Team has no stores.')
        this.$toasted.error(err.response.data[0].message, {
          icon: 'exclamation-triangle',
        });
    }
  },
  methods: {
    onCopy: function() {
      this.$toasted.success(i18n.t('teams.joinLink'), {
        icon: 'clipboard',
      });
    },
    onError: function() {
      this.$toasted.error(i18n.t('teams.joinLinkError'), {
        icon: 'exclamation-triangle',
      });
    },
    loadMember: function(id) {
      if (this.member._id === id) {
        return this.$router
          .push({ name: 'profile', params: { id } })
          .catch(() => {});
      } else if (this.access) {
        return this.$router
          .push({ name: 'membersById', params: { id } })
          .catch(() => {});
      }
    },
    removeMember: async function(id) {
      try {
        this.$store.commit('LOADING_TRUE');
        await this.$store.dispatch('removeMember', {
          teamId: this.team._id,
          memberId: id,
        });
        this.$store.commit('LOADING_FALSE');
        this.$toasted.success(i18n.t('teams.removeMemberSuccess'), {
          icon: 'circle-check',
        });
      } catch (err) {
        this.$store.commit('LOADING_FALSE');
        this.$toasted.error(i18n.t('teams.removeMemberError'), {
          icon: 'exclamation-triangle',
        });
      }
    },
    loadStore: function(id) {
      this.$router.push({ name: 'storesById', params: { id } }).catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 200px auto;
  grid-template-rows: auto 76px;
  width: 100%;
  height: 100%;
  grid-gap: 1rem;
  font-size: 0.9rem;
  grid-template-areas:
    'left-bar main '
    'buttons main';
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

  .member-list {
    .memberlist {
      .list-group {
        width: 100%;
        max-height: 400px;
        overflow-x: hidden;
        overflow-y: auto;

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
}

.member-buttons {
  grid-area: buttons;
}

.main-section {
  grid-area: main;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    'stores-section'
    'contact-bar';

  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  .stores {
    grid-area: stores-section;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      margin-bottom: 0.3rem;
    }
    img {
      height: 30px;
    }
  }

  .contact-bar {
    grid-area: contact-bar;
    font-size: 0.9rem;

    .team-info {
      justify-content: space-around;
      text-align: center;
    }

    .section-header {
      padding: 0.5rem;
      width: 100%;
      border-radius: 5px;
      color: $white-text;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 0.5rem 0;
    }

    .teamInfo {
      font-size: 0.8em;
      text-align: center;
    }
  }
}
</style>
