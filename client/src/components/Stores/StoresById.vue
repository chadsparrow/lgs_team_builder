<template>
  <div class="storepage">
    <div class="store-info sidebar-left">
      <div v-if="currentStore && currentStore.storeName">
        <div class="row p-1">
          <small class="col-sm-12 text-info">Store Created:</small>
          <span class="col-sm-12">
            {{
            currentStore.createdAt | moment('timezone', currentStore.timezone, 'MMM Do YYYY / hh:mm a - z')
            }}
          </span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Store Timezone:</small>
          <span class="col-sm-12">{{ currentStore.timezone }}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Store Admin:</small>
          <span class="col-sm-12">{{ currentStore.adminId.name }}</span>
          <span class="col-sm-12">{{ currentStore.adminId.email }}</span>
        </div>
      </div>
    </div>
    <div class="store-items middle-section">Store Items</div>
  </div>
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
    orders: function() {
      return this.$store.getters.orders;
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

<style lang="scss" scoped>
.storepage {
  display: grid;
  grid-template-columns: 255px 1fr;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
  grid-template-areas: 'left-bar store-items';
}

.store-info {
  grid-area: left-bar;
}

.store-items {
  grid-area: store-items;
  overflow-x: hidden;
  overflow-y: auto;
  display: grid;
  flex-wrap: wrap;
}
</style>
