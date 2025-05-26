<template>
    <div class="min-h-screen flex flex-col bg-gray-50">
        <!-- Header con información del picking -->
        <Header title=".:. Liberar Picking .:."></Header>
        <main class="flex-1 p-4 space-y-6 bg-gray-800">
            <!-- Formulario de Lectura -->
            <ScanEtiqu v-model="scanValue" :disabled="isManualMode" @onChange="handleScanChange" />
            <div v-show="isOpen" class="border border-gray-700 border-t-0 rounded-b-lg p-4 space-y-4 bg-gray-700 ">
                <!-- descripcion. material -->
                <div class="space-y-1">
                    <label class="block text-xs font-medium text-gray-500">
                       material
                    </label>
                    <input type="text" v-model="materialDesc" ref="materialDescInput" class="w-full p-2 border rounded-lg bg-gray-50"
                        disabled />
                </div>
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
                    <input  type="text" v-model="lote" class="w-full p-2 border rounded-lg bg-gray-50" disabled />
                </div>
                <!-- Cantidad buena -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-white">
                        Cantidad 
                    </label>
                    <input disabled type="number" v-model="goodQuantity" ref="goodQuantityInput"
                        class="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-italia-red focus:border-italia-red"
                        placeholder="Ingrese cantidad" />
                </div>
            </div>    
        </main>

        <!-- Botones de acción -->
        <div class="p-4 grid grid-cols-2 gap-4  border border-gray-700 border-t-0 rounded-b-lg  bg-gray-700 ">
            <button @click="handleAccept"
                class="flex items-center justify-center gap-2 bg-italia-red text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700">
                <span class="material-icons">check</span>
                Liberar Picking 
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

        <!-- Popup de alertas generales -->
        <BasePopup 
            v-model="showBasePopup" 
            :title="popupTitle" 
            :message="popupMessage" 
            :type="popupType" 
            :action="popupAction"
            confirmText="Aceptar" 
            :showConfirm="true" 
            @confirm="handlePopupConfirm" 
            @update="handlePopupUpdate" 
        />

        <!-- Popup de Token de Autorización -->
        <PopupToken 
            v-model="showTokenPopup"
            @send-generated-token="handleSendTokenToWebhook"
            @token-validated="handleTokenValidated"
            @submit-success="handleSubmitSuccess"
            @submit-error="handleSubmitError"
        />

        <LoaderComponent v-if="isLoading" loadingText="cargando ..." />
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'

import Header from '../../components/Header.vue'
import ScanEtiqu from '../../components/ScanEtiqu.vue'  
import { UseDespachoStore } from '../../store/despachos';
import { useLoader } from '../../composables/useLoader';
import PopupForm from '../../components/PopupForm.vue';
import BasePopup from '../../components/BasePopup.vue';
import { InfoEntrega, InfoProduct } from '../../services/entregas';
import PopupToken from '../../components/PopupToken.vue';
import { useAuthStore } from '../../store/auth';
import { infoEstiba } from '../../services/product'
import { MessageService } from '../../services/mensajeria'

const userStore = useAuthStore();
const isManualMode = ref(false);
const handlePopupUpdate = ref(false);
const router = useRouter()
const route = useRoute()
const store = UseDespachoStore()
const isOpen = ref(false)
const isOpen2 = ref(false)
const { isLoading, loadingText, showLoader, hideLoader } = useLoader()

// Variables reactivas
const materialCode = ref('')
const materialDesc = ref('')
const materialName = ref('')
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
const materialDescInput = ref(null)
const otNumber = ref('')
const almacenWm = ref('')

// Estados para popups - SEPARADOS
const showBasePopup = ref(false);  // Para BasePopup
const showTokenPopup = ref(false); // Para PopupToken
const popupTitle = ref('');
const popupMessage = ref('');
const popupType = ref('');
const popupAction = ref('normal')
const showOrderModal = ref(false)
const titleModalOt = ref("Ingresar Orden y Ubicación")

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

// Función que maneja el envío al webhook
const handleSendTokenToWebhook = async (data) => {
    console.log('🟡 Enviando token al webhook:', data.token)
    const message = `🔐 el usuario ${userStore.nameUser} solicita el Token de Autorización para liberar Picking del pallet ${palletNumber.value} Token: ${data.token}`;
    
    try {
        let datax = JSON.stringify({
            "message": message,
            "param1": "AAAAu82EK2g",
            "key": "AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI",
            "token": "HUlMpAXPy3yN0Pm9kzDHRRxz-MsTV8bp5D-4YRrY9Lk"
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://lilix.ceramicaitalia.com:3001/mensajeria/google',
            headers: { 
                'Content-Type': 'application/json'
            },
            data: datax
        };

        const response = await axios.request(config)
        console.log('🟢 Token enviado exitosamente:', response.data);
        
        // Llamar al callback de éxito
        data.onSuccess(response.data)
        
    } catch (error) {
        console.error('🔴 Error enviando token:', error);
        // Llamar al callback de error
        data.onError(error)
    }

    try {
        const responsesms = await MessageService.sendSms("3162521573", message)
        console.log(responsesms)
    } catch (error) {
        console.error('🔴 Error enviar sms  token:', error);
    }

    //3162521573
}

// Cuando el token se valida completamente
const handleTokenValidated = (data) => {
    console.log('🟢 Token validado exitosamente:', data)
   const response = infoEstiba.freePicking(palletNumber.value)
   console.log('🟢 Respuesta de liberar picking:', response)

}

const handleSubmitSuccess = (data) => {
    console.log('🟢 Proceso completado:', data)
}

const handleSubmitError = (error) => {
    console.error('🔴 Error en el proceso:', error)
}

// CAMBIO PRINCIPAL: Ahora abre el popup de token
const handleAccept = async () => {
    console.log('🔵 Abriendo popup de token...')
    showTokenPopup.value = true;  // Cambio aquí: usar showTokenPopup en lugar de showPopup
}

const handleScanChange = async (value) => {
    let scanner = scanValue.value;
    
    if (scanner.length == 0) {
        showBasePopup.value = true;  // Cambio aquí: usar showBasePopup
        popupTitle.value = 'Alerta'
        popupMessage.value = 'Scanear Etiqueta'
        popupType.value = 'warning'
    } else {
        showLoader('Cargando información...')
        divideEtiquetas(scanner, 'A');
        AsignaCampos()
        try {
            let infoPallet = await InfoEntrega.getIngresoMaterialInfo('P','',null,null, pallet.value)
            let infoPallet2 = await InfoProduct.GetInfoPallet(pallet.value, lote.value, material.value)
            materialDesc.value = infoPallet2.data.data.descripcion
            console.log(infoPallet2.data.data.descripcion)      
            goodQuantity.value = infoPallet.data[0].Cantidad 
            isOpen.value = true 
        } catch (error) {
            goodQuantity.value = 0
            showBasePopup.value = true;  // Cambio aquí: usar showBasePopup
            popupTitle.value = 'Alerta'
            popupMessage.value = error.message
            popupType.value = 'error'
        } finally {
            vibrate();
            hideLoader()
        }
    }
}

const divideEtiquetas = (codigo, tipo) => {
    codigo = codigo.trim()
    material.value = codigo.slice(0, 18)        
    lote.value = codigo.slice(18, 28)          
    tipo === "A" ? pallet.value = codigo.slice(-10) : null
}

const AsignaCampos = () => {
    materialCode.value = material.value;
    palletNumber.value = pallet.value;
}

const handlePopupConfirm = () => {
    showBasePopup.value = false  // Cambio aquí: usar showBasePopup
}

const validaCampos = () => {
    if (materialCode.value !== infoPos.value[0].matnr || lote.value !== infoPos.value[0].charg) {
        showBasePopup.value = true;  // Cambio aquí: usar showBasePopup
        popupTitle.value = 'Alerta'
        popupMessage.value = 'la informacion de la etiqueta no es consistente con la posicion'
        popupType.value = 'warning'
        return false
    }
    isOpen.value = true
    goodQuantityInput.value?.focus()
    resetFields()
    return true
}

watch(scanValue, (newValue) => {
    scanValue.value = newValue.trim()
})
</script>