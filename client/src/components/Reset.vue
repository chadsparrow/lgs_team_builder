<template>
  <div class="page container" v-if="member">
    <div class="text-center">
      <img
        id="tbLogo"
        src="https://teambuilder.s3.amazonaws.com/images/assets/tb_logo_white.svg"
        alt="Team Builder Logo"
      />
      <div class="greeting">
        Hi! {{ member.email.split('@')[0].toUpperCase() }} <br />Go ahead and
        reset your password!
      </div>
    </div>
    <form @submit.prevent="reset" novalidate>
      <div class="form-group">
        <label for="password">{{ $t('profiles.newPassword') }}</label>
        <input
          type="password"
          class="form-control"
          id="password"
          ref="password"
          v-model="password"
          autofocus
        />
      </div>
      <div class="form-group">
        <label for="confirmPassword">{{
          $t('profiles.confirmPassword')
        }}</label>
        <input
          type="password"
          class="form-control"
          id="confirmPassword"
          ref="confirmPassword"
          v-model="confirmPassword"
          autofocus
        />
      </div>
      <button type="submit" class="btn btn-lg btn-info btn-block">
        {{ $t('login.resetPass') }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Reset',
  data() {
    return {
      password: undefined,
      confirmPassword: undefined,
      member: undefined,
    };
  },
  created: async function() {
    try {
      const res = await this.$store.dispatch(
        'findMemberByResetPasswordToken',
        this.$route.query.token
      );
      this.member = res.data.member;
    } catch (err) {
      this.$toasted.error(err.response.data.message, {
        icon: 'exclamation-triangle',
      });
      this.$router.push({ path: '/forgot' });
    }
  },
  methods: {
    reset: async function() {
      const password = this.password;
      const confirmPassword = this.confirmPassword;

      try {
        const res = await this.$store.dispatch('resetPassword', {
          id: this.member._id,
          password: this.password,
          confirmPassword: this.confirmPassword,
        });
        this.$toasted.success(res.data.message, { icon: 'check-circle' });
        this.$router.push({ path: '/' });
      } catch (err) {
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
}
</style>
