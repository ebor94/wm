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
      <div v-for="material in entregaDetalles" :key="material.tapos"
        class="bg-white rounded-lg shadow-lg overflow-hidden" @click="handleMaterialClick">
        <!-- Código de producto -->
        <div class="bg-green-600 text-white p-2 font-bold">
          {{ material.vlpla }}
        </div>

        <!-- Detalles del producto -->
        <div class="p-4 space-y-3">
          <!-- Nombre del producto -->
          <div class="text-gray-800 font-semibold">
            {{ material.maktx }}
          </div>

          <!-- Lote -->
          <div class="text-gray-700 text-sm">
            <span class="font-medium">Lote:</span> {{ material.charg }}
          </div>

          <!-- Medidas -->
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="text-gray-700">
              {{ getAcumulado(material.vbeln, material.tapos, material.tanum) }} / {{ material.nsola }}
              <!-- <span class="font-medium">Medidas:</span> 63.000/63.000 M -->
            </div>
            <div class="text-gray-700">
              <span class="font-medium">OT:</span> {{ material.tanum }}
            </div>
          </div>

          <!-- Cantidad -->
          <div class="text-gray-700 text-sm border-t pt-2">
            <span class="font-medium">{{ material.cantcj }}</span> cajas / {{ material.cantestb }} estibas
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Buttons -->
    <div class="p-4 grid grid-cols-2 gap-4">
      <button @click="handleTerminarEntrega"
        class="bg-italia-red text-white py-3 px-6 rounded-full font-medium shadow-md hover:bg-red-700 active:bg-red-800">
        Terminar entrega
      </button>
      <button @click="goToMenu"
        class="bg-white text-gray-700 py-3 px-6 rounded-full font-medium shadow-md hover:bg-gray-50 active:bg-gray-100 border border-gray-300">
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
import { useRouter, useRoute } from 'vue-router'  // Añadir useRoute
import { ref, onMounted } from 'vue'
import { UseDespachoStore } from '../../store/despachos';

const router = useRouter()
const route = useRoute()
const store = UseDespachoStore()
const entre = ref('')
const entregaDetalles = ref([])

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
const getDetallesEntrega = (numeroEntrega) => {
  const detalleEntrega = store.detalleEntregas.find(detalle =>
    detalle.entrega === numeroEntrega
  )
  if (detalleEntrega && detalleEntrega.datos) {
    entregaDetalles.value = detalleEntrega.datos
  }
}

const getAcumulado = (entrega, posOt, ot) => {
  return "11111"

}

onMounted(async () => {
  try {
    entre.value = route.params.entrega
    getDetallesEntrega(entre.value)
    console.log('Número de entrega:', entre.value)
  } catch (error) {
    console.error('Error al cargar los materiales:', error)
  }
})
</script>

<style scoped>
/* Optimizaciones para alta luminosidad */
:root {
  color-scheme: light;
}

/* Ajustes para mejor legibilidad en luz brillante */
.text-gray-700 {
  color: #374151;
  /* Un gris más oscuro para mejor contraste */
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