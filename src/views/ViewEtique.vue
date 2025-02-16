<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header con información del picking -->
    <Header title=".:. Consultar Etiqueta .:."></Header>


    <main class="flex-1 p-4 space-y-6 bg-gray-800">
      <!-- Formulario de Lectura -->
      <ScanEtiqu v-model="scanValue" :disabled="isManualMode" @onChange="handleScanChange" />
      <div class="p-6 bg-gray-900">
        <div class="space-y-4">
          <div v-for="(item, index) in materiales" :key="index"
            class="bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700">
            <!-- Código SAP y Material -->
            <div class="text-gray-400 font-mono mb-2">{{ formatCodigoSap(item.codigoSap) }}</div>
            <div class="text-white font-bold text-xl mb-4">{{ item.material }}</div>

            <!-- Detalles -->
            <div class="space-y-2">
              <!-- <div class="flex items-center">  
            <span class="text-gray-400">Ubicacion :</span>  
            <span class="text-white ml-2">{{ item.ubicacion || 'Sin ubicación' }}</span>  
          </div>   -->

              <div class="flex items-center">
                <span class="text-gray-400">Lote :</span>
                <span class="text-white ml-2">{{ item.lote }}</span>
              </div>

              <div class="flex items-center">
                <span class="text-gray-400">Cantidad :</span>
                <span class="text-white ml-2">{{ item.cantidad }} M²</span>
              </div>
            </div>
          </div>

        </div>
        <div class="space-y-3">
          <div class="flex items-center">
            <span class="text-gray-400">Total estiba :</span>
            <span class="text-white ml-2">{{ cantidadTotal }}</span>
          </div>
        </div>
      </div>

    </main>


    <!-- Botones de acción -->
    <div class="p-4 grid grid-cols-2 gap-4  bg-gray-300 border-t">
      <button @click="handleScanChange"
        class="flex items-center justify-center gap-2 bg-italia-red text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700">
        <span class="material-icons">check</span>
        Aceptar
      </button>
      <button @click="handleBack"
        class="flex items-center justify-center gap-2 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-200">
        <span class="material-icons">arrow_back</span>
        Volver
      </button>
    </div>

    <!-- Footer -->
    <footer class="bg-red-600 border-t p-2 text-center text-white text-sm">
      Cerámica Italia ©2024
    </footer>
    <!-- Agregar el Popup -->
    <BasePopup v-model="showPopup" :title="popupTitle" :message="popupMessage" :type=popupType :action="popupAction"
      confirmText="Aceptar" :showConfirm="true" @confirm="handlePopupConfirm" @update="handlePopupUpdate" />

    <LoaderComponent v-if="isLoading" loadingText="cargando ..." />


  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, computed , watch} from 'vue'
import { UseDespachoStore } from '../store/despachos';
import BasePopup from '../components/BasePopup.vue';
import { infoEstiba } from '../services/product';
import { useLoader } from '../composables/useLoader';
import Header from '../components/Header.vue';
import ScanEtiqu from '../components/ScanEtiqu.vue';

const isManualMode = ref(false);
const handlePopupUpdate= ref(false);
const router = useRouter()
const route = useRoute()
const store = UseDespachoStore()
const isOpen = ref(false)
const { isLoading, loadingText, showLoader, hideLoader } = useLoader()

// Variables reactivas
const materialCode = ref('')
const scanValue = ref('')
const palletNumber = ref('')
const material = ref('')
const pallet = ref('')
const lote = ref('')



// Agregar estados para el popup
const showPopup = ref(false);
const popupTitle = ref('');
const popupMessage = ref('');
const popupType = ref('');
const popupAction = ref('normal')

const materiales = ref([])

// Computed properties  
pallet.value = computed(() => materiales.value[0]?.pallet || '')
const cantidadTotal = computed(() => {
  return materiales.value.reduce((sum, item) => sum + item.cantidad, 0).toFixed(2)
})



const formatCodigoSap = (codigo) => {
  return codigo.replace(/^0+/, '')
}
const resetFields = async () => {
  scanValue.value = '';
}
const handleBack = () => {
  router.back()
}
const vibrate = () => {
  if (navigator.vibrate) {
    navigator.vibrate(200)
  }
}
const handleScanChange = async (value) => {
  // Lógica específica de la vista  
  
  let scanner = scanValue.value;
  console.log(scanner.length)
  if (scanner.length == 0) {
    showPopup.value = true;
    popupTitle.value = 'Alerta'
    popupMessage.value =  'Scanear Etiqueta'
    popupType.value = 'warning'

  }else{
    divideEtiquetas(scanner, 'A');
  AsignaCampos()
  const responEstiba = await infoEstiba.getInfoEtiqueta(pallet.value);
  materiales.value = responEstiba.data.data;
  resetFields();
  vibrate();
  }

}

const divideEtiquetas = (codigo, tipo) => {
  codigo = codigo.trim()
  material.value = codigo.slice(0, 18)        // " 000000000000203080000001566000001990534"   
  lote.value = codigo.slice(18, 28)          // "0000012280"
  tipo === "A" ? pallet.value = codigo.slice(-10) : null //0001990534
}
const AsignaCampos = () => {
  materialCode.value = material.value;
  palletNumber.value = pallet.value;
}
const handlePopupConfirm = () => {
  showPopup.value = false
}

watch(scanValue, (newValue) => {  
  scanValue.value = newValue.trim()  
})
</script>

<style scoped>
/* Optimizaciones para dispositivos industriales */
input,
button {
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

.table-container {
  overflow-x: auto;
}
</style>