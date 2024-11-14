

<template>
  <Transition name="fade">
    <div 
      v-if="modelValue" 
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <!-- Overlay -->
      <div 
        class="absolute inset-0 bg-black bg-opacity-50"
        @click="$emit('update:modelValue', false)"
      ></div>

      <!-- Popup Content -->
      <div 
        class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10"
        :class="[
          type === 'success' ? 'border-t-4 border-green-500' :
          type === 'error' ? 'border-t-4 border-red-500' :
          type === 'warning' ? 'border-t-4 border-yellow-500' :
          type === 'info' ? 'border-t-4 border-blue-500' : ''
        ]"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h3 
            class="text-lg font-semibold"
            :class="[
              type === 'success' ? 'text-green-700' :
              type === 'error' ? 'text-red-700' :
              type === 'warning' ? 'text-yellow-700' :
              type === 'info' ? 'text-blue-700' : 'text-gray-700'
            ]"
          >
            {{ title }}
          </h3>
          <button 
            @click="$emit('update:modelValue', false)"
            class="text-gray-400 hover:text-gray-600"
          >
            <span class="material-icons">close</span>
          </button>
        </div>

        <!-- Body -->
        <div class="p-4">
          <div class="flex items-start">
            <!-- Icon -->
            <span 
              class="material-icons text-2xl mr-3"
              :class="[
                type === 'success' ? 'text-green-500' :
                type === 'error' ? 'text-red-500' :
                type === 'warning' ? 'text-yellow-500' :
                type === 'info' ? 'text-blue-500' : ''
              ]"
            >
              {{ icon }}
            </span>
            <!-- Message -->
            <div class="text-gray-600">
              <slot>{{ message }}</slot>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-2 p-4 border-t bg-gray-50">
          <slot name="actions">
      <button 
        v-if="showConfirm"
        @click="handleConfirm"
        class="px-4 py-2 bg-italia-red text-white rounded-lg hover:bg-red-700"
      >
        {{ confirmText }}
      </button>
      <button 
        @click="$emit('update:modelValue', false)"
        class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        {{ cancelText }}
      </button>
    </slot>
  </div>
      </div>
    </div>
  </Transition>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Mensaje'
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  showConfirm: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: 'Aceptar'
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  },
  action: {
    type: String,
    default: 'normal' // puede ser 'normal', 'update', etc.
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'update'])

const handleConfirm = () => {
  if (props.action === 'update') {
    emit('update')
  } else {
    emit('confirm')
  }
  emit('update:modelValue', false)
}

// Computed para el icono según el tipo
const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'check_circle'
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    default:
      return 'info'
  }
})


</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>