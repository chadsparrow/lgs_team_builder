<template>
  <div class="mt-4 container">
    <div v-if="!access && id">
      <span>You do not have access to Add Members</span>
      <br />
      <br />
      <router-link :to="`/dashboard/teams/${id}`" class="btn btn-dark">Return to Team</router-link>
    </div>
    <form @submit.prevent="addTeamMember" novalidate v-else class="mb-4">
      <h5>Add a single registered member to your team</h5>
      <div class="row">
        <div class="form-group col-sm-12 mt-4">
          <label for="newMember">Type the email address</label>
          <vSelect id="newMember" v-model="chosenMember" label="email" :options="members"></vSelect>
          <small id="newMemberHelp" class="form-text text-muted">
            If the member you choose has
            <strong>Invites</strong>
            set to
            <strong>"Auto Accept"</strong> , they will instantly be part of your team, otherwise they will have to accept the invite.
          </small>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <button
            type="submit"
            class="btn btn-block btn-info"
            :disabled="!access || !chosenMember"
          >Add Member</button>
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
    <hr />
    <form @submit.prevent="inviteTeamMember" style="margin-top: 60px;" novalidate>
      <h5>Invite a single member to register and join your team!</h5>
      <div class="row">
        <div class="form-group col-sm-12 mt-4">
          <label for="invite">Type the email address</label>
          <input
            id="invite"
            type="email"
            class="form-control form-control-sm"
            v-model="inviteEmail"
            :disabled="inviteDisabled"
            ref="invite"
          />
          <small
            id="inviteHelp"
            class="form-text text-muted"
          >An email invitation will be sent and once registered, they will be added to the team.</small>
        </div>
        <div class="col-sm-6">
          <button
            type="submit"
            class="btn btn-block btn-info"
            :disabled="!access || !inviteEmail"
          >Send Invite</button>
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
    <h5
      style="margin-top: 60px;"
    >Method to send batch invites to large amounts of users coming! - Excel file upload</h5>
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
      teamMembers: [],
      inviteEmail: ''
    };
  },
  components: {
    vSelect
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
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
          text: 'Add Member',
          link: '#'
        }
      ];
    },
    access: function() {
      if (this.member && this.member.isAdmin) return true;

      if (this.managerId._id === this.member._id) return true;

      return false;
    },
    inviteDisabled: function() {
      return this.chosenMember && this.chosenMember._id ? true : false;
    }
  },
  watch: {
    chosenMember: function() {
      this.inviteEmail = '';
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
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);

      res = await this.$store.dispatch('getMembers');
      const memberList = res.data;
      const availMembers = [];

      let found;
      memberList.forEach(element => {
        found = false;
        if (!element.invites.disabled) {
          this.teamMembers.forEach(teamMember => {
            if (teamMember._id === element._id) {
              found = true;
            }
          });

          if (!found) availMembers.push(element);
        }
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
        if (this.chosenMember.invites.autoAccept) {
          await this.$store.dispatch('addTeamMember', { newTeamMember, id: this.id });
          this.$router.push({ name: 'teamsById', params: { id: this.id } }).catch(() => {});
          this.$toasted.success('Member Added to Team', { icon: 'check-circle' });
        }

        if (!this.chosenMember.invites.autoAccept) {
          const res = await this.$store.dispatch('sendInviteNotification', {
            id: this.chosenMember._id,
            teamId: this.id
          });
          this.$router.push({ name: 'teamsById', params: { id: this.id } }).catch(() => {});
          this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
        }
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
      }
    },
    inviteTeamMember: function() {
      //
      this.$toasted.success(`Invite sent to ${this.inviteEmail}`, { icon: 'check-circle' });
      this.$router.push({ name: 'teamsById', params: { id: this.id } }).catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  max-width: 500px;
}
</style>
