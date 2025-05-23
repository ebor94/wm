<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Header -->
    <Header title="Lista materiales" />
    
    <!-- Header con estadísticas usando el composable -->
    <header class="bg-gray-200 p-4 shadow-md">
      <h1 class="text-gray-800 text-lg font-bold text-center">{{ actions }}</h1>
      <div class="text-gray-600 text-sm text-center">
        <span class="font-medium">Entrega: {{ entre }}</span>
        </div>
      <div class="text-gray-800 text-lg font-bold text-center">
        <span class="font-medium">Total Estibas: {{ totalPallets }}</span>
      </div>
      
      <!-- ✅ NUEVO: Estadísticas usando composable -->
      <div class="bg-white rounded-lg p-3 mt-2">
        <div class="grid grid-cols-4 gap-2 text-center">
          <div class="text-green-600">
            <div class="font-bold">{{ estadisticas.completados }}</div>
            <div class="text-xs">Completados</div>
          </div>
          <div class="text-yellow-600">
            <div class="font-bold">{{ estadisticas.enProgreso }}</div>
            <div class="text-xs">En progreso</div>
          </div>
          <div class="text-red-600">
            <div class="font-bold">{{ estadisticas.pendientes }}</div>
            <div class="text-xs">Pendientes</div>
          </div>
          <div class="text-blue-600">
            <div class="font-bold">{{ estadisticas.porcentajeCompletado }}%</div>
            <div class="text-xs">Progreso</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-4 bg-gray-800">
      <!-- Material Cards -->
      <div v-for="material in entregaDetalles" :key="material.tapos"
        class="bg-white rounded-lg shadow-lg overflow-hidden mb-4"
        @click="handleMaterialClick(entre, material.tapos, material.nsola, material.tanum)">
        
        <!-- ✅ Header usando composable -->
        <div :class="[
          getColorByStatus(getAcumuladoComputed(material.vbeln, material.tapos, material.tanum).value, material.nsola),
          'text-white p-2 font-bold transition-colors duration-200'
        ]">
          {{ material.vlpla }}
        </div>

        <!-- Detalles del producto -->
        <div class="p-4 space-y-3">
          <div class="text-gray-800 font-semibold">{{ material.matnr }}</div>
          <div class="text-gray-800 font-semibold">{{ material.maktx }}</div>
          <div class="text-gray-700 text-sm">
            <span class="font-medium">Lote:</span> {{ material.charg }}
          </div>

          <!-- ✅ Progreso usando composables -->
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="text-gray-700">
              <template v-if="getAcumuladoComputed(material.vbeln, material.tapos, material.tanum).value !== undefined">
                {{ getAcumuladoComputed(material.vbeln, material.tapos, material.tanum).value }} / {{ material.nsola }}
              </template>
              <template v-else>
                <div class="flex items-center space-x-2">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-italia-red"></div>
                  <span>Cargando...</span>
                </div>
              </template>
            </div>
            <div class="text-gray-700">
              <span class="font-medium">OT:</span> {{ material.tanum }}
            </div>
          </div>

          <!-- ✅ Barra de progreso con color dinámico usando Tailwind -->
          <div class="bg-gray-50 p-2 rounded mt-2">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium">Progreso:</span>
              <span class="text-sm font-medium" 
                    :class="getProgressTextColor(getAcumuladoComputed(material.vbeln, material.tapos, material.tanum).value, material.nsola)">
                {{ getProgressText(getAcumuladoComputed(material.vbeln, material.tapos, material.tanum).value, material.nsola) }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                :class="[
                  'h-2 rounded-full transition-all duration-500',
                  getProgressBarColor(getAcumuladoComputed(material.vbeln, material.tapos, material.tanum).value, material.nsola)
                ]"
                :style="getProgressBarStyle(getAcumuladoComputed(material.vbeln, material.tapos, material.tanum).value, material.nsola)"
              ></div>
            </div>
          </div>

          <div class="text-gray-700 text-sm border-t pt-2">
            <span class="font-medium">{{ material.cantcj }}</span> cajas / {{ material.cantestb }} estibas
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="entregaDetalles.length === 0 && !isLoading" 
           class="flex flex-col items-center justify-center py-12 text-gray-500">
        <div class="text-6xl mb-4">📦</div>
        <h3 class="text-lg font-medium mb-2">No hay materiales</h3>
        <p class="text-sm text-center">No se encontraron materiales para esta entrega</p>
      </div>
    </main>

    <!-- ✅ Botones con validación usando composable -->
    <div class="p-4 grid grid-cols-2 gap-4 bg-gray-300">
      <button @click="handleTerminarEntrega"
        :disabled="!puedeTerminar && actions === 'alistar'"
        :class="[
          puedeTerminar || actions !== 'alistar' 
            ? 'bg-italia-red hover:bg-red-700' 
            : 'bg-gray-400 cursor-not-allowed',
          'text-white py-3 px-6 rounded-full font-medium shadow-md transition-colors'
        ]">
        {{ textButtonAction }}
      </button>
      <button @click="goToMenu"
        class="bg-white text-gray-700 py-3 px-6 rounded-full font-medium shadow-md hover:bg-gray-50 active:bg-gray-100 border border-gray-300">
        Volver
      </button>
    </div>

    <LoaderComponent v-if="isLoading" loading-text="Cargando..." />
    <BasePopup v-model="showPopup" :title="popupTitle" :message="popupMessage" :type="popupType" :action="popupAction"
      confirmText="Aceptar" :showConfirm="true" @confirm="handlePopupConfirm" @update="handlePopupUpdate" />

    <!-- Footer -->
    <footer class="bg-gray-200 p-2 text-center text-gray-600 text-sm">
      Cerámica Italia ©2024
    </footer>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, computed, watch } from 'vue'
import { UseDespachoStore } from '../../store/despachos'
import { InfoEntrega } from '../../services/entregas'
import { useLoader } from '../../composables/useLoader'
import { useAcumulados } from '../../composables/useAcumulados'
import { useProgressUtils } from '../../composables/useProgressUtils'
import BasePopup from '../../components/BasePopup.vue'
import Header from '../../components/Header.vue'

// ✅ Usar composables
const { isLoading, loadingText, showLoader, hideLoader } = useLoader()
const { 
  getAcumulado, 
  getAcumuladoComputed, 
  precargarAcumulados,
  acumuladosCache 
} = useAcumulados()

const { 
  getColorByStatus, 
  getProgressText, 
  getProgressTextColor,
  getProgressPercentage,
  getProgressBarColor,
  getProgressBarStyle,
  calcularEstadisticas,
  puedeTerminarEntrega 
} = useProgressUtils()

const router = useRouter()
const route = useRoute()
const store = UseDespachoStore()

// Variables reactivas
const entre = ref('')
const entregaDetalles = ref([])
const horaInicioAlistamiento = ref('')
const showPopup = ref(false)
const popupTitle = ref('')
const popupMessage = ref('')
const popupType = ref('')
const popupAction = ref('normal')
const totalPallets = ref(0)
const actions = ref('')
const codaccion = ref('')
const textButtonAction = ref('')

// ✅ Computed usando composables
const estadisticas = calcularEstadisticas(entregaDetalles, getAcumuladoComputed)
const puedeTerminar = puedeTerminarEntrega(entregaDetalles, getAcumuladoComputed, actions)

// ✅ Watcher para actualizar total de pallets
watch(() => acumuladosCache.value, () => {
  totalPallets.value = entregaDetalles.value.reduce((total, material) => {
    return total + Number(material.cantestb)
  }, 0)
}, { deep: true })

// ✅ Función optimizada para cargar detalles
const getDetallesEntrega = async (numeroEntrega) => {
  try {
    const detalleEntrega = store.detalleEntregas.find(detalle =>
      detalle.entrega === numeroEntrega
    )

    if (!detalleEntrega?.datos?.length) {
      throw new Error(`Sin datos para la entrega ${numeroEntrega}`)
    }

    entregaDetalles.value = detalleEntrega.datos
    
    // 🚀 Usar composable para cargar en paralelo
    const materialesParaCargar = entregaDetalles.value.map(material => ({
      entrega: material.vbeln,
      posOt: material.tapos,
      ot: material.tanum
    }))

    await precargarAcumulados(materialesParaCargar)
    
    // Calcular total de pallets
    totalPallets.value = entregaDetalles.value.reduce((total, material) => {
      return total + Number(material.cantestb)
    }, 0)

  } catch (error) {
    console.error('Error en getDetallesEntrega:', error)
    mostrarPopup('Sin datos', error.message, 'error')
  }
}

// ✅ Helper para mostrar popups
const mostrarPopup = (titulo, mensaje, tipo = 'info') => {
  popupTitle.value = titulo
  popupMessage.value = mensaje
  popupType.value = tipo
  popupAction.value = 'normal'
  showPopup.value = true
}

// ✅ Función refactorizada handleTerminarEntrega
const acciones = {
  alistar: {
    codigoAccion: "00003",
    textoBoton: "Terminar entrega",
    horaDescripcion: "Hora Inicio alistamiento",
    async ejecutar(entrega) {
      const finishOrder = await InfoEntrega.finishOrder(entrega, "")
      
      if (finishOrder.status !== 200) {
        throw new Error('Error en el servidor')
      }

      const mensaje = finishOrder.data[0].message
      const tiposRespuesta = {
        'NO EXISTE INFORMACION DE ALISTAMIENTO': { tipo: 'info', mensaje },
        'OK': { tipo: 'success', mensaje: 'CONFIRMACION EXITOSA' }
      }

      return tiposRespuesta[mensaje] || { tipo: 'warning', mensaje }
    }
  },
  
  cargue: {
    codigoAccion: "00204",
    textoBoton: "Finalizar Cargue", 
    horaDescripcion: "Hora inicio Cargue",
    async ejecutar(entrega) {
      const gestion = await InfoEntrega.getGestion(entrega)
      const gestionData = gestion.data.data
      const horaFin = gestionData.find(d => d.DescAccion === 'Hora Fin Cargue')?.Valor

      if (horaFin === "Pendiente de Registro") {
        await InfoEntrega.RegisterAccionFechahora(entrega, "00204")
        return { tipo: 'success', mensaje: 'Cargue Finalizado Con Exito' }
      }
      
      return { tipo: 'info', mensaje: 'Cargue ya finalizado' }
    }
  }
}

const handleTerminarEntrega = async () => {
  const accion = acciones[actions.value]
  if (!accion) return

  try {
    showLoader()
    const resultado = await accion.ejecutar(entre.value)
    mostrarPopup('Estado De Registro', resultado.mensaje, resultado.tipo)
  } catch (error) {
    console.error('Error en handleTerminarEntrega:', error)
    mostrarPopup('Error', error.message || 'Error desconocido', 'error')
  } finally {
    hideLoader()
  }
}

// ✅ Función refactorizada getGestionEntrega
const getGestionEntrega = async (entrega) => {
  try {
    const gestion = await InfoEntrega.getGestion(entrega)
    if (gestion.status !== 200) throw new Error('Error obteniendo gestión')

    const accion = acciones[actions.value]
    if (!accion) return

    const gestionData = gestion.data.data
    let horaRegistrada = gestionData.find(d => d.DescAccion === accion.horaDescripcion)?.Valor

    textButtonAction.value = accion.textoBoton

    if (horaRegistrada === "Pendiente de Registro") {
      const registro = await InfoEntrega.RegisterAccionFechahora(entrega, accion.codigoAccion)
      if (registro.status === 200) {
        horaRegistrada = registro.data.data[0].resultado.replace('Act. Con  Fecha :', '')
      }
    } else {
      horaRegistrada = horaRegistrada.split('/')[0].replace('Fecha Registrada :', '')
    }

    horaInicioAlistamiento.value = horaRegistrada

  } catch (error) {
    console.error('Error en getGestionEntrega:', error)
    mostrarPopup('Error', 'Error obteniendo gestión de entrega', 'error')
  }
}

// Funciones de navegación
const goToMenu = () => {
  router.back()
}

const handleMaterialClick = (entrega, posOt, totalpos, ot) => {
  showLoader()
  router.push(`/picking/scan/${entrega}/${posOt}/${totalpos}/${ot}`)
}

// Handlers del popup
const handlePopupConfirm = () => {
  showPopup.value = false
}

const handlePopupUpdate = (value) => {
  showPopup.value = value
}

// ✅ OnMounted optimizado
onMounted(async () => {
  try {
    showLoader("Cargando datos...")
    
    entre.value = route.params.entrega
    actions.value = route.params.action

    // Ejecutar en paralelo las funciones principales
    await Promise.all([
      getDetallesEntrega(entre.value),
      getGestionEntrega(entre.value)
    ])

  } catch (error) {
    console.error('Error en onMounted:', error)
    mostrarPopup('Error de carga', 'Error al cargar los datos iniciales', 'error')
  } finally {
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