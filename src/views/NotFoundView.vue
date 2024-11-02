<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <!-- Logo Container -->
      <div class="mb-8">
        <img 
          src="../assets/log.png" 
          alt="LogiCIT" 
          class="h-16 mb-2"
        />
      </div>
  
      <!-- Error Content -->
      <div class="text-center space-y-4 max-w-md">
        <h1 class="text-6xl font-bold text-italia-red">404</h1>
        <div class="space-y-2">
          <h2 class="text-2xl font-semibold text-gray-800">Página no encontrada</h2>
          <p class="text-gray-600">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>
  
        <!-- Ilustración -->
        <div class="my-8 text-italia-red">
          <span class="material-icons" style="font-size: 64px">
            warehouse
          </span>
        </div>
  
        <!-- Botones de Acción -->
        <div class="space-y-3">
          <button 
            @click="goToHome"
            class="w-full bg-italia-red text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700"
          >
            <span class="material-icons">home</span>
            <span>Ir al Inicio</span>
          </button>
  
          <button 
            @click="goBack"
            class="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-200 border"
          >
            <span class="material-icons">arrow_back</span>
            <span>Volver Atrás</span>
          </button>
        </div>
      </div>
  
      <!-- Footer -->
      <footer class="mt-auto text-center text-sm text-gray-500 p-4">
        LogiCIT - Cerámica Italia ©2024
      </footer>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const goToHome = () => {
    router.push('/')
  }
  
  const goBack = () => {
    router.back()
  }
  </script>
  
  <style scoped>
  button {
    min-height: 44px;
    touch-action: manipulation;
  }
  
  .material-icons {
    font-size: 20px;
  }
  
  /* Animación suave para los botones */
  button {
    transition: all 0.2s ease;
  }
  
  button:active {
    transform: scale(0.98);
  }
  </style>