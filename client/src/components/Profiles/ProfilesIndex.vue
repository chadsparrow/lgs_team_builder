<template>
  <div class="row" v-if="member">
    <div class="col sidebar">
      <div class="avatarWrapper">
        <avatar
          :username="member.name"
          :size="225"
          background-color="#E1E1E1"
          color="#000"
          :rounded="false"
          :src="member.avatarUrl"
        ></avatar>
      </div>
      <div class="row p-1 mt-4">
        <small class="col-sm-12 text-info">My Timezone:</small>
        <span class="col-sm-12">{{member.timezone}}</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Member Since:</small>
        <span
          class="col-sm-12"
        >{{member.createdAt | moment('timezone', member.timezone, "MMM Do YYYY - hh:ss a - z")}}</span>
      </div>
      <router-link :to="`/dashboard/profile/edit`" class="btn btn-sm btn-block btn-info mt-3 mb-4">
        <i class="fas fa-cog mr-2" style="vertical-align: middle;"></i>Edit My Profile
      </router-link>
    </div>
    <div class="col">Test</div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';

export default {
  name: 'ProfilesIndex',
  components: {
    Avatar
  },
  data() {
    return {
      breadcrumbs: [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'My Profile',
          link: '#'
        }
      ],
      memberDetails: {}
    };
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
      const foundMember = await this.$store.dispatch('getMemberDetails', this.member._id);
      this.memberDetails = foundMember.data;
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  }
};
</script>

<style lang="scss" scoped>
.vue-avatar--wrapper {
  border-radius: 1rem !important;
  position: relative;
}

.sidebar {
  flex: 0 0 255px;

  span {
    font-size: 0.8em;
  }
}
</style>
