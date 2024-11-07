<template>
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="bg-italia-red text-white p-4 text-center font-bold">
        Toma de Picking
      </header>
  
      <!-- Main Content -->
      <main class="flex-1 bg-gray-800 p-4 flex flex-col gap-4">
        <!-- Título -->
        <div class="bg-gray-300 rounded-lg p-3 text-center text-gray-700">
          Listado Despachos Para Alistamiento
        </div>
  
        <!-- Lista de Despachos -->
        <div class="space-y-4">
          <div  v-for="despacho in store.despachos" :key="despacho.Despacho_no || 'null'" class="space-y-2">
         
            <!-- Botón Collapse -->
            <button 
              class="w-full bg-white rounded-full p-3 text-left flex items-center gap-2"
              @click="toggleDespacho(despacho.Despacho_no)"
            >
              <span class="material-icons">
                {{ expandedDespachos.includes(despacho.Despacho_no) ? 'expand_less' : 'expand_more' }}
              </span>
              {{ despacho.Despacho_no || 'prioridad' }} / {{ despacho.Fecha_Requerida || 'sin fecha de despacho' }}
            </button>
  
            <!-- Contenido Collapse -->
            <div 
              v-show="expandedDespachos.includes(despacho.Despacho_no)"
              v-for="orden in despacho.ordenes" :key="orden.entrega" 
              class="bg-white rounded-lg p-4 mx-4 space-y-3 items-center"
            >
            <label class="w-full text-center text-blue-800 border-t border-gray-200 pt-2">{{ orden.entrega }} / {{ orden.cte }}</label>
              <button 
                class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="handleGestionEntrega(orden.entrega)"
              >
              [ENTREGA FACTURADA]
              </button>
              <button 
                class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="handleGestionEntrega(orden.entrega)"
              >
                Gestion Entrega
              </button>
              <button 
                class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="handleVerOrden(orden.entrega)"
              >
                Ver Orden de Transporte
              </button>
            </div>
          </div>
        </div>
  
        <!-- Botón Ir al Menú -->
        <button 
          @click="goToMenu"
          class="bg-white rounded-full p-3 text-center mt-auto"
        >
          Ir menú
        </button>
      </main>
  
      <!-- Footer -->
      <footer class="bg-italia-red text-white p-2 text-center">
        Cerámica Italia ©2024
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref ,onMounted} from 'vue'
  import { UseDespachoStore } from '../store/despachos'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const expandedDespachos = ref([])
  const store = UseDespachoStore() 

  
  // Funciones
  const toggleDespacho = (id) => {
    const index = expandedDespachos.value.indexOf(id)
    if (index === -1) {
      expandedDespachos.value.push(id)
    } else {
      expandedDespachos.value.splice(index, 1)
    }
  }
  
  const handleGestionEntrega = (id) => {
  router.push(`/entrega/${id}`)
}
  
const handleVerOrden = (id) => {
  router.push(`/orden-transporte/${id}`)
}
  
  const goToMenu = () => {
    router.push('/menu')
  }



  </script>
  
  <style scoped>
  .material-icons {
    font-size: 1.5rem;
  }
  
  /* Animación para el collapse */
  .collapse-enter-active,
  .collapse-leave-active {
    transition: max-height 0.3s ease-out;
  }
  
  .collapse-enter-from,
  .collapse-leave-to {
    max-height: 0;
    overflow: hidden;
  }
  
  /* Ajustes para dispositivo Zebra */
  button {
    min-height: 44px;
    touch-action: manipulation;
  }
  </style>