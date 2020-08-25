<template>
  <div>
    <label :for="name">{{ $t(label) }}</label>
    <input
      :id="name"
      :type="inputType"
      :class="classNames"
      :value="value"
      :ref="name"
      @input="$emit('input', $event.target.value)"
      :readonly="readOnly"
    />
  </div>
</template>

<script>
export default {
  name: 'InputField',
  props: {
    name: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    inputType: { type: String, required: true },
    classNames: { type: String, required: true },
    readOnly: { type: Boolean, required: true },
  },
};
</script>
