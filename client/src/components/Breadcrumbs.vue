<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item" v-for="breadcrumb of breadcrumbs" :key="breadcrumb.text">
        <router-link class="btn btn-sm" tag="a" :to="breadcrumb.link">{{breadcrumb.text}}</router-link>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  computed: {
    breadcrumbs: function() {
      return this.$store.getters.breadcrumbs;
    }
  }
};
</script>


<style lang="scss">
.breadcrumb {
  background-color: #222;
  height: 40px;
  vertical-align: middle;
  color: white;

  a {
    color: white;

    &:hover {
      color: lightgray;
    }
  }

  .breadcrumb-item {
    height: 100%;
  }
}
</style>

