<template>
  <div class="min-h-screen flex flex-col">
    <LoaderComponent 
     v-if="isLoading"
     :loading-text="loadingText"
      />
    <!-- Header -->
    <Header title="Cargue de material" ></Header>

    <!-- Main Content -->
    <main class="flex-1 bg-gray-800 p-4 flex flex-col gap-4">
      <!-- Título -->
      <div class="bg-gray-300 rounded-lg p-3 text-center text-gray-700">
        Listado Despachos Para Cargue
      </div>

      <!-- Lista de Despachos -->
      <div class="space-y-4">
        <div v-for="despacho in despachosFiltrados" :key="despacho.Despacho_no || 'null'" class="space-y-2">
       
          <!-- Botón Collapse -->
          <button :class="[isOverweight(despacho) ? 'w-full bg-purple-700 rounded-full p-3 text-white text-left flex items-center gap-2' : 'w-full bg-white rounded-full p-3 text-left flex items-center gap-2']"
            @click="toggleDespacho(despacho.Despacho_no)">
            <span class="material-icons">
              {{ expandedDespachos.includes(despacho.Despacho_no) ? 'expand_less' : 'expand_more' }}
            </span>
            {{ despacho.despachoVerificado == 1 ? '✅' : '❌' }}{{ despacho.Despacho_no || 'prioridad' }} / {{
              despacho.Fecha_Requerida || 'sin fecha de despacho' }} /  Peso Total: {{ getTotalWeightByDespacho(despacho) }} Ton 
          </button>

          <!-- Contenido Collapse -->
          <div v-show="expandedDespachos.includes(despacho.Despacho_no)" v-for="orden in despacho.ordenes"
            :key="orden.entrega" class="bg-white rounded-lg p-4 mx-4 space-y-3 items-center">
            <label class="w-full text-center text-blue-800 border-t border-gray-200 pt-2">
              {{ orden.estadoEntrega == 1 ? '✅' : '❌' }}/{{ orden.entrega }} / {{ orden.cte == null ? 'Asignado a Otro Tecnico' : orden.cte}}/ Peso : {{ deliveryWeights[orden.entrega] || 'Cargando Peso...' }} Ton
              <span v-if="orden.placa && orden.placa !== '--------'" 
                    class="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                🚛 {{ orden.placa }}
              </span>
            </label>
            <div v-if="orden.cte !== null">
              <button class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="handleListMaterial(orden.entrega)">
                {{ getEstadoEntrega(orden.entrega).value?.mensaje || 'Sin estado' }}
              </button>
              <button class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="handleGestionEntrega(orden.entrega)">
                Gestión Entrega
              </button>
              <button class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="handleVerOrden(orden.entrega)">
                Ver Orden de Transporte
              </button>
              <button class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="showNovedades(orden.entrega)">
                Ver Novedades
              </button>
              <!-- ✅ NUEVO: Botón de contabilizar -->
              <div v-if="getEstadoEntrega(orden.entrega).value?.mensaje === 'OK'">
                <button class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                  @click="contabilizar(orden.entrega)">
                  Contabilizar Entrega
                </button>
              </div>  
              <!-- ✅ NUEVO: Botón de facturar -->
              <div v-if="getEstadoEntrega(orden.entrega).value?.mensaje === 'ENTREGA CONTABILIZADA'">
                <button class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                  @click="facturar(orden.entrega)">
                  Facturar Entrega
                </button>
              </div>
            </div>
            <div v-else>
              <button class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="handleGestionEntrega(orden.entrega)">
                Gestión Entrega
              </button>
              <button class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="showNovedades(orden.entrega)">
                Ver Novedades
              </button>
            </div>
          </div>

          <!-- Modal de Novedades con scroll -->
          <div v-if="showNovedadesModal"
            class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
              <!-- Header fijo -->
              <div class="border-b p-4 sticky top-0 bg-white rounded-t-lg z-10">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="text-lg font-semibold">Novedades de Cargue</h3>
                    <p class="text-sm text-gray-600">Entrega: {{ selectedEntrega }}</p>
                  </div>
                  <button @click="closeNovedades" class="text-gray-400 hover:text-gray-600">
                    <span class="material-icons">close</span>
                  </button>
                </div>
              </div>

              <!-- Contenido scrolleable -->
              <div class="p-4 overflow-y-auto flex-1 space-y-4">
                <!-- Estado Cargue -->
                <div class="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h4 class="font-medium text-gray-700 mb-1 flex items-center">
                    <span class="material-icons text-italia-red mr-2">local_shipping</span>
                    Estado del Cargue
                  </h4>
                  <p class="text-sm text-gray-600 ml-8">
                    {{ getNovedadValor('00203') || 'No registrado' }}
                  </p>
                </div>

                <!-- Hora Inicio Cargue -->
                <div class="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h4 class="font-medium text-gray-700 mb-1 flex items-center">
                    <span class="material-icons text-italia-red mr-2">schedule</span>
                    Hora Inicio Cargue
                  </h4>
                  <p class="text-sm text-gray-600 ml-8">
                    {{ getNovedadValor('00203') || 'No registrado' }}
                  </p>
                </div>

                <!-- Hora Fin Cargue -->
                <div class="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h4 class="font-medium text-gray-700 mb-1 flex items-center">
                    <span class="material-icons text-italia-red mr-2">event_available</span>
                    Hora Fin Cargue
                  </h4>
                  <p class="text-sm text-gray-600 ml-8">
                    {{ getNovedadValor('00204') || 'No registrado' }}
                  </p>
                </div>

                <!-- Placa del Vehículo -->
                <div class="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h4 class="font-medium text-gray-700 mb-1 flex items-center">
                    <span class="material-icons text-italia-red mr-2">directions_car</span>
                    Placa del Vehículo
                  </h4>
                  <p class="text-sm text-gray-600 ml-8">
                    {{ getNovedadValor('00205') || 'No asignado' }}
                  </p>
                </div>

                <!-- Observaciones de Cargue -->
                <div class="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h4 class="font-medium text-gray-700 mb-1 flex items-center">
                    <span class="material-icons text-italia-red mr-2">note</span>
                    Observaciones de Cargue
                  </h4>
                  <p class="text-sm text-gray-600 ml-8">
                    {{ getNovedadValor('00206') || 'Sin observaciones' }}
                  </p>
                </div>
              </div>

              <!-- Footer fijo con formulario -->
              <div class="border-t p-4 sticky bottom-0 bg-white rounded-b-lg">
                <div class="space-y-4">
                  <textarea v-model="nuevaNovedad" rows="3"
                    class="w-full p-2 border rounded-lg resize-none focus:ring-2 focus:ring-italia-red focus:border-italia-red bg-gray-50"
                    placeholder="Escriba la novedad de cargue aquí..."></textarea>
                  <div class="flex justify-end space-x-2">
                    <button @click="registrarNovedad(selectedEntrega)"
                      class="flex items-center gap-1 bg-italia-red text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      <span class="material-icons text-sm">save</span>
                      Registrar
                    </button>
                    <button @click="closeNovedades"
                      class="flex items-center gap-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                      <span class="material-icons text-sm">close</span>
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ NUEVO: BasePopup -->
      <BasePopup
       v-model="showPopup"
       :title="popupTitle" 
       :message="popupMessage" 
       :type="popupType" 
       :action="popupAction" 
       confirmText="Aceptar"
       :showConfirm="true" 
       @confirm="handlePopupConfirm"
       @update="handlePopupUpdate"
        />

      <!-- Botón Ir al Menú -->
      <button @click="goToMenu" class="bg-white rounded-full p-3 text-center mt-auto">
        Ir menú
      </button>
    </main>

    <!-- Footer -->
    <footer class="bg-italia-red text-white p-2 text-center">
      Cerámica Italia ©2024
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { UseDespachoStore } from '../store/despachos'
import { useRouter } from 'vue-router'
import { useLoader } from '../composables/useLoader'
import { infoDespachos, InfoEntrega } from '../services/entregas'
import Header from '../components/Header.vue'
import BasePopup from '../components/BasePopup.vue'

const router = useRouter()
const expandedDespachos = ref([])
const store = UseDespachoStore()
const { isLoading, loadingText, showLoader, hideLoader } = useLoader()

// ✅ NUEVO: Referencias adicionales para novedades y popup
const showNovedadesModal = ref(false)
const selectedEntrega = ref('')
const nuevaNovedad = ref('')
const novedades = ref([])
const deliveryWeights = ref({})

// ✅ NUEVO: Estados para el popup
const showPopup = ref(false)
const popupTitle = ref('')
const popupMessage = ref('')
const popupType = ref('')
const popupAction = ref('normal')

// ✅ NUEVO: Función para mostrar modal de novedades
const showNovedades = async (entrega) => {
  selectedEntrega.value = entrega
  showNovedadesModal.value = true
  await cargarNovedades(entrega)
}

// ✅ NUEVO: Función para cerrar modal
const closeNovedades = () => {
  showNovedadesModal.value = false
  nuevaNovedad.value = ''
  selectedEntrega.value = ''
}

// ✅ NUEVO: Función para contabilizar
const contabilizar = async (entrega) => {
  try {
    showLoader("Contabilizando....")
    
    let response = await InfoEntrega.Contabilizar(entrega)
    console.log(response.data)
    
    // Actualizar el estado en el store después de contabilizar
    await actualizarEstadoEntrega(entrega)
    
    popupTitle.value = 'Resultado'
    popupMessage.value = response.data.data.mensaje2
    showPopup.value = true
    popupType.value = 'success'
    popupAction.value = 'normal'
    
  } catch (error) {
    console.error('Error en contabilizar:', error)
    popupTitle.value = 'Error'
    popupMessage.value = error.message || 'Error al contabilizar'
    showPopup.value = true
    popupType.value = 'error'
    popupAction.value = 'normal'
  } finally {
    hideLoader()
  }
}

// ✅ NUEVO: Función para facturar
const facturar = async (entrega) => {
  try {
    showLoader("Facturando....")
    
    let response = await infoDespachos.facturaEntrega(entrega, 'J')
    console.log('facturar', response.data)
    
    // Actualizar el estado en el store después de facturar
    await actualizarEstadoEntrega(entrega)
    
    popupTitle.value = 'Resultado'
    popupMessage.value = response.data.data[0].nofactura || response.data.data[0].mensaje
    showPopup.value = true
    popupType.value = 'success'
    popupAction.value = 'normal'
    
  } catch (error) {
    console.error('Error en facturar:', error)
    popupTitle.value = 'Error'
    popupMessage.value = error.message || 'Error al facturar'
    showPopup.value = true
    popupType.value = 'error'
    popupAction.value = 'normal'
  } finally {
    hideLoader()
  }
}

// ✅ NUEVO: Función para verificar sobrepeso
const isOverweight = (despacho) => {
  let total = 0;
  despacho.ordenes.forEach(orden => {
    total += parseFloat(deliveryWeights.value[orden.entrega] || 0);
  });
  return total > 33;
}

// ✅ NUEVO: Función para obtener peso de entrega
const GetweightDelivery = async (entrega) => {
  if (!deliveryWeights.value[entrega]) {
    try {
      const response = await InfoEntrega.GetWeight(entrega)
      deliveryWeights.value[entrega] = (response.data.data[0].pesopick / 1000).toFixed(2)
    } catch (error) {
      console.log(error)
      deliveryWeights.value[entrega] = 'Error'
    }
  }
  return deliveryWeights.value[entrega]
}

// ✅ NUEVO: Función para obtener peso total por despacho
const getTotalWeightByDespacho = (despacho) => {
  let total = 0;
  despacho.ordenes.forEach(orden => {
    total += parseFloat(deliveryWeights.value[orden.entrega] || 0);
  });
  
  return total.toFixed(2);
}

// ✅ NUEVO: Función para obtener valor de novedad
const getNovedadValor = (codAccion) => {
  const novedad = novedades.value.find(n => n.CodAccion === codAccion)
  if (novedad) {
    return novedad.Valor
  }
  return null
}

// ✅ NUEVO: Función para cargar novedades existentes
const cargarNovedades = async (entrega) => {
  try {
    let novedad = await InfoEntrega.getGestion(entrega)
    console.log(novedad.data)
    novedades.value = novedad.data.data
  } catch (error) {
    console.error('Error al cargar novedades:', error)
  }
}

// ✅ NUEVO: Función para registrar nueva novedad
const registrarNovedad = async (entrega) => {
  if (!nuevaNovedad.value.trim()) return

  try {
    console.log(nuevaNovedad.value, entrega)
    let response = await InfoEntrega.saveActionText(entrega, nuevaNovedad.value, localStorage.getItem('user'))
    console.log(response.data)
    nuevaNovedad.value = '' // Limpiar el campo
    
    // Mostrar confirmación
    popupTitle.value = 'Novedad Registrada'
    popupMessage.value = 'La novedad se ha registrado correctamente'
    showPopup.value = true
    popupType.value = 'success'
    popupAction.value = 'normal'
    
  } catch (error) {
    console.error('Error al registrar novedad:', error)
    popupTitle.value = 'Error'
    popupMessage.value = 'Error al registrar la novedad'
    showPopup.value = true
    popupType.value = 'error'
    popupAction.value = 'normal'
  }
}

// Funciones existentes
const toggleDespacho = (id) => {
  const index = expandedDespachos.value.indexOf(id)
  if (index === -1) {
    expandedDespachos.value.push(id)
  } else {
    expandedDespachos.value.splice(index, 1)
  }
}

// ✅ ACTUALIZADO: Usar getter del store para cargue
const despachosFiltrados = computed(() => store.despachosParaCargue("Cargar"))

// ✅ ACTUALIZADO: Función mejorada getEstadoEntrega con reactivity
const getEstadoEntrega = (entrega) => {
  return computed(() => {
    return store.detalleEntregas.find(detalle => detalle.entrega === entrega)
  })
}

// ✅ NUEVO: Función para actualizar estado de entrega
const actualizarEstadoEntrega = async (entrega) => {
  try {
    // Usar el método del store directamente
    await store.updateEntregaStatus(entrega)
    console.log('Estado actualizado correctamente para entrega:', entrega)
  } catch (error) {
    console.error('Error al actualizar estado:', error)
    // Fallback: recargar todos los detalles
    await store.getEntregasDetails()
  }
}

const handleListMaterial = (id) => {
  router.push(`/entrega/${id}/cargue`)
}

const handleGestionEntrega = (id) => {
  window.location.href = `http://ci.ceramicaitalia.com/transporte/Gestion/GestionEntrega.asp?noentrega=${id}`
}

const handleVerOrden = (id) => {
  showLoader("cargando OT....")
  router.push(`/orden-transporte/${id}`)
}

const goToMenu = () => {
  router.back()
}

// ✅ NUEVO: Handlers del popup
const handlePopupConfirm = () => {
  showPopup.value = false
}

const handlePopupUpdate = (value) => {
  showPopup.value = value
}

// ✅ ACTUALIZADO: OnMounted optimizado
onMounted(async () => {
  try {
    showLoader("Cargando datos...")
    
    // Usar los métodos del store
    if (store.despachos.length === 0) {
      await store.fetchDespachos()
    }
    
    if (store.detalleEntregas.length === 0) {
      await store.getEntregas()
    }
    
    // Cargar pesos en paralelo para despachos de cargue
    const pesosPromises = store.despachosParaCargue("Cargar").flatMap(despacho => 
      despacho.ordenes.map(orden => GetweightDelivery(orden.entrega))
    )
    
    await Promise.all(pesosPromises)
    
  } catch (error) {
    console.error('Error:', error)
    popupTitle.value = 'Error'
    popupMessage.value = 'Error al cargar los datos'
    showPopup.value = true
    popupType.value = 'error'
    popupAction.value = 'normal'
  } finally {
    hideLoader()
  }
})
</script>

<style scoped>
.material-icons {
  font-size: 1.5rem;
}

/* Animación para el collapse */
.collapse-enter-active,
.collapse-leave-active {
  transition: max-height 0.3s ease-out;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  overflow: hidden;
}

/* Ajustes para dispositivo Zebra */
button {
  min-height: 44px;
  touch-action: manipulation;
}
</style>