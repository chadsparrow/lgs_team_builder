<template>
  <div class="page container">
    <form @submit.prevent="reset" novalidate>
      <div class="text-center">
        <img
          id="tbLogo"
          src="https://teambuilder.s3.amazonaws.com/images/assets/tb_logo_white.svg"
          alt="Team Builder Logo"
        />
      </div>
      <div class="form-group">
        <label for="email">{{ Enter your $t('login.emailAddress') }}</label>
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
  </div>
</template>

<script>
export default {
  name: 'Forgot',
  data() {
    return {
      email: undefined,
    };
  },
  methods: {
    reset: async function() {
      const email = this.email;

      try {
        const res = await this.$store.dispatch('forgot', { email });
        this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
        console.log(res);
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
  }
}
</style>
