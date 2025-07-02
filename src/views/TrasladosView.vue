<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <Header title=".:. Traslado .:." ></Header>


    <!-- Main Content -->
    <main class="flex-1 bg-gray-800 p-4 flex flex-col space-y-4">
      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Lectura -->
       <!--  <div>
          <label class="text-gray-300 text-sm mb-1 block">Lectura</label>
          <input v-model="formData.lectura" type="text" @change="handleChangeScan" @keyup.enter="handleChangeScan"
            placeholder="Valor de etiqueta"
            class="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-italia-red focus:border-italia-red" />
        </div> -->

        <ScannerInput
            v-model="scanValue"
            @onCodeProcessed="recibirCodigo"
            @onError="recibirError"
            />
       

        <!-- Ubicación Origen -->
        <div>
          <label class="text-gray-300 text-sm mb-1 block">Ubicación Origen</label>
          <select  v-model="indiceSeleccionado" @change="onUbicacionChange"
            class="w-full bg-white text-gray-800 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-italia-red focus:border-italia-red">
            <option value="" disabled selected>Seleccione Ubicación Origen</option>
            <option v-for="(ubicacion, index) in ubicaciones" :key="ubicacion.id" :value="index">
              {{ ubicacion.ubicacion }} ==> {{ ubicacion.disponible }}  {{ ubicacion.lote ? `- Lote: ${ubicacion.lote}` : '' }}
            </option>
          </select>
        </div>

         <!-- Cantidad buena -->
        <div>
          <label class="text-gray-300 text-sm mb-1 block">Cantidad buena ({{ cantidadxcajas }})</label>
          <input 
           v-model="formData.cantidadBuena" 
           ref="cantidadBuenaInput" 
           type="number" 
           placeholder="Cant. buena"  
           @keyup.enter="handleChangeUbicacionDestino"
           @change="onCantidadBuenaChange"
           class="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-italia-red focus:border-italia-red" />
             <label class="block text-sm font-medium text-white">
                        Cantidad  ({{ cantidadUmi }})
                    </label>
        </div>

        <!-- Ubicación Destino -->
        <div>
          <label class="text-gray-300 text-sm mb-1 block">Ubicación Destino</label>
          <input
          v-model="formData.ubicacionDestino" 
          @keyup.enter="handleChangeButonTraslado"
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
      <button @click="handleSubmit" ref="BotonTraslado"
        class="flex items-center justify-center gap-2 bg-italia-red text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700">
        <span class="material-icons">check</span>
        Aceptar/ Trasladar
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
import { nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { InfoWm } from '../services/entregas';
import { useLoader } from '../composables/useLoader';
import BasePopup from '../components/BasePopup.vue';
import Header from '../components/Header.vue';
import ScannerInput from '../components/ScanEtiqu.vue'
import { useProductsStore } from '../store/producto';
import { useAuthStore } from '../store/auth';
const productsStore = useProductsStore()
const userStore = useAuthStore()

const router = useRouter()
const { isLoading, loadingText, showLoader, hideLoader } = useLoader()
const indiceSeleccionado = ref('') // Indice de la ubicación seleccionada
// Agregar estados para el popup
const showPopup = ref(false);
const popupTitle = ref('');
const popupMessage = ref('');
const popupType = ref('');
const popupAction = ref('normal')
const scanValue = ref('')
const tipoScan = ref('') // Tipo de escaneo, por defecto 'P' para Pallet
const cantidadxcajas = ref(0) // Cantidad de cajas por pallet
const cantidadUmi = ref(0) // Cantidad de UMI (Unidades de Medida de ingreso)

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
const BotonTraslado = ref(null)
const goodQuantity = ref(0) // Cantidad buena convertida

const focusInputBuenaInput = async () => {
    await nextTick() // Esperar a que el DOM se actualice
    cantidadBuenaInput.value?.focus()
}

const handleChangeUbicacionDestino = () => {
  //console.log('Ubicación destino cambiada:', formData.value.ubicacionDestino)
  ubicacionDestino.value?.focus()
}

const handleChangeButonTraslado = () => {
  //console.log('Botón de traslado enfocado')
   if (formData.value.ubicacionDestino) {
   BotonTraslado.value?.focus()
  }else{
    vibrate()
  }
  
}
const onUbicacionChange = () => {

  if (indiceSeleccionado.value !== '') {
    let resultadoUbicacionLote = ubicaciones.value[indiceSeleccionado.value];
    formData.value.ubicacionOrigen = resultadoUbicacionLote.ubicacion;
    if (tipoScan.value !== 'ETIQUETA_COMPLETA') {
      formData.value.lote = resultadoUbicacionLote.lote;
      goodQuantity.value = resultadoUbicacionLote.disponible;
      formData.value.consecutivo = 'x';
    }
    showLoader('Cargando informacion del material...')
    productsStore.fetchInventarioLotes(formData.value.material, localStorage.getItem('centro'), localStorage.getItem('almacen')).then(() => {
      //console.log('📦 Inventario actualizado en el store')
      if (userStore.umPicking === 'CJ') {
        let quantityConvert = infoQuantityPos(formData.value.material, formData.value.lote)
        //console.log('Cantidad convertida:', quantityConvert)
        if (!quantityConvert || quantityConvert.length === 0) {
          showPopup.value = true;
          popupTitle.value = 'Alerta';
          popupMessage.value = 'No se encontró información  para la conversión del material';
          popupType.value = 'warning';
          vibrate()
          return
        }
        cantidadxcajas.value = quantityConvert.m2cajas;
       
        formData.value.cantidadBuena = (goodQuantity.value / cantidadxcajas.value).toFixed(2);
        cantidadUmi.value = goodQuantity.value

        //goodQuantity.value = goodQuantityConvert.value;
        focusInputBuenaInput().then(() => {
          console.log('Input enfocado')
        }).catch((error) => {
          console.error('Error al enfocar el input:', error)
        })
      }



    }).catch(error => {
      console.error('❌ Error al consultar inventario:', error)
      showPopup.value = true;
      popupTitle.value = 'Alerta'
      popupMessage.value = 'Error al consultar inventario: ' + error.message
      popupType.value = 'error'
      vibrate()
    }).finally(() => {
      hideLoader()
    })
  }
}
const onCantidadBuenaChange = () => {
  //console.log('Cantidad buena cambiada:', formData.value.cantidadBuena)
  if (formData.value.cantidadBuena && formData.value.cantidadBuena > 0) {
    // Convertir cantidad buena a UMI si es necesario
    if (userStore.umPicking === 'CJ') {
      //formData.value.cantidadBuena = (formData.value.cantidadBuena  / cantidadxcajas.value).toFixed(2);
      cantidadUmi.value =  (formData.value.cantidadBuena  / cantidadxcajas.value).toFixed(2);
      goodQuantity.value = cantidadUmi.value
    } else {
      goodQuantity.value = formData.value.cantidadBuena;
      cantidadUmi.value = goodQuantity.value
    }
  } else {
    goodQuantity.value = 0;
    cantidadUmi.value = 0;
  }

}
const vibrate = () => {
    if (navigator.vibrate) {
        navigator.vibrate(200)
    }
}

const resetForm = () => {
  formData.value.lectura = ''
  formData.value.cantidadBuena = ''
  formData.value.ubicacionOrigen = ''
  formData.value.material = ''
  formData.value.lote = ''
  formData.value.consecutivo = ''
  scanValue.value = ''
  ubicaciones.value = []
  indiceSeleccionado.value = ''
  cantidadBuenaInput.value = null
}
/* const handleChangeScan = async (event) => {
  //1 dividir numero de equiqueta
  divideEtiquetas(formData.value.lectura);
  showLoader();
  await GetPalletQuantity(formData.value.consecutivo);
  await GetInfoMaterialAviable(formData.value.material, formData.value.lote, formData.value.consecutivo);
  hideLoader();

} */
/* const divideEtiquetas = (codigo) => {
  codigo = codigo.trim()
  formData.value.material = codigo.slice(0, 18)        // "0000000000002020220000016147000199189"   
  formData.value.lote = codigo.slice(19, 28)          // "0000012280"
  formData.value.consecutivo = codigo.slice(-10) //0001990534
  cantidadBuenaInput.value?.focus()


} */
 const recibirCodigo = (resultado) => {
   showLoader();
  console.log('📦 Código procesado:', resultado)
  
  // Aquí tienes acceso a toda la información:
  console.log('🏷️ Tipo:', resultado.tipo)  
  console.log('📋 Material:', resultado.materialCode)
  console.log('🔖 Tipo Lectura:', resultado.tipoLectura)
   tipoScan.value = resultado.tipo
   //showLoader('Cargando informacion...')
  if (resultado.materialCode) {
    console.log('🔹 Material:', resultado.materialCode)
   formData.value.material = resultado.materialCode
   
  }
  
  if (resultado.lote) {
    console.log('📊 Lote:', resultado.lote)   
    formData.value.lote = resultado.lote
  }
  
  if (resultado.pallet) {
     formData.value.consecutivo = resultado.pallet 
     
    console.log('📦 Pallet:', formData.value.consecutivo)
    
    
   
    
    // Usar .then() en lugar de await

    Promise.all([
      GetPalletQuantity( formData.value.consecutivo),
      //GetInfoMaterialAviable(formData.value.material, formData.value.lote, pallet.value)
    ])
    .then(() => {
      //cantidadBuenaInput.value?.focus()
    })
    .catch(error => {
      formData.value.cantidadBuena  = 0
      showPopup.value = true
      popupTitle.value = 'Alerta'
      popupMessage.value = error.message
      popupType.value = 'error al obtener cantidad de pallet'
    })
    .finally(() => {
      hideLoader()
    })
  }
   
   GetInfoMaterialAviable(formData.value.material, formData.value.lote || 'x',  formData.value.consecutivo || 'x')
        .then(() => {
          console.log('Ubicaciones cargadas')
        })
        .catch(error => {
          cantidadBuena.value = 0
          showPopup.value = true
          popupTitle.value = 'Alerta'
          popupMessage.value = error.message
          popupType.value = 'Error al cargar ubicaciones'
          console.error('Error al cargar ubicaciones:', error)
        })
        .finally(() => {
          hideLoader()
        })
    

}

const infoQuantityPos = (material, lote = '') => {
    let infoprod;
    if (lote !== '') {
        infoprod = productsStore.getProductsByLote(lote);
        console.log('lote:', lote, 'Información del producto:', infoprod);
        return infoprod[0]
    }
    if (material !== '') {
        infoprod = productsStore.getProductByMaterial(material);
        console.log('material:', material, 'Información del producto:', infoprod);
        return infoprod
    }

    // return infoprod
}

const recibirError = (error) => {
  console.error('❌ Error:', error)
  //ultimoCodigo.value = null
}

async function GetInfoMaterialAviable(material, lote, pallet) {
  try {
    const infoPallet = await InfoWm.GetInfoLocationMaterialBach(material, lote, pallet);
    console.log(infoPallet)
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
  let cantidadEnviar = formData.value.cantidadBuena
   if (userStore.umPicking === 'CJ') {
   // formData.value.cantidadBuena = goodQuantity.value
    cantidadEnviar = goodQuantity.value
  }
  console.log('Procesando traslado antes:', formData.value)
  console.log(formData.value.material,formData.value.lote,formData.value.consecutivo || 'x', cantidadEnviar, formData.value.ubicacionOrigen, formData.value.ubicacionDestino );;
   //return 
  showLoader();
  try {

    const response = await InfoWm.MoveMaterial(formData.value.material,formData.value.lote,formData.value.consecutivo || 'x', cantidadEnviar, formData.value.ubicacionOrigen, formData.value.ubicacionDestino );
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
  // formData.value.consecutivo == '' || formData.value.consecutivo.length == 0 ||
    //formData.value.lote == '' || formData.value.consecutivo.lote == 0 ||
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