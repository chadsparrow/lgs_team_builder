<template>
  <div class="page container" v-if="member">
    <div class="text-center">
      <img
        id="tbLogo"
        src="https://teambuilder.s3.amazonaws.com/images/assets/tb_logo_white.svg"
        alt="Team Builder Logo"
      />
      <div class="greeting">{{ $t('login.resetPass') }}!</div>
    </div>
    <form @submit.prevent="resetPassword">
      <div
        class="form-group"
        :class="{ 'form-group-error': $v.password.error }"
      >
        <label for="password" class="form__label">{{
          $t('profiles.newPassword')
        }}</label>
        <input
          type="password"
          class="form-control"
          id="password"
          ref="password"
          v-model.trim="$v.password.$model"
          autofocus
        />
        <div v-if="$v.password.$error || $v.password.$dirty">
          <span class="error" v-if="!$v.password.required"
            >New password is required</span
          >
          <span class="error" v-if="!$v.password.minLength"
            >New password must be more then 5 characters</span
          >
        </div>
      </div>
      <div
        class="form-group"
        :class="{ 'form-group-error': $v.confirmPassword.error }"
      >
        <label for="confirmPassword" class="form__label">{{
          $t('profiles.confirmPassword')
        }}</label>
        <input
          type="password"
          class="form-control"
          id="confirmPassword"
          ref="confirmPassword"
          v-model="$v.confirmPassword.$model"
        />
        <div v-if="$v.confirmPassword.$error || $v.confirmPassword.$dirty">
          <span class="error" v-if="!$v.confirmPassword.required">
            Confirm Password is required
          </span>
          <span class="error" v-if="!$v.confirmPassword.sameAsPassword">
            Confirm password must match new password
          </span>
        </div>
      </div>
      <button
        type="submit"
        class="btn btn-lg btn-info btn-block mt-5"
        :disabled="submitStatus === 'PENDING' || $v.$invalid"
      >
        {{ $t('login.resetPass')
        }}<span
          class="spinner-border spinner-border-sm ml-2"
          role="status"
          aria-hidden="true"
          v-show="submitStatus === 'PENDING' || submitStatus === 'OK'"
        ></span>
      </button>
    </form>
  </div>
</template>

<script>
import { required, sameAs, minLength } from 'vuelidate/lib/validators';

export default {
  name: 'ResetPassword',
  data() {
    return {
      password: '',
      confirmPassword: '',
      member: null,
      submitStatus: null,
    };
  },
  validations: {
    password: {
      required,
      minLength: minLength(6),
    },
    confirmPassword: {
      required,
      sameAsPassword: sameAs('password'),
    },
  },
  created() {
    this.axios
      .get(`/api/v1/auth/reset?token=${this.$route.query.token}`)
      .then(({ data }) => {
        this.member = data.member;
      })
      .catch((err) => {
        this.$toasted.error(err.response.data.message, {
          icon: 'exclamation-triangle',
        });
        this.$router.push({ path: '/forgot' });
      });
  },
  methods: {
    resetPassword() {
      this.$v.$touch();
      if (this.$v.invalid) {
        this.submitStatus = 'ERROR';
      } else {
        this.submitStatus = 'PENDING';

        const password = this.password;
        const confirmPassword = this.confirmPassword;

        this.axios
          .post(`/api/v1/auth/reset/${this.member._id}`, {
            password: this.password,
            confirmPassword: this.confirmPassword,
          })
          .then(({ data }) => {
            this.$toasted.success(data.message, { icon: 'check-circle' });
            this.$router.push({ path: '/' });
            this.submitStatus = 'OK';
          })
          .catch((err) => {
            this.submitStatus = 'ERROR';
            this.$toasted.error(err.response.data[0].message, {
              icon: 'exclamation-triangle',
            });
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  color: white;
  padding: 1rem;
  position: relative;

  #tbLogo {
    width: 150px;
    margin-bottom: 2rem;
  }

  .greeting {
    margin-bottom: 2rem;
    font-size: 1.5rem;
    font-weight: $font-weight-bold;
  }

  form {
    width: 100%;
    max-width: 400px;

    .form-group {
      .form__label {
        font-size: $label-font-size;
        line-height: 1rem;
        margin-left: 0.25rem;
        margin-bottom: 0.25rem;
      }

      input {
        text-align: center;
      }

      .error {
        color: red;
        margin-left: 4px;
        font-size: $label-font-size;
        font-weight: $font-weight-bold;
      }

      button {
        margin: 2rem 0;
        font-weight: $font-weight-bold;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &--error {
        input {
          border-color: red;
        }
      }
    }
  }
}
</style>
