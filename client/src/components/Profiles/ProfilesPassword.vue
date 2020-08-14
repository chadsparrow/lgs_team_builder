<template>
  <div class="page container">
    <form @submit.prevent="changePassword">
      <div class="row">
        <div
          class="form-group col-sm-12"
          :class="{ 'form-group-error': $v.oldPassword.error }"
        >
          <label for="oldPassword" class="form__label">{{
            $t('profiles.oldPassword')
          }}</label>
          <input
            id="oldPassword"
            type="password"
            class="form-control form-control-sm"
            v-model.trim="$v.oldPassword.$model"
            ref="oldPassword"
            autofocus
          />
          <div v-if="$v.oldPassword.$error || $v.oldPassword.$dirty">
            <span class="error" v-if="!$v.oldPassword.required"
              >Old password is required</span
            >
          </div>
        </div>
        <div
          class="form-group col-sm-12"
          :class="{ 'form-group-error': $v.newPassword.$error }"
        >
          <label for="newpassword" class="form__label">{{
            $t('profiles.newPassword')
          }}</label>
          <input
            id="newPassword"
            type="password"
            class="form-control form-control-sm"
            v-model.trim="$v.newPassword.$model"
            ref="newPassword"
          />
          <div v-if="$v.newPassword.$error || $v.newPassword.$dirty">
            <span class="error" v-if="!$v.newPassword.required">
              New password is required
            </span>
            <span class="error" v-if="!$v.newPassword.notSameAsOldPassword">
              New password cannot match old password
            </span>
            <span class="error" v-if="!$v.newPassword.minLength">
              New password must be more then 5 characters
            </span>
          </div>
        </div>
        <div
          class="form-group col-sm-12 mb-4"
          :class="{ 'form-group-error': $v.confirmPassword.$error }"
        >
          <label for="confirmPassword" class="form__label">{{
            $t('profiles.confirmPassword')
          }}</label>
          <input
            id="confirmPassword"
            type="password"
            class="form-control form-control-sm"
            v-model.trim="$v.confirmPassword.$model"
            ref="confirmPassword"
          />
          <div v-if="$v.confirmPassword.$error || $v.confirmPassword.$dirty">
            <span class="error" v-if="!$v.confirmPassword.required">
              Confirm Password is required
            </span>
            <span class="error" v-if="!$v.confirmPassword.sameAsNewPassword">
              Confirm password must match new password
            </span>
          </div>
        </div>
        <div class="col sm-6">
          <button
            class="small-btn btn-block"
            type="submit"
            :disabled="submitStatus === 'PENDING' || $v.$invalid"
          >
            {{ $t('profiles.changePassword')
            }}<span
              class="spinner-border spinner-border-sm ml-2"
              role="status"
              aria-hidden="true"
              v-show="submitStatus === 'PENDING' || submitStatus === 'OK'"
            ></span>
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
import { required, sameAs, not, minLength } from 'vuelidate/lib/validators';
import toast from '../../helpers/toast';
import { get } from 'lodash';

export default {
  name: 'ProfilesPassword',

  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      submitStatus: null,
    };
  },
  validations: {
    oldPassword: {
      required,
    },
    newPassword: {
      required,
      minLength: minLength(6),
      notSameAsOldPassword: not(sameAs('oldPassword')),
    },
    confirmPassword: {
      required,
      sameAsNewPassword: sameAs('newPassword'),
    },
  },
  computed: {
    ...mapGetters(['loggedInMember']),
  },
  created: async function() {
    this.$store.commit('LOADING_TRUE');
    try {
      const breadcrumbs = [
        {
          text: i18n.t('profiles.myProfile'),
          link: '/dashboard/profile',
        },
        {
          text: i18n.t('profiles.changePassword'),
          link: '#',
        },
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      this.$store.commit('LOADING_FALSE');
    } catch (err) {
      this.$store.commit('LOADING_FALSE');
      toast.error(err);
    }
  },
  methods: {
    changePassword: async function() {
      this.$v.$touch();
      if (this.$v.invalid) {
        this.submitStatus = 'ERROR';
      } else {
        this.submitStatus = 'PENDING';

        const updatedPassword = {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword,
        };

        try {
          await this.$store.dispatch('changePassword', {
            updatedPassword,
            id: this.loggedInMember._id,
          });
          toast.success(i18n.t('profiles.passwordUpdated'));
          this.submitStatus = 'OK';
          this.$router.push({ name: 'profile' });
        } catch (err) {
          this.submitStatus = 'ERROR';
          if (get(err.response, 'data[0].context')) {
            const key = get(err.response, 'data[0].context.key');
            this.$refs[key].focus();
          }
          toast.error(err);
        }
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

    .form-group {
      .form__label {
        font-size: $label-font-size;
        line-height: 1rem;
        margin-left: 0.25rem;
        margin-bottom: 0.25rem;
      }

      .error {
        color: red;
        margin-left: 4px;
        font-size: $label-font-size;
        font-weight: $font-weight-bold;
      }

      &--error {
        input {
          border-color: red;
        }
      }
    }

    button {
      background-color: $blue-color;
      font-weight: $font-weight-bold;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
