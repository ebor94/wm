<template>
    <header class="bg-italia-red text-white p-2">
        <h1 class="text-center text-lg font-bold">{{ title }} </h1>
        <h5 class="text-center text-lg font-bold">{{ valorAcumulado }} / {{ valorMaximo }}  => {{ valorprocentual }} %  </h5>
    </header>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../store/auth';
import { infoDespachos } from '../services/entregas';
const store = useAuthStore();
const valorMaximo = ref(0);
  const valorAcumulado = ref(0);
  
  const valorprocentual = computed(() =>
    Number(((valorAcumulado.value * 100) / valorMaximo.value).toFixed(2)  ) 
  ) ;
const props = defineProps({
    title: { type: String, required: true }
});

onMounted(async() => {
    try {
      const response = await infoDespachos.indicadorDespacho(store.ptoExpedicion);
      const indicador = response.data.data;
      
      if (indicador?.[1]?.metros) valorMaximo.value = indicador[1].metros;
      if (indicador?.[0]?.metros) valorAcumulado.value = indicador[0].metros;
      
    } catch (error) {
      console.error('Error en indicadorDespacho:', error);
    }
});

</script>