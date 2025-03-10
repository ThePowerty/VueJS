<template>
  <input
    class="input-field"
    v-model="computedModel"
    :type="type"
    :placeholder="placeHolder"
    :required
  />
  <p v-if="error" class="error-message">{{ error }}</p>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'

  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    placeHolder: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
  })

  const emits = defineEmits(['update:modelValue'])

  const computedModel = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emits('update:modelValue', value)
    },
  })
</script>

<style module lang="scss">
  .input-field {
    margin-bottom: 16px;
  }

  .error-message {
    color: red;
    margin-top: 8px;
    font-size: 14px;
  }
</style>
