<template>
  <div class="page container">
    <form @submit.prevent="submit" v-if="verified && !emailSent">
      <div class="text-center">
        <img
          id="tbLogo"
          src="https://teambuilder.s3.amazonaws.com/images/assets/tb_logo_white.svg"
          alt="Team Builder Logo"
        />
      </div>
      <div
        class="form-group mb-4"
        :class="{ 'form-group--error': $v.email.$error }"
      >
        <label for="email" class="form__label sr-only">{{
          $t('login.emailAddress')
        }}</label>
        <input
          type="email"
          class="form-control"
          id="email"
          name="email"
          ref="email"
          v-model.trim="$v.email.$model"
          placeholder="Email Address"
          aria-placeholder="Email Address"
          autofocus
        />
        <div v-if="$v.email.$error || $v.email.$dirty">
          <span class="error" v-if="!$v.email.required">Email is required</span>
          <span class="error" v-if="!$v.email.email"
            >Must be a valid email</span
          >
        </div>
      </div>
      <div class="form-group" :class="{ 'form-group--error': $v.email.$error }">
        <label for="password" class="form__label sr-only">{{
          $t('login.password')
        }}</label>
        <input
          type="password"
          class="form-control"
          id="password"
          name="password"
          ref="password"
          placeholder="Password"
          aria-placeholder="Password"
          v-model.trim="$v.password.$model"
        />
        <div v-if="$v.password.$error || $v.password.$dirty">
          <span class="error" v-if="!$v.password.required">
            Password is required
          </span>
        </div>
      </div>
      <button
        type="submit"
        class="large-btn btn-block"
        :disabled="submitStatus === 'PENDING' || $v.$invalid"
      >
        {{ $t('login.loginButton')
        }}<span
          class="spinner-border spinner-border-sm ml-2"
          role="status"
          aria-hidden="true"
          v-show="submitStatus === 'PENDING' || submitStatus === 'OK'"
        ></span>
      </button>
      <div class="text-center">
        <small>{{ $t('login.resetPassTitle') }}</small
        ><br />
        <router-link class="text-info" to="/forgot">{{
          $t('login.resetPass')
        }}</router-link>
      </div>
      <div class="text-center mt-4">
        <small>&copy; {{ $t('year') }} Garneau.com - LGS TeamBuilder</small>
      </div>
      <div class="langChooser">
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="lang"
            id="english"
            value="en"
            v-model="$root.$i18n.locale"
          />
          <label class="form-check-label" for="english">EN</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="radio"
            name="lang"
            id="french"
            value="fr"
            v-model="$root.$i18n.locale"
          />
          <label class="form-check-label" for="french">FR</label>
        </div>
      </div>
    </form>
    <form @submit.prevent="verify" v-else-if="!verified && !emailSent">
      <div class="form-group" :class="{ 'form-group--error': $v.email.$error }">
        <label for="email" class="form__label">{{
          $t('login.emailAddress')
        }}</label>
        <input
          type="email"
          class="form-control"
          id="email"
          ref="verifyEmail"
          v-model.trim="$v.email.$model"
        />
        <div v-if="$v.email.$error || $v.email.$dirty">
          <span class="error" v-if="!$v.email.required">Email is required</span>
          <span class="error" v-if="!$v.email.email"
            >Must be a valid email</span
          >
        </div>
      </div>
      <button
        type="submit"
        class="large-btn btn-block"
        :disabled="submitStatus === 'PENDING' || $v.$invalid"
      >
        {{ $t('login.verifyEmail')
        }}<span
          class="spinner-border spinner-border-sm ml-2"
          role="status"
          aria-hidden="true"
          v-show="submitStatus === 'PENDING' || submitStatus === 'OK'"
        ></span>
      </button>
    </form>
    <div class="result" v-else>
      {{ $t('login.resultline1') }}<br />
      {{ $t('login.resultline2') }}
    </div>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators';

export default {
  name: 'login',
  data() {
    return {
      email: undefined,
      password: undefined,
      verified: true,
      emailSent: false,
      submitStatus: null,
    };
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },
  methods: {
    submit: async function() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR';
      } else {
        this.submitStatus = 'PENDING';

        const email = this.email.toLowerCase();
        const password = this.password;
        try {
          const res = await this.$store.dispatch('login', { email, password });
          this.$router.push({ name: 'dashboardIndex' }).catch(() => {});
          this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
          this.submitStatus = 'OK';
        } catch (err) {
          this.submitStatus = 'ERROR';
          if (err.response.data[0].error.message.includes('unverified')) {
            this.verified = false;
            this.$refs.verifyEmail.focus();
          }

          this.email = '';
          this.password = '';

          this.$toasted.error(err.response.data[0].error.message, {
            icon: 'exclamation-triangle',
          });
          this.$refs.email.focus();
        }
      }
    },
    verify() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR';
      } else {
        this.submitStatus = 'PENDING';
        this.axios
          .post('/api/v1/auth/verifyemail', { email: this.email })
          .then((res) => {
            this.emailSent = true;
            this.submitStatus = 'OK';
            this.$toasted.success(res.data[0].message, {
              icon: 'check-circle',
            });
          })
          .catch((err) => {
            this.submitStatus = 'ERROR';
            this.email = '';
            this.$refs.verifyEmail.focus();
            this.$toasted.error(err.response.data[0].error.message, {
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
  justify-content: center;
  align-items: center;
  overflow: hidden;
  color: white;
  padding: 1rem;

  form {
    width: 100%;
    max-width: 400px;
    margin-bottom: 8rem;

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

      &--error {
        input {
          border-color: red;
        }
      }
    }

    #tbLogo {
      width: 150px;
      margin-bottom: 2.5rem;
    }

    button {
      margin: 2rem 0;
      font-weight: $font-weight-bold;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .langChooser {
      margin-top: 1rem;
      font-size: 0.85rem;
      text-align: center;

      input {
        display: none;
      }

      label {
        cursor: pointer;

        &:hover {
          font-weight: 700;
          text-decoration: underline;
        }
      }
    }
  }

  .result {
    margin-top: 2rem;
    text-align: center;
  }
}
</style>
