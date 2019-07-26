<template>
  <div>
    <h1>This is the home page</h1>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      items: ["Bio", "Pics", "Companies", "Links"],
      active: "Bio"
    };
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
