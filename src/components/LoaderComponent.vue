<template>
  <div 
    v-if="loading" 
    class="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center"
  >
    <div class="relative">
      <!-- Logo animado -->
      <svg width="80" height="80" viewBox="0 0 100 100">
        <!-- Rombo exterior -->
        <g class="logo-container">
          <path 
            d="M50 10 L90 50 L50 90 L10 50 Z" 
            fill="none" 
            stroke="#EE1D23" 
            stroke-width="4"
            stroke-linejoin="round"
            class="logo-outline"
          />
          
          <!-- Líneas divisorias internas -->
          <line 
            x1="50" 
            y1="10" 
            x2="50" 
            y2="90" 
            stroke="#EE1D23" 
            stroke-width="3"
            stroke-linecap="round"
            class="line-vertical"
          />
          <line 
            x1="10" 
            y1="50" 
            x2="90" 
            y2="50" 
            stroke="#EE1D23" 
            stroke-width="3"
            stroke-linecap="round"
            class="line-horizontal"
          />
          
          <!-- Rombo central -->
          <path 
            d="M50 30 L70 50 L50 70 L30 50 Z" 
            fill="#EE1D23"
            stroke="#EE1D23"
            stroke-width="2"
            stroke-linejoin="round"
            class="diamond"
          />
        </g>
      </svg>
      
      <!-- Spinner circular -->
      <div class="spinner"></div>
    </div>

    <!-- Texto de carga -->
    <div class="mt-4 text-gray-600 font-medium tracking-wider">
      {{ loadingText }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: true
  },
  loadingText: {
    type: String,
    default: 'Cargando...'
  }
})
</script>

<style scoped>
.logo-container {
  transform-origin: center;
  animation: pulse 2s infinite ease-in-out;
}

.logo-outline {
  stroke-dasharray: 320;
  stroke-dashoffset: 320;
  animation: drawRhombus 3s infinite;
  filter: drop-shadow(0 0 1px rgba(238, 29, 35, 0.3));
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  margin: -50px 0 0 -50px;
  border: 3px solid rgba(238, 29, 35, 0.1);
  border-top: 3px solid #EE1D23;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.line-vertical {
  animation: drawLineVertical 2s infinite;
  transform-origin: center;
}

.line-horizontal {
  animation: drawLineHorizontal 2s infinite;
  transform-origin: center;
}

.diamond {
  animation: pulseDiamond 2s infinite;
  transform-origin: center;
}


@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes drawRhombus {
  0% {
    stroke-dashoffset: 320;
  }
  50% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 320;
  }
}

@keyframes drawLineVertical {
  0%, 100% {
    transform: scaleY(0);
  }
  50% {
    transform: scaleY(1);
  }
}

@keyframes drawLineHorizontal {
  0%, 100% {
    transform: scaleX(0);
  }
  50% {
    transform: scaleX(1);
  }
}

@keyframes pulseDiamond {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>