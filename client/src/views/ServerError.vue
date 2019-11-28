<template>
  <div class="container">
    <div class="row text-center">
      <div class="col-sm-12 mb-4">
        <img src="@/assets/404_error.svg" alt="404 Error Image" />
      </div>
      <div class="col-sm-12">
        <h1>505 Server Error.</h1>
        <h5 class="text-muted">Please try again later.</h5>
      </div>
      <div class="col-sm-12 mt-4">
        <small>&copy; 2019 Garneau.com - LGS Team Builder</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  justify-content: center;

  img {
    width: 100px;
  }
}
</style>
