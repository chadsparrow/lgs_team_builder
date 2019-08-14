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
  height: 100vh;
  width: 100%;

  a {
    text-decoration: none;
    color: white !important;
  }
}

body {
  background-image: linear-gradient(to bottom right, white, rgb(225, 225, 225));
}
</style>
