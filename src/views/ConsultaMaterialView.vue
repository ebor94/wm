<template>
    <div class="min-h-screen flex flex-col bg-slate-900">
      <!-- Header -->
      <header class="bg-slate-800 border-b border-slate-700 p-4">
      <h1 class="text-center text-white text-lg font-semibold">
        Consulta de Material
      </h1>
    </header>
  
      <main class="flex-1 p-4 flex flex-col space-y-4">
        <!-- Campo de búsqueda -->
        <div class="space-y-2">
          <label class="text-sm text-slate-100">Material a Consultar</label>
          <input
            v-model="materialBusqueda"
            type="text"
            placeholder="231038"
            class="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-lg placeholder-slate-500"
          />
        </div>
          <!-- Campo de filtrado de resultados -->
      <div v-if="materiales.length > 0" class="space-y-2">
        <label class="text-sm text-slate-100">Filtrar resultados por ubicación o lote</label>
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Filtrar por ubicación o lote..."
          class="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-lg placeholder-slate-500"
        />
      </div>
  
        <!-- Lista de Materiales -->
        <div class="grid grid-cols-1 gap-4 auto-rows-min">
          <div 
          v-for="material in filteredMateriales" 
          :key="material.ubicacion + material.lote"
          class="border border-slate-700 rounded-lg p-4 space-y-3 bg-slate-800"
        >
           
              <!-- Código de Material -->
              <h3 class="font-bold text-white">{{ material.matnr }}</h3>
              
              <!-- Descripción -->
              <p class="font-bold text-white">{{ material.name }}</p>
              
              <!-- Lote -->
              <div class="text-sm">
                <span class="font-bold text-white">Ubicacion : </span>
                <span class="font-bold text-white"> {{ material.ubicacion }} </span>
              </div>
               <!-- Lote -->
               <div class="text-sm">
                <span class="font-bold text-white">Lote : </span>
                <span class="font-bold text-white"> {{ material.lote }} </span>
              </div>
              
              <!-- Disponible -->
              <div class="text-sm">
                <span class="font-bold text-white">disponible : </span>
                <span class="font-bold text-white"> {{ material.disponible }} M²</span>
              </div>
              
              <!-- <div class="border-t my-2"></div> -->
          
          </div>
  
          <!-- Total Metros -->
          <div class="border border-slate-700 rounded-lg p-4 space-y-3 bg-slate-800">
            <div class="font-bold text-white flex justify-between items-center">
              <span>Total Metros:</span>
              <span>{{ totalMetros }}</span>
            </div>
          </div>
        </div>
  
        <!-- Botones -->
        <div class="grid grid-cols-2 gap-4 pt-4">
          <button 
            @click="consultarMaterial"
            class="flex items-center justify-center gap-2 bg-italia-red text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            <span class="material-icons">search</span>
            Consultar Material
          </button>
  
          <button 
            @click="volver"
            class="flex items-center justify-center gap-2 bg-slate-700 text-white py-3 px-6 rounded-full hover:bg-slate-600 transition-colors border border-slate-600"
          >
            <span class="material-icons">arrow_back</span>
            Volver
          </button>
        </div>
      </main>
      <LoaderComponent 
     v-if="isLoading"
     :loading-text="loadingText"
      />
    </div>
  </template>
  
  <script setup>
  import { ref,  computed  } from 'vue'
  import { useRouter } from 'vue-router'
  import { InfoWm } from '../services/entregas';
  import { useLoader } from '../composables/useLoader'

  const { isLoading, loadingText, showLoader, hideLoader } = useLoader()  
  const router = useRouter()
  const materialBusqueda = ref('231038')
  const totalMetros = ref(0)
  const searchTerm = ref('') // Para filtrar los resultados
  
  // Datos de ejemplo
  const materiales = ref([])
  
  // Funciones
  const consultarMaterial = async() => {  
    try {
      showLoader('Consultando  Material...')
      const infoMaterial = await InfoWm.GetInfoMaterialAvailable(materialBusqueda.value)
       materiales.value  = infoMaterial.data.data.datos
      totalMetros.value = infoMaterial.data.data.totalubica
      searchTerm.value = '' 
    } catch (error) {
      console.log(error)
    }finally{
      hideLoader();
    }
  }

const filteredMateriales = computed(() => {
  if (!searchTerm.value) return materiales.value
  
  const term = searchTerm.value.toLowerCase()
  return materiales.value.filter(item => 
    item.ubicacion.toLowerCase().includes(term) || 
    item.lote.toLowerCase().includes(term)
  )
})


  
  const volver = () => {
    router.back()
  }
  </script>
  
  <style scoped>
  /* Optimizaciones para dispositivos industriales */
  input, button {
    min-height: 44px;
    touch-action: manipulation;
  }
  
  /* Prevenir zoom en inputs */
  input {
    font-size: 16px;
  }
  
  /* Scroll suave */
  .overflow-auto {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
    max-height: calc(100vh - 300px);
  }
  
  /* Ajustes para mejor visibilidad */
  .material-icons {
    font-size: 20px;
  }
  
  /* Ajustes para la lista */
  .space-y-3 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
  }
  </style>