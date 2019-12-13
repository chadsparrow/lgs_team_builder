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
    Loading
  },
  computed: {
    ...mapGetters(['isLoading'])
  },
  methods: {
    logout: async function() {
      await this.$store.dispatch('logout');
      this.$router.push({ name: 'home' }).catch(() => {});
    }
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Overpass:200,300,400,700,900&display=swap');

$dark-color: #111111;
$blue-color: #17a2b8;
$label-color: #999999;
$white-text: #ffffff;
$black-text: #000000;

body,
html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Overpass', sans-serif;
  background: black;
  font-size: 16px;
  scroll-behavior: smooth;
  a {
    cursor: pointer;
  }
}

label {
  color: $blue-color;
  margin: 0 0;
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
      border: 0px solid grey;
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
    font-size: 0.85em;
  }

  .list-group {
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 250px;

    .list-group-item {
      font-size: 0.9rem;
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
    margin-bottom: 1rem;
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
  small {
    font-size: 0.8rem;
    color: $blue-color;
  }
  font-size: 0.85rem;
}

.sizesBox {
  background-color: $blue-color;
  font-size: 0.85rem;
  margin: 0.5rem 0;
  padding: 1rem;
  label {
    color: white;
  }
}

::-webkit-scrollbar {
  width: 14px;
  height: 18px;
}
::-webkit-scrollbar-thumb {
  height: 10px;
  border: 3px solid rgba(0, 0, 0, 0);
  background-clip: padding-box;
  background-color: $blue-color;
  border-radius: 10px;
}

@media (max-width: 800px) {
  .sidebar-left,
  .middle-section,
  .sidebar-right {
    flex: none;
  }
}
</style>
