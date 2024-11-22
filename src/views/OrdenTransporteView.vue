<template>
    <div class="min-h-screen flex flex-col bg-gray-800">
      <!-- Header -->
      <header class="bg-italia-red text-white p-2">
      <h1 class="text-center text-lg font-bold">
        Lista Ordenes de Transporte
      </h1>
    </header>
  
      <!-- Main Content -->
      <main class="flex-1 p-4 space-y-4">
        <!-- Primera Orden con Detalle -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div 
            @click="toggleOrden('orden1')"
            class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          >
            <div class="flex items-center space-x-2">
              <span class="material-icons text-gray-400">
                {{ expandedOrden === 'orden1' ? 'expand_less' : 'expand_more' }}
              </span>
              <span class="font-medium">294263</span>
            </div>
            <span class="material-icons text-red-500">close</span>
          </div>
  
          <!-- Contenido Colapsable -->
          <div v-show="expandedOrden === 'orden1'" class="border-t">
            <div class="p-4 space-y-4">
              <!-- Material Info -->
              <div class="bg-blue-50 p-3 rounded-lg">
                <div class="flex justify-between items-start">
                  <div class="space-y-1">
                    <h3 class="text-blue-600 font-medium">MARMOL GIOTA VENATO BEIGE 60X60 GB</h3>
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">Lote:</span> 0000012832
                    </p>
                  </div>
                  <span class="material-icons text-red-500">close</span>
                </div>
              </div>
  
              <!-- Ubicación y Cantidad -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-sm text-gray-500">Ubicación</label>
                  <p class="text-gray-700 font-medium">LOTE-F-F06</p>
                </div>
                <div class="space-y-1">
                  <label class="text-sm text-gray-500">Cantidad</label>
                  <p class="text-gray-700 font-medium">259.2</p>
                </div>
              </div>
  
              <!-- Botón Confirmar -->
              <button class="w-full py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50">
                Confirmar Posición 1
              </button>
            </div>
            <button class="w-full py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50">
                Confirmar OT completa
              </button>
          </div>
          <LoaderComponent 
     v-if="isLoading"
     :loading-text="loadingText"
      />
        </div>
  
      </main>
  
      <!-- Footer -->
      <footer class="p-4">
        <button 
          @click="volver"
          class="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200"
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
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useLoader } from '../composables/useLoader'
  const { isLoading, loadingText, showLoader, hideLoader } = useLoader()

  const router = useRouter()
  const route = useRoute()
  const expandedOrden = ref(null)
  const entre = ref('')
  const toggleOrden = (ordenId) => {
    expandedOrden.value = expandedOrden.value === ordenId ? null : ordenId
  }

 
  
  const volver = () => {
    router.back()
  }

  onMounted(async () => {
    showLoader("cargando OT....")
    try {
      entre.value = route.params.entrega
    } catch (error) {
      
    }finally{
      hideLoader();
    }
   
 })
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
  
  /* Ajustes para mejor visibilidad */
  .text-gray-700 {
    color: #374151;
  }
  
  .text-gray-600 {
    color: #4B5563;
  }
  
  /* Ajustes para dispositivos táctiles */
  .cursor-pointer {
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  </style>