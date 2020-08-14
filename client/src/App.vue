<template>
  <div id="app">
    <loading
      :active.sync="isLoading"
      :is-full-page="true"
      color="#000"
      background-color="#000"
      :opacity="0.0"
      loader="spinner"
    ></loading>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { mapGetters } from 'vuex';

export default {
  components: {
    Loading,
  },
  computed: {
    ...mapGetters(['isLoading']),
  },
  methods: {
    logout: async function() {
      await this.$store.dispatch('logout');
    },
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700;900&display=swap');

// GLOBAL STYLES
* {
  box-sizing: border-box;
}

body,
html {
  margin: 0;
  padding: 0;
  font-family: $base-font-family;
  background: $black-text;
  font-size: $base-font-size;
  scroll-behavior: smooth;
  a {
    cursor: pointer;
  }
}

label {
  color: $blue-color;
  font-size: $label-font-size;
  margin: 0;
  padding: 0;
}

.small-btn,
.large-btn,
.danger-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background: $blue-color;
  color: $white-text;
  user-select: none;
  border: 1px solid $blue-color;
  border-radius: $border-radius;
  font-weight: $font-weight-regular;
  cursor: pointer;

  &:hover:not([disabled]) {
    background: $white-text;
    color: $blue-color;
    border: 1px solid $blue-color;
    box-shadow: $box-shadow;
  }

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
}

.large-btn {
  padding: 0.3rem 1rem;
  font-size: 1.1rem;
}

.danger-btn {
  background: $danger-red !important;
  color: white !important;
  border: 1px solid $danger-red !important;

  &:hover:not([disabled]) {
    background: $danger-red-hover !important;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.25s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.table {
  font-size: $span-font-size;
}

.table > tbody > tr > td,
.table > tbody > tr > th {
  vertical-align: middle;
}

.table-hover {
  tbody {
    tr:hover {
      td {
        background-color: $blue-color;
        color: $white-text;
        cursor: pointer;
      }
    }
  }
}

textarea {
  white-space: pre-wrap;
}

.pagination {
  .active {
    a {
      background-color: $blue-color !important;
      color: $white-text;
      border: 0px solid $label-color;
    }
  }
  .page-item {
    a {
      color: $black-text;
    }
  }
}

.vue-avatar--wrapper {
  border-radius: 1rem !important;
}

.avatarWrapper {
  img {
    border-radius: 0.8rem;
  }
}

.sidebar-left {
  grid-area: sidebar-left;
  overflow-x: hidden;
  overflow-y: auto;
  span {
    font-size: $span-font-size;
  }

  .list-group {
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 250px;

    .list-group-item {
      font-size: $span-font-size;
      padding: 0.3rem 0.7rem;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        background-color: $blue-color;
        color: $white-text;
      }

      .memberIcons {
        display: flex;
        justify-content: flex-start;
      }
    }
  }
}

.middle-section {
  grid-area: middle-section;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: $span-font-size;
  padding: $scrollbar-padding;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    width: 100%;
    border-radius: $border-radius;
    color: $white-text;
  }

  .form-group {
    margin: 0 0 0.25rem 0;
  }
}

.sidebar-right {
  grid-area: right-section;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: $span-font-size;
  small {
    color: $blue-color;
  }
}

.sizesBox {
  background-color: $blue-color;
  font-size: $span-font-size;
  margin: 0.5rem 0;
  padding: 1rem;
  label {
    color: $white-text;
  }
}

::-webkit-scrollbar {
  width: 6px;
  background-color: $scrollbar_track;
  border-radius: $border-radius;
  -webkit-border-radius: $border-radius;
}

::-webkit-scrollbar-thumb {
  background-clip: initial;
  border-radius: $border-radius;
  -webkit-border-radius: $border-radius;
  background-color: $blue-color;
}

::-webkit-scrollbar-button {
  width: 0;
  height: 0;
  display: none;
}

::-webkit-scrollbar-corner {
  background-color: transparent;
}

@media (max-width: 800px) {
  .sidebar-left,
  .middle-section,
  .sidebar-right {
    flex: none;
  }
}
</style>
