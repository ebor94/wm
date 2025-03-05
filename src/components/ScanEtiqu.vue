// ScannerInput.vue
<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <label class="block text-sm font-medium text-white">
        {{ label }}
      </label>
      <input
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled"
        @change="handleChange"
        @keyup.enter="handleChange"
        class="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-italia-red focus:border-italia-red"
        :placeholder="placeholder"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Valor de etiqueta'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Escanee o ingrese el valor'
  }
})

const emit = defineEmits(['update:modelValue', 'onChange'])

const handleChange = (event) => {
    //console.log('ingreso al componente padre')
  const value = event.target.value
  emit('onChange', value)
}
</script>

<style scoped>
.italia-red {
  --tw-ring-color: rgb(205, 33, 34);
  --tw-border-opacity: 1;
  border-color: rgb(205, 33, 34);
}
</style>