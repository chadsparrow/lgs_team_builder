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
        <button class="btn btn-sm btn-danger" @click.prevent="deleteMember">
          <i class="fas fa-trash" style="vertical-align: middle;"></i>
        </button>
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
  },
  methods: {
    deleteMember: async function() {
      try {
        if (confirm('Are you sure?')) {
          const res = await this.$store.dispatch('deleteMember', this.id);
          this.$toasted.success(res.data[0].message);
          this.$router.push({ name: 'members' });
        }
      } catch (err) {
        this.$toasted.error(err.response.data[0].message);
      }
    }
  }
};
</script>
