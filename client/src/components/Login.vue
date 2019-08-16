<template>
  <div>
    <h4>Sign In</h4>
    <form class="login" @submit.prevent="login" novalidate>
      <label for="email">Email</label>
      <div>
        <input placeholder="Your email" type="email" v-model="email" autofocus ref="email" />
      </div>
      <label for="password">Password</label>
      <div>
        <input placeholder="Password" type="password" v-model="password" ref="password" />
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
        this.$router.push('/dashboard');
        this.$toast.success(res.data[0].message);
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toast.error(err.response.data[0].message);
      }
    }
  }
};
</script>
