<template>
  <div class="container">
    <h5 class="text-center">Dashboard</h5>
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
