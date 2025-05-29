<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <LoaderComponent 
      v-if="isLoading"
      loading-text="Cargando menú..."
    />
    


    <Header title="📱 Menú Principal"></Header>

    <!-- Contenido Principal -->
    <main class="flex-1 p-6 flex flex-col space-y-6">
      <!-- Tarjeta de Usuario con animación -->
      <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 transform hover:scale-105 transition-all duration-300">
        <div class="text-center space-y-2">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-3 shadow-lg">
            <span class="text-white text-2xl font-bold">
              {{ getUserInitials(authStore.nameUser) }}
            </span>
          </div>
          <div class="text-gray-800 font-bold text-lg">
            {{ authStore.nameUser || 'Usuario' }}
          </div>
          <div class="flex items-center justify-center space-x-2 text-gray-600">
            <span class="material-icons text-sm">location_on</span>
            <span class="font-medium">{{ authStore.almaceMM }}</span>
          </div>
          <div class="text-gray-500 text-sm">Selecciona una opción</div>
        </div>
      </div>

      <!-- Grid de Menús con iconos y animaciones -->
      <div class="grid grid-cols-2 gap-4 flex-1">
        <button 
          v-for="(item, index) in menuItems" 
          :key="index"
          @click="handleMenuClick(item.action)"
          class="group bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-2xl border border-white/30 hover:border-blue-300 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 active:scale-95"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <div class="flex flex-col items-center space-y-3 h-full justify-center">
            <!-- Icono dinámico con estilos inline -->
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
              :style="getIconStyle(item.action)">
              <span class="material-icons text-white text-xl">
                {{ getMenuIcon(item.action) }}
              </span>
            </div>
            <!-- Título del menú -->
            <span class="text-gray-700 font-medium text-sm text-center leading-tight group-hover:text-gray-900 transition-colors duration-300">
              {{ item.title }}
            </span>
          </div>
          <!-- Efecto de ripple -->
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
        </button>
      </div>

      <!-- Botones de acción con mejor diseño -->
      <div class="space-y-4 mt-auto">
        <!-- Botón de configuración -->
        <div class="flex justify-center">
          <button 
            @click="changeStore"
            class="group bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg hover:shadow-xl border border-white/30 hover:border-gray-400 transition-all duration-300 hover:scale-110"
          >
            <span class="material-icons text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
              settings_applications
            </span>
          </button>
        </div>

        <!-- Botón de cerrar sesión -->
        <div class="flex justify-center">
          <button 
            @click="handleLogout"
            class="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <div class="flex items-center space-x-3">
              <span class="material-icons text-white">logout</span>
              <span class="text-white font-medium">Cerrar Sesión</span>
            </div>
          </button>
        </div>
      </div>
    </main>

    <!-- Modal mejorado -->
    <TrasladoModal
      :isOpen="isModalOpen" 
      @close="closeModal"
      @seleccionarAlmacen="handleSeleccionAlmacen"
    />

    <!-- Footer con gradiente -->
    <footer class="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 text-center shadow-2xl">
      <div class="flex items-center justify-center space-x-2">
        <span class="material-icons text-sm">copyright</span>
        <span class="text-sm font-medium">Cerámica Italia 2024</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { UseDespachoStore } from '../store/despachos'
import { useRouter } from 'vue-router'
import { useLoader } from '../composables/useLoader'
import { useAuthStore } from '../store/auth'
import { useMenuAPI } from '../composables/useMenuAPI'
import TrasladoModal from '../components/TrasladoModal.vue'
import Header from '../components/Header.vue'

const authStore = useAuthStore()
const despachosStore = UseDespachoStore()
const { isLoading, loadingText, showLoader, hideLoader } = useLoader()
const { 
  menus: menuItems, 
  fetchUserMenus, 
  getMenuIcon, 
  getDefaultMenus,
  hasError 
} = useMenuAPI()
const router = useRouter()
const storeDespachos = UseDespachoStore()

// Función para obtener iniciales del usuario
const getUserInitials = (name) => {
  if (!name) return 'U'
  const words = name.split(' ')
  if (words.length === 1) return words[0].charAt(0).toUpperCase()
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
}


// Función para obtener el estilo del icono de manera segura
const getIconStyle = (action) => {
  const colorMap = {
    'alistamiento': { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    'cargue': { background: 'linear-gradient(135deg, #10b981, #059669)' },
    'traslado': { background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    'consultar-ubicacion': { background: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    'ot-pendiente': { background: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    'consultar-material': { background: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
    'gestion-entrega': { background: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
    'indicator': { background: 'linear-gradient(135deg, #ec4899, #db2777)' },
    'info-etiqueta': { background: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
    'traslado-almacenes': { background: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    'freepicking': { background: 'linear-gradient(135deg, #84cc16, #65a30d)' },
    'ingreso-mcia': { background: 'linear-gradient(135deg, #10b981, #059669)' }
  }
  return colorMap[action] || { background: 'linear-gradient(135deg, #6b7280, #4b5563)' }
}
const loadUserMenus = async () => {
  try {
    showLoader("Cargando menús...")
    const userCode = authStore.userCode || authStore.user?.usercode
    
    if (userCode) {
      await fetchUserMenus(userCode)
    } else {
      // Si no hay usercode, usar menús por defecto
      menuItems.value = getDefaultMenus()
      console.warn('No se encontró usercode, usando menús por defecto')
    }
  } catch (error) {
    console.error('Error al cargar menús:', error)
    // En caso de error, usar menús por defecto
    menuItems.value = getDefaultMenus()
  } finally {
    hideLoader()
  }
}

// Manejo de clicks en el menú
const handleMenuClick = (action) => {
  try {
    showLoader("Cargando...")
    if (action === 'gestion-entrega') {
      handleGestionEntrega()
      return
    }
    router.push(`/${action}`)
  } catch (error) {
    console.error('Error al navegar:', error)
    hideLoader()
  }
}

const isModalOpen = ref(false)
const almacenActual = ref(localStorage.getItem('almacen') || '')

const changeStore = () => {
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleSeleccionAlmacen = (almacenId) => {
  console.log(`Almacén seleccionado: ${almacenId}`)
  localStorage.setItem('almacen', almacenId)
  authStore.almaceMM = almacenId
  almacenActual.value = almacenId
}

const handleLogout = () => {
  authStore.logout()
  despachosStore.resetStore()
  router.push('/')
}

const handleGestionEntrega = () => {
  window.location.href = 'http://ci.ceramicaitalia.com/transporte/Gestion/GestionEntrega.asp'
}

onMounted(async () => {
  await storeDespachos.fetchDespachos()
  await loadUserMenus() // Cargar menús dinámicos
  hideLoader()
})
</script>

<style scoped>
/* Animación de entrada para los botones */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > button {
  animation: slideInUp 0.6s ease-out both;
}

/* Mejoras específicas para dispositivos táctiles */
button {
  white-space: normal;
  min-height: 44px;
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

/* Efecto glassmorphism */
.bg-white\/90 {
  background-color: rgba(255, 255, 255, 0.9);
}

.bg-white\/95 {
  background-color: rgba(255, 255, 255, 0.95);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Scroll suave en dispositivos móviles */
* {
  -webkit-overflow-scrolling: touch;
}

/* Mejoras para Material Icons */
.material-icons {
  user-select: none;
  -webkit-user-select: none;
}

/* Animación de pulso para el botón de configuración */
.group:hover span.material-icons {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>