<template>
  <div>
    <h4>Dashboard</h4>
    <div v-for="member of members" :key="member._id">{{ member.name }}</div>
    <button @click="reload">Reload</button>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      members: []
    };
  },
  created: async function() {
    try {
      const res = await this.$store.dispatch('getMembers');
      this.members = res.data;
    } catch (err) {
      this.$toast.error(err.response.data[0].message);
    }
  },
  methods: {
    reload: async function() {
      try {
        const res = await this.$store.dispatch('getMembers');
        this.members = res.data;
      } catch (err) {
        this.$toast.error(err.response.data[0].message);
      }
    }
  }
};
</script>
