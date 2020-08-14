<template>
  <div class="container">
    <h1>DASHBOARD INDEX</h1>
  </div>
</template>

<script>
import i18n from '../../i18n';
import toast from '../../helpers/toast';

export default {
  data() {
    return {};
  },
  async created() {
    try {
      await this.$store.dispatch('setBreadcrumbs', []);
    } catch (err) {
      toast.error(err);
    }
  },
};
</script>
