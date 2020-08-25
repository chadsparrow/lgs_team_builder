<template>
  <div class="mt-4 container" v-if="!isLoading">
    <div v-if="!access && id">
      <span>You do not have access to Remove Members</span>
      <br />
      <br />
      <router-link
        :to="`/dashboard/teams/${id}`"
        class="large-btn danger-btn"
        tag="button"
        >Return to Team</router-link
      >
    </div>
    <form @submit.prevent="removeMembers" novalidate v-else class="mb-4">
      <h5>Remove members from the team</h5>
      <div class="row">
        <div class="form-group col-sm-12 mt-2">
          <label for="newMember"
            >Type the email address or select from dropdown</label
          >
          <vSelect
            multiple
            id="newMember"
            v-model="chosenMembers"
            :reduce="(member) => member._id"
            label="email"
            :options="members"
          ></vSelect>
          <small id="newMemberHelp" class="form-text text-muted"
            >In order to remove a team manager, you must select a new manager
            first.</small
          >
        </div>
      </div>
      <div class="row">
        <div class="col-sm-6">
          <button
            type="submit"
            class="large-btn btn-block"
            :disabled="!access || chosenMembers.length === 0"
          >
            Remove Members
          </button>
        </div>
        <div class="col-sm-6">
          <router-link
            tag="button"
            class="large-btn danger-btn btn-block"
            :to="`/dashboard/teams/${id}`"
            >Cancel</router-link
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { mapGetters } from 'vuex';
import toast from '../../helpers/toast';
import get from 'lodash/get';

export default {
  name: 'TeamsRemoveMembers',
  data() {
    return {
      id: '',
      name: '',
      manager: '',
      members: [],
      chosenMembers: [],
    };
  },
  components: {
    vSelect,
  },
  computed: {
    ...mapGetters(['isLoading', 'loggedInMember']),
    member: function() {
      return this.loggedInMember;
    },
    access: function() {
      if (!this.isLoading) {
        if (this.member.isAdmin) return true;
        if (this.manager._id === this.member._id) return true;
      }
      return false;
    },
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      let res = await this.$store.dispatch('getTeam', this.$route.params.id);
      const { _id, name, managerId, members } = res.data;
      this.id = _id;
      this.name = name;
      this.manager = managerId;
      this.teamMembers = members;
      const breadcrumbs = [
        {
          text: 'Teams',
          link: '/dashboard/teams',
        },
        {
          text: `${this.name}`,
          link: `/dashboard/teams/${this.id}`,
        },
        {
          text: 'Remove Members',
          link: '#',
        },
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);

      const filtered = members.filter(function(element) {
        return element._id !== managerId._id;
      });

      this.members = filtered;
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      toast.error(err);
    }
  },
  methods: {
    removeMembers: async function() {
      this.$store.commit('LOADING_TRUE');
      try {
        const res = await this.$store.dispatch('removeTeamMembers', {
          chosenMembers: this.chosenMembers,
          id: this.id,
        });
        this.$store.commit('LOADING_FALSE');
        this.$router
          .push({ name: 'teamsById', params: { id: this.id } })
          .catch(() => {});

        toast.success(get(res, 'data[0].message', 'Success'));
      } catch (err) {
        this.$store.commit('LOADING_FALSE');
        toast.error(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
form {
  max-width: 500px;
}
</style>
