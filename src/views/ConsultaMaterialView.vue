<template>
    <div class="min-h-screen flex flex-col bg-gray-100">
      <!-- Header -->
      <header class="bg-gray-200 p-4 border-b">
        <h1 class="text-center text-gray-800 text-lg font-semibold">
          Listado material - por ubicación
        </h1>
      </header>
  
      <main class="flex-1 p-4 flex flex-col space-y-4">
        <!-- Campo de búsqueda -->
        <div class="space-y-2">
          <label class="text-sm text-gray-600">Material a Consultar</label>
          <input
            v-model="materialBusqueda"
            type="text"
            placeholder="231038"
            class="w-full p-4 bg-white border rounded-lg text-center text-xl font-medium focus:ring-2 focus:ring-italia-red focus:border-italia-red"
          />
        </div>
  
        <!-- Lista de Materiales -->
        <div class="flex-1 space-y-3 overflow-auto">
          <template v-for="(material, index) in materiales" :key="index">
            <div class="bg-white rounded-lg p-4 space-y-2 shadow-sm">
              <!-- Código de Material -->
              <h3 class="font-bold text-gray-800">{{ material.codigo }}</h3>
              
              <!-- Descripción -->
              <p class="text-gray-700">{{ material.descripcion }}</p>
              
              <!-- Lote -->
              <div class="text-sm">
                <span class="text-gray-600">Lote:</span>
                <span class="text-gray-800">{{ material.lote }}</span>
              </div>
              
              <!-- Disponible -->
              <div class="text-sm">
                <span class="text-gray-600">disponible:</span>
                <span class="text-gray-800 font-medium">{{ material.disponible }} M²</span>
              </div>
              
              <div class="border-t my-2"></div>
            </div>
          </template>
  
          <!-- Total Metros -->
          <div class="bg-white rounded-lg p-4 mt-4">
            <div class="text-gray-800 font-bold flex justify-between items-center">
              <span>Total Metros:</span>
              <span>19284.804</span>
            </div>
          </div>
        </div>
  
        <!-- Botones -->
        <div class="grid grid-cols-1 gap-3 pt-4">
          <button 
            @click="consultarMaterial"
            class="flex items-center justify-center gap-2 bg-white text-gray-700 py-3 px-6 rounded-full hover:bg-gray-50 border shadow-sm"
          >
            <span class="material-icons">search</span>
            Consultar Material
          </button>
  
          <button 
            @click="volver"
            class="flex items-center justify-center gap-2 bg-white text-gray-700 py-3 px-6 rounded-full hover:bg-gray-50 border shadow-sm"
          >
            <span class="material-icons">arrow_back</span>
            Volver
          </button>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const materialBusqueda = ref('231038')
  
  // Datos de ejemplo
  const materiales = ref([
    {
      codigo: 'B11BEF04',
      descripcion: 'PICASSO 58.4 X118.4 PRIMERA RECT',
      lote: '0000015030',
      disponible: '1788.480'
    },
    {
      codigo: 'B11BEF03',
      descripcion: 'PICASSO 58.4 X118.4 PRIMERA RECT',
      lote: '0000015030',
      disponible: '223.560'
    },
    {
      codigo: 'B11BEF12',
      descripcion: 'PICASSO 58.4 X118.4 PRIMERA RECT',
      lote: '0000012197',
      disponible: '167.670'
    },
    {
      codigo: 'B11BCF07',
      descripcion: 'PICASSO 58.4 X118.4 PRIMERA RECT',
      lote: '0000015030',
      disponible: '391.230'
    }
  ])
  
  // Funciones
  const consultarMaterial = () => {
    console.log('Consultando material:', materialBusqueda.value)
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
    max-height: calc(100vh - 300px);
  }
  
  /* Ajustes para mejor visibilidad */
  .material-icons {
    font-size: 20px;
  }
  
  /* Ajustes para la lista */
  .space-y-3 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
  }
  </style>