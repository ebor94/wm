<template>
    <div class="min-h-screen flex flex-col bg-gray-50">
        <!-- Header con información del picking -->
        <Header title=".:. Ingresar Pallet .:."></Header>
        <main class="flex-1 p-4 space-y-6 bg-gray-800">
            <!-- Formulario de Lectura -->
            <!-- <ScanEtiqu v-model="scanValue" :disabled="isManualMode" @onChange="handleScanChange" /> -->
            <ScannerInput v-model="scanValue" @onCodeProcessed="recibirCodigo" @onError="recibirError" />
            <div v-show="isOpen" class="border border-gray-700 border-t-0 rounded-b-lg p-4 space-y-4 bg-gray-700 ">
                <!-- Cod. material -->
                <div class="space-y-1">
                    <label class="block text-xs font-medium text-gray-500">
                        Cod. material
                    </label>
                    <input type="text" v-model="materialCode" class="w-full p-2 border rounded-lg bg-gray-50"
                        disabled />
                </div>

                <!-- Consecutivo estiba -->
                <div class="space-y-1">
                    <label class="block text-xs font-medium text-gray-500">
                        Consecutivo estiba
                    </label>
                    <input type="text" v-model="palletNumber" class="w-full p-2 border rounded-lg bg-gray-50"
                        disabled />
                </div>

                <!-- Lote -->
                <div class="space-y-1">
                    <label class="block text-xs font-medium text-gray-500">
                        Lote
                    </label>
                    <input type="text" v-model="lote" class="w-full p-2 border rounded-lg bg-gray-50"
                        :disabled="!loteEditable" />
                </div>
                <!-- Cantidad buena -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-white">
                        Cantidad ({{ cantidadxcajas }})
                    </label>
                    <input type="number" v-model="goodQuantity" ref="goodQuantityInput"
                        class="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-italia-red focus:border-italia-red"
                        placeholder="Ingrese cantidad" />
                </div>
                <label class="block text-sm font-medium text-white">
                    Cantidad Convertida {{ goodQuantityConvert }}
                </label>
                <!-- Grid de información adicional -->
                <div class="w-full p-1 border rounded-lg bg-white">
                    <button @click="isOpen2 = !isOpen2"
                        class="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-t-lg transition-colors">
                        Información Adicional
                        <span class="material-icons">
                            expand_less
                        </span>
                    </button>
                    <div v-show="isOpen2" class="border border-gray-200 border-t-0 rounded-b-lg p-4 space-y-4 bg-white">
                        <!-- Posición OT -->
                        <div class="space-y-1">
                            <label class="block text-xs font-medium text-gray-500">
                                Posición MT
                            </label>
                            <input type="text" v-model="MtPosition" class="w-full p-2 border rounded-lg bg-gray-50"
                                disabled />
                        </div>

                        <!-- UM Base -->
                        <div class="space-y-1">
                            <label class="block text-xs font-medium text-gray-500">
                                UM Base
                            </label>
                            <input type="text" v-model="meins" class="w-full p-2 border rounded-lg bg-gray-50"
                                disabled />
                        </div>

                        <!-- Número OT -->
                        <div class="space-y-1">
                            <label class="block text-xs font-medium text-gray-500">
                                Número MT
                            </label>
                            <input type="text" v-model="mt" class="w-full p-2 border rounded-lg bg-gray-50" disabled />
                        </div>
                    </div>
                </div>
            </div>


        </main>
        <!-- Botones de acción -->
        <div class="p-4 grid grid-cols-2 gap-4  border border-gray-700 border-t-0 rounded-b-lg  bg-gray-700 ">
            <button @click="handleAccept"
                class="flex items-center justify-center gap-2 bg-italia-red text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700">
                <span class="material-icons">check</span>
                Ingresar Pallet
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

        <PopupForm v-model="showOrderModal" :title="titleModalOt"
            api-url="https://lilix.ceramicaitalia.com:3001/transporte/wm/lt12/" :otNumber="otNumber"
            :almacenWm="almacenWm" @submit-success="handleSuccess" @submit-error="handleError" />
    </div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { UseDespachoStore } from '../store/despachos';
import { useAuthStore } from '../store/auth';
import BasePopup from '../components/BasePopup.vue';
import { useLoader } from '../composables/useLoader';
import Header from '../components/Header.vue';
import { InfoEntrega } from '../services/entregas';
import PopupForm from '../components/PopupForm.vue';
import ScannerInput from '../components/ScanEtiqu.vue'
import { useProductsStore } from '../store/producto';
//const scanValue = ref('')


const isManualMode = ref(false);
const handlePopupUpdate = ref(false);
const router = useRouter()
const route = useRoute()
const store = UseDespachoStore()
const isOpen = ref(false)
const isOpen2 = ref(false)
const { isLoading, loadingText, showLoader, hideLoader } = useLoader()
const productsStore = useProductsStore()
const userStore = useAuthStore()

// Variables reactivas
const materialCode = ref('')
const scanValue = ref('')
const palletNumber = ref('')
const material = ref('')
const pallet = ref('')
const lote = ref('')
const MtPosition = ref('')
const meins = ref('')
const mt = ref('')
const infoPos = ref([])
const goodQuantity = ref('0')
const goodQuantityInput = ref(null)
const otNumber = ref('')
const almacenWm = ref('')
const tipoScan = ref('') // Tipo de escaneo, por defecto 'P' para Pallet
const loteEditable = ref(false); // Cambiar a true si se permite editar el lote
const cantidadxcajas = ref(0); // Variable para cantidad en cajas
const goodQuantityConvert = ref(0); // Variable para cantidad convertida



// Agregar estados para el popup
const showPopup = ref(false);
const popupTitle = ref('');
const popupMessage = ref('');
const popupType = ref('');
const popupAction = ref('normal')
const showOrderModal = ref(false)
const titleModalOt = ref("Ingresar Orden y Ubicación")

const resetFields = async () => {
    scanValue.value = '';
    // MtPosition.value= ''
    /*      materialCode.value  = '';
          lote.value= '';
           pallet.value= '';
          MtPosition.value= ''; */
}
const handleBack = () => {
    router.back()
}
const vibrate = () => {
    if (navigator.vibrate) {
        navigator.vibrate(200)
    }
}


const handleAccept = async () => {
    let bandera = '';
    if (goodQuantity.value === 0) {
        showPopup.value = true;
        popupTitle.value = 'Alerta'
        popupMessage.value = 'La cantidad buena no puede ser 0'
        popupType.value = 'warning'
        return
    }
    showLoader('Guardando información...');

    try {
        /* EAN13
        CODIGO_PRODUCTO
        CODIGO_18
        ETIQUETA_COMPLETA */
        if (tipoScan.value === 'ETIQUETA_COMPLETA') {
            bandera = '1'
        } else {
            bandera = '4'
        }

        lote.value == '' ? lote.value = 'x' : lote.value = lote.value.trim()

         if (userStore.umPicking === 'CJ') {
            goodQuantity.value = goodQuantityConvert.value;
         }
        
     
       // console.log(mt.value, materialCode.value, lote.value, pallet.value, localStorage.getItem('centro'), localStorage.getItem('almacen'), '', '', MtPosition.value.toString(), goodQuantity.value.toString(), localStorage.getItem('user'), bandera)
        //return
        let response = await InfoEntrega.enterPallet(mt.value, materialCode.value, lote.value, pallet.value, localStorage.getItem('centro'), localStorage.getItem('almacen'), '', '', MtPosition.value.toString(), goodQuantity.value.toString(), localStorage.getItem('user'), bandera)
        console.log(response)
        if (response.data.MENSAJE.includes("|")) {
            const partes = response.data.MENSAJE.split("|");
            otNumber.value = partes[1];
            let title = partes[0].toString()
            almacenWm.value = partes[2].toString()
            // console.log(title)
            if (title == "PALLET YA LEGALIZADO EN ESTE CENTRO ") titleModalOt.value = "OT pendiente de confirmar"

            showOrderModal.value = true
        } else {
            showPopup.value = true;
            popupTitle.value = 'Información'
            popupMessage.value = response.data.MENSAJE || response.data.error
            popupType.value = 'success'
            resetFields()
            isOpen.value = false
        }
    } catch (error) {
        showPopup.value = true;
        popupTitle.value = 'Alerta'
        popupMessage.value = error.message
        popupType.value = 'error'
    } finally {
        hideLoader()
    }
}
const handleScanChange = async (value) => {

    // Lógica específica de la vista  
    let scanner = scanValue.value;
    //.log(scanValue.value)
    if (scanner.length == 0) {
        showPopup.value = true;
        popupTitle.value = 'Alerta'
        popupMessage.value = 'Scanear Etiqueta'
        popupType.value = 'warning'

    } else {
        showLoader('Cargando información...')
        divideEtiquetas(scanner, 'A');
        AsignaCampos()
        try {

            let infoPallet = await InfoEntrega.getIngresoMaterialInfo('P', '', null, null, pallet.value)
            goodQuantity.value = infoPallet.data[0].Cantidad
        } catch (error) {
            goodQuantity.value = 0
            showPopup.value = true;
            popupTitle.value = 'Alerta'
            popupMessage.value = error.message
            popupType.value = 'error'

        } finally {
            validaCampos()
            vibrate();
            hideLoader()
        }



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
const validaCampos = () => {
    //console.log("lote ",infoPos.value[0].charg, lote.value);

    //console.log(materialCode.value, infoPos.value[0].matnr, lote.value, infoPos.value[0].charg)
    if (tipoScan.value === 'ETIQUETA_COMPLETA') {
        if (materialCode.value !== infoPos.value[0].matnr || lote.value !== infoPos.value[0].charg) {
            showPopup.value = true;
            popupTitle.value = 'Alerta'
            popupMessage.value = 'la informacion de la etiqueta no es consistente con la posicion'
            popupType.value = 'warning'
            return false
        }
    } else {
        loteEditable.value = true
        lote.value = infoPos.value[0].charg
    }
    isOpen.value = true
    focusInput().then(() => {
        // console.log('Input enfocado')
    }).catch((error) => {
        //console.error('Error al enfocar el input:', error)
    })
    //goodQuantity.value?.focus()
    resetFields()
    return true
}
const focusInput = async () => {
    await nextTick() // Esperar a que el DOM se actualice
    goodQuantityInput.value?.focus()
}
watch(scanValue, (newValue) => {
    scanValue.value = newValue.trim()
})

const recibirCodigo = (resultado) => {
    console.log('📦 Código procesado:', resultado)

    // Aquí tienes acceso a toda la información:
    console.log('🏷️ Tipo:', resultado.tipo)
    tipoScan.value = resultado.tipo
    console.log('📋 Material:', resultado.materialCode)
    console.log('🔖 Tipo Lectura:', resultado.tipoLectura)

    if (resultado.materialCode) {
        console.log('🔹 Material:', resultado.materialCode)
        materialCode.value = resultado.materialCode
        material.value = resultado.materialCode
    }

    if (resultado.lote) {
        console.log('📊 Lote:', resultado.lote)
        lote.value = resultado.lote
    }

    if (resultado.pallet) {
        console.log('📦 Pallet:', resultado.pallet)
        showLoader('Cargando cantidad de pallet...')

        pallet.value = resultado.pallet
        palletNumber.value = pallet.value

        // Usar .then() en lugar de await
        InfoEntrega.getIngresoMaterialInfo('P', '', null, null, pallet.value)
            .then(infoPallet => {
                goodQuantity.value = infoPallet.data[0].Cantidad
            })
            .catch(error => {
                goodQuantity.value = 0
                showPopup.value = true
                popupTitle.value = 'Alerta'
                popupMessage.value = error.message
                popupType.value = 'error'
            })
            .finally(() => {
                hideLoader()
            })
    }
    // ✅ CONSULTAR INVENTARIO EN EL STORE
    // console.log('🔍 Consultando inventario para material:', materialCode.value)
    showLoader('Cargando informacion del material...')
    productsStore.fetchInventarioLotes(materialCode.value, localStorage.getItem('centro'), localStorage.getItem('almacen')).then(() => {
        //console.log('📦 Inventario actualizado en el store')
        if (userStore.umPicking === 'CJ') {
            let quantityConvert = infoQuantityPos(materialCode.value, lote.value)
            //console.log('Cantidad convertida:', quantityConvert)
            if (!quantityConvert || quantityConvert.length === 0) {
                showPopup.value = true;
                popupTitle.value = 'Alerta';
                popupMessage.value = 'No se encontró información del lote para la conversión del material';
                popupType.value = 'warning';
                vibrate()
                return
            }
            cantidadxcajas.value = quantityConvert.m2cajas;
            goodQuantityInput.value = (infoPos.value[0].lfimg / cantidadxcajas.value).toFixed(2);
            goodQuantity.value = (infoPos.value[0].lfimg / cantidadxcajas.value).toFixed(2);
            goodQuantityConvert.value = (goodQuantityInput.value * cantidadxcajas.value).toFixed(2);
            //goodQuantity.value = goodQuantityConvert.value;
        }
        isOpen.value = validaCampos()
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
    validaCampos()

    //console.log('🔄 Cantidad convertida:', quantityConvert)
    vibrate()
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

onMounted(() => {
    mt.value = route.params.entrega
    MtPosition.value = Number(route.params.pos)
    //log( mt.value,  MtPosition.value)
    infoPos.value = store.detalleEntregas.filter(item => item.vbeln === mt.value && item.posnr === MtPosition.value)
    localStorage.setItem('centroExp', infoPos.value[0].werks)
    localStorage.setItem('almacenExp', infoPos.value[0].lgort)
    //console.log(infoPos.value)
    meins.value = infoPos.value[0].meins
    // Lógica específica de la vista
})

</script>