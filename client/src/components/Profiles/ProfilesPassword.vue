<template>
  <form>
    <div class="row">
      <div class="form-group col-sm-12">
        <label for="oldPassword">Old Password</label>
        <input
          id="oldPassword"
          type="password"
          class="form-control form-control-sm"
          v-model="oldPassword"
          ref="oldPassword"
          autofocus
        />
      </div>
      <div class="form-group col-sm-12">
        <label for="newpassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          class="form-control form-control-sm"
          v-model="newPassword"
          ref="newPassword"
        />
      </div>
      <div class="form-group col-sm-12 mb-4">
        <label for="confirmPassword">Confirm New Password</label>
        <input
          id="confirmPassword"
          type="password"
          class="form-control form-control-sm"
          v-model="confirmPassword"
          ref="confirmPassword"
        />
      </div>
      <div class="col sm-6">
        <button class="btn btn-block btn-info" @click.prevent="changePassword">
          Change Password
        </button>
      </div>
      <div class="col sm-6">
        <router-link to="/dashboard/profile" class="btn btn-block btn-danger">Cancel</router-link>
      </div>
    </div>
  </form>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ProfilesPassword',
  computed: {
    ...mapGetters(['loggedInMember'])
  },
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'My Profile',
          link: '/dashboard/profile'
        },
        {
          text: 'Change Password',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    changePassword: async function() {
      if (this.newPassword === this.oldPassword) {
        this.$toasted.error('New Password should be different from Old Password.', {
          icon: 'exclamation-triangle'
        });
        this.newPassword = '';
        this.confirmPassword = '';
        this.$refs['newPassword'].focus();
        return;
      }
      const updatedPassword = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      };
      this.$store.commit('LOADING_TRUE');
      try {
        await this.$store.dispatch('changePassword', {
          updatedPassword,
          id: this.loggedInMember._id
        });
        this.$store.commit('LOADING_FALSE');
        this.$router.push({ name: 'profile' });
        this.$toasted.success('Password Updated', { icon: 'lock' });
      } catch (err) {
        this.$store.commit('LOADING_FALSE');
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
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
