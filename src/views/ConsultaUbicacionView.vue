<template>
    <div class="min-h-screen flex flex-col bg-white">
      <!-- Header -->
      <header class="bg-gray-100 border-b p-4">
        <h1 class="text-center text-gray-800 text-lg font-semibold">
          Listado material - por ubicación
        </h1>
      </header>
  
      <main class="flex-1 p-4 flex flex-col space-y-4">
        <!-- Ubicación a consultar -->
        <div class="space-y-2">
          <label class="text-sm text-gray-600">Ubicación a consultar</label>
          <div class="relative">
            <input
              v-model="ubicacionConsulta"
              type="text"
              placeholder="B18PRODF21"
              class="w-full p-3 bg-white border rounded-lg focus:ring-2 focus:ring-italia-red focus:border-italia-red text-gray-800 text-lg"
            />
            <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i class="material-icons">search</i>
            </span>
          </div>
        </div>
  
        <!-- Lista de Materiales -->
        <div class="flex-1 space-y-4 overflow-auto">
          <!-- Primer Material -->
          <div class="border rounded-lg p-4 space-y-3 bg-gray-50">
            <h3 class="font-bold text-gray-800">STELVIO GREY 19.3X118.4 PRIMERA RECT</h3>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-600">B18PRODF21</p>
                <p class="text-gray-600">Lote: 0000015272</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-green-600">Existencia: 164.160 M²</p>
                <p class="font-semibold text-blue-600">Disponible: 164.160 M²</p>
              </div>
            </div>
            
            <div class="text-gray-500 text-sm">
              Doc: -
            </div>
          </div>
  
          <!-- Segundo Material -->
          <div class="border rounded-lg p-4 space-y-3 bg-gray-50">
            <h3 class="font-bold text-gray-800">LIBANO CAFE 19.3X118.4 PRIMERA DUAL RECT</h3>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-600">B18PRODF21</p>
                <p class="text-gray-600">Lote: 0000015972</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-green-600">Existencia: 820.800 M²</p>
                <p class="font-semibold text-blue-600">Disponible: 820.800 M²</p>
              </div>
            </div>
            
            <div class="text-gray-500 text-sm">
              Doc: -
            </div>
          </div>
  
          <!-- Totales -->
          <div class="border-t pt-4 mt-4">
            <div class="grid grid-cols-2 gap-4 font-semibold text-gray-800">
              <div>Total Metros:</div>
              <div class="text-right">984.960</div>
              <div>TOTAL DISPONIBLE:</div>
              <div class="text-right">984.960</div>
            </div>
          </div>
        </div>
  
        <!-- Ubicación Destino -->
        <div class="space-y-2 pt-4 border-t">
          <label class="text-sm text-gray-600">Ubicación Destino</label>
          <input
            v-model="ubicacionDestino"
            type="text"
            placeholder="Ubicación Destino"
            class="w-full p-3 bg-white border rounded-lg focus:ring-2 focus:ring-italia-red focus:border-italia-red"
          />
        </div>
  
        <!-- Botones de Acción -->
        <div class="grid grid-cols-2 gap-4 pt-4">
          <button 
            @click="consultarUbicacion"
            class="flex items-center justify-center gap-2 bg-italia-red text-white py-3 px-6 rounded-lg hover:bg-red-700"
          >
            <span class="material-icons">search</span>
            Consultar Ubicación
          </button>
          
          <button 
            @click="vaciarUbicacion"
            class="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 border"
          >
            <span class="material-icons">delete_outline</span>
            Vaciar Ubicación
          </button>
        </div>
  
        <!-- Botón Volver -->
        <button 
          @click="volver"
          class="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 border"
        >
          <span class="material-icons">arrow_back</span>
          Volver
        </button>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  // Variables reactivas
  const ubicacionConsulta = ref('B18PRODF21')
  const ubicacionDestino = ref('')
  
  // Funciones
  const consultarUbicacion = () => {
    console.log('Consultando ubicación:', ubicacionConsulta.value)
  }
  
  const vaciarUbicacion = () => {
    console.log('Vaciando ubicación')
  }
  
  const volver = () => {
    router.back()
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
  
  /* Scroll suave */
  .overflow-auto {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  }
  
  /* Ajustes para mejor visibilidad */
  .material-icons {
    font-size: 20px;
  }
  
  /* Ajustes para campos deshabilitados */
  input:disabled {
    opacity: 0.7;
  }
  
  /* Estilos para la lista */
  .overflow-auto {
    max-height: calc(100vh - 400px);
  }
  </style>