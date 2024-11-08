<template>
    <div class="min-h-screen flex flex-col bg-gray-50">
      <!-- Header con información del picking -->
      <header class="bg-white border-b">
        <div class="p-4">
          <h1 class="text-center text-lg font-semibold text-gray-800">
            .:. Picking .:.
          </h1>
          <div class="text-center text-sm text-gray-600 mt-1">
            [63.000 - Pend: 63.000]M²
          </div>
        </div>
      </header>
  
      <main class="flex-1 p-4 space-y-6">
        <!-- Barra de Progreso -->
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div class="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-italia-red" style="width: 0%"></div>
            </div>
            <button class="ml-4 px-4 py-1 border rounded-full text-gray-600 text-sm">
              Manual
            </button>
          </div>
        </div>
  
        <!-- Formulario de Lectura -->
        <div class="space-y-4">
          <!-- Valor de etiqueta -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Valor de etiqueta
            </label>
            <input
              type="text"
              v-model="scanValue"
              class="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-italia-red focus:border-italia-red"
              placeholder="Escanee o ingrese el valor"
            />
          </div>
  
          <!-- Cantidad buena -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Cantidad buena
            </label>
            <input
              type="number"
              v-model="goodQuantity"
              class="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-italia-red focus:border-italia-red"
              placeholder="Ingrese cantidad"
            />
          </div>
  
          <!-- Cantidad material con rotura -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Cantidad material con rotura
            </label>
            <input
              type="number"
              v-model="brokenQuantity"
              class="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-italia-red focus:border-italia-red"
              placeholder="Ingrese cantidad con rotura"
            />
          </div>
  
          <!-- Grid de información adicional -->
          <div class="grid grid-cols-2 gap-4 mt-4">
            <!-- Cod. material -->
            <div class="space-y-1">
              <label class="block text-xs font-medium text-gray-500">
                Cod. material
              </label>
              <input
                type="text"
                v-model="materialCode"
                class="w-full p-2 border rounded-lg bg-gray-50"
                disabled
              />
            </div>
  
            <!-- Consecutivo estiba -->
            <div class="space-y-1">
              <label class="block text-xs font-medium text-gray-500">
                Consecutivo estiba
              </label>
              <input
                type="text"
                v-model="palletNumber"
                class="w-full p-2 border rounded-lg bg-gray-50"
                disabled
              />
            </div>
  
            <!-- Lote -->
            <div class="space-y-1">
              <label class="block text-xs font-medium text-gray-500">
                Lote
              </label>
              <input
                type="text"
                v-model="batch"
                class="w-full p-2 border rounded-lg bg-gray-50"
                disabled
              />
            </div>
  
            <!-- Posición OT -->
            <div class="space-y-1">
              <label class="block text-xs font-medium text-gray-500">
                Posición OT
              </label>
              <input
                type="text"
                v-model="otPosition"
                class="w-full p-2 border rounded-lg bg-gray-50"
                disabled
              />
            </div>
  
            <!-- UM Base -->
            <div class="space-y-1">
              <label class="block text-xs font-medium text-gray-500">
                UM Base
              </label>
              <input
                type="text"
                value="M2"
                class="w-full p-2 border rounded-lg bg-gray-50"
                disabled
              />
            </div>
  
            <!-- Número OT -->
            <div class="space-y-1">
              <label class="block text-xs font-medium text-gray-500">
                Número OT
              </label>
              <input
                type="text"
                value="0001"
                class="w-full p-2 border rounded-lg bg-gray-50"
                disabled
              />
            </div>
          </div>
        </div>
      </main>
  
      <!-- Botones de acción -->
      <div class="p-4 grid grid-cols-2 gap-4 bg-white border-t">
        <button 
          @click="handleAccept"
          class="flex items-center justify-center gap-2 bg-italia-red text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700"
        >
          <span class="material-icons">check</span>
          Aceptar
        </button>
        <button 
          @click="handleBack"
          class="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200"
        >
          <span class="material-icons">arrow_back</span>
          Volver
        </button>
      </div>
  
      <!-- Footer -->
      <footer class="bg-white border-t p-2 text-center text-gray-600 text-sm">
        Cerámica Italia ©2024
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  // Variables reactivas
  const scanValue = ref('')
  const goodQuantity = ref('')
  const brokenQuantity = ref('')
  const materialCode = ref('B18PROD21')
  const palletNumber = ref('001')
  const batch = ref('000/00/90/05')
  const otPosition = ref('0001')
  
  // Funciones de manejo
  const handleAccept = () => {
    // Validar y procesar la lectura
    console.log('Procesando lectura:', {
      scanValue: scanValue.value,
      goodQuantity: goodQuantity.value,
      brokenQuantity: brokenQuantity.value
    })
  }
  
  const handleBack = () => {
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
  
  /* Ajustes para mejor visibilidad */
  :root {
    color-scheme: light;
  }
  
  /* Ajustes para campos deshabilitados */
  input:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
  
  /* Estilo para los iconos de Material */
  .material-icons {
    font-size: 20px;
  }
  </style>