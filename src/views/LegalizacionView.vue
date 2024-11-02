<template>
    <div class="min-h-screen flex flex-col bg-white">
      <!-- Header -->
      <header class="bg-italia-red text-white py-4">
        <div class="flex items-center px-4">
          <span class="material-icons">assignment</span>
          <h1 class="text-lg font-bold ml-2">LEGALIZAR TRASLADO</h1>
        </div>
      </header>
  
      <!-- Main Content -->
      <main class="flex-1 p-4">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Código -->
          <div class="space-y-1">
            <label class="text-sm text-gray-600">Código</label>
            <input
              v-model="formData.codigo"
              type="text"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-italia-red focus:border-italia-red bg-gray-50"
            />
          </div>
  
          <!-- Lote -->
          <div class="space-y-1">
            <label class="text-sm text-gray-600">Lote</label>
            <input
              v-model="formData.lote"
              type="text"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-italia-red focus:border-italia-red bg-gray-50"
            />
          </div>
  
          <!-- Número de Estiba -->
          <div class="space-y-1">
            <label class="text-sm text-gray-600">Número de Estiba</label>
            <input
              v-model="formData.numeroEstiba"
              type="text"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-italia-red focus:border-italia-red bg-gray-50"
            />
          </div>
  
          <!-- Cantidad -->
          <div class="space-y-1">
            <label class="text-sm text-gray-600">Cantidad</label>
            <input
              v-model="formData.cantidad"
              type="number"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-italia-red focus:border-italia-red bg-gray-50"
            />
          </div>
  
          <!-- Centro -->
          <div class="space-y-1">
            <label class="text-sm text-gray-600">Centro</label>
            <input
              v-model="formData.centro"
              type="text"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-italia-red focus:border-italia-red bg-gray-50"
            />
          </div>
  
          <!-- Almacén -->
          <div class="space-y-1">
            <label class="text-sm text-gray-600">Almacén</label>
            <input
              v-model="formData.almacen"
              type="text"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-italia-red focus:border-italia-red bg-gray-50"
            />
          </div>
  
          <!-- Destino -->
          <div class="space-y-1">
            <label class="text-sm text-gray-600">Destino</label>
            <input
              v-model="formData.destino"
              type="text"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-italia-red focus:border-italia-red bg-gray-50"
            />
          </div>
  
          <!-- Calidad -->
          <div class="space-y-1">
            <label class="text-sm text-gray-600">Calidad</label>
            <input
              v-model="formData.calidad"
              type="text"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-italia-red focus:border-italia-red bg-gray-50"
            />
          </div>
  
          <!-- Peso -->
          <div class="space-y-1">
            <label class="text-sm text-gray-600">Peso</label>
            <input
              v-model="formData.peso"
              type="number"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-italia-red focus:border-italia-red bg-gray-50"
            />
          </div>
  
          <!-- Usuario -->
          <div class="space-y-1">
            <label class="text-sm text-gray-600">Usuario</label>
            <div class="relative">
              <input
                v-model="formData.usuario"
                type="text"
                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-italia-red focus:border-italia-red bg-gray-50 pr-10"
              />
              <span class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span class="material-icons text-gray-400">person</span>
              </span>
            </div>
          </div>
        </form>
      </main>
  
      <!-- Action Buttons -->
      <div class="p-4 space-y-3 bg-gray-50 border-t">
        <button 
          @click="handleRegistroAutomatico"
          class="w-full bg-red-500 text-white p-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-600"
        >
          <span class="material-icons">auto_mode</span>
          <span>Registro automático</span>
        </button>
  
        <button 
          @click="handleConfirmarOrden"
          class="w-full bg-green-500 text-white p-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600"
        >
          <span class="material-icons">check_circle</span>
          <span>Confirmar Orden</span>
        </button>
  
        <button 
          @click="handlePendienteTraslado"
          class="w-full bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600"
        >
          <span class="material-icons">pending</span>
          <span>Pendiente de Traslado</span>
        </button>
      </div>
  
      <!-- Footer -->
      <footer class="bg-gray-100 p-2 text-center text-sm text-gray-600 border-t">
        Dirección T.I. - 2024 — Todos los derechos reservados
        <div class="text-right text-xs mt-1">V.2.1</div>
      </footer>
      <TrasladoModal
    :isOpen="showTrasladoModal"
    @close="showTrasladoModal = false"
  />
    </div>
    
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
import TrasladoModal from '../components/TrasladoModal.vue';


const showTrasladoModal = ref(false)

// Modificar la función handlePendienteTraslado
const handlePendienteTraslado = () => {
  showTrasladoModal.value = true
}
  
  const router = useRouter()
  
  const formData = ref({
    codigo: '',
    lote: '',
    numeroEstiba: '',
    cantidad: '',
    centro: '',
    almacen: '',
    destino: '',
    calidad: '',
    peso: '',
    usuario: ''
  })
  
  const handleRegistroAutomatico = () => {
    console.log('Registro automático:', formData.value)
  }
  
  const handleConfirmarOrden = () => {
    console.log('Confirmando orden:', formData.value)
  }

  
  const handleSubmit = () => {
    console.log('Form submitted:', formData.value)
  }
  </script>
  
  <style scoped>
  /* Optimizaciones para dispositivos industriales */
  input, button {
    min-height: 44px;
    touch-action: manipulation;
  }
  
  /* Prevenir zoom en inputs */
  input {
    font-size: 16px;
  }
  
  /* Ajustes para mejor visibilidad */
  .material-icons {
    font-size: 20px;
  }
  
  /* Transiciones suaves */
  button {
    transition: background-color 0.2s ease;
  }
  
  /* Scroll suave */
  main {
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
    max-height: calc(100vh - 180px);
  }
  
  /* Ajustes para campos deshabilitados */
  input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  </style>