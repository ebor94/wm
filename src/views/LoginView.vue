<template>
    <div class="min-h-screen p-4">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-auto mt-4">
        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <img 
            src="../assets/log.png" 
            alt="Cerámica Italia" 
            class="h-12"
          />
        </div>
  
        <!-- Título -->
        <h2 class="text-center text-xl mb-8">.:. App WM .:.</h2>
  
        <!-- Formulario -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <input
              v-model="username"
              type="text"
              placeholder="N°. Usuario"
              class="input-handheld w-full"
              @keyup.enter="focusPassword"
              ref="usernameInput"
            />
          </div>
  
          <div>
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="input-handheld w-full"
              @keyup.enter="handleSubmit"
              ref="passwordInput"
            />
          </div>
  
          <button
            type="submit"
            class="btn-handheld w-full bg-italia-red text-white hover:bg-red-700"
          >
            Inicia Sesión
          </button>
        </form>
  
        <!-- Enlaces de ayuda -->
        <div class="mt-4 text-center space-y-2">
          <a href="#" class="text-gray-600 text-sm block hover:underline">
            ¿Olvidó su clave?
          </a>
          <a href="#" class="text-gray-600 text-sm block hover:underline">
            Contacte al administrador(PBX)
          </a>
        </div>
  
        <!-- Footer -->
        <div class="mt-6 text-center text-xs text-gray-500">
          Derechos reservados T.I.Cerámica Italia S.A
        </div>
      </div>
      <LoaderComponent 
      v-if="isLoading"
      :loading="isLoading"
      :loading-text="loadingText"
    />
    </div>
    
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
import router from '../router';
import { useLoader } from '../composables/useLoader' 
  const usernameInput = ref(null)
  const passwordInput = ref(null)
  const username = ref('')
  const password = ref('')

  const { isLoading, loadingText, showLoader, hideLoader } = useLoader()
  
  const focusPassword = () => {
    passwordInput.value?.focus()
  }
  
  const handleSubmit = async () => {
  try {
    showLoader('Iniciando sesión...')
    console.log('Login attempt:', { username: username.value, password: password.value })
    await new Promise(resolve => setTimeout(resolve, 2000))
    // Aquí irá la validación del login
    router.push('/menu')
  } catch (error) {
    console.error('Login error:', error)
  }finally {
    hideLoader()
  }
}
  
  onMounted(() => {
    usernameInput.value?.focus()
  })
  </script>