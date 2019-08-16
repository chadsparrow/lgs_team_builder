<template>
  <div>
    <router-view />
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Overpass&display=swap');

body,
html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Overpass', sans-serif;

  a {
    text-decoration: none;
    color: white !important;
  }
}

#toast-container {
  top: auto !important;
  left: auto !important;
  bottom: 30px;
  right: 30px;
}
</style>
