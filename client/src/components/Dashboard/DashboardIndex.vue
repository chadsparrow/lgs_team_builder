<template>
  <div class="container">
    <h1>DASHBOARD INDEX</h1>
  </div>
</template>

<script>
import i18n from '../../i18n';

export default {
  data() {
    return {};
  },
  async created() {
    try {
      await this.$store.dispatch('setBreadcrumbs', []);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, {
        icon: 'exclamation-triangle',
      });
    }
  },
};
</script>
