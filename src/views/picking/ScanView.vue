<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header con información del picking -->
    <header class="bg-red-600 border-b">
      <div class="p-4">
        <h1 class="text-center text-lg font-semibold text-white">
          .:. Picking .:.
        </h1>
        <div class="text-center text-sm text-white mt-1">
          {{ nameProduct }}
        </div>
        <div class="text-center text-sm text-white mt-1">
          Acum : {{ acumulado }} / {{ totalPos }}
        </div>
        
      </div>
    </header>

    <main class="flex-1 p-4 space-y-6 bg-gray-800">
      <!-- Barra de Progreso -->
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <button
           class="ml-4 px-4 py-1 border rounded-full text-gray-600 text-sm hover:bg-gray-200"
           @click="handleManual"
           >
            Manual
          </button>
        <div class="flex items-center justify-between mb-2">

          {{ matnr }}{{ batch }}
         
        </div>
      </div>

      <!-- Formulario de Lectura -->
      <div class="space-y-4">
        <!-- Valor de etiqueta -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-white">
            Valor de etiqueta
          </label>
          <input
           type="text" 
           v-model="scanValue"
           :disabled="isManualMode" 
           @change="handleChangeScan"
           @keyup.enter="handleChangeScan"
           class="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-italia-red focus:border-italia-red"
           placeholder="Escanee o ingrese el valor" />
        </div>

        <!-- Cantidad buena -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-white">
            Cantidad buena
          </label>
          <input type="number" v-model="goodQuantity" ref="goodQuantityInput"
            class="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-italia-red focus:border-italia-red"
            placeholder="Ingrese cantidad" />
        </div>

        <!-- Cantidad material con rotura -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-white">
            Cantidad material con rotura
          </label>
          <input type="number" v-model="brokenQuantity"
            class="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-italia-red focus:border-italia-red"
            placeholder="Ingrese cantidad con rotura" />
        </div>


        <!-- Grid de información adicional -->
        <div class="w-full p-1 border rounded-lg bg-white">

          <button @click="isOpen = !isOpen"
            class="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-t-lg transition-colors">
            Información Adicional
            <span class="material-icons">
              expand_less
            </span>
          </button>
          <div v-show="isOpen" class="border border-gray-200 border-t-0 rounded-b-lg p-4 space-y-4 bg-white">
            <!-- Cod. material -->
            <div class="space-y-1">
              <label class="block text-xs font-medium text-gray-500">
                Cod. material
              </label>
              <input type="text" v-model="materialCode" class="w-full p-2 border rounded-lg bg-gray-50" disabled />
            </div>

            <!-- Consecutivo estiba -->
            <div class="space-y-1">
              <label class="block text-xs font-medium text-gray-500">
                Consecutivo estiba
              </label>
              <input type="text" v-model="palletNumber" class="w-full p-2 border rounded-lg bg-gray-50" disabled />
            </div>

            <!-- Lote -->
            <div class="space-y-1">
              <label class="block text-xs font-medium text-gray-500">
                Lote
              </label>
              <input type="text" v-model="batch" class="w-full p-2 border rounded-lg bg-gray-50" disabled />
            </div>

            <!-- Posición OT -->
            <div class="space-y-1">
              <label class="block text-xs font-medium text-gray-500">
                Posición OT
              </label>
              <input type="text" v-model="otPosition" class="w-full p-2 border rounded-lg bg-gray-50" disabled />
            </div>

            <!-- UM Base -->
            <div class="space-y-1">
              <label class="block text-xs font-medium text-gray-500">
                UM Base
              </label>
              <input type="text" v-model="meins" class="w-full p-2 border rounded-lg bg-gray-50" disabled />
            </div>

            <!-- Número OT -->
            <div class="space-y-1">
              <label class="block text-xs font-medium text-gray-500">
                Número OT
              </label>
              <input type="text" v-model="tanum" class="w-full p-2 border rounded-lg bg-gray-50" disabled />
            </div>
          </div>
        </div>
      </div>
    </main>


    <!-- Botones de acción -->
    <div class="p-4 grid grid-cols-2 gap-4  bg-gray-300 border-t">
      <button @click="handleAccept"
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
     
      <LoaderComponent 
      v-if="isLoading"
      loadingText="cargando ..."
    />

  
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { UseDespachoStore } from '../../store/despachos';
import BasePopup from '../../components/BasePopup.vue';
import { infoDespachos, InfoWm } from '../../services/entregas';
import { useLoader } from '../../composables/useLoader';


const router = useRouter()
const route = useRoute()
const store = UseDespachoStore()
const isOpen = ref(false)
const { isLoading, loadingText, showLoader, hideLoader } = useLoader()

// Variables reactivas
const materialCode = ref('')
const scanValue = ref('')
const goodQuantity = ref(0)
const brokenQuantity = ref(0)
const locations = ref('')
const palletNumber = ref('')
const batch = ref('')
const otPosition = ref('')
const meins = ref('')
const tanum = ref('')
const matnr = ref('')
const nameProduct = ref('')
const material = ref('')
const QuantityPallet = ref('')
const pallet = ref('')
const lote = ref('')
const goodQuantityInput = ref(null)
const registroOk = ref(true)
const acumulado = ref(0)
const entregaPicking = ref('')
const totalPos = ref(0)
const tipolectura = ref('A')
const flag = ref('4')
const idRegistro = ref('')
const palletMAnual = ref(0)
const isManualMode = ref(false) 


// Agregar estados para el popup
const showPopup = ref(false);
const popupTitle = ref('');
const popupMessage = ref('');
const popupType = ref('');
const popupAction = ref('normal')

const handleAccept = async  () => {
  // Validar y procesar la lectura
  validaformulario()
  if(!registroOk.value){
   // console.log(registroOk)
    registroOk.value = true
  }else{
    console.log('Procesando lectura:', {
    scanValue: scanValue.value,
    goodQuantity: goodQuantity.value,
    brokenQuantity: brokenQuantity.value
  })
    showLoader("Registrando Informacion...")
    await RegistrarPicking();
 
  }
}

const handleManual = async () => {
  isManualMode.value = true 
  palletNumber.value = palletMAnual.value + 1 
  palletMAnual.value =  palletNumber.value  
  material.value = matnr.value
  materialCode.value = matnr.value
  tipolectura.value = 'M'
  scanValue.value = `${matnr.value}${batch.value}${palletNumber.value}`
  goodQuantityInput.value?.focus()
  

 
}

const resetFields = async () => {
  scanValue.value ='';
  goodQuantity.value = '';
  goodQuantityInput.value = '';
}

const RegistrarPicking = async () =>{
  let entrega     =  entregaPicking.value;  
  let posicion    =  "000000";
  let materialx   =  material.value;
  let lote        =  batch.value;
  let consestib   =  palletNumber.value;
  let cantbuena   =  goodQuantity.value; 
  let cantrotura  =  brokenQuantity.value;
  let UMBASE      =  meins.value;
  let usuario     =  localStorage.getItem("user");
  let bandera     =  flag.value; 
  let IDX         =  idRegistro.value;
  let POSOT       =  otPosition.value;
  let OT          =  tanum.value;
  let tplectura   =  tipolectura.value


  const regPicking = await InfoWm.RegistryPicking(entrega,posicion,materialx,lote,consestib,cantbuena,cantrotura,UMBASE,usuario,bandera,IDX,POSOT,OT,tplectura)
  console.log(regPicking.data.data[0])

  let mensaje = regPicking.data.data[0].mensaje;
  if (mensaje == "RESGISTRO EXITOSO"){
    hideLoader()
    acumulado.value = Number(regPicking.data.data[0].acumulado) + acumulado.value 
    idRegistro.value = regPicking.data.data[0].id
    popupTitle.value = 'Estado De Registro';
    popupMessage.value = mensaje
    showPopup.value = true;
    popupType.value = 'success' 
    popupAction.value = 'normal'

  }else if(mensaje == "UP"){
    hideLoader()
    showPopup.value = true
    popupTitle.value = 'Actualización Requerida'
    popupMessage.value = 'Se requiere actualizar el registro. ¿Desea continuar?'
    popupType.value = 'warning'
    popupAction.value = 'update'
    vibrate()
    

  }else{
    hideLoader()
    acumulado.value = Number(regPicking.data.data[0].acumulado) + acumulado.value 
    idRegistro.value = regPicking.data.data[0].id
    popupTitle.value = 'Estado De Registro';
    popupMessage.value = mensaje
    showPopup.value = true;
    popupType.value = 'warning' 
    popupAction.value = 'normal'

  }

  resetFields();
}

const handleBack = () => {
  router.back()
}

const validaformulario = () => {

  if(tipolectura.value === "A" && goodQuantity.value > QuantityPallet.value ){
   
    popupTitle.value = 'Error de Validación';
    popupMessage.value = `cantidad no permitida ${goodQuantity.value}, supera cantidad del pallet`;
    showPopup.value = true;
    popupType.value = 'warning' 
    scanValue.value = '';
    registroOk.value = false
    vibrate()
    return false

  }

 
  if(  goodQuantity.value == 0 || goodQuantity.value == '' || goodQuantity.value.length == 0) { 
     
    popupTitle.value = 'Error de Validación';
    popupMessage.value = `cantidad no permitida ${goodQuantity.value}`;
    showPopup.value = true;
    popupType.value = 'warning' 
    scanValue.value = '';
    registroOk.value = false
    vibrate()
   
    return false
  }
  if(material.value.length == 0) { 
      
    popupTitle.value = 'Error de Validación';
    popupMessage.value = `Material vacio, no permitido`;
    showPopup.value = true;
    popupType.value = 'warning' 
    scanValue.value = '';
    registroOk.value = false
    vibrate()
    return false
  }
  if(scanValue.value.length == 0) { 
      
    popupTitle.value = 'Error de Validación';
    popupMessage.value = `Material vacio, no permitido`;
    showPopup.value = true;
    popupType.value = 'warning' 
    scanValue.value = '';
    registroOk.value = false
    vibrate()
    return false
  }

  let  total =  acumulado.value + goodQuantity.value + brokenQuantity.value
 if(total > totalPos.value) {      
    popupTitle.value = 'Error de Validación';
    popupMessage.value = `excede cantidad acumulada, no permitido`;
    showPopup.value = true;
    popupType.value = 'warning' 
    scanValue.value = '';
    registroOk.value = false
    vibrate()
    
    return false
  }

  
 

}

const vibrate = ()=> {
  if (navigator.vibrate) {
        navigator.vibrate(200)
      }
}
const handleChangeScan = async (event) => {

  //1 dividir numero de equiqueta
  divideEtiquetas(scanValue.value, 'A');
  //2 validar que el material lote ingresado coincida con el de la ot
  validaCampos(batch.value, lote.value, "lote");
  validaCampos(matnr.value, material.value, "materaial");
  AsignaCampos();
  if(tipolectura.value === 'A'){
    await GetPalletQuantity(palletNumber.value)
  } 
}


const divideEtiquetas = (codigo, tipo) => {
  codigo = codigo.trim()
  material.value = codigo.slice(0, 18)        // " 000000000000203080000001566000001990534"   
  lote.value = codigo.slice(18, 28)          // "0000012280"
  tipo === "A" ? pallet.value = codigo.slice(-10) : null //0001990534


}

const validaCampos = (campo1, campo2, campo) => {
  if (campo1 !== campo2) {
    popupTitle.value = 'Error de Validación';
    popupMessage.value = `El ${campo} escaneado no corresponde con el ${campo} de la OT`;
    showPopup.value = true;
    popupType.value = 'error'
    scanValue.value = '';
    
  } else {
    goodQuantityInput.value?.focus()
  }
}

const AsignaCampos = () => {
  materialCode.value = material.value;
  palletNumber.value = pallet.value;
}

async function GetPalletQuantity(pallet) {

  if (pallet == '') {
    goodQuantity.value = '';
  } else {
    const infoPallet = await InfoWm.GetInfoPallet(pallet);
    //console.log(infoPallet.data.success)
    if (infoPallet.data.success) {
      let cantidad = infoPallet.data.data.mensaje
      let result = cantidad.replace("|", "") || cantidad.replace("|PALLET NO EXISTE", "");
      result == 'PALLET NO EXISTE' ? goodQuantity.value = '' : goodQuantity.value = Number(result);
      QuantityPallet.value = Number(result)
    }
  }

}

const getAcumulado = async (entrega, posOt, ot) => {
  const responseDespachos = await infoDespachos.getEntregaAcumulada(entrega, posOt, ot)
  //console.log(responseDespachos)
  return responseDespachos.data.success ?  parseFloat(responseDespachos.data.data[0].acumulado) : 0

}


const handlePopupConfirm = () => {
  showPopup.value = false

}
const handlePopupUpdate = async () => {
  try {
    // Usar los mismos datos que el registro original
    let entrega     =  entregaPicking.value;  
    let posicion    =  "000000";
    let materialx   =  material.value;
    let lote        =  batch.value;
    let consestib   =  palletNumber.value;
    let cantbuena   =  goodQuantity.value; 
    let cantrotura  =  brokenQuantity.value;
    let UMBASE      =  meins.value;
    let usuario     =  localStorage.getItem("user");
    let bandera     =  "2"; // Cambiar bandera para actualización
    let IDX         =  idRegistro.value;
    let POSOT       =  otPosition.value;
    let OT          =  tanum.value;
    let tplectura   =  tipolectura.value

    // Llamar a la API con bandera de actualización
   
    showLoader()
    const regPicking = await InfoWm.RegistryPicking(
      entrega,
      posicion,
      materialx,
      lote,
      consestib,
      cantbuena,
      cantrotura,
      UMBASE,
      usuario,
      bandera,
      IDX,
      POSOT,
      OT,
      tplectura
    )
    console.log(regPicking)
    const mensaje = regPicking.data.data[0].mensaje;
    
    if (mensaje === "OK" || mensaje === "RESGISTRO EXITOSO") {
      hideLoader()
      acumulado.value = regPicking.data.data[0].acumulado
      showPopup.value = true
      popupTitle.value = 'Éxito'
      popupMessage.value = 'Actualización exitosa'
      popupType.value = 'success'
      popupAction.value = 'normal'

      // Limpiar campos después de actualización exitosa
      scanValue.value = ''
      goodQuantity.value = 0
      brokenQuantity.value = 0
      hideLoader()
    } else {
      hideLoader()
      showPopup.value = true
      popupTitle.value = 'Error'
      popupMessage.value = mensaje || 'Error al actualizar'
      popupType.value = 'error'
      popupAction.value = 'normal'
      vibrate()
   
    }
  } catch (error) {
    hideLoader()
    console.error('Error en actualización:', error)
    showPopup.value = true
    popupTitle.value = 'Error'
    popupMessage.value = 'Error al procesar la actualización'
    popupType.value = 'error'
    popupAction.value = 'normal'
    vibrate()
    
  }
}

onMounted(async () => {
  try {
    let entrega = route.params.entrega
    entregaPicking.value = entrega
    totalPos.value = Number(route.params.totalPos)

    const detalleEntrega = store.detalleEntregas.find(detalle =>
      detalle.entrega === entrega
    )
    if (detalleEntrega) {
      let pos = Number(route.params.pos)
      const materialTapos1 = detalleEntrega.datos.find(item => item.tapos === pos)

      if (materialTapos1) {

        locations.value = materialTapos1.vlpla || ''
        batch.value = materialTapos1.charg || ''
        otPosition.value = materialTapos1.tapos || ''
        meins.value = materialTapos1.meins || ''
        tanum.value = materialTapos1.tanum || ''
        matnr.value = materialTapos1.matnr || ''
        nameProduct.value = materialTapos1.maktx || ''
        acumulado.value = await getAcumulado(entrega, materialTapos1.tapos,materialTapos1.tanum )

      }
    }

  } catch (error) {
    console.error('Error al cargar los materiales:', error)
  }
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
</style>