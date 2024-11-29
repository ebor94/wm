<template>
  <div class="min-h-screen flex flex-col">
    <LoaderComponent 
     v-if="isLoading"
     :loading-text="loadingText"
      />
    <!-- Header -->
    <header class="bg-italia-red text-white p-4 text-center font-bold">
      Toma de Picking
    </header>

    <!-- Main Content -->
    <main class="flex-1 bg-gray-800 p-4 flex flex-col gap-4">
      <!-- Título -->
      <div class="bg-gray-300 rounded-lg p-3 text-center text-gray-700">
        Listado Despachos Para Alistamiento
      </div>

      <!-- Lista de Despachos -->
      <div class="space-y-4">
        <div v-for="despacho in filtrarDespachosCargue(store.despachos)" :key="despacho.Despacho_no || 'null'"
          class="space-y-2">

          <!-- Botón Collapse -->
          <button class="w-full bg-white rounded-full p-3 text-left flex items-center gap-2"
            @click="toggleDespacho(despacho.Despacho_no)">
            <span class="material-icons">
              {{ expandedDespachos.includes(despacho.Despacho_no) ? 'expand_less' : 'expand_more' }}
            </span>
            {{ despacho.despachoVerificado == 1 ? '✅' : '❌' }}{{ despacho.Despacho_no || 'prioridad' }} / {{
              despacho.Fecha_Requerida || 'sin fecha de despacho' }}
          </button>

          <!-- Contenido Collapse -->
          <!-- Contenido Collapse -->
          <div v-show="expandedDespachos.includes(despacho.Despacho_no)" v-for="orden in despacho.ordenes"
            :key="orden.entrega" class="bg-white rounded-lg p-4 mx-4 space-y-3 items-center">
            <label class="w-full text-center text-blue-800 border-t border-gray-200 pt-2">
              {{ orden.estadoEntrega == 1 ? '✅' : '❌' }}/{{ orden.entrega }} / {{ orden.cte == null ? 'Asignado a Otro Tecnico' : orden.cte}}
            </label>
            <div v-if="orden.cte !== null">
              <button class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="handleListMaterial(orden.entrega)">
                {{ getEstadoEntrega(orden.entrega)?.mensaje || 'Sin estado' }}
              </button>
              <button class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="handleGestionEntrega(orden.entrega)">
                Gestion Entrega
              </button>
              <button class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="handleVerOrden(orden.entrega)">
                Ver Orden de Transporte
              </button>
              <button class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="showNovedades(orden.entrega)">
                Ver Novedades
              </button>
              <div v-if ="getEstadoEntrega(orden.entrega)?.mensaje == 'OK'">
                <button class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="contabilizar(orden.entrega)">
                Contabilizar Entrega
              </button>
              </div> 
            </div>
            <div v-else>
              <button class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="handleGestionEntrega(orden.entrega)">
                Gestion Entrega
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
                    <h3 class="text-lg font-semibold">Novedades de la Entrega</h3>
                    <p class="text-sm text-gray-600">Entrega: {{ selectedEntrega }}</p>
                  </div>
                  <button @click="closeNovedades" class="text-gray-400 hover:text-gray-600">
                    <span class="material-icons">close</span>
                  </button>
                </div>
              </div>

              <!-- Contenido scrolleable -->
              <div class="p-4 overflow-y-auto flex-1 space-y-4">
                <!-- Ubicación Material -->
                <div class="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h4 class="font-medium text-gray-700 mb-1 flex items-center">
                    <span class="material-icons text-italia-red mr-2">location_on</span>
                    Ubicación Material Alistado
                  </h4>
                  <p class="text-sm text-gray-600 ml-8">
                    {{ getNovedadValor('00006') || 'No registrado' }}
                  </p>
                </div>

                <!-- Estado Alistamiento -->
                <div class="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h4 class="font-medium text-gray-700 mb-1 flex items-center">
                    <span class="material-icons text-italia-red mr-2">info</span>
                    Estado Alistamiento
                  </h4>
                  <p class="text-sm text-gray-600 ml-8">
                    {{ getNovedadValor('00007') || 'No registrado' }}
                  </p>
                </div>

                <!-- Nro Estibas Reestibadas -->
                <div class="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h4 class="font-medium text-gray-700 mb-1 flex items-center">
                    <span class="material-icons text-italia-red mr-2">inventory_2</span>
                    Nro Estibas Reestibadas
                  </h4>
                  <p class="text-sm text-gray-600 ml-8">
                    {{ getNovedadValor('00040') || 'No registrado' }}
                  </p>
                </div>

                <!-- Porcentaje de alistamiento -->
                <div class="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h4 class="font-medium text-gray-700 mb-1 flex items-center">
                    <span class="material-icons text-italia-red mr-2">percent</span>
                    % alistamiento
                  </h4>
                  <p class="text-sm text-gray-600 ml-8">
                    {{ getNovedadValor('00150') || 'Sin novedades' }}
                  </p>
                </div>

                <!-- Novedades de alistamiento -->
                <div class="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h4 class="font-medium text-gray-700 mb-1 flex items-center">
                    <span class="material-icons text-italia-red mr-2">note</span>
                    Novedades de alistamiento
                  </h4>
                  <p class="text-sm text-gray-600 ml-8">
                    {{ getNovedadValor('00160') || 'Sin novedades' }}
                  </p>
                </div>
              </div>

              <!-- Footer fijo con formulario -->
              <div class="border-t p-4 sticky bottom-0 bg-white rounded-b-lg">
                <div class="space-y-4">
                  <textarea v-model="nuevaNovedad" rows="3"
                    class="w-full p-2 border rounded-lg resize-none focus:ring-2 focus:ring-italia-red focus:border-italia-red bg-gray-50"
                    placeholder="Escriba la novedad aquí..."></textarea>
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
import { ref, onMounted } from 'vue'
import { UseDespachoStore } from '../store/despachos'
import { useRouter } from 'vue-router'
import { useLoader } from '../composables/useLoader'
import { InfoEntrega } from '../services/entregas';

const router = useRouter()
const expandedDespachos = ref([])
const store = UseDespachoStore()
const { isLoading, loadingText, showLoader, hideLoader } = useLoader()
// Referencias adicionales
const showNovedadesModal = ref(false)
const selectedEntrega = ref('')
const nuevaNovedad = ref('')
const novedades = ref([])

// Función para mostrar modal de novedades
const showNovedades = async (entrega) => {
  selectedEntrega.value = entrega
  showNovedadesModal.value = true
  // Aquí cargarías las novedades existentes
  await cargarNovedades(entrega)
}

// Función para cerrar modal
const closeNovedades = () => {
  showNovedadesModal.value = false
  nuevaNovedad.value = ''
  selectedEntrega.value = ''
}

const contabilizar = async (entrega) => {
  try {
    showLoader()
    let response  = await InfoEntrega.Contabilizar(entrega)
    popupTitle.value = 'Resultado';
    popupMessage.value = response.data.data.mensaje2
    showPopup.value = true;
    popupType.value = 'error' 
    popupAction.value = 'normal'
    hideLoader()
  } catch (error) {
    popupTitle.value = 'Error Catch';
    popupMessage.value = error
    showPopup.value = true;
    popupType.value = 'error' 
    popupAction.value = 'normal'
    
  }
  

}



// Función para obtener el valor de una novedad específica por CodAccion
const getNovedadValor = (codAccion) => {
  const novedad = novedades.value.find(n => n.CodAccion === codAccion)
  if (novedad) {
    // Limpiamos el texto eliminando "/ Fecha Proceso :" y todo lo que sigue
    return novedad.Valor
  }
  return null
}

// Función para cargar novedades existentes
const cargarNovedades = async (entrega) => {
  try {

    let novedad = await InfoEntrega.getGestion(entrega)
    console.log(novedad.data)
    novedades.value = novedad.data.data

  } catch (error) {
    console.error('Error al cargar novedades:', error)
  }
}

// Función para registrar nueva novedad
const registrarNovedad = async (entrega) => {
  if (!nuevaNovedad.value.trim()) return

  try {
    // Aquí irá tu llamada a la API para registrar la novedad

    console.log(nuevaNovedad.value, entrega)
    let response = await InfoEntrega.saveActionText(entrega,nuevaNovedad.value,localStorage.getItem('user'))
    console.log(response.data)
    nuevaNovedad.value = '' // Limpiar el campo
  } catch (error) {
    console.error('Error al registrar novedad:', error)
  }
}
// Funciones
const toggleDespacho = (id) => {
  const index = expandedDespachos.value.indexOf(id)
  if (index === -1) {
    expandedDespachos.value.push(id)
  } else {
    expandedDespachos.value.splice(index, 1)
  }
}

const filtrarDespachosCargue = (despachos) => {
  return despachos.filter(despacho =>
    despacho.ordenes.some(orden => orden.accion === "Alistar")
  )
}

const getEstadoEntrega = (entrega) => {
  try {
    return store.detalleEntregas.find(detalle => detalle.entrega === entrega)
  } catch (error) {

  } finally {
    hideLoader();
  }

}

const handleListMaterial = (id) => {
  router.push(`/entrega/${id}/alistar`)
}
const handleGestionEntrega = (id) => {

  window.location.href = `http://ci.ceramicaitalia.com/transporte/Gestion/GestionEntrega.asp?noentrega=${id}`
  //router.push(`/entrega/${id}`)
}

const handleVerOrden = (id) => {
  showLoader("cargando OT....")
  router.push(`/orden-transporte/${id}`)
}

const goToMenu = () => {
  router.push('/menu')
}

onMounted(async () => {

  try {
    await store.getEntregas()
  } catch (error) {
    console.error('Error:', error)
  }

})
//aca debe hacer el onmounted cuando cargue el componente traer los de talles de la entregas  y preguntar si  el store de despachos exite ,sino volver a generarlo cuando se recargue la pagina
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