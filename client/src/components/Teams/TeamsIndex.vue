<template>
  <div v-if="!isLoading" class="page container">
    <div class="header mb-2">
      <div class="form-group has-search m-0" v-if="teams.length > 0">
        <span class="fa fa-search form-control-feedback"></span>
        <input
          type="text"
          id="teamSearch"
          class="form-control form-control-sm"
          v-model="teamSearchText"
          :placeholder="$t('search')"
        />
      </div>
      <router-link to="/dashboard/teams/add" class="small-btn" tag="button">
        <i class="fas fa-plus mr-2"></i>{{ $t('teams.addTeam') }}
      </router-link>
    </div>

    <div class="member-list">
      <span v-if="currentTeams.length === 0 && member.isAdmin"
        >No Teams Found</span
      >
      <span v-else-if="currentTeams.length === 0"
        >No Teams Found - Contact your team manager to add you</span
      >
      <div class="table-responsive-sm" v-else>
        <table
          class="table table-hover table-striped"
          v-if="currentTeams.length > 0"
        >
          <tbody>
            <tr>
              <th
                class="priority-2"
                scope="col"
                v-if="member && member.isAdmin"
              >
                {{ $t('teams.account') }}
              </th>
              <th class="priority-1" scope="col">
                {{ $t('formLabels.name') }}
              </th>
              <th class="priority-5" scope="col">{{ $t('admin') }}</th>
              <th class="priority-4" scope="col">{{ $t('manager') }}</th>
              <th class="priority-3" scope="col">{{ $t('memberPlural') }}</th>
            </tr>
            <tr
              v-for="team of currentTeams"
              :key="team._id"
              @click.prevent="loadTeam(team._id)"
            >
              <td
                class="priority-2"
                scope="row"
                v-if="member && member.isAdmin"
              >
                {{ team.teamId }}
              </td>
              <td class="priority-1">{{ team.name }}</td>
              <td class="priority-5">{{ team.adminId.name }}</td>
              <td class="priority-4">
                <i
                  class="fas fa-certificate text-warning mr-1"
                  v-if="member && team.managerId._id === member._id"
                ></i>
                {{ team.managerId.name }}
              </td>
              <td class="priority-3">{{ team.members.length }}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate';
import { mapGetters } from 'vuex';
import i18n from '../../i18n';
export default {
  name: 'TeamsIndex',
  components: {
    Paginate,
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      teamSearchText: '',
    };
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      const breadcrumbs = [
        {
          text: i18n.t('menu.adminOnly.teams'),
          link: '#',
        },
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      await this.$store.dispatch('getTeams');
      await this.$store.commit('CLEAR_CURRENTS');
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, {
        icon: 'exclamation-triangle',
      });
    }
  },
  computed: {
    ...mapGetters(['isLoading', 'loggedInMember', 'teams']),
    member: function() {
      return this.loggedInMember;
    },
    filteredTeams: function() {
      return this.teams.filter((team) => {
        if (
          team.name.toLowerCase().includes(this.teamSearchText.toLowerCase()) ||
          team.teamId
            .toLowerCase()
            .includes(this.teamSearchText.toLowerCase()) ||
          team.adminId.name
            .toLowerCase()
            .includes(this.teamSearchText.toLowerCase()) ||
          team.managerId.name
            .toLowerCase()
            .includes(this.teamSearchText.toLowerCase())
        ) {
          return team;
        }
      });
    },
    filteredCount: function() {
      return this.filteredTeams.length;
    },
    indexOfLastItem: function() {
      return this.currentPage * this.itemsPerPage;
    },
    indexOfFirstItem: function() {
      return this.indexOfLastItem - this.itemsPerPage;
    },
    currentTeams: function() {
      return this.filteredTeams.slice(
        this.indexOfFirstItem,
        this.indexOfLastItem
      );
    },
    pageNumbers: function() {
      const pageArray = [];
      for (
        let i = 1;
        i <= Math.ceil(this.filteredTeams.length / this.itemsPerPage);
        i++
      ) {
        pageArray.push(i);
      }
      return pageArray.length;
    },
  },
  methods: {
    loadTeam: function(id) {
      this.$router.push({ name: 'teamsById', params: { id } }).catch(() => {});
    },
    editTeam: function(id) {
      this.$router
        .push({ name: 'teamsByIdEdit', params: { id } })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  width: 100%;

  .header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    .has-search .form-control {
      padding-left: 2rem;
    }

    .has-search .form-control-feedback {
      position: absolute;
      z-index: 2;
      display: block;
      width: 2rem;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      pointer-events: none;
      color: #aaa;
    }
  }
}

/* Extra Large */
@media screen and (min-width: 993px) and (max-width: 1200px) {
  .priority-5 {
    display: none;
  }
}

/* Large */
@media screen and (min-width: 769px) and (max-width: 992px) {
  .priority-5 {
    display: none;
  }
  .priority-4 {
    display: none;
  }
}

/* Medium */
@media screen and (min-width: 576px) and (max-width: 768px) {
  .priority-5 {
    display: none;
  }
  .priority-4 {
    display: none;
  }
}

/* Small */
@media screen and (min-width: 398px) and (max-width: 575px) {
  .priority-5 {
    display: none;
  }
  .priority-4 {
    display: none;
  }
  .priority-3 {
    display: none;
  }
}

/* Extra Small */
@media screen and (min-width: 0px) and (max-width: 397px) {
  .page {
    .header {
      justify-content: center;
      flex-direction: column-reverse;

      .form-group {
        max-width: 100%;
        width: 100%;

        .form-control {
          width: 100%;
        }
      }
    }
  }

  .priority-5 {
    display: none;
  }
  .priority-4 {
    display: none;
  }
  .priority-3 {
    display: none;
  }
}
</style>
