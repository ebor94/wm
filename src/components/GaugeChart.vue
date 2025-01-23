// GaugeChart.vue

<template>
  <div class="w-full h-auto relative"> 
    <canvas ref="chartCanvas" class="w-full h-full max-w-[200px] max-h-[200px] mx-auto" />
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
      <p class="text-lg font-bold">{{ formattedPercentage }}</p> 
   
    </div>
    <p class="text-center text-lg font-bold text-center text-sm text-gray-500">
         Requerido: {{ max }} | Despachado Dia: {{ acumulado }}
      </p>
  </div>
  
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { Chart, ArcElement, DoughnutController } from 'chart.js/auto';

Chart.register(ArcElement, DoughnutController);

const props = defineProps({
  percentage: { type: Number, required: true },
  color: { type: String, default: '#FF0000'},
  backgroundColor: { type: String, default: '#C4C4C4' },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  acumulado: { type: Number, required: true }
});

const chartCanvas = ref(null);
let gaugeChart = null;

const data = computed(() => ({
  datasets: [{
    data: [props.percentage, 100 - props.percentage],
    backgroundColor: [props.color, props.backgroundColor],
    borderWidth: 0,
    cutout: '50%'
  }]
}));

const formattedPercentage = computed(() => `${props.percentage}%`);

const renderChart = () => {
  const ctx = chartCanvas.value.getContext('2d');
  gaugeChart = new Chart(ctx, {
    type: 'doughnut',
    data: data.value,
    options: {
      aspectRatio: 1,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });
};

onMounted(renderChart);

watch(
  [() => props.percentage, () => props.color],
  () => {
    if (gaugeChart) {
      gaugeChart.data.datasets[0].data = [props.percentage, 100 - props.percentage];
      gaugeChart.data.datasets[0].backgroundColor = [props.color, props.backgroundColor];
      gaugeChart.update();
    }
  }
);

defineExpose({
  chartCanvas,
  formattedPercentage,
  min: props.min,
  max: props.max,
  acumulado: props.acumulado
});
</script>