<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link class="active btn btn-sm" tag="a" to="/dashboard/members">Members</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link class="active btn btn-sm" tag="a" to="#">{{name}}</router-link>
        </li>
        <div class="ml-auto">
          <router-link :to="`/dashboard/members/${id}/edit`" class="btn btn-sm btn-dark">
            <i class="fas fa-cog" style="vertical-align: middle;"></i>
          </router-link>
        </div>
      </ol>
    </nav>

    <div class="row">
      <div class="col-sm-4">
        <avatar
          :username="name"
          :size="225"
          background-color="#E1E1E1"
          color="#000"
          :rounded="false"
          :src="avatarUrl"
        ></avatar>
        <div class="row p-1 mt-4">
          <small class="col-sm-12 text-info">My Timezone:</small>
          <span class="col-sm-12">{{timezone}}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Member Since:</small>
          <span
            class="col-sm-12"
          >{{memberSince | moment('timezone', timezone, "MMM Do YYYY - hh:ss a-z")}}</span>
        </div>
      </div>
      <div class="col-sm-8">Test</div>
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
  data() {
    return {
      name: '',
      avatarUrl: '',
      memberSince: Date.now(),
      timezone: ''
    };
  },
  computed: {
    getMember: function() {
      return this.$store.getters.foundMember;
    },
    id: function() {
      return this.getMember._id;
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('getMember', this.$route.params.id);
      this.name = this.getMember.name;
      this.avatarUrl = this.getMember.avatarUrl;
      this.memberSince = this.getMember.createdAt;
      this.timezone = this.getMember.timezone;
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
</style>