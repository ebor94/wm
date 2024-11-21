<!-- components/ConnectionAlert.vue -->
<template>
    <Transition name="slide-down">
      <div v-if="!isOnline || checking" 
           :class="[
             'fixed top-0 left-0 right-0 z-50 shadow-lg',
             checking ? 'bg-yellow-500' : 'bg-red-500'
           ]">
        <!-- Barra de alerta -->
        <div class="container mx-auto px-4 py-3 flex items-center justify-between text-white">
          <div class="flex items-center space-x-2">
            <span class="material-icons">
              {{ checking ? 'sync' : 'wifi_off' }}
            </span>
            <span>{{ message }}</span>
          </div>
          <button 
            v-if="!checking"
            @click="checkConnection"
            class="bg-white px-4 py-1 rounded-full text-sm hover:bg-opacity-90 flex items-center space-x-1"
            :class="checking ? 'text-yellow-500' : 'text-red-500'"
          >
            <span class="material-icons text-sm">refresh</span>
            <span>Verificar conexión</span>
          </button>
        </div>
        
        <!-- Barra de progreso -->
        <div v-if="checking" 
             class="h-1 bg-yellow-400">
          <div class="h-full bg-white transition-all duration-300"
               :style="{ width: `${progress}%` }">
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useLoader } from '../composables/useLoader' // Asumiendo que tienes el composable del loader
  
  const { showLoader, hideLoader } = useLoader()
  const isOnline = ref(navigator.onLine)
  const checking = ref(false)
  const progress = ref(0)
  const message = ref(getStatusMessage(navigator.onLine))
  
  function getStatusMessage(online, checking = false) {
    if (checking) return 'Verificando conexión...'
    return online ? 'Conexión restaurada' : 'Sin conexión a Internet'
  }
  
  const updateOnlineStatus = () => {
    const wasOffline = !isOnline.value
    isOnline.value = navigator.onLine
    message.value = getStatusMessage(isOnline.value)
    
    if (isOnline.value && wasOffline) {
      showTemporaryMessage('Conexión restaurada', 'success')
    }
  }
  
  const showTemporaryMessage = (msg, type = 'info') => {
    message.value = msg
    setTimeout(() => {
      if (isOnline.value) {
        checking.value = false
        progress.value = 0
      }
    }, 2000)
  }
  
  const checkConnection = async () => {
    if (checking.value) return
    
    checking.value = true
    progress.value = 0
    message.value = 'Verificando conexión...'
    
    try {
      const progressInterval = setInterval(() => {
        progress.value = Math.min(progress.value + 15, 90)
      }, 200)
  
      // Intentar múltiples endpoints para mayor confiabilidad
      const endpoints = [
        'https://www.google.com/favicon.ico',
        'https://www.cloudflare.com/favicon.ico'
      ]
  
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000)
      })
  
      const fetchPromises = endpoints.map(url =>
        fetch(url, { mode: 'no-cors', cache: 'no-store' })
      )
  
      await Promise.race([
        Promise.any(fetchPromises),
        timeoutPromise
      ])
  
      clearInterval(progressInterval)
      progress.value = 100
      isOnline.value = true
      showTemporaryMessage('Conexión establecida correctamente')
      
    } catch (error) {
      progress.value = 100
      showTemporaryMessage('No se pudo establecer la conexión', 'error')
    } finally {
      setTimeout(() => {
        checking.value = false
        progress.value = 0
      }, 2000)
    }
  }
  
  // Verificar conexión inicial
  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    // Verificar conexión al montar el componente
    if (!navigator.onLine) {
      checkConnection()
    }
  })
  
  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  })
  </script>
  
  <style scoped>
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: all 0.3s ease;
  }
  
  .slide-down-enter-from,
  .slide-down-leave-to {
    transform: translateY(-100%);
    opacity: 0;
  }
  
  /* Animación del ícono de sync */
  .material-icons:contains('sync') {
    animation: spin 1.5s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  </style>