<template>
  <div class="page">
    <form>
      <div class="row">
        <div class="form-group col-sm-12">
          <label for="oldPassword">{{ $t('profiles.oldPassword') }}</label>
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
          <label for="newpassword">{{ $t('profiles.newPassword') }}</label>
          <input
            id="newPassword"
            type="password"
            class="form-control form-control-sm"
            v-model="newPassword"
            ref="newPassword"
          />
        </div>
        <div class="form-group col-sm-12 mb-4">
          <label for="confirmPassword">{{ $t('profiles.confirmPassword') }}</label>
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
            {{ $t('profiles.changePassword') }}
          </button>
        </div>
        <div class="col sm-6">
          <router-link to="/dashboard/profile" class="btn btn-block btn-danger">{{
            $t('cancel')
          }}</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import i18n from '../../i18n';

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
        {
          text: i18n.t('profiles.myProfile'),
          link: '/dashboard/profile'
        },
        {
          text: i18n.t('profiles.changePassword'),
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
        this.$toasted.error(i18n.t('profiles.newPasswordError'), {
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
        this.$toasted.success(i18n.t('profiles.passwordUpdated'), { icon: 'lock' });
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
.page {
  display: flex;
  justify-content: center;
  form {
    max-width: 600px;
    margin-top: 2rem;
  }
}
</style>
