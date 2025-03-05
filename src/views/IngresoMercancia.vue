<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header - Reducido el padding -->
    <Header title="Ingreso De Mercancia"></Header>
    <!-- Main Content -->
    <main class="flex-1 p-2 bg-gray-800 text-white">
      <div class="max-w-lg mx-auto mt-2">
        <div class="mb-2">
          <label for="entrega" class="block text-sm font-medium mb-1">Número de Entrega</label>
          <div class="flex">
            <input type="text" id="entrega" v-model="entrega" @keyup.enter="consultarEntrega"
              placeholder="Ingrese número de entrega"
              class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button @click="consultarEntrega"
              class="ml-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
              Consultar
            </button>
          </div>
        </div>

        <!-- Mostrar información de la entrega cuando esté disponible -->
        <div v-if="entregaInfo" class="mt-4 p-4 bg-gray-700 rounded-md">
          <h4 class="text-xl text-center font-semibold mb-1">Información de la Entrega</h4>
          <CardListMaterial :entregaDetalles="entregaInfo" @material-selected="procesarSeleccion" />
        </div>


        <!-- Mostrar mensaje de carga -->
        <div v-if="loading" class="mt-4 text-center">
          <p>Cargando información...</p>
        </div>

        <!-- Mostrar error si ocurre -->
        <div v-if="error" class="mt-4 p-3 bg-red-900 text-white rounded-md">
          <p>{{ error }}</p>
        </div>

      </div>
    </main>
    <div class="p-4 grid grid-cols-2 gap-4  bg-gray-300">
      <button @click="goToMenu"
        class="bg-italia-red text-white py-3 px-6 rounded-full font-medium shadow-md hover:bg-red-700 active:bg-red-800">
        Volver al Menú
      </button>
    </div>
    <BasePopup v-model="showPopup" :title="popupTitle" :message="popupMessage" :type=popupType :action="popupAction"
      confirmText="Aceptar" :showConfirm="true" @confirm="handlePopupConfirm" @update="handlePopupUpdate" />

    <loader-component v-if="isLoading" loadingText="cargando ..." />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../components/Header.vue';
import { infoDespachos, InfoEntrega } from '../services/entregas';
import { UseDespachoStore } from '../store/despachos';
import { useLoader } from '../composables/useLoader';
import CardListMaterial from '../components/CardListMaterial.vue';
import BasePopup from '../components/BasePopup.vue';
// Estado reactivo
const entrega = ref('');
const entregaInfo = ref(null);
const entregaInfoAcum = ref(null);
const loading = ref(false);
const error = ref('');
const store = UseDespachoStore()
const router = useRouter()
const route = useRoute()

const { isLoading, loadingText, showLoader, hideLoader } = useLoader()
// Agregar estados para el popup
const showPopup = ref(false);
const popupTitle = ref('');
const popupMessage = ref('');
const popupType = ref('');
const popupAction = ref('normal')

const goToMenu = async () => {
  store.detalleEntregas = null;
  router.push('/menu')
};
// Función para consultar la entrega
const consultarEntrega = async () => {
  // Validar que se haya ingresado un número de entrega
  if (!entrega.value) {
    error.value = 'Por favor ingrese un número de entrega';    
      showPopup.value = true;
      popupTitle.value = 'Alerta'
      popupMessage.value = error.value
      popupType.value = 'error'
    return;
  }

  try {
    showLoader('Consultando entrega...');
    // Restablecer estados
    loading.value = true;
    error.value = '';
    entregaInfo.value = null;
    store.detalleEntregas = null;
    // Llamar al servicio para consultar la entrega
    const response = await InfoEntrega.getListMt(entrega.value);
    const responseAcum = await InfoEntrega.getIngresoMaterialInfo("L", entrega.value);
    console.log(response);
    // Actualizar el estado con la información recibida 0070334079
    if (response.data.mensaje == "OK") {
      let responseEntergaDtalle = await infoDespachos.getEntregaStatus(entrega.value)
      //console.log(responseEntergaDtalle.data.datos);
      entregaInfoAcum.value = responseAcum.data;
      entregaInfo.value = agregarAcumuladosPorPosnr(response.data.datos, entregaInfoAcum.value);

      entregaInfo.value.forEach(item => {
        const busquedaCjEstb = responseEntergaDtalle.data.datos.find(item2 =>
          item2.charg === item.charg &&
          item2.matnr === item.matnr &&
          item2.posnr === item.vgpos);
        if (busquedaCjEstb) {
          item.cantcj = busquedaCjEstb.cantcj;
          item.cantestb = busquedaCjEstb.cantestb;
        } else {
          // Si no hay coincidencia, podemos establecer valores por defecto  
          item.cantcj = 0;
          item.cantestb = 0;
        }
      });

      store.detalleEntregas = entregaInfo.value;
      // console.log(entregaInfo.value );

    } else {
      error.value = response.data.mensaje;
      showPopup.value = true;
      popupTitle.value = 'Alerta'
      popupMessage.value = error.value
      popupType.value = 'error'

    }

  } catch (err) {
    // Manejar errores
    error.value = err.response?.data?.message || 'Error al consultar la entrega. Intente nuevamente.';

    showPopup.value = true;
    popupTitle.value = 'Alerta'
    popupMessage.value = error.value
    popupType.value = 'error'
  } finally {
    // Finalizar carga
    hideLoader();
    loading.value = false;
  }
}

const procesarSeleccion = (materialInfo) => {
  //console.log('Material seleccionado:', materialInfo);
  router.push(`/ingreso-mcia-scan/${materialInfo.vbeln}/${materialInfo.posnr}/`)
  // Lógica adicional aquí
};

function agregarAcumuladosPorPosnr(inventarioArray, procesadosArray) {
  // Paso 1: Calcular las sumas acumuladas por Posnr del array de procesados
  const acumuladosPorPosnr = procesadosArray.reduce((acc, item) => {
    const posnr = item.Posnr;
    if (!acc[posnr]) {
      acc[posnr] = 0;
    }
    acc[posnr] += parseFloat(item.Cantidad);
    return acc;
  }, {});

  // Paso 2: Crear una copia profunda del array original para no modificarlo directamente
  const inventarioConAcumulados = JSON.parse(JSON.stringify(inventarioArray));
  // Paso 3: Agregar el campo de acumulados a cada elemento del inventario
  inventarioConAcumulados.forEach(item => {
    // Convertir el posnr a string para asegurar la comparación correcta
    const posnrComoString = item.posnr.toString();
    // Si hay acumulados para este Posnr, agregar el valor, sino 0
    item.cantidadAcumuladaProcesada = acumuladosPorPosnr[posnrComoString] || 0;
    // Opcionalmente, agregar un campo para calcular la diferencia
    item.diferenciaProcesada = item.lfimg - item.cantidadAcumuladaProcesada;
    // Opcionalmente, agregar un campo para el estado de procesamiento
    item.estadoProcesamiento = item.diferenciaProcesada <= 0 ? 'Completado' : 'Pendiente';
  });

  return inventarioConAcumulados;
}

onMounted(() => {
  // console.log('Componente montado');
  entregaInfo.value = store.detalleEntregas;
});

</script>
