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
              <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                <!-- Header del Modal -->
                <div class="bg-italia-red text-white px-4 py-3">
                  <DialogTitle as="h3" class="text-lg font-medium">
                    Pallets Pendiente de Traslado
                  </DialogTitle>
                </div>
  
                <!-- Contenido -->
                <div class="max-h-[70vh] overflow-auto">
                  <!-- Tabla -->
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50 sticky top-0">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pallet
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lote
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Material
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr 
                        v-for="pallet in palletsPendientes" 
                        :key="pallet.id"
                        class="hover:bg-gray-50"
                      >
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {{ pallet.pallet }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {{ pallet.lote }}
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-600">
                          {{ pallet.material }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
  
                <!-- Footer con botón de cerrar -->
                <div class="bg-gray-50 px-4 py-3 flex justify-end">
                  <button
                    @click="closeModal"
                    class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
                  >
                    <span class="material-icons">close</span>
                    <span>Cerrar</span>
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
  import { ref } from 'vue'
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
  
  const emit = defineEmits(['close'])
  
  // Datos de ejemplo para los pallets
  const palletsPendientes = ref([
    {
      id: 1,
      pallet: '000198558',
      lote: '0000015272',
      material: 'STELVIO TERRA 19.3X118.6 GB RECT'
    },
    {
      id: 2,
      pallet: '000198087',
      lote: '0000015972',
      material: 'LIBANO CAFE 19.3X118.6 PRIMERA DUAL RECT'
    },
    {
      id: 3,
      pallet: '000198096',
      lote: '0000015972',
      material: 'LIBANO CAFE 19.3X118.6 PRIMERA DUAL RECT'
    },
    {
      id: 4,
      pallet: '000198106',
      lote: '0000015972',
      material: 'LIBANO CAFE 19.3X118.6 PRIMERA DUAL RECT'
    },
    {
      id: 5,
      pallet: '000198113',
      lote: '0000015972',
      material: 'LIBANO CAFE 19.3X118.6 PRIMERA DUAL RECT'
    },
    {
      id: 6,
      pallet: '000198119',
      lote: '0000016007',
      material: 'MAGDALENA GRIS 60X60 PRIMERA EXC'
    },
    // ... más pallets
  ])
  
  const closeModal = () => {
    emit('close')
  }
  </script>
  
  <style scoped>
  /* Ajustes para mejor visibilidad en dispositivos industriales */
  .modal-content {
    -webkit-overflow-scrolling: touch;
  }
  
  /* Optimizaciones táctiles */
  button {
    min-height: 44px;
    touch-action: manipulation;
  }
  
  /* Ajustes de tabla para dispositivos móviles */
  td, th {
    touch-action: manipulation;
  }
  
  /* Estilizado de scroll */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #666;
  }
  </style>