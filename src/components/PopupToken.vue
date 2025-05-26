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
                            <label for="authToken" class="block text-sm font-medium text-gray-700 mb-1">
                                Ingrese Token de Autorización
                            </label>
                            <input 
                                id="authToken" 
                                v-model="formData.authToken" 
                                type="text"
                                maxlength="5"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                :class="{ 'border-red-500': errors.authToken }"
                                placeholder="Ingrese el token de 5 dígitos" 
                                @input="onTokenInput"
                            />
                            <p v-if="errors.authToken" class="mt-1 text-sm text-red-600">
                                {{ errors.authToken }}
                            </p>
                        </div>
                        
                    </form>

                    <!-- Loading and Error Messages -->
                    <div v-if="loading" class="flex items-center justify-center py-2">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        <span class="ml-2 text-gray-600">Validando token...</span>
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
                    <button 
                        @click="handleSubmit" 
                        :disabled="loading || !isFormValid"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        Validar Token
                    </button>
                    <button 
                        @click="$emit('update:modelValue', false)" 
                        :disabled="loading"
                        class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, reactive, watch, nextTick, onMounted, computed } from 'vue'



const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
        default: false
    },
    title: {
        type: String,
        default: 'Ingresar Token de Autorización'
    }
})

const emit = defineEmits(['update:modelValue', 'submit-success', 'submit-error', 'token-validated', 'send-generated-token'])

// Token generado automáticamente
const generatedToken = ref('')

// Form data
const formData = reactive({
    authToken: ''
})

// Form state
const errors = reactive({
    authToken: ''
})

const loading = ref(false)
const apiError = ref('')
const apiSuccess = ref('')

// Computed para validar si el formulario está completo
const isFormValid = computed(() => {
    return formData.authToken.length === 5 && !errors.authToken
})

// Generar token de 5 dígitos
const generateToken = async () => {
    const token = Math.floor(10000 + Math.random() * 90000).toString()
    generatedToken.value = token
    console.log('Token generado:', token) // Para debug
    
    // Enviar el token generado al webhook via componente padre
    try {
        await new Promise((resolve, reject) => {
            emit('send-generated-token', {
                token: token,
                timestamp: new Date().toISOString(),
                onSuccess: (response) => resolve(response),
                onError: (error) => reject(error)
            })
        })
        console.log('Token enviado al webhook exitosamente')
    } catch (error) {
        console.error('Error enviando token al webhook:', error)
    }
    
    return token
}

// Validar input del token (solo números)
const onTokenInput = (event) => {
    const value = event.target.value
    // Solo permitir números
    const numericValue = value.replace(/[^0-9]/g, '')
    formData.authToken = numericValue
    
    // Limpiar error si existe
    if (errors.authToken) {
        errors.authToken = ''
    }
}

// Validate form
const validateForm = () => {
    let isValid = true

    // Reset errors
    errors.authToken = ''


    // Validar token
    if (!formData.authToken.trim()) {
        errors.authToken = 'El token es requerido'
        isValid = false
    } else if (formData.authToken.length !== 5) {
        errors.authToken = 'El token debe tener exactamente 5 dígitos'
        isValid = false
    } else if (!/^\d{5}$/.test(formData.authToken)) {
        errors.authToken = 'El token solo debe contener números'
        isValid = false
    } else if (formData.authToken !== generatedToken.value) {
        errors.authToken = 'El token ingresado no es válido'
        isValid = false
    }



    return isValid
}

// Watch para focus cuando se abre el modal
watch(() => props.modelValue, async (isOpen) => {
    if (isOpen) {
        // Reset form
        formData.authToken = ''
        errors.authToken = ''
        apiError.value = ''
        apiSuccess.value = ''
        
        // Generar nuevo token SOLO cuando se abre el modal (esto enviará automáticamente al webhook)
        await generateToken()
        
        await nextTick()
    }
})

// Submit form
const handleSubmit = async () => {
    // Reset messages
    apiError.value = ''
    apiSuccess.value = ''

    // Validaciones básicas de formulario (campos requeridos, formato)
    if (!formData.authToken.trim()) {
        errors.authToken = 'El token es requerido'
        return
    }
    


    if (formData.authToken.length !== 5) {
        errors.authToken = 'El token debe tener exactamente 5 dígitos'
        return
    }

    // Set loading state
    loading.value = true

    try {


        validateForm()
        if (!isFormValid.value) {
            return
        }
        // Emitir evento de éxito con los datos completos
        apiSuccess.value = '¡Token enviado y validado correctamente!'
        emit('token-validated', {
            token: formData.authToken,          
            timestamp: new Date().toISOString(),
            
        })
        
        emit('submit-success', formData)
        
        // Cerrar modal después de un delay
        setTimeout(() => {
            emit('update:modelValue', false)
        }, 500)
        
    } catch (error) {
        if (error.message.includes('token ingresado no coincide')) {
            errors.authToken = 'Token inválido. Verifique el código ingresado.'
            apiError.value = 'El token ingresado no es válido'
        } else if (error.message.includes('webhook')) {
            apiError.value = 'Error al enviar el token al webhook. Inténtelo nuevamente.'
        } else {
            apiError.value = 'Error al procesar la solicitud. Inténtelo nuevamente.'
        }
        emit('submit-error', error)
    } finally {
        loading.value = false
    }
}

// NO generar token inicial al montar - SOLO cuando se abre el modal
onMounted(() => {
    console.log('PopupToken montado - NO se genera token automáticamente')
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