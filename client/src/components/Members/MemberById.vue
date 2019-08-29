<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link tag="a" class="btn btn-sm" to="/dashboard/members">Members</router-link>
      </li>
      <li class="breadcrumb-item">
        <router-link
          class="btn btn-sm active"
          tag="a"
          :to="`/dashboard/members/${id}`"
        >{{ foundMember.name }}</router-link>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  computed: {
    foundMember: function() {
      return this.$store.getters.foundMember;
    },
    id: function() {
      return this.foundMember._id;
    }
  },
  created: function() {
    this.$store.dispatch('getMember', this.$route.params.id);
  }
};
</script>


