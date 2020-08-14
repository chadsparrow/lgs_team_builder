<template>
  <div class="page container">
    <form>
      <div class="row">
        <div class="form-group col-sm-12">
          <label for="currentEmail">{{ $t('profiles.currentEmail') }}</label>
          <input
            id="currentEmail"
            type="email"
            class="form-control form-control-sm"
            v-model="loggedInMember.email"
            ref="currentEmail"
            readonly
          />
        </div>
        <div class="form-group col-sm-12">
          <label for="newEmail">{{ $t('profiles.newEmail') }}</label>
          <input
            id="newEmail"
            type="email"
            class="form-control form-control-sm"
            v-model="newEmail"
            ref="newEmail"
            autofocus
          />
          <small class="text-muted">{{ $t('profiles.newEmailTag') }}</small>
        </div>
        <div class="form-group col-sm-12 mb-4">
          <label for="confirmEmail">{{ $t('profiles.confirmNewEmail') }}</label>
          <input
            id="confirmEmail"
            type="email"
            class="form-control form-control-sm"
            v-model="confirmEmail"
            ref="confirmEmail"
          />
        </div>
        <div class="col sm-6">
          <button class="small-btn btn-block" @click.prevent="updateEmail">
            {{ $t('profiles.updateEmail') }}
          </button>
        </div>
        <div class="col sm-6">
          <router-link
            tag="button"
            to="/dashboard/profile"
            class="small-btn danger-btn btn-block"
            >{{ $t('cancel') }}</router-link
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import i18n from '../../i18n';

export default {
  name: 'ProfilesEmail',
  computed: {
    ...mapGetters(['loggedInMember']),
  },
  data() {
    return {
      newEmail: '',
      confirmEmail: '',
    };
  },
  created: async function() {
    try {
      const breadcrumbs = [
        {
          text: i18n.t('profiles.myProfile'),
          link: '/dashboard/profile',
        },
        {
          text: i18n.t('profiles.updateEmail'),
          link: '#',
        },
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, {
        icon: 'exclamation-triangle',
      });
    }
  },
  methods: {
    updateEmail: async function() {
      if (this.newEmail === this.loggedInMember.email) {
        this.$toasted.error(i18n.t('profiles.emailExistsError'), {
          icon: 'exclamation-triangle',
        });
        this.newEmail = '';
        this.confirmEmail = '';
        this.$refs['newEmail'].focus();
        return;
      }
      const updatedEmail = {
        currentEmail: this.loggedInMember.email,
        newEmail: this.newEmail,
        confirmEmail: this.confirmEmail,
      };

      try {
        const res = await this.$store.dispatch('updateEmail', {
          updatedEmail,
          id: this.loggedInMember._id,
        });

        this.$router.push({ name: 'profile' });
        this.$toasted.success(i18n.t('profiles.newEmailSuccess'), {
          icon: 'envelope',
        });
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, {
          icon: 'exclamation-triangle',
        });
        this.newEmail = '';
        this.confirmEmail = '';
        this.$refs['newEmail'].focus();
      }
    },
  },
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
