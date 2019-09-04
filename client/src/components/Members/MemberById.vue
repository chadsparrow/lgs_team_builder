<template>
  <div class="container-fluid">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link class="active btn btn-sm" tag="a" to="/dashboard/members">Members</router-link>
        </li>
        <li class="breadcrumb-item" v-if="foundMember && foundMember.name">
          <router-link class="active btn btn-sm" tag="a" to="#">{{foundMember.name}}</router-link>
        </li>
        <div class="ml-auto">
          <router-link
            :to="`/dashboard/members/${foundMember._id}/edit`"
            class="btn btn-sm btn-dark"
          >
            <i class="fas fa-cog" style="vertical-align: middle;"></i>
          </router-link>
        </div>
      </ol>
    </nav>

    <div class="row">
      <div class="col sidebar">
        <div v-if="foundMember && foundMember.name">
          <avatar
            :username="foundMember.name"
            :size="225"
            background-color="#E1E1E1"
            color="#000"
            :rounded="false"
            :src="avatarUrl"
          ></avatar>
          <div class="row p-1 mt-4">
            <small class="col-sm-12 text-info">Member Timezone:</small>
            <span class="col-sm-12">{{foundMember.timezone}}</span>
          </div>
          <div class="row p-1">
            <small class="col-sm-12 text-info">Member Since:</small>
            <span
              class="col-sm-12"
            >{{foundMember.createdAt | moment('timezone', foundMember.timezone, "MMM Do YYYY / hh:ss a - z")}}</span>
          </div>
        </div>
        <div v-else>
          <div class="placeholderImg"></div>
        </div>
      </div>
      <div class="col">Test</div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';

export default {
  name: 'MemberById',
  data() {
    return {
      avatarUrl: null
    };
  },
  components: {
    Avatar
  },
  computed: {
    foundMember: function() {
      return this.$store.getters.foundMember;
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('getMemberDetails', this.$route.params.id);
      this.avatarUrl = this.foundMember.avatarUrl;
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearMemberDetails');
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
</style>