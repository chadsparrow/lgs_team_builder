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
      this.$router.push({ name: 'home' }).catch(() => {});
    },
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;500;700;900&display=swap');

* {
  box-sizing: border-box;
}

body,
html {
  margin: 0;
  padding: 0;
  font-family: 'Noto Sans JP', sans-serif;
  background: $black-text;
  font-size: 14px;
  scroll-behavior: smooth;
  a {
    cursor: pointer;
  }
}

label {
  color: $blue-color;
  font-size: 0.75rem;
  margin: 0;
  padding: 0;
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
  font-size: 0.85rem;
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
    font-size: 0.85rem;
  }

  .list-group {
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 250px;

    .list-group-item {
      font-size: 0.85rem;
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
  font-size: 0.85rem;
  padding: 0 0.5rem 0 0;

  .section-header {
    padding: 0.5rem;
    width: 100%;
    border-radius: 5px;
    color: $white-text;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 0.5rem 0;
  }

  .info-spans {
    margin-bottom: 0.5rem;
    span {
      background-color: rgba(255, 255, 255, 0.6);
      padding: 0.1rem 0.25rem;
      border-radius: 5px;
      display: block;
    }

    label {
      margin-left: 4px;
      margin-top: 0.3rem;
    }
  }

  .form-group {
    margin: 0;
  }
}

.sidebar-right {
  grid-area: right-section;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 0.85rem;
  small {
    color: $blue-color;
  }
}

.sizesBox {
  background-color: $blue-color;
  font-size: 0.85rem;
  margin: 0.5rem 0;
  padding: 1rem;
  label {
    color: $white-text;
  }
}

::-webkit-scrollbar {
  width: 6px;
  background-color: $scrollbar_track;
  border-radius: 7px;
  -webkit-border-radius: 7px;
}

::-webkit-scrollbar-thumb {
  background-clip: initial;
  border-radius: 7px;
  -webkit-border-radius: 7px;
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
