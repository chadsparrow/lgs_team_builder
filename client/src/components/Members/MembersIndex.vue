<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link class="active btn btn-sm btn-dark" tag="a" to="/dashboard/members">Members</router-link>
        </li>
        <router-link to="/dashboard/members/add" class="btn btn-sm btn-dark ml-auto">Add Member</router-link>
      </ol>
    </nav>

    <span v-if="!members">No Members Found.</span>
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr
            v-for="(member, index) of members"
            :key="member._id"
            @click.prevent="loadMember(member._id)"
          >
            <th scope="row">{{ index + 1 }}</th>
            <td>
              <span v-if="member.avatarUrl">{{ member.avatarUrl }}</span>
              <span v-else>No Avatar</span>
            </td>
            <td>{{ member.name }}</td>
            <td>{{ member.email }}</td>
            <td>
              <span v-if="member.isAdmin">Admin</span>
              <span v-else>User</span>
            </td>
            <td style="width: 100px;">
              <router-link
                class="btn btn-sm btn-info"
                :to="`/dashboard/members/${member._id}`"
              >View/Edit</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  created: async function() {
    await this.$store.dispatch('getMembers');
  },
  computed: {
    members: function() {
      return this.$store.getters.members;
    }
  },
  methods: {
    loadMember: function(id) {
      this.$router.push({ name: 'memberid', params: { id } });
    }
  }
};
</script>

<style lang="scss" scoped>
tr:hover {
  cursor: pointer;
}
</style>
