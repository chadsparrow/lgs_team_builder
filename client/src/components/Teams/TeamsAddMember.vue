<template>
  <div class="mt-4 container-fluid">
    <div v-if="member && !member.isAdmin">
      <span>You do not have access to Add Members</span>
      <br />
      <br />
      <router-link :to="`/dashboard/teams/${id}`" class="btn btn-dark">Return to Team</router-link>
    </div>
    <form @submit.prevent="addTeamMember" novalidate v-else class="mb-4">
      <h6>Add a single registered member to your team</h6>
      <div class="row">
        <div class="form-group col-sm-12 mt-2">
          <label for="newMember">Type the email address</label>
          <vSelect id="newMember" v-model="chosenMember" label="email" :options="members"></vSelect>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-sm-6">
          <button type="submit" class="btn btn-block btn-info" :disabled="!chosenMember">Add Member</button>
        </div>
        <div class="col-sm-6">
          <router-link
            tag="a"
            class="btn btn-danger btn-block"
            :to="`/dashboard/teams/${id}`"
          >Cancel</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

export default {
  name: 'TeamsAddMember',
  data() {
    return {
      id: '',
      name: '',
      managerId: '',
      members: [],
      chosenMember: '',
      teamMembers: []
    };
  },
  components: {
    vSelect
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    }
  },
  created: async function() {
    try {
      let res = await this.$store.dispatch('getTeam', this.$route.params.id);
      const { _id, name, managerId, members } = res.data;
      this.id = _id;
      this.name = name;
      this.managerId = managerId;
      this.teamMembers = members;
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Teams',
          link: '/dashboard/teams'
        },
        {
          text: `${name}`,
          link: `/dashboard/teams/${_id}`
        },
        {
          text: 'Add Member',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);

      res = await this.$store.dispatch('getMembers');
      const memberList = res.data;
      const availMembers = [];

      let found;
      memberList.forEach(element => {
        found = false;
        this.teamMembers.forEach(teamMember => {
          if (teamMember._id === element._id) {
            found = true;
          }
        });

        if (!found) availMembers.push(element);
      });

      this.members = availMembers;
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    addTeamMember: async function() {
      const newTeamMember = {
        memberId: this.chosenMember._id
      };

      try {
        await this.$store.dispatch('addTeamMember', { newTeamMember, id: this.id });
        this.$router.push({ name: 'teamsById', params: { id: this.id } }).catch(() => {});
        this.$toasted.success('Member Added to Team', { icon: 'check-circle' });
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  max-width: 500px;
}
</style>
