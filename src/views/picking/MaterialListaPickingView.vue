<template>
    <div class="min-h-screen flex flex-col bg-gray-100">
      <!-- Header -->
      <header class="bg-gray-200 p-4 shadow-md">
        <h1 class="text-gray-800 text-lg font-bold text-center">
          Listado material - Alistamiento
        </h1>
      </header>
  
      <!-- Main Content -->
      <main class="flex-1 p-4">
        <!-- Peso Total -->
        <div class="mb-4 bg-white p-3 rounded-lg shadow-sm">
          <span class="text-gray-800 font-semibold">Peso: </span>
          <span class="text-gray-700">1.20 Ton.</span>
        </div>
  
        <!-- Material Card -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden" @click="handleMaterialClick">
          <!-- Código de producto -->
          <div class="bg-green-600 text-white p-2 font-bold">
            B18PROD21
          </div>
  
          <!-- Detalles del producto -->
          <div class="p-4 space-y-3">
            <!-- Nombre del producto -->
            <div class="text-gray-800 font-semibold">
              ANTAR CREMA BRILLANTE 25X75 PRIMERA
            </div>
  
            <!-- Lote -->
            <div class="text-gray-700 text-sm">
              <span class="font-medium">Lote:</span> 000/00/90/05
            </div>
  
            <!-- Medidas -->
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="text-gray-700">
                <span class="font-medium">Medidas:</span> 63.000/63.000 M
              </div>
              <div class="text-gray-700">
                <span class="font-medium">Ct:</span> 000/0253107
              </div>
            </div>
  
            <!-- Cantidad -->
            <div class="text-gray-700 text-sm border-t pt-2">
              <span class="font-medium">42.000</span> cajas / 1.000 estibas
            </div>
          </div>
        </div>
      </main>
  
      <!-- Bottom Buttons -->
      <div class="p-4 grid grid-cols-2 gap-4">
        <button 
          @click="handleTerminarEntrega"
          class="bg-italia-red text-white py-3 px-6 rounded-full font-medium shadow-md hover:bg-red-700 active:bg-red-800"
        >
          Terminar entrega
        </button>
        <button 
          @click="goToMenu"
          class="bg-white text-gray-700 py-3 px-6 rounded-full font-medium shadow-md hover:bg-gray-50 active:bg-gray-100 border border-gray-300"
        >
          Ir menú
        </button>
      </div>
  
      <!-- Footer -->
      <footer class="bg-gray-200 p-2 text-center text-gray-600 text-sm">
        Cerámica Italia ©2024
      </footer>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const handleTerminarEntrega = () => {
    // Implementar lógica para terminar entrega
    console.log('Terminando entrega...')
  }
  
  const goToMenu = () => {
    router.push('/menu')
  }

  const handleMaterialClick = (materialId) => {
  router.push(`/picking/scan/${materialId}`)
}
  </script>
  
  <style scoped>
  /* Optimizaciones para alta luminosidad */
  :root {
    color-scheme: light;
  }
  
  /* Ajustes para mejor legibilidad en luz brillante */
  .text-gray-700 {
    color: #374151; /* Un gris más oscuro para mejor contraste */
  }
  
  /* Eliminar efectos de transparencia */
  .bg-white {
    background-color: #ffffff;
  }
  
  /* Aumentar contraste de sombras */
  .shadow-lg {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 
                0 2px 4px -1px rgba(0, 0, 0, 0.1);
  }
  
  /* Asegurar tamaño mínimo para interacción táctil */
  button {
    min-height: 44px;
    touch-action: manipulation;
  }
  </style>