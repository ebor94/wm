<template>
    <div class="min-h-screen flex flex-col">
      <LoaderComponent 
      v-if="isLoading"
      loading-text="cargando ..."
    />
      <!-- Header Rojo -->
       <Header title=" Menú inicial" ></Header>

      <!-- Contenido Principal -->
      <main class="flex-1 bg-gray-800 p-4 flex flex-col">
        <!-- Nombre de Usuario y Mensaje -->
        <div class="bg-gray-300 rounded-lg p-3 mb-2 text-center">
          <div class="text-gray-700 font-bold">{{ authStore.nameUser || 'Usuario' }}</div>
          <div class="text-gray-700 font-bold">{{ authStore.almaceMM }}</div>
          <div class="text-gray-600">Por favor seleccione</div> <div class="mt-auto flex justify-center p-4">
          
        </div>
        </div>
  
        <!-- Grid de Botones -->
        <div class="grid grid-cols-2 gap-4">
          <button 
            v-for="(item, index) in menuItems" 
            :key="index"
            @click="handleMenuClick(item.action)"
            class="bg-white py-3 px-4 rounded-full text-gray-700 hover:bg-gray-100 text-sm font-medium shadow"
          >
            {{ item.title }}
          </button>
        </div>
  
        <!-- Botón de Cerrar Sesión -->
        <div class="mt-auto flex justify-center p-4">
          <button 
            @click="handleLogout"
            class="flex items-center space-x-2 bg-white rounded-full px-6 py-2 text-gray-700"
          >
            <span class="material-icons">logout</span>
            <span>Terminar Sesión</span>
          </button>          
        </div>
        <div class="flex justify-center">
          <button 
            @click="changeStore"
            class="bg-white rounded-full"
          >
            <span class="tiny material-icons">settings_applications</span>
           
          </button>
          
        </div>
      </main>
      <TrasladoModal
        :isOpen="isModalOpen" 
        @close="closeModal"
        @seleccionarAlmacen="handleSeleccionAlmacen"
       />
  
      <!-- Footer -->
      <footer class="bg-italia-red text-white p-2 text-center">
        Cerámica Italia ©2024
        
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref , onMounted} from 'vue'

   import { UseDespachoStore } from '../store/despachos'; 
  import { useRouter } from 'vue-router'
  import { useLoader } from '../composables/useLoader' 
  import { useAuthStore } from '../store/auth';
  import TrasladoModal from '../components/TrasladoModal.vue'
import Header from '../components/Header.vue';

 const authStore = useAuthStore()
 const despachosStore = UseDespachoStore()
  const { isLoading, loadingText, showLoader, hideLoader } = useLoader()
  const router = useRouter()
  const storeDespachos = UseDespachoStore()
  
  // Lista de opciones del menú
  const menuItems = [
    { title: 'Alistamiento', action: 'alistamiento' },
    { title: 'Cargue', action: 'cargue' },
    { title: 'Traslado ubicacion', action: 'traslado' },
    // { title: 'Traslado / Lotes', action: 'traslado-lotes' },
    { title: 'Consultar Ubicacion', action: 'consultar-ubicacion' },
    { title: 'OT Pendiente confirmar', action: 'ot-pendiente' },
    { title: 'Consultar material', action: 'consultar-material' },
    { title: 'Gestion Entrega', action: 'gestion-entrega' },
    { title: 'Indicador De Despacho', action: 'indicator' },
    { title: 'Validar Etiqueta', action: 'info-etiqueta' },
    {title: 'Traslado entre Almacenes', action:'traslado-almacenes'},
    {title: 'Liberar Picking', action:'freepicking'},
   // { title: 'Consultar Despacho', action: 'consultar-despacho' },
    { title: 'Ingreso De Mercancia', action: 'ingreso-mcia' },
    // { title: 'Legalizacion', action: 'legalizacion' },
  ]
  
  // Manejo de clicks en el menú
  const handleMenuClick = (action) => {
   try {
    showLoader("cargando...")
    if(action == 'gestion-entrega') {
      handleGestionEntrega();
      return
    }
    router.push(`/${action}`)
   } catch (error) {
    
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
  // Lógica adicional con el almacén seleccionado
}
  // Manejo de cierre de sesión
  const handleLogout =   () => {
    // Aquí implementaremos la lógica de cierre de sesión
    authStore.logout()
    despachosStore.resetStore()
    router.push('/')
  }

  const handleGestionEntrega = () => {
  window.location.href = 'http://ci.ceramicaitalia.com/transporte/Gestion/GestionEntrega.asp'
}

onMounted(async () => {
  await storeDespachos.fetchDespachos()
   hideLoader()
})
  </script>
  
  <style scoped>
  /* Ajustes específicos para el dispositivo Zebra */
  button {
    white-space: normal; /* Permite que el texto se ajuste en múltiples líneas */
    min-height: 44px; /* Altura mínima para mejor interacción táctil */
  }
  </style>