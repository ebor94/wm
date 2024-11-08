<template>
    <div class="min-h-screen flex flex-col bg-gray-50">
      <!-- Header -->
      <header class="bg-gray-800 text-white p-4">
        <h1 class="text-center text-lg font-bold">
          ORDENES DE TRANSPORTE PENDIENTE CONFIRMAR
        </h1>
      </header>
  
      <!-- Main Content -->
      <main class="flex-1 p-4 space-y-4">
        <!-- Lista de Pallets con Collapse -->
        <div class="space-y-3">
          <div 
            v-for="pallet in pallets" 
            :key="pallet.id"
            class="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <!-- Cabecera del Pallet (Siempre visible) -->
            <div 
              @click="togglePallet(pallet.id)"
              class="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            >
              <div class="flex items-center space-x-2">
                <span class="material-icons text-gray-500">
                  {{ expandedPallet === pallet.id ? 'expand_less' : 'expand_more' }}
                </span>
                <span class="font-medium text-gray-700">pallet: {{ pallet.numero }}</span>
              </div>
              <span class="material-icons text-red-500">close</span>
            </div>
  
            <!-- Contenido Colapsable -->
            <div 
              v-show="expandedPallet === pallet.id"
              class="border-t bg-blue-50"
            >
              <div class="p-4 space-y-3">
                <!-- Detalles del Material -->
                <div class="space-y-2">
                  <h3 class="text-blue-600 font-medium">{{ pallet.material }}</h3>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-600">Lote:</span>
                    <span class="text-sm font-medium">{{ pallet.lote }}</span>
                    <span class="material-icons text-green-500 text-sm">check_circle</span>
                  </div>
                </div>
  
                <!-- OT y Usuario -->
                <div class="space-y-1">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-600">OT:</span>
                    <span class="text-sm font-medium">{{ pallet.ot }}</span>
                  </div>
                  <div class="text-sm text-gray-700">
                    <span class="text-gray-600">Usuario:</span> {{ pallet.usuario }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  
      <!-- Footer con Botón de Volver -->
      <footer class="p-4 border-t bg-white">
        <button 
          @click="volver"
          class="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-full hover:bg-gray-200 transition-colors"
        >
          <span class="material-icons">arrow_back</span>
          <span>Volver</span>
        </button>
  
        <div class="text-center text-sm text-gray-500 mt-4">
          Cerámica Italia ©2024
        </div>
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const expandedPallet = ref(null)
  
  // Lista de pallets con datos completos
  const pallets = ref([
    {
      id: 1,
      numero: '1986988',
      material: 'GINEVRA 60X60 CYR PRIMERA',
      lote: '0000015743',
      ot: '289934',
      usuario: 'Jorge Elias Sanchez Ortega',
      estado: 'pendiente'
    },
    {
      id: 2,
      numero: '1987100',
      material: 'GINEVRA 60X60 CYR PRIMERA',
      lote: '0000015743',
      ot: '289934',
      usuario: 'Jorge Elias Sanchez Ortega',
      estado: 'pendiente'
    },
    {
      id: 3,
      numero: '1987150',
      material: 'GINEVRA 60X60 CYR PRIMERA',
      lote: '0000015743',
      ot: '289934',
      usuario: 'Jorge Elias Sanchez Ortega',
      estado: 'pendiente'
    },
    {
      id: 4,
      numero: '1987188',
      material: 'GINEVRA 60X60 CYR PRIMERA',
      lote: '0000015743',
      ot: '289934',
      usuario: 'Jorge Elias Sanchez Ortega',
      estado: 'pendiente'
    },
    {
      id: 5,
      numero: '1987200',
      material: 'GINEVRA 60X60 CYR PRIMERA',
      lote: '0000015743',
      ot: '289934',
      usuario: 'Jorge Elias Sanchez Ortega',
      estado: 'pendiente'
    },
    {
      id: 6,
      numero: '1987276',
      material: 'GINEVRA 60X60 CYR PRIMERA',
      lote: '0000015743',
      ot: '289934',
      usuario: 'Jorge Elias Sanchez Ortega',
      estado: 'pendiente'
    },
    {
      id: 7,
      numero: '1988800',
      material: 'GINEVRA 60X60 CYR PRIMERA',
      lote: '0000015743',
      ot: '289934',
      usuario: 'Jorge Elias Sanchez Ortega',
      estado: 'pendiente'
    }
  ])
  
  // Función para manejar el collapse
  const togglePallet = (palletId) => {
    if (expandedPallet.value === palletId) {
      expandedPallet.value = null
    } else {
      expandedPallet.value = palletId
    }
  }
  
  const volver = () => {
    router.back()
  }
  </script>
  
  <style scoped>
  /* Optimizaciones para dispositivos industriales */
  button {
    min-height: 44px;
    touch-action: manipulation;
  }
  
  /* Ajustes visuales */
  .material-icons {
    font-size: 20px;
  }
  
  /* Animaciones de collapse */
  .collapse-enter-active,
  .collapse-leave-active {
    transition: max-height 0.3s ease-out;
  }
  
  .collapse-enter-from,
  .collapse-leave-to {
    max-height: 0;
    overflow: hidden;
  }
  
  /* Scroll suave */
  .main-content {
    -webkit-overflow-scrolling: touch;
  }
  
  /* Transiciones suaves */
  .transition-colors {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
  
  /* Ajustes para mejor visibilidad */
  .text-gray-700 {
    color: #374151;
  }
  
  .text-gray-600 {
    color: #4B5563;
  }
  
  /* Sombras más pronunciadas */
  .shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  </style>