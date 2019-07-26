<template>
  <div id="app">
    <div id="nav">
      <sui-sidebar visible="true" width="very thin" animation="overlay"></sui-sidebar>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
</style>
