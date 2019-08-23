<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link class="active btn btn-sm btn-dark" tag="a" to="/dashboard/members">Members</router-link>
      </li>
    </ol>
  </nav>

  <span v-if="!members">No Members Found.</span>
    <div class="table-responsive" v-else>
      <table class="table table-hover table-striped">
        <tbody>
          <tr
            v-for="(member, index) of member"
            :key="member._id"
            @click.prevent="loadMember(member._id)"
          >
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ member.avatarUrl }}</td>
            <td>{{ member.name }}</td>
            <td>{{ member.email }}</td>
            <td>{{ member.isAdmin }}</td>
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
      this.$router.push({ name: 'catalogid', params: { id } });
    }
  }
};
</script>

<style>
</style>
