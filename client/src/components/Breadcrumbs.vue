<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item" v-for="breadcrumb of breadcrumbs" :key="breadcrumb.text">
          <router-link class="btn btn-sm" tag="a" :to="breadcrumb.link">
            {{ breadcrumb.text }}
          </router-link>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Breadcrumbs',
  computed: {
    ...mapGetters(['breadcrumbs'])
  }
};
</script>

<style lang="scss">
.breadcrumb {
  margin-top: 1rem;
  background-color: none !important;
  padding: 0px 15px !important;
}
</style>
