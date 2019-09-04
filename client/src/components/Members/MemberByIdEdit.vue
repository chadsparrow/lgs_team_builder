<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link tag="a" class="btn btn-sm" to="/dashboard/members">Members</router-link>
      </li>
      <li class="breadcrumb-item">
        <router-link class="btn btn-sm" tag="a" :to="`/dashboard/members/${id}`">
          {{
          foundMember.name
          }}
        </router-link>
      </li>
      <li class="breadcrumb-item">
        <router-link class="btn btn-sm" tag="a" to="#">Edit</router-link>
      </li>
      <div class="ml-auto">
        <router-link to="#" class="btn btn-sm btn-danger">
          <i class="fas fa-trash" style="vertical-align: middle;"></i>
        </router-link>
      </div>
    </ol>
  </nav>
</template>

<script>
export default {
  name: 'MemberByIdEdit',
  computed: {
    foundMember: function() {
      return this.$store.getters.foundMember;
    },
    id: function() {
      return this.foundMember._id;
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('getMember', this.$route.params.id);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  }
};
</script>
