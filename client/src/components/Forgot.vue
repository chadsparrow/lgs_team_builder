<template>
  <div class="page container">
    <div class="text-center">
      <img
        id="tbLogo"
        src="https://teambuilder.s3.amazonaws.com/images/assets/tb_logo_white.svg"
        alt="Team Builder Logo"
      />
    </div>
    <form @submit.prevent="forgot" novalidate v-if="!linkSent">
      <div class="form-group">
        <label for="email">{{ $t('login.emailAddress') }}</label>
        <input
          type="email"
          class="form-control"
          id="email"
          ref="email"
          v-model="email"
          autofocus
        />
      </div>
      <button type="submit" class="btn btn-lg btn-info btn-block">
        {{ $t('login.resetPass') }}
      </button>
    </form>
    <div class="result" v-else>
      {{ $t('login.resultline1') }}<br />
      {{ $t('login.resultline2') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Forgot',
  data() {
    return {
      email: undefined,
      linkSent: false,
    };
  },
  methods: {
    forgot() {
      this.axios
        .post('/api/v1/auth/forgot', { email: this.email })
        .then(({ data }) => {
          if (data[0].message === 'Reset Link Sent!') {
            this.linkSent = true;
          }
        })
        .catch((err) => {
          this.email = '';
          this.$refs.email.focus();
          this.$toasted.error(err.response.data[0].message, {
            icon: 'exclamation-triangle',
          });
        });
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

    input {
      text-align: center;
    }

    label {
      font-size: 0.85rem;
      line-height: 1rem;
      margin-left: 0.25rem;
      margin-bottom: 0.25rem;
    }

    button {
      margin: 2rem 0;
      font-weight: 700;
    }
  }

  .result {
    margin-top: 2rem;
    text-align: center;
  }
}
</style>
