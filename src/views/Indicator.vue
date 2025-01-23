<template>
      <div class="min-h-screen flex flex-col bg-gray-800">
    <!-- Header -->
    <header class="bg-italia-red text-white p-2">
      <h1 class="text-center text-lg font-bold">
        Indicador de Despacho
      </h1>
    </header>
    <main class="flex-1 p-2 bg-gray-800 text-white">
    <GaugeChart 
    :percentage="valor"
    :min="0" 
    :max="100" 
    :acumulado="valorAcumulado" 
    />
</main>
</div>
  </template>


<script>
import { ref } from 'vue';
import GaugeChart from '../components/GaugeChart.vue';


export default {
  components: {
    GaugeChart,
  },
  setup() {
    const valor = ref(48);
    const valorAcumulado = ref(230); 
    // ...
    return { valor, valorAcumulado };
  },
};
</script>