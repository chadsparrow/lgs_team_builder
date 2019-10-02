<template>
  <form>
    <p>Your new email address will become your username when logging in.</p>
    <div class="row">
      <div class="form-group col-sm-12">
        <label for="currentEmail">Current Email</label>
        <input
          id="currentEmail"
          type="email"
          class="form-control form-control-sm"
          v-model="member.email"
          ref="currentEmail"
          readonly
        />
      </div>
      <div class="form-group col-sm-12">
        <label for="newEmail">New Email</label>
        <input
          id="newEmail"
          type="email"
          class="form-control form-control-sm"
          v-model="newEmail"
          ref="newEmail"
          autofocus
        />
      </div>
      <div class="form-group col-sm-12 mb-4">
        <label for="confirmEmail">Confirm New Email</label>
        <input
          id="confirmEmail"
          type="email"
          class="form-control form-control-sm"
          v-model="confirmEmail"
          ref="confirmEmail"
        />
      </div>
      <div class="col sm-6">
        <button class="btn btn-block btn-info" @click.prevent="updateEmail">Update Email Address</button>
      </div>
      <div class="col sm-6">
        <router-link to="/dashboard/profile" class="btn btn-block btn-danger">Cancel</router-link>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: 'ProfilesEmail',
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    }
  },
  data() {
    return {
      newEmail: '',
      confirmEmail: ''
    };
  },
  created: async function() {
    try {
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'My Profile',
          link: '/dashboard/profile'
        },
        {
          text: 'Update Email',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    updateEmail: async function() {
      if (this.newEmail === this.member.email) {
        this.$toasted.error('New Email should be different from current Email.', {
          icon: 'exclamation-triangle'
        });
        this.newEmail = '';
        this.confirmEmail = '';
        this.$refs['newEmail'].focus();
        return;
      }
      const updatedEmail = {
        currentEmail: this.member.email,
        newEmail: this.newEmail,
        confirmEmail: this.confirmEmail
      };

      try {
        const res = await this.$store.dispatch('updateEmail', {
          updatedEmail,
          id: this.member._id
        });

        this.$router.push({ name: 'profile' });
        this.$toasted.success(res.data[0].message, { icon: 'envelope' });
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
        this.newEmail = '';
        this.confirmEmail = '';
        this.$refs['newEmail'].focus();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  width: 600px;
}
</style>

