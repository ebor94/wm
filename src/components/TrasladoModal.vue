<template>
  <!-- Modal/Popup -->
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <!-- Fondo oscuro -->
      <TransitionChild
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <!-- Modal Container -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
              <!-- Header del Modal -->
              <div class="bg-italia-red text-white px-4 py-3">
                <DialogTitle as="h3" class="text-lg font-medium">
                  Selección de Almacén
                </DialogTitle>
              </div>

              <!-- Contenido -->
              <div class="p-6 space-y-6">
                <!-- Campos de información -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Centro Actual
                    </label>
                    <div class="bg-gray-100 p-3 rounded-md text-gray-800">
                      {{ centroActual }}
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Almacén Actual
                    </label>
                    <div class="bg-gray-100 p-3 rounded-md text-gray-800">
                      {{ almacenActual }}
                    </div>
                  </div>
                  
                  <div>
                    <label for="almacenDestino" class="block text-sm font-medium text-gray-700 mb-1">
                      Almacén a Trabajar
                    </label>
                    <select
                      id="almacenDestino"
                      v-model="almacenSeleccionado"
                      class="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-italia-red focus:border-italia-red"
                    >
                        <option value="" disabled>Seleccione Almacen Destino</option>
                  <option v-for="almacen in almacenesDestino" :key="almacen.id" :value="almacen.id">
                    {{ almacen.id }} ==> {{ almacen.warehouseNumber }}
                  </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Footer con botones -->
              <div class="bg-gray-50 px-4 py-3 flex justify-end space-x-3">
                <button
                  @click="closeModal"
                  class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
                >
                  <span>Cancelar</span>
                </button>
                <button
                  @click="confirmarSeleccion"
                  class="bg-italia-red text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
                  :disabled="!almacenSeleccionado"
                >
                  <span>Confirmar</span>
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { InfoWm } from '../services/entregas';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close', 'seleccionarAlmacen'])

// Datos de ejemplo
const centroActual = ref(localStorage.getItem('centro'))
const almacenActual = ref(localStorage.getItem('almacen'))
const almacenSeleccionado = ref('')

// Opciones de almacenes
const almacenesDestino = ref([])

const closeModal = () => {
  almacenSeleccionado.value = ''
  emit('close')
}

const confirmarSeleccion = () => {
  if (almacenSeleccionado.value) {
    emit('seleccionarAlmacen', almacenSeleccionado.value)
    closeModal()
  }
}

async function GetInfoStores(centro, onSuccess = null, onError = null) {
  try {
    // Llamar a la función existente para obtener info de almacenes
    const response = await InfoWm.GetInfoStores(centro);

    // Validar la respuesta
    const validation = validateWarehouseResponse(response);

    if (validation.isValid) {
      // console.log(`Se encontraron ${validation.count} almacenes para el centro ${centro}`);

      // Procesar los datos para un formato más útil
      const processedStores = validation.warehouses.map(store => {
        return {
          id: store.lgort,
          warehouseNumber: store.lgnum,
          center: store.werks,
          // Puedes incluir otros campos según necesites
        };
      });

      // Ejecutar callback de éxito si se proporcionó
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(processedStores);
      }

      return processedStores;
    } else {
      const errorMsg = `Error al validar la información de almacenes: ${validation.message}`;
      console.error(errorMsg);

      // Ejecutar callback de error si se proporcionó
      if (onError && typeof onError === 'function') {
        onError(new Error(errorMsg));
      }

      return null;
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || 'Error desconocido';
    console.error('Error en GetInfoStores:', errorMsg);

    // Ejecutar callback de error si se proporcionó
    if (onError && typeof onError === 'function') {
      onError(error);
    }

    return null;
  }
}
function validateWarehouseResponse(response) {
  // Check if response has the expected structure
  if (!response || !response.data) {
    return { isValid: false, message: 'Respuesta inválida: no hay datos' };
  }

  // Check if success property is true
  if (response.data.success !== true) {
    return { isValid: false, message: 'Respuesta inválida: success no es true' };
  }

  // Check if data array exists and has items
  if (!Array.isArray(response.data.data) || response.data.data.length === 0) {
    return { isValid: false, message: 'Respuesta inválida: no hay almacenes en la respuesta' };
  }

  // Validate each warehouse entry has required fields
  const requiredFields = ['mandt', 'werks', 'lgort', 'lgnum'];
  for (const warehouse of response.data.data) {
    for (const field of requiredFields) {
      if (typeof warehouse[field] === 'undefined') {
        return {
          isValid: false,
          message: `Respuesta inválida: falta el campo requerido '${field}' en uno de los almacenes`
        };
      }
    }
  }

  return {
    isValid: true,
    message: 'Respuesta válida',
    warehouses: response.data.data,
    count: response.data.data.length
  };
}

onMounted(async () => {
  // Obtener el centro actual desde localStorage
  const centro = localStorage.getItem('centro') || '';
  await GetInfoStores(centro).then(stores => {
    if (stores) {
      almacenesDestino.value = stores
      //console.log(almacenesDestino);
    }
  });
});

</script>

<style scoped>
/* Optimizaciones táctiles */
button {
  min-height: 44px;
  touch-action: manipulation;
}

select {
  min-height: 44px;
  touch-action: manipulation;
}
</style>