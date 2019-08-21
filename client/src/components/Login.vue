<template>
  <div class="container">
    <div class="row text-center">
      <form @submit.prevent="login" novalidate class="col-sm-12 text-left">
        <h4 class="text-center m-4">TB Logo</h4>
        <h4 class="text-center m-4">Log In</h4>
        <div class="form-group">
          <label for="email">Email address</label>
          <input
            type="email"
            class="form-control"
            id="email"
            placeholder="Enter email"
            ref="email"
            v-model="email"
          />
        </div>
        <div class="form-group mb-4">
          <label for="password">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            placeholder="Password"
            ref="password"
            v-model="password"
          />
        </div>
        <button type="submit" class="btn btn-dark btn-block">Login</button>
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
        this.$router.push({ name: 'dashboard' });
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
  width: 300px;
  background-color: black;
  color: white;
  border-radius: 10px;
  padding: 1rem;
  position: relative;
  font-weight: 200;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

label {
  font-size: 0.9rem;
}

.container {
  display: flex;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  justify-content: center;
}
</style>
