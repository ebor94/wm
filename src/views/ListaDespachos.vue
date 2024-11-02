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
          <div v-for="(despacho, index) in despachos" :key="index" class="space-y-2">
            <!-- Botón Collapse -->
            <button 
              class="w-full bg-white rounded-full p-3 text-left flex items-center gap-2"
              @click="toggleDespacho(despacho.id)"
            >
              <span class="material-icons">
                {{ expandedDespachos.includes(despacho.id) ? 'expand_less' : 'expand_more' }}
              </span>
              {{ despacho.numero }}
            </button>
  
            <!-- Contenido Collapse -->
            <div 
              v-show="expandedDespachos.includes(despacho.id)"
              class="bg-white rounded-lg p-4 mx-4 space-y-3"
            >
              <button 
                class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="handleGestionEntrega(despacho.id)"
              >
              [ENTREGA FACTURADA]
              </button>
              <button 
                class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="handleGestionEntrega(despacho.id)"
              >
                Gestion Entrega
              </button>
              <button 
                class="w-full text-center text-blue-500 border-t border-gray-200 pt-2"
                @click="handleVerOrden(despacho.id)"
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
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const expandedDespachos = ref([])
  
  // Datos de ejemplo - esto normalmente vendría de una API
  const despachos = ref([
    {
      id: 2,
      numero: '0013803T/2024-11-02T13:59:59.000Z',
      pedido: '60617873',
      estado: 'ENTREGA FACTURADA'
    },
    {
      id: 3,
      numero: '0013817O/2024-11-05T18:00:00.000Z',
      pedido: '12345678',
      estado: 'ENTREGA FACTURADA'
    }
  ])
  
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