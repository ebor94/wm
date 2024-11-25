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
      <!-- Lista de Órdenes de Transporte -->
      <div v-for="orden in ordenesTransporte" :key="orden.tanum" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- Cabecera de la OT -->
        <div 
          @click="toggleOrden(orden.tanum)"
          class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        >
          <div class="flex items-center space-x-2">
            <span class="material-icons text-gray-400">
              {{ expandedOrden === orden.tanum ? 'expand_less' : 'expand_more' }}
            </span>
            <span class="font-medium">OT: {{ orden.tanum }}</span>
          </div>
          <span class="material-icons" :class="orden.estado === 'C' ? 'text-green-500' : 'text-red-500'">
            {{ orden.estado === 'C' ? 'check_circle' : 'close' }}
          </span>
        </div>

        <!-- Contenido Colapsable -->
        <div v-show="expandedOrden === orden.tanum" class="border-t">
          <div class="p-4 space-y-4">
            <!-- Detalles de la OT -->
            <div v-if="ordenDetalles[orden.tanum]" class="space-y-4">
              <div v-for="detalle in ordenDetalles[orden.tanum]" :key="detalle.id" 
                   class="bg-blue-50 p-3 rounded-lg">
                <div class="flex justify-between items-start">
                  <div class="space-y-1">
                    <h3 class="text-blue-600 font-medium">{{ detalle.maktx || 'Material' }}</h3>
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">Lote:</span> {{ detalle.charg || 'N/A' }}
                    </p>
                  </div>
                  <span class="text-sm font-medium px-2 py-1 rounded-full"
                        :class="detalle.estado === 'C' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ detalle.pquit === 'X' ? '✅' : '❌' }}
                  </span>
                </div>

                <!-- Ubicación y Cantidad -->
                <div class="grid grid-cols-2 gap-4 mt-3">
                  <div class="space-y-1">
                    <label class="text-sm text-gray-500">Ubicación</label>
                    <p class="text-gray-700 font-medium">{{ detalle.vlpla || 'Sin ubicación' }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm text-gray-500">Cantidad</label>
                    <p class="text-gray-700 font-medium">{{ detalle.nsola || '0' }}</p>
                  </div>
                </div>

                <!-- Botón Confirmar Posición -->
                <button v-if="detalle.estado !== 'C'"
                  @click="confirmarPosicion(orden.tanum, detalle.tapos)"
                  class="w-full mt-3 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
                >
                  Confirmar Posición {{ detalle.tapos }}
                </button>
              </div>
            </div>

            <!-- Botón Confirmar OT completa -->
            <button v-if="puedeConfirmarOT(orden.tanum)"
              @click="confirmarOTCompleta(orden.tanum)"
              class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Confirmar OT completa
            </button>
          </div>
        </div>
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

    <LoaderComponent 
      v-if="isLoading"
      :loading-text="loadingText"
    />
    <BasePopup
     v-model="showPopup"
     :title="popupTitle" 
     :message="popupMessage" 
     :type=popupType 
     :action="popupAction" 
     confirmText="Aceptar"
     :showConfirm="true" 
     @confirm="handlePopupConfirm"
     @update="handlePopupUpdate"
      />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoader } from '../composables/useLoader'
import { InfoEntrega } from '../services/entregas'
import BasePopup from '../components/BasePopup.vue';

// Agregar estados para el popup
const showPopup = ref(false);
const popupTitle = ref('');
const popupMessage = ref('');
const popupType = ref('');
const popupAction = ref('normal')

const router = useRouter()
const route = useRoute()
const { isLoading, loadingText, showLoader, hideLoader } = useLoader()

const expandedOrden = ref(null)
const ordenesTransporte = ref([])
const ordenDetalles = ref({})

const toggleOrden = async (tanum) => {
  if (expandedOrden.value === tanum) {
    expandedOrden.value = null
  } else {
    expandedOrden.value = tanum
    if (!ordenDetalles.value[tanum]) {
      await cargarDetallesOrden(tanum)
    }
  }
}

const cargarDetallesOrden = async (tanum) => {
  showLoader("Cargando detalles...")
  try {
    const response = await InfoEntrega.getOrderTranport(route.params.entrega, 'D', tanum)
    console.log(response.data)
    ordenDetalles.value[tanum] = response.data
  } catch (error) {
    popupType.value = 'error'     
    popupTitle.value = 'Resultado';
    popupMessage.value = error
    showPopup.value = true;    
    popupAction.value = 'normal'
    //console.error('Error al cargar detalles:', error)
  } finally {
    hideLoader()
  }
}

const confirmarPosicion = async (tanum, posicion) => {
  showLoader("Confirmando posición...")
  try {
    // Implementar lógica de confirmación
   let response =  await InfoEntrega.confirmarPosicion(route.params.entrega , posicion, tanum)
   console.log(response.data)
   response.status == 200 ? popupType.value = 'success'  : popupType.value = 'info'  
   response.data[0].message == 'NO EXISTE INFORMACION DE ALISTAMIENTO' ? popupType.value = 'warning'  : popupType.value = 'success'     
    popupTitle.value = 'Resultado';
    popupMessage.value = response.data[0].message
    showPopup.value = true;    
    popupAction.value = 'normal'    
    await cargarDetallesOrden(tanum) // Recargar detalles
  } catch (error) {
    popupType.value = 'error'     
    popupTitle.value = 'Resultado';
    popupMessage.value = error
    showPopup.value = true;    
    popupAction.value = 'normal'
    console.error('Error al confirmar posición:', error)
  } finally {
    hideLoader()
  }
}

const confirmarOTCompleta = async (tanum) => {
  showLoader("Confirmando OT...")
  try {
    // Implementar lógica de confirmación completa
   let response =  await InfoEntrega.confirmarOTCompleta(tanum,route.params.entrega)
    response.status == 200 ? popupType.value = 'success'  : popupType.value = 'info'     
    response.data[0].message == 'NO EXISTE INFORMACION DE ALISTAMIENTO' ? popupType.value = 'warning'  : popupType.value = 'success'     
    popupTitle.value = 'Resultado';
    popupMessage.value = response.data[0].message
    showPopup.value = true;    
    popupAction.value = 'normal'  
    await cargarOrdenesTransporte() // Recargar todo
  } catch (error) {
    popupType.value = 'error'     
    popupTitle.value = 'Resultado';
    popupMessage.value = error
    showPopup.value = true;    
    popupAction.value = 'normal'
  } finally {
    hideLoader()
  }
}

const puedeConfirmarOT = (tanum) => {
  if (!ordenDetalles.value[tanum]) return false
  return ordenDetalles.value[tanum].every(detalle => detalle.estado !== 'C')
}

const cargarOrdenesTransporte = async () => {
  showLoader("Cargando OT...")
  try {
    const response = await InfoEntrega.getOrderTranport(route.params.entrega, 'C')
    ordenesTransporte.value = response.data
    console.log(response.data)
  } catch (error) {
    popupType.value = 'error'     
    popupTitle.value = 'Resultado';
    popupMessage.value = error
    showPopup.value = true;    
    popupAction.value = 'normal'
  } finally {
    hideLoader()
  }
}

const volver = () => {
  router.back()
}

onMounted(async () => {
  await cargarOrdenesTransporte()
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