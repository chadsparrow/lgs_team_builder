<template>
  <div>
    <h4>Login Page</h4>
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
    login: function() {
      const email = this.email;
      const password = this.password;
      this.$store
        .dispatch('login', { email, password })
        .then(() => {
          this.$router.push('/dashboard');
        })
        .catch(err => console.log(err));
    }
  }
};
</script>
