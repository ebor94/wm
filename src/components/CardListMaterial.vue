<template>
    <div class="container mx-auto p-4">
      <div v-if="entregaDetalles && entregaDetalles.length > 0">
        <div v-for="material in entregaDetalles" :key="material.tapos"
          class="bg-white rounded-lg shadow-lg overflow-hidden mb-4"
          @click="handleMaterialClick(material.vbeln ,material.posnr)">
          <!-- Código de producto -->
          <div
            :class="[material.lfimg === material.cantidadAcumuladaProcesada ? 'bg-green-600' : 'bg-red-600', 'text-white p-2 font-bold']">
            {{ material.vlpla }}
          </div>
          <!-- Detalles del producto -->
          <div class="p-4 space-y-3">
            <!-- Nombre del producto -->
            <div class="text-gray-800 font-semibold">
              {{ material.matnr }}
            </div>
            <div class="text-gray-800 font-semibold">
              {{ material.arktx }}
            </div>
            <!-- Lote -->
            <div class="text-gray-700 text-sm">
              <span class="font-medium">Lote:</span> {{ material.charg }}
            </div>
            <!-- Medidas -->
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="text-gray-700" v-if="material.cantidadAcumuladaProcesada !== undefined">
                {{ material.cantidadAcumuladaProcesada }} / {{ material.lfimg }}
              </div>
              <div v-else class="text-gray-700">
                Cargando...
              </div>
              <div class="text-gray-700">
                <span class="font-medium">pos:</span> {{ material.posnr }} / {{ material.vgpos }}
              </div>
            </div>
            <!-- Cantidad -->
            <div class="text-gray-700 text-sm border-t pt-2"  v-if=" material.cantestb !== 0 ||  material.cantestb !== undefined">
              <span class="font-medium">{{ material.cantcj }}</span> cajas / {{ material.cantestb }} estibas
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    entregaDetalles: {
      type: Array,
      required: true,
      default: () => []
    }
  });
  
  const emit = defineEmits(['material-selected']);
  
  const handleMaterialClick = (vbeln,posnr) => {
    emit('material-selected', {
      vbeln,posnr
    });
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
  }
  </style>