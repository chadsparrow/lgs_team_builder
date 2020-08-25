<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li
          class="breadcrumb-item"
          v-for="breadcrumb of breadcrumbs"
          :key="breadcrumb.text"
        >
          <router-link class="btn btn-sm" tag="button" :to="breadcrumb.link">{{
            breadcrumb.text
          }}</router-link>
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
    ...mapGetters(['breadcrumbs']),
  },
};
</script>

<style lang="scss">
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  background: transparent;
  padding: 0;
  margin: 0;

  .breadcrumb-item {
    .btn {
      font-size: 0.7rem;
      color: $blue-color;
      &:hover {
        background: $blue-color;
        color: $white-text;
      }
    }
  }
}
</style>
