<template>
  <div class="min-h-screen bg-italia-red">
    <!-- Loader Component -->
    <LoaderComponent 
      v-if="authStore.isLoading"
      loading-text="Iniciando sesión..."
    />

    <div class="min-h-screen p-4">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-auto mt-4">
        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <img 
            src="../assets/logo.png" 
            alt="Cerámica Italia" 
            class="h-12"
          />
        </div>

        <!-- Título -->
        <h2 class="text-center text-xl mb-8">.:. PickApp .:.</h2>

        <!-- Error Message -->
        <div 
          v-if="authStore.hasError" 
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        >
          {{ authStore.error }}
        </div>

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
              :disabled="authStore.isLoading"
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
              :disabled="authStore.isLoading"
            />
          </div>

          <button
            type="submit"
            class="btn-handheld w-full bg-italia-red text-white hover:bg-red-700"
            :disabled="authStore.isLoading"
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
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import router from '../router';
import { useLoader } from '../composables/useLoader' 
import { useAuthStore } from '../store/auth';



const authStore = useAuthStore()
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
    await authStore.login(username.value, password.value)
    // Aquí irá la validación del login
    router.push('/menu')
  } catch (error) {
    //console.error('Login error:', error)
  }finally {
   // hideLoader()
  }
}
  
  onMounted(() => {
    usernameInput.value?.focus()
    authStore.checkAuth()
  })
  </script>