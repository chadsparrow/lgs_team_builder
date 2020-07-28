<template>
  <div class="page">
    <form @submit.prevent="login" novalidate>
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
        <router-link class="text-info" to="#">{{
          $t('login.resetPass')
        }}</router-link>
      </div>
      <div class="text-center mt-4">
        <small>&copy; 2019 Garneau.com - LGS Team Builder</small>
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
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      email: undefined,
      password: undefined,
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
        this.$toasted.error(err.response.data[0].message, {
          icon: 'exclamation-triangle',
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

    .text-center {
      .text-info {
        font-size: 0.85rem;
      }
    }
  }
}
</style>
