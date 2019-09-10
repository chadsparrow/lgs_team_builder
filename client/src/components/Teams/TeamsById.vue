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
            <small class="col-sm-12 text-info">Team Timezone:</small>
            <span class="col-sm-12">{{timezone}}</span>
          </div>
          <div class="row p-1">
            <small class="col-sm-12 text-info">Team Since:</small>
            <span
              class="col-sm-12"
            >{{createdAt | moment('timezone', timezone, "MMM Do YYYY / hh:ss a - z")}}</span>
          </div>
          <router-link
            :to="`/dashboard/members/${id}/edit`"
            class="btn btn-sm btn-block btn-info mt-3 mb-4"
            v-if="member && member.isAdmin"
          >
            <i class="fas fa-cog mr-2" style="vertical-align: middle;"></i>Edit Team
          </router-link>
        </div>
        <div v-else>
          <div class="placeholderImg"></div>
        </div>
      </div>
      <div class="col infoSection" v-if="name">
        <h6 class="bg-secondary">Team Information</h6>
        <form>
          <div class="row"></div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';

export default {
  name: 'TeamById',
  data() {
    return {
      id: '',
      name: '',
      logo: null,
      adminId: '',
      managerId: '',
      mainContact: {},
      bulkShipping: {},
      members: [],
      timezone: '',
      timezoneAbbrev: '',
      createdAt: ''
    };
  },
  components: {
    Avatar
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    },
    breadcrumbs: function() {
      return [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Members',
          link: '/dashboard/teams'
        },
        {
          text: `${this.name}`,
          link: '#'
        }
      ];
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
      const res = await this.$store.dispatch('getTeam', this.$route.params.id);
      const {
        _id,
        name,
        logo,
        adminId,
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
      this.logo = logo;
      this.adminId = adminId;
      this.managerId = managerId;
      this.mainContact = mainContact;
      this.bulkShipping = bulkShipping;
      this.members = members;
      this.timezone = timezone;
      this.timezoneAbbrev = timezoneAbbrev;
      this.createdAt = createdAt;
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
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
}

.infoSection {
  form {
    max-width: 800px;
  }
  .form-group {
    margin-top: 1px;
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