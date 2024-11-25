<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-italia-red text-white p-4 text-center font-bold text-lg">
      .:. Traslado .:.
    </header>

    <!-- Main Content -->
    <main class="flex-1 bg-gray-800 p-4 flex flex-col space-y-4">
      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Lectura -->
        <div>
          <label class="text-gray-300 text-sm mb-1 block">Lectura</label>
          <input v-model="formData.lectura" type="text" @change="handleChangeScan" @keyup.enter="handleChangeScan"
            placeholder="Valor de etiqueta"
            class="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-italia-red focus:border-italia-red" />
        </div>

        <!-- Cantidad buena -->
        <div>
          <label class="text-gray-300 text-sm mb-1 block">Cantidad buena</label>
          <input v-model="formData.cantidadBuena" ref="cantidadBuenaInput" type="number" placeholder="Cant. buena"
            class="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-italia-red focus:border-italia-red" />
        </div>

        <!-- Ubicación Origen -->
        <div>
          <label class="text-gray-300 text-sm mb-1 block">Ubicación Origen</label>
          <select v-model="formData.ubicacionOrigen"
            class="w-full bg-white text-gray-800 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-italia-red focus:border-italia-red">
            <option value="" disabled selected>Seleccione Ubicación Origen</option>
            <option v-for="ubicacion in ubicaciones" :key="ubicacion.id" :value="ubicacion.ubicacion">
              {{ ubicacion.ubicacion }} ==> {{ ubicacion.disponible }}
            </option>
          </select>
        </div>

        <!-- Ubicación Destino -->
        <div>
          <label class="text-gray-300 text-sm mb-1 block">Ubicación Destino</label>
          <input
          v-model="formData.ubicacionDestino" 
          ref="ubicacionDestino"
          type="text" placeholder="Ubicación Destino"
            class="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-italia-red focus:border-italia-red" />
        </div>

        <!-- Material -->
        <div>
          <label class="text-gray-300 text-sm mb-1 block">Material</label>
          <input v-model="formData.material" type="text" placeholder="Material" disabled
            class="w-full bg-gray-700 text-gray-400 p-3 rounded-lg border border-gray-600" />
        </div>

        <!-- Lote y Consecutivo Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-gray-300 text-sm mb-1 block">Lote</label>
            <input v-model="formData.lote" type="text" placeholder="Lote del material" disabled
              class="w-full bg-gray-700 text-gray-400 p-3 rounded-lg border border-gray-600" />
          </div>
          <div>
            <label class="text-gray-300 text-sm mb-1 block">Consecutivo estiba</label>
            <input v-model="formData.consecutivo" type="text" placeholder="Consecutivo estiba" disabled
              class="w-full bg-gray-700 text-gray-400 p-3 rounded-lg border border-gray-600" />
          </div>
        </div>
      </form>
    </main>

    <!-- Bottom Buttons -->
    <div class="p-4 grid grid-cols-2 gap-4 bg-gray-900">
      <button @click="handleSubmit"
        class="flex items-center justify-center gap-2 bg-italia-red text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700">
        <span class="material-icons">check</span>
        Aceptar
      </button>
      <button @click="goToMenu"
        class="flex items-center justify-center gap-2 bg-gray-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600">
        <span class="material-icons">menu</span>
        Ir menú
      </button>
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
    <LoaderComponent v-if="isLoading" loadingText="cargando ..." />
    <!-- Footer -->
    <footer class="bg-italia-red text-white p-2 text-center text-sm">
      Cerámica Italia ©2024
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { InfoWm } from '../services/entregas';
import { useLoader } from '../composables/useLoader';
import BasePopup from '../components/BasePopup.vue';

const router = useRouter()
const { isLoading, loadingText, showLoader, hideLoader } = useLoader()

// Agregar estados para el popup
const showPopup = ref(false);
const popupTitle = ref('');
const popupMessage = ref('');
const popupType = ref('');
const popupAction = ref('normal')
// Datos del formulario
const formData = ref({
  lectura: '',
  cantidadBuena: '',
  ubicacionOrigen: '',
  ubicacionDestino: '',
  material: '',
  lote: '',
  consecutivo: ''
})
const cantidadBuenaInput = ref(null)
const ubicacionDestino = ref( localStorage.getItem('ubicacionDestino') || null)
const ubicaciones = ref([])

const resetForm = () => {
  formData.value.lectura = ''
  formData.value.cantidadBuena = ''
  formData.value.ubicacionOrigen = ''
  formData.value.material = ''
  formData.value.lote = ''
  formData.value.consecutivo = ''
}
const handleChangeScan = async (event) => {
  //1 dividir numero de equiqueta
  divideEtiquetas(formData.value.lectura);
  showLoader();
  await GetPalletQuantity(formData.value.consecutivo);
  await GetInfoMaterialAviable(formData.value.material, formData.value.lote, formData.value.consecutivo);
  hideLoader();

}
const divideEtiquetas = (codigo) => {
  codigo = codigo.trim()
  formData.value.material = codigo.slice(0, 18)        // "0000000000002020220000016147000199189"   
  formData.value.lote = codigo.slice(19, 28)          // "0000012280"
  formData.value.consecutivo = codigo.slice(-10) //0001990534
  cantidadBuenaInput.value?.focus()


}

async function GetInfoMaterialAviable(material, lote, pallet) {
  try {
    const infoPallet = await InfoWm.GetInfoLocationMaterialBach(material, lote, pallet);
    ubicaciones.value = infoPallet.data.data.datos
  } catch (error) {
    console.log(error)
  }

}

async function GetPalletQuantity(pallet) {

  if (pallet == '') {
    formData.value.cantidadBuena = '';
  } else {
    try {
      const infoPallet = await InfoWm.GetInfoPallet(pallet);
      if (infoPallet.data.success) {
        let cantidad = infoPallet.data.data.mensaje
        let result = cantidad.replace("|", "") || cantidad.replace("|PALLET NO EXISTE", "");
        result == 'PALLET NO EXISTE' ? cantidadBuenaInput.value = '' : cantidadBuenaInput.value = Number(result);
        formData.value.cantidadBuena = Number(result)
      }
    } catch (error) {
      console.log(error)
    }

  }

}
// Funciones
const handleAccept = async  () => {
  console.log('Procesando traslado:', formData.value)
  showLoader();
  try {

    const response = await InfoWm.MoveMaterial(formData.value.material,formData.value.lote,formData.value.consecutivo,formData.value.cantidadBuena, formData.value.ubicacionOrigen, formData.value.ubicacionDestino );
    localStorage.setItem('ubicacionDestino', formData.value.ubicacionDestino)
    hideLoader();
    response.status == 200 ? popupType.value = 'success'  : popupType.value = 'info'     
    popupTitle.value = 'Resultado';
    popupMessage.value = response.data.data.mensaje
    showPopup.value = true;    
    popupAction.value = 'normal'
    resetForm();
  } catch (error) {
    hideLoader();
    popupTitle.value = 'Error Catch';
    popupMessage.value = error
    showPopup.value = true;
    popupType.value = 'error' 
    popupAction.value = 'normal'

  }
  
  
  // Aquí implementar la lógica de traslado
}

const handleSubmit = () => {
  if(formData.value.cantidadBuena == 0 || formData.value.cantidadBuena.length == 0 ||
   formData.value.consecutivo == '' || formData.value.consecutivo.length == 0 ||
   formData.value.lectura == '' || formData.value.consecutivo.lectura == 0 ||
   formData.value.lote == '' || formData.value.consecutivo.lote == 0 ||
   formData.value.material == '' || formData.value.material == 0 ||
   formData.value.ubicacionDestino == '' || formData.value.ubicacionDestino == 0 ||
   formData.value.ubicacionOrigen == '' || formData.value.ubicacionOrigen == 0){

    popupTitle.value = 'Validacion';
    popupMessage.value = "campos incompletos"
    showPopup.value = true;
    popupType.value = 'error' 
    popupAction.value = 'normal'


  }else{
    handleAccept()
  }

  
}

const goToMenu = () => {
   localStorage.removeItem('ubicacionDestino')
  router.push('/menu')
}


onMounted(async () => {
  formData.value.ubicacionDestino = localStorage.getItem('ubicacionDestino') || ''
  ubicacionDestino.value = localStorage.getItem('ubicacionDestino') || ''
})
</script>

<style scoped>
/* Optimizaciones para dispositivos industriales */
input,
select,
button {
  min-height: 44px;
  touch-action: manipulation;
}

/* Prevenir zoom en inputs */
input,
select {
  font-size: 16px;
}

/* Ajustes para mejor visibilidad en ambientes industriales */
.material-icons {
  font-size: 20px;
}

/* Ajustes para campos deshabilitados */
input:disabled {
  opacity: 0.7;
}

/* Asegurar contraste adecuado */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>