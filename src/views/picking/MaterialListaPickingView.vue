<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Header -->
    <header class="bg-gray-200 p-4 shadow-md">
      <h1 class="text-gray-800 text-lg font-bold text-center">
        Listado material - Alistamiento
      </h1>
      <div class="text-gray-800 text-lg font-bold text-center">
        <span class="font-medium"> {{ horaInicioAlistamiento }}</span>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-4  bg-gray-800">
      <!-- Peso Total -->
      <!-- <div class="mb-4 bg-white p-3 rounded-lg shadow-sm">
        <span class="text-gray-800 font-semibold">Peso: </span>
        <span class="text-gray-700">1.20 Ton.</span>
      </div> -->

      <!-- Material Card -->
      <div v-for="material in entregaDetalles" :key="material.tapos"
        class="bg-white rounded-lg shadow-lg overflow-hidden"
        @click="handleMaterialClick(entre, material.tapos, material.nsola)">
        <!-- Código de producto -->
        <div
          :class="[material.acumulado === material.nsola ? 'bg-green-600' : 'bg-red-600', 'text-white p-2 font-bold']">
          {{ material.vlpla }}
        </div>

        <!-- Detalles del producto -->
        <div class="p-4 space-y-3">
          <!-- Nombre del producto -->
          <div class="text-gray-800 font-semibold">
            {{ material.matnr }}
          </div>
          <div class="text-gray-800 font-semibold">
            {{ material.maktx }}
          </div>

          <!-- Lote -->
          <div class="text-gray-700 text-sm">
            <span class="font-medium">Lote:</span> {{ material.charg }}
          </div>

          <!-- Medidas -->
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="text-gray-700" v-if="material.acumulado !== undefined">
              {{ material.acumulado }} / {{ material.nsola }}
            </div>
            <div v-else class="text-gray-700">
              Cargando...
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
    <div class="p-4 grid grid-cols-2 gap-4  bg-gray-300">
      <button @click="handleTerminarEntrega"
        class="bg-italia-red text-white py-3 px-6 rounded-full font-medium shadow-md hover:bg-red-700 active:bg-red-800">
        Terminar entrega
      </button>
      <button @click="goToMenu"
        class="bg-white text-gray-700 py-3 px-6 rounded-full font-medium shadow-md hover:bg-gray-50 active:bg-gray-100 border border-gray-300">
        Volver
      </button>
    </div>
    <LoaderComponent v-if="isLoading" loading-text="Cargando Lista Materiales..." />

    <!-- Footer -->
    <footer class="bg-gray-200 p-2 text-center text-gray-600 text-sm">
      Cerámica Italia ©2024
    </footer>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { UseDespachoStore } from '../../store/despachos';
import { infoDespachos, InfoEntrega } from '../../services/entregas'
import { useLoader } from '../../composables/useLoader';


const { isLoading, loadingText, showLoader, hideLoader } = useLoader()
const router = useRouter()
const route = useRoute()
const store = UseDespachoStore()
const entre = ref('')
const entregaDetalles = ref([])
const horaInicioAlistamiento = ref('')

const handleTerminarEntrega = async () => {
  // Implementar lógica para terminar entrega
  const finishOrder = await InfoEntrega.finishOrder(entre.value);
  console.log('Terminando entrega...')
}

const goToMenu = () => {
  router.push('/alistamiento')
}


const handleMaterialClick = (entrega, posOt, totalpos) => {
   showLoader()
  router.push(`/picking/scan/${entrega}/${posOt}/${totalpos}`)
}
const getDetallesEntrega = async (numeroEntrega) => {
  showLoader()
  const detalleEntrega = store.detalleEntregas.find(detalle =>
    detalle.entrega === numeroEntrega
  )
  if (detalleEntrega && detalleEntrega.datos) {
    entregaDetalles.value = detalleEntrega.datos
    // Cargar los acumulados para cada material
    for (const material of entregaDetalles.value) {
      const acumulado = await getAcumulado(material.vbeln, material.tapos, material.tanum)
      material.acumulado = Number(acumulado)
    }
  }
}

const getAcumulado = async (entrega, posOt, ot) => {
  const responseDespachos = await infoDespachos.getEntregaAcumulada(entrega, posOt, ot)
  //console.log(responseDespachos)
  hideLoader()
  return responseDespachos.data.success ? responseDespachos.data.data[0].acumulado : 0

}
const getGestionEntrega = async (entrega) => {
  const gestion = await InfoEntrega.getGestion(entrega);
  let gestionData;
  let horaFull;
  if (gestion.status == 200) {
    gestionData = gestion.data.data;
    horaFull = gestionData.find(detalle => detalle.DescAccion === 'Hora Inicio alistamiento')?.Valor;
    if (horaFull === "Pendiente de Registro") {
      let registroFechaHora = await InfoEntrega.RegisterAccionFechahora(entrega);
      if (registroFechaHora.status == 200) {
        gestionData = registroFechaHora.data.data;
        console.log("Registrando hora inicio alistamiento",gestionData)
        horaFull = gestionData[0].resultado
        horaFull = horaFull.replace('Act. Con  Fecha :', '')
        horaInicioAlistamiento.value = horaFull 
      }

    } else {
      horaFull = horaFull.split('/')
      horaInicioAlistamiento.value = horaFull[0].replace('Fecha Registrada :', '')
      console.log(horaInicioAlistamiento.value)
    }
  }


}

onMounted(async () => {
  try {

    entre.value = route.params.entrega
    getDetallesEntrega(entre.value)
    console.log('Número de entrega:', entre.value)
    getGestionEntrega(entre.value)

  } catch (error) {
    console.error('Error al cargar los materiales:', error)
    hideLoader()
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