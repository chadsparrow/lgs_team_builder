<template>
  <div class="page container">
    <div class="text-center">
      <img
        id="tbLogo"
        src="https://teambuilder.s3.amazonaws.com/images/assets/tb_logo_white.svg"
        alt="Team Builder Logo"
      />
    </div>
    <form @submit.prevent="forgot" v-if="!linkSent">
      <div class="form-group" :class="{ 'form-group--error': $v.email.$error }">
        <label for="email" class="form__label">{{
          $t('login.emailAddress')
        }}</label>
        <input
          type="email"
          class="form-control"
          id="email"
          ref="email"
          v-model.trim="$v.email.$model"
          autofocus
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
        {{ $t('login.resetPass')
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
import toast from '../helpers/toast';
import get from 'lodash/get';

export default {
  name: 'Forgot',
  data() {
    return {
      email: undefined,
      linkSent: false,
      submitStatus: null,
    };
  },
  validations: {
    email: {
      required,
      email,
    },
  },
  methods: {
    forgot() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR';
      } else {
        this.submitStatus = 'PENDING';
        this.axios
          .post('/api/v1/auth/forgot', { email: this.email })
          .then(({ data }) => {
            if (data[0].message === 'Reset Link Sent!') {
              this.linkSent = true;
              toast.success(data[0].message);
            }
            this.submitStatus = 'OK';
          })
          .catch((err) => {
            this.submitStatus = 'ERROR';
            this.email = '';
            this.$refs.email.focus();
            toast.error(err);
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
    margin-bottom: 2.5rem;
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

      &--error {
        input {
          border-color: red;
        }
      }
    }

    button {
      margin: 2rem 0;
      font-weight: 700;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .result {
    margin-top: 2rem;
    text-align: center;
  }
}
</style>
