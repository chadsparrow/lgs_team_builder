<template>
  <div class="mt-4 container" v-if="dataReady">
    <div v-if="!access && id">
      <span>You do not have access to Remove Members</span>
      <br />
      <br />
      <router-link :to="`/dashboard/teams/${id}`" class="btn btn-dark">Return to Team</router-link>
    </div>
    <form @submit.prevent="removeMembers" novalidate v-else class="mb-4">
      <h5>Remove members from the team</h5>
      <div class="row">
        <div class="form-group col-sm-12 mt-2">
          <label for="newMember">Type the email address or select from dropdown</label>
          <vSelect
            multiple
            id="newMember"
            v-model="chosenMembers"
            :reduce="member => member._id"
            label="email"
            :options="members"
          ></vSelect>
          <small
            id="newMemberHelp"
            class="form-text text-muted"
          >In order to remove a team manager, you must select a new manager first.</small>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <button
            type="submit"
            class="btn btn-block btn-info"
            :disabled="!access || chosenMembers.length === 0"
          >Remove Members</button>
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
  name: 'TeamsRemoveMembers',
  data() {
    return {
      id: '',
      name: '',
      manager: '',
      members: [],
      chosenMembers: []
    };
  },
  components: {
    vSelect
  },
  computed: {
    dataReady: function() {
      return this.$store.getters.dataReady;
    },
    member: function() {
      return this.$store.getters.loggedInMember;
    },
    breadcrumbs: function() {
      return [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Teams',
          link: '/dashboard/teams'
        },
        {
          text: `${this.name}`,
          link: `/dashboard/teams/${this.id}`
        },
        {
          text: 'Remove Members',
          link: '#'
        }
      ];
    },
    access: function() {
      if (this.dataReady) {
        if (this.member.isAdmin) return true;
        if (this.manager._id === this.member._id) return true;
      }
      return false;
    }
  },
  created: async function() {
    try {
      let res = await this.$store.dispatch('getTeam', this.$route.params.id);
      const { _id, name, managerId, members } = res.data;
      this.id = _id;
      this.name = name;
      this.manager = managerId;
      this.teamMembers = members;
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);

      const filtered = members.filter(function(element) {
        return element._id !== managerId._id;
      });

      this.members = filtered;
      this.$store.dispatch('setDataReadyTrue');
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      this.$store.dispatch('setDataReadyTrue');
    }
  },
  beforeDestroy: function() {
    this.$store.dispatch('setDataReadyFalse');
  },
  methods: {
    removeMembers: async function() {
      try {
        const res = await this.$store.dispatch('removeTeamMembers', {
          chosenMembers: this.chosenMembers,
          id: this.id
        });
        this.$router.push({ name: 'teamsById', params: { id: this.id } }).catch(() => {});
        this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
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
