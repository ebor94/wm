<template>
  <div class="min-h-screen flex flex-col bg-slate-900">
    <!-- Header -->
    <Header title="Listado material - por ubicación" ></Header>


    <main class="flex-1 p-4 flex flex-col space-y-4">
      <!-- Ubicación a consultar -->
      <div class="space-y-2">
        <label class="text-sm text-slate-300">Ubicación a consultar</label>
        <div class="relative">
          <input v-model="ubicacionConsulta" type="text" placeholder="B18PRODF21"
            class="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-lg placeholder-slate-500" />
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <i class="material-icons">search</i>
          </span>
        </div>
      </div>

      <!-- Lista de Materiales -->
      <div class="grid grid-cols-1 gap-4 auto-rows-min">
        <!-- Material Card -->
        <div v-for="locations in stockLocations" :key="locations.ubicacion"
          class="border border-slate-700 rounded-lg p-4 space-y-3 bg-slate-800">
          <h3 class="font-bold text-white">{{ locations.name }}</h3>
          <p class="text-slate-400">{{ locations.matnr }}</p>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-slate-400">{{ locations.ubicacion }}</p>
              <p class="text-slate-400">Lote: {{ locations.lote }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-emerald-400">Existencia: {{ locations.existencia }} M²</p>
              <p class="font-semibold text-blue-400">Disponible: {{ locations.disponible }} M²</p>
            </div>
          </div>
        </div>



        <!-- Totales -->
        <div class="border-t border-slate-700 pt-4 mt-4">
          <div class="grid grid-cols-2 gap-4 font-semibold text-white">
            <div>Total Metros:</div>
            <div class="text-right">{{ totalubica }}</div>
            <div>TOTAL DISPONIBLE:</div>
            <div class="text-right">{{ disponibleubica }}</div>
            
          </div>
        </div>
      </div>

      <!-- Ubicación Destino -->
      <div class="space-y-2 pt-4 border-t border-slate-700">
        <label class="text-sm text-slate-300">Ubicación Destino</label>
        <input v-model="ubicacionDestino" type="text" placeholder="Ubicación Destino"
          class="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500" />
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-4 pt-4">
        <button @click="consultarUbicacion"
          class="flex items-center justify-center gap-2 bg-italia-red text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors">

          <span class="material-icons">search</span>
          Consultar Ubicación
        </button>

        <button @click="vaciarUbicacion"
          class="flex items-center justify-center gap-2 bg-slate-700 text-white py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600">
          <span class="material-icons">delete_outline</span>
          Vaciar Ubicación
        </button>
      </div>

      <!-- Back Button -->
      <button @click="volver"
        class="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700">
        <span class="material-icons">arrow_back</span>
        Volver
      </button>
    </main>
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
     @update="handlePopupUpdate" />
  </div>

</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { InfoWm } from '../services/entregas';
import { useLoader } from '../composables/useLoader'

const { isLoading, loadingText, showLoader, hideLoader } = useLoader()
const router = useRouter();
// Variables reactivas
const ubicacionConsulta = ref('');
const ubicacionDestino = ref('');
const stockLocations = ref([]);
const totalubica = ref(0);
const disponibleubica = ref(0)

// Agregar estados para el popup
const showPopup     = ref(false);
const popupTitle    = ref('Validacion de Campos');
const popupMessage  = ref('Ubicacion Vacia');
const popupType     = ref('warning');
const popupAction   = ref('normal')

// Funciones
const consultarUbicacion = async () => {
  if (ubicacionConsulta.value === '' || ubicacionConsulta.value.length === 0) {
    showPopup.value     = true ;
    return false;
  }
  try {
    
    showLoader('Consultando  ubicación...')    
    let ubicacionx = ubicacionConsulta.value;
    let ubicacionUpper = ubicacionx.toUpperCase();
    console.log('Consultando ubicación:', ubicacionUpper)
    const StockLocation = await InfoWm.SerachLocationStockAvailable(ubicacionUpper);
    stockLocations.value = StockLocation.data.data.datos;
    disponibleubica.value = StockLocation.data.data.disponibleubica;
    totalubica.value = StockLocation.data.data.totalubica;
    console.log(StockLocation.data)
  } catch (error) {
    console.log('Consultando ubicación:', error)
  } finally {
    hideLoader()
  }

}

const vaciarUbicacion = async() => {
  console.log('vaciando ubicación:', ubicacionConsulta.value, ubicacionDestino.value)
  if (ubicacionDestino.value === '' || ubicacionDestino.value.length === 0) {
    showPopup.value     = true ;
    return false;
  }
  try {
    showLoader("vaciando ubicación")
    
    let ubicacionOrigen = ubicacionConsulta.value;
    let ubicacionOrigenUpper = ubicacionOrigen.toUpperCase();

    let ubicaDestino = ubicacionDestino.value;
    let ubicacionDestionUpper = ubicaDestino.toUpperCase();

    const StockLocation = await InfoWm.ClearLocationStockAvailable(ubicacionOrigenUpper, ubicacionDestionUpper);
    let mensaje = StockLocation.data.data.mensaje;
    console.log(mensaje)
    showPopup.value = true;   
    popupTitle.value = 'Vaciar Ubicacion';  
    popupMessage.value = mensaje;
    popupType.value = 'info';   
  
  } catch (error) {
    console.log('vaciando ubicación:', error)
  } finally {
    ubicacionDestino.value = '';
    hideLoader()
    await consultarUbicacion()
  }

}

const volver = () => {
  router.back()
}
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

/* Scroll suave */
.overflow-auto {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

/* Ajustes para mejor visibilidad */
.material-icons {
  font-size: 20px;
}

/* Ajustes para campos deshabilitados */
input:disabled {
  opacity: 0.7;
}

/* Estilos para la lista */
.overflow-auto {
  max-height: calc(100vh - 400px);
}
</style>