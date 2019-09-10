<template>
  <div class="mt-2">
    <form @submit.prevent="addTeam" novalidate class="container">
      <div class="form-group row">
        <div class="col-sm-12 mb-2">
          <label for="name">Team Name</label>
          <input
            type="text"
            class="form-control"
            id="name"
            ref="name"
            v-model="name"
            placeholder="Enter a team name..."
            autofocus
          />
          <small id="nameHelp" class="form-text text-muted ml-2">Must not contain profanity</small>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-sm-6">
          <button type="submit" class="btn btn-block btn-info">Add Team</button>
        </div>
        <div class="col-sm-6">
          <router-link tag="a" class="btn btn-danger btn-block" to="/dashboard/teams">Cancel</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'TeamsAdd',
  created: async function() {
    try {
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  data() {
    return {
      name: '',
      breadcrumbs: [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Teams',
          link: '/dashboard/teams'
        },
        {
          text: 'Add Team',
          link: '#'
        }
      ]
    };
  },
  methods: {
    addTeam: async function() {
      const team = {
        name: this.name
      };
      try {
        const res = await this.$store.dispatch('addTeam', team);
        this.$router.push({ name: 'teams' });
        this.$toasted.success(res.data[0].message);
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
          this.$refs[key].value = '';
        }
        this.$toasted.error(err.response.data[0].message);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  width: 500px;
}
</style>
