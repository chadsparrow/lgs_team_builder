<template>
  <div class="container">
    <div class="row">
      <form @submit.prevent="login" novalidate class="col-sm-12">
        <div class="text-center mb-4 mt-2">
          <img id="tbLogo" src="@/assets/tb_logo_white.svg" alt="Team Builder Logo" />
        </div>
        <div class="form-group">
          <label for="email">Email address</label>
          <input
            type="email"
            class="form-control"
            id="email"
            ref="email"
            v-model="email"
            autofocus
          />
        </div>
        <div class="form-group mb-4">
          <label for="password">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            ref="password"
            v-model="password"
          />
        </div>
        <button type="submit" class="btn btn-dark btn-block mt-2">Log In</button>
        <div class="text-center mt-4 mb-0">
          <small>Need to register or forgot your password?</small>
        </div>
        <div class="underForm text-center">
          <router-link tag="a" class="mr-4 text-info" to="/register">Register</router-link>
          <router-link tag="a" class="text-info" to="#">Reset Password</router-link>
        </div>
        <div class="col-sm-12 mt-4 text-center">
          <small>&copy; 2019 Garneau.com - LGS Team Builder</small>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      email: undefined,
      password: undefined
    };
  },
  methods: {
    login: async function() {
      const email = this.email;
      const password = this.password;

      try {
        const res = await this.$store.dispatch('login', { email, password });
        this.$router.push({ name: 'dashboardIndex' }).catch(() => {});
        this.$toasted.success(res.data[0].message);
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].message);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  margin-bottom: 100px;
  width: 400px;
  background-color: black;
  color: white;
  border-radius: 10px;
  padding: 1.5rem;
  position: relative;
  font-weight: 200;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.container {
  display: flex;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  justify-content: center;
}

.underForm {
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    font-weight: 700;
  }
}

#tbLogo {
  width: 150px;
}
</style>
