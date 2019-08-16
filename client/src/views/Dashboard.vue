<template>
  <div>
    <h4>Dashboard</h4>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  created: async function() {
    try {
      const res = await this.$store.dispatch('getMembers');
      console.log(res.data);
    } catch (err) {
      this.$toast.error(err.response.data[0].message);
    }
  }
};
</script>

