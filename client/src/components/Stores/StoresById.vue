<template>
  <div>TEST</div>
</template>

<script>
export default {
  name: 'StoresById',
  created: async function() {
    try {
      await this.$store.dispatch('getStore', this.$route.params.id);
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Stores',
          link: '/dashboard/stores'
        },
        {
          text: `${this.currentStore.storeName}`,
          link: `/dashboard/stores/${this.currentStore._id}`
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  computed: {
    currentStore: function() {
      return this.$store.getters.currentStore;
    },
    member: function() {
      return this.$store.getters.getCurrentMember;
    },
    modeColor: function(store) {
      let bgColor = '';
      switch (store.mode) {
        case 'HOLD':
          bgColor = '#FF8C00';
          break;
        case 'OPEN':
          bgColor = '#9ACD32';
          break;
        case 'CLOSED':
          bgColor = '#B22222';
      }

      return bgColor;
    }
  },
  methods: {}
};
</script>
