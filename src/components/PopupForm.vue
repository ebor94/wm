<template>
    <Transition name="fade">
        <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center" @keydown.esc.prevent>
            <!-- Overlay -->
            <div class="absolute inset-0 bg-black bg-opacity-50" @click="$emit('update:modelValue', false)"></div>

            <!-- Modal Content -->
            <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10 border-t-4 border-blue-500">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 border-b">
                    <h3 class="text-lg font-semibold text-blue-700">
                        {{ title }}
                    </h3>
                    <button @click="$emit('update:modelValue', false)" class="text-gray-400 hover:text-gray-600">
                        <span class="material-icons">close</span>
                    </button>
                </div>

                <!-- Form Body -->
                <div class="p-4">
                    <form @submit.prevent="handleSubmit">
                        <div class="mb-4">
                            <label for="orderNumber" class="block text-sm font-medium text-gray-700 mb-1">
                                Número de Orden
                            </label>
                            <input id="orderNumber" v-model="formData.orderNumber" type="text"
                                disabled
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                :class="{ 'border-red-500': errors.orderNumber }"
                                placeholder="Ingrese el número de orden" />
                            <p v-if="errors.orderNumber" class="mt-1 text-sm text-red-600">
                                {{ errors.orderNumber }}
                            </p>
                        </div>

                        <div class="mb-4">
                            <label for="location" class="block text-sm font-medium text-gray-700 mb-1">
                                Ubicación
                            </label>
                            <input v-focus ref="locationInput" id="location" v-model="formData.location" type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                :class="{ 'border-red-500': errors.location }" placeholder="Ingrese la ubicación" />
                            <p v-if="errors.location" class="mt-1 text-sm text-red-600">
                                {{ errors.location }}
                            </p>
                        </div>
                    </form>

                    <!-- Loading and Error Messages -->
                    <div v-if="loading" class="flex items-center justify-center py-2">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span class="ml-2 text-gray-600">Procesando...</span>
                    </div>

                    <div v-if="apiError" class="mt-2 p-2 bg-red-100 text-red-700 rounded-md">
                        {{ apiError }}
                    </div>

                    <div v-if="apiSuccess" class="mt-2 p-2 bg-green-100 text-green-700 rounded-md">
                        {{ apiSuccess }}
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex justify-end gap-2 p-4 border-t bg-gray-50">
                    <button @click="handleSubmit" :disabled="loading"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">
                        Confirmar
                    </button>
                    <button @click="$emit('update:modelValue', false)" :disabled="loading"
                        class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>

import axios from 'axios'
import { ref, reactive, watch, nextTick, onMounted } from 'vue'  
  
const locationInput = ref(null)
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
        default: false

    },
    title: {
        type: String,
        default: 'Ingresar Orden y Ubicación'
    },
    apiUrl: {
        type: String,
        required: true
    },
    otNumber: {
        type: String,
        required: true
    },
    almacenWm: {
        type: String,
        required: true
    }

})

const emit = defineEmits(['update:modelValue', 'submit-success', 'submit-error'])

// Form data
const formData = reactive({
    orderNumber: props.otNumber,
    location: ''
})

// Form state
const errors = reactive({
    orderNumber: '',
    location: ''
})
const loading = ref(false)
const apiError = ref('')
const apiSuccess = ref('')

// Validate form
const validateForm = () => {
    let isValid = true

    // Reset errors
    errors.orderNumber = ''
    errors.location = ''

    if (!formData.orderNumber.trim()) {
        errors.orderNumber = 'El número de orden es requerido'
        isValid = false
    }

    if (!formData.location.trim()) {
        errors.location = 'La ubicación es requerida'
        isValid = false
    }

    return isValid
}

watch(() => props.otNumber, (newValue, oldValue) => {
    //console.log('Watch otNumber:', { newValue, oldValue });  
    formData.orderNumber = newValue; 
}, { immediate: true });

watch(() => props.modelValue, async (isOpen) => {  
    if (isOpen) {  
        await nextTick()  
        // Pequeño timeout para asegurar que la transición del modal ha terminado  
        setTimeout(() => {  
            locationInput.value?.focus()  
        }, 100)  
    }  
})

// Submit form
const handleSubmit = async () => {

   // Reset messages
apiError.value = '';
apiSuccess.value = '';

// Validate form
if (!validateForm()) {
  return;
}

// Set loading state
loading.value = true;

try {
  // Preparar datos para la solicitud
  const requestData = {
    ubicacion: formData.location,
    almacen: props.almacenWm,
    modo: "N",
    ot: formData.orderNumber
  };

  // Obtener token del localStorage o de donde lo tengas almacenado
  const token = localStorage.getItem('token'); // Ajusta según donde guardes tu token

  // Configurar la petición con Axios
  const response = await axios({
    method: 'POST',
    url: props.apiUrl,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined
    },
    data: requestData,
    timeout: 10000 // 10 segundos de timeout
  });

  // Con Axios, la respuesta ya viene parseada como JSON
  const data = response.data;

  // Verificar success en la respuesta
  if (!data.success) {
    throw new Error(data.error?.message || 'Error al procesar la solicitud');
  }

  // Emitir evento de éxito con los datos
  emit('submit-success', data.data[0]);

  // Mostrar mensaje de éxito
  apiSuccess.value = data.data[0].mensaje;

  // Reset form after success
  formData.orderNumber = '';
  formData.location = '';

  // Close modal after a delay (optional)
  setTimeout(() => {
    emit('update:modelValue', false);
  }, 2000);
} catch (error) {
  // Manejar diferentes tipos de errores de Axios
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    const responseData = error.response?.data;
    
    if (statusCode === 401) {
      apiError.value = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
    } else if (statusCode === 404) {
      apiError.value = 'Servicio no encontrado. Contacte al administrador.';
    } else if (error.code === 'ECONNABORTED') {
      apiError.value = 'La solicitud tardó demasiado. Intente nuevamente.';
    } else if (!error.response) {
      apiError.value = 'Error de conexión. Verifique su conexión a internet.';
    } else {
      apiError.value = responseData?.error?.message || error.message || 'Ocurrió un error al procesar la solicitud';
    }
  } else {
    // Error estándar
    apiError.value = error.message || 'Ocurrió un error al procesar la solicitud';
  }
  
  // Emitir evento de error
  emit('submit-error', error);
} finally {
  // Reset loading state
  loading.value = false;
}


}
onMounted(() => {  
   // console.log('Modal montado, otNumber:', props.otNumber);  
   // console.log('formData inicial:', formData);  
});
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