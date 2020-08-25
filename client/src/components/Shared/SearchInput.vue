<template>
  <div>
    <span class="fa fa-search form-control-feedback"></span>
    <input
      type="text"
      :id="name"
      :name="name"
      class="form-control form-control-sm m-0"
      :value="value"
      :placeholder="$t(translation)"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  props: {
    id: String,
    name: String,
    value: String,
    translation: String,
  },
};
</script>

<style lang="scss" scoped>
.has-search .form-control {
  padding-left: 2rem;
}

.has-search .form-control-feedback {
  position: absolute;
  z-index: 2;
  display: block;
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  color: #aaa;
}

@media screen and (min-width: 0px) and (max-width: 397px) {
  .form-group {
    max-width: 100%;
    width: 100%;
  }
}
</style>
