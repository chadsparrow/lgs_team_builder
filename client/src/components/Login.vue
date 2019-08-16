<template>
  <div>
    <h4>Sign In</h4>
    <form class="login" @submit.prevent="login">
      <label for="email">Email</label>
      <div>
        <input placeholder="Your email" type="email" v-model="email" autofocus ref="email" />
      </div>
      <label for="password">Password</label>
      <div>
        <input placeholder="Password" type="password" v-model="password" />
      </div>
      <hr />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      error: {}
    };
  },
  methods: {
    login: async function() {
      const email = this.email;
      const password = this.password;

      try {
        const res = await this.$store.dispatch('login', { email, password });
        M.toast({ html: 'Welcome Back', classes: 'green' });
        this.$router.push('/dashboard');
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        M.toast({ html: err.response.data[0].message, classes: 'red' });
        this.error = err.response.data[0];
      }
    }
  }
};
</script>
