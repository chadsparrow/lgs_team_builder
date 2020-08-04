<template>
  <div class="page container">
    <form @submit.prevent="login" novalidate v-if="verified && !emailSent">
      <div class="text-center">
        <img
          id="tbLogo"
          src="https://teambuilder.s3.amazonaws.com/images/assets/tb_logo_white.svg"
          alt="Team Builder Logo"
        />
      </div>
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
      <div class="form-group">
        <label for="password">{{ $t('login.password') }}</label>
        <input
          type="password"
          class="form-control"
          id="password"
          ref="password"
          v-model="password"
        />
      </div>
      <button type="submit" class="btn btn-lg btn-info btn-block">
        {{ $t('login.loginButton') }}
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
    <form
      @submit.prevent="verify"
      novalidate
      v-else-if="!verified && !emailSent"
    >
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
        {{ $t('login.verifyEmail') }}
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
  name: 'login',
  data() {
    return {
      email: undefined,
      password: undefined,
      verified: true,
      emailSent: false,
    };
  },
  methods: {
    login: async function() {
      const email = this.email;
      const password = this.password;

      try {
        const res = await this.$store.dispatch('login', { email, password });
        this.$router.push({ name: 'dashboardIndex' }).catch(() => {});
        this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }

        if (err.response.data[0].message.includes('not verified')) {
          this.verified = false;
        }

        this.$toasted.error(err.response.data[0].message, {
          icon: 'exclamation-triangle',
        });
      }
    },
    verify() {
      this.axios
        .post('/api/v1/auth/verifyemail', { email: this.email })
        .then((res) => {
          this.emailSent = true;
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
  justify-content: center;
  align-items: center;
  overflow: hidden;
  color: white;
  padding: 1rem;

  form {
    width: 100%;
    max-width: 400px;
    margin-bottom: 8rem;

    input {
      text-align: center;
    }

    #tbLogo {
      width: 150px;
      margin-bottom: 2.5rem;
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
