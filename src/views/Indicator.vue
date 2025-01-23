<template>
    <div class="min-h-screen flex flex-col bg-gray-800">
        <Header title="Indicador de Despacho" ></Header>
    
      <main class="flex-1 p-2 bg-gray-800 text-white">
        <GaugeChart
          :percentage="valorprocentual"
          :color="gaugeColor"
          :min="0"
          :max="valorMaximo"
          :acumulado="valorAcumulado"
        />
      </main>
      <button @click="goToMenu"
        class="flex items-center justify-center gap-2 bg-gray-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600">
        <span class="material-icons">menu</span>
        Ir menú
      </button>
      <footer class="bg-italia-red text-white p-2 text-center text-sm">
      Cerámica Italia ©2024
    </footer>
    </div>

  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../store/auth';
  import { infoDespachos } from '../services/entregas';
  import GaugeChart from '../components/GaugeChart.vue';
import Header from '../components/Header.vue';
  
  const store = useAuthStore();
  const router = useRouter()
  const valorMaximo = ref(0);
  const valorAcumulado = ref(0);
  
  const valorprocentual = computed(() =>
    Number(((valorAcumulado.value * 100) / valorMaximo.value).toFixed(2)  ) 
  ) ;
  const goToMenu = () => {   
  router.push('/menu')
}
  
  const gaugeColor = computed(() => {
  const percent = (valorprocentual.value / 100);
  const red = Math.round(255 * (1 - percent))
  const green = Math.round(255 * percent);
  return `rgb(${red}, ${green}, 0)`;
});
  
  onMounted(async () => {
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