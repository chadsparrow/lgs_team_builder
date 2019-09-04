<template>
  <div>
    <nav aria-label="breadcrumb" v-if="member">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link class="active btn btn-sm" tag="a" to="#">My Profile</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link class="active btn btn-sm" tag="a" to="#">{{member.name}}</router-link>
        </li>
        <div class="ml-auto">
          <router-link :to="`/dashboard/profile/edit`" class="btn btn-sm btn-dark">
            <i class="fas fa-cog" style="vertical-align: middle;"></i>
          </router-link>
        </div>
      </ol>
    </nav>

    <div class="row" v-if="member">
      <div class="col-sm-4">
        <div class="avatarWrapper">
          <avatar
            :username="member.name"
            :size="225"
            background-color="#E1E1E1"
            color="#000"
            :rounded="false"
            :src="member.avatarUrl"
          ></avatar>
          <button id="avatarChange" class="btn btn-sm btn-block btn-info mt-2">Change Avatar</button>
        </div>
        <div class="row p-1 mt-4">
          <small class="col-sm-12 text-info">My Timezone:</small>
          <span class="col-sm-12">{{member.timezone}}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Member Since:</small>
          <span
            class="col-sm-12"
          >{{member.createdAt | moment('timezone', member.timezone, "MMM Do YYYY - hh:ss a-z")}}</span>
        </div>
      </div>
      <div class="col-sm-8">Test</div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';

export default {
  name: 'ProfilesIndex',
  components: {
    Avatar
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    }
  }
};
</script>

<style lang="scss" scoped>
.vue-avatar--wrapper {
  border-radius: 1rem !important;
  position: relative;
}

#avatarChange {
  width: 225px;
}
</style>
