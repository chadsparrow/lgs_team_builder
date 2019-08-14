<template>
  <div>
    <h2>Login Page</h2>
    <form @submit.prevent="login">
      <div>
        <input placeholder="Your email" type="email" v-model="email" />
      </div>
      <div>
        <input placeholder="Password" type="password" v-model="password" />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    login: async function() {
      const email = this.email;
      const password = this.password;
      await this.$store.dispatch('login', { email, password });
      this.$router.push('/about');
    }
  }
};
</script>
