<template>
  <div :class="classInfo">
    <label :for="name">{{ $t(labelText) }}</label>
    <span :name="name">{{ spanText }}</span>
  </div>
</template>

<script>
export default {
  props: {
    labelText: {
      type: String,
      required: true,
    },
    spanText: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    classInfo: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
span {
  background-color: $info-spans-background;
  padding: 0.15rem 0.25rem;
  border-radius: $border-radius;
  display: block;
}

label {
  margin-left: 4px;
  margin-top: 0.3rem;
}
</style>
