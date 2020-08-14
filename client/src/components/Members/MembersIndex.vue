<template>
  <div v-if="!isLoading" class="page container">
    <div class="header mb-2">
      <div class="form-group has-search m-0" v-if="allMembers.length > 0">
        <span class="fa fa-search form-control-feedback"></span>
        <input
          type="text"
          id="memberSearch"
          name="memberSearch"
          class="form-control form-control-sm m-0"
          v-model="memberSearchText"
          :placeholder="$t('search')"
        />
      </div>
      <div v-if="loggedInMember.isAdmin">
        <router-link
          to="/dashboard/members/add"
          class="small-btn addMemberBtn"
          tag="button"
        >
          <i class="fas fa-plus mr-2"></i>{{ $t('members.addMember') }}
        </router-link>
      </div>
    </div>
    <span v-if="allMembers.length === 0">No Members Found</span>
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr
            v-for="member of currentMembers"
            :key="member._id"
            @click.prevent="loadMember(member._id)"
          >
            <td class="priority-1">
              <Gravatar :email="member.email" default-img="mp" :size="24" />
            </td>
            <td class="priority-2">{{ member.name }}</td>
            <td class="priority-3">{{ member.email }}</td>
            <td class="priority-4">
              <span>{{ member.isAdmin ? $t('admin') : $t('member') }}</span>
            </td>
            <td class="priority-5">
              <span
                ><i
                  class="fas fa-user-check"
                  style="color: green;"
                  v-if="member.isVerified"
                ></i
                ><i class="fas fa-user-times" style="color:red" v-else></i
              ></span>
            </td>
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
      :prev-text="$t('previous')"
      :next-text="$t('next')"
      v-if="pageNumbers > 1"
    ></paginate>
  </div>
</template>

<script>
import Paginate from 'vuejs-paginate';
import Gravatar from 'vue-gravatar';
import { mapGetters } from 'vuex';
import i18n from '../../i18n';

export default {
  name: 'MembersIndex',
  components: {
    Paginate,
    Gravatar,
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 12,
      memberSearchText: '',
    };
  },
  created: async function() {
    try {
      const breadcrumbs = [
        {
          text: i18n.t('menu.adminOnly.members'),
          link: '#',
        },
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.$store.commit('LOADING_TRUE');
      await this.$store.dispatch('getMembers');
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].error.message, {
        icon: 'exclamation-triangle',
      });
    }
  },
  computed: {
    ...mapGetters(['allMembers', 'isLoading', 'loggedInMember']),
    filteredMembers: function() {
      return this.allMembers.filter((member) => {
        if (
          member.name
            .toLowerCase()
            .includes(this.memberSearchText.toLowerCase()) ||
          member.email
            .toLowerCase()
            .includes(this.memberSearchText.toLowerCase())
        ) {
          return member;
        }
      });
    },
    filteredCount: function() {
      return this.filteredMembers.length;
    },
    indexOfLastItem: function() {
      return this.currentPage * this.itemsPerPage;
    },
    indexOfFirstItem: function() {
      return this.indexOfLastItem - this.itemsPerPage;
    },
    currentMembers: function() {
      return this.filteredMembers.slice(
        this.indexOfFirstItem,
        this.indexOfLastItem
      );
    },
    pageNumbers: function() {
      const pageArray = [];
      if (this.allMembers) {
        for (
          let i = 1;
          i <= Math.ceil(this.filteredMembers.length / this.itemsPerPage);
          i++
        ) {
          pageArray.push(i);
        }
      }
      return pageArray.length;
    },
  },
  methods: {
    loadMember: function(id) {
      this.$router
        .push({ name: 'membersById', params: { id } })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  .header {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem;

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
