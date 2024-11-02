<template>
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="bg-italia-red text-white p-4 text-center font-bold text-lg">
        .:. Traslado .:.
      </header>
  
      <!-- Main Content -->
      <main class="flex-1 bg-gray-800 p-4 flex flex-col space-y-4">
        <!-- Formulario -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Lectura -->
          <div>
            <label class="text-gray-300 text-sm mb-1 block">Lectura</label>
            <input
              v-model="formData.lectura"
              type="text"
              placeholder="Valor de etiqueta"
              class="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-italia-red focus:border-italia-red"
            />
          </div>
  
          <!-- Cantidad buena -->
          <div>
            <label class="text-gray-300 text-sm mb-1 block">Cantidad buena</label>
            <input
              v-model="formData.cantidadBuena"
              type="number"
              placeholder="Cant. buena"
              class="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-italia-red focus:border-italia-red"
            />
          </div>
  
          <!-- Ubicación Origen -->
          <div>
            <label class="text-gray-300 text-sm mb-1 block">Ubicación Origen</label>
            <select
              v-model="formData.ubicacionOrigen"
              class="w-full bg-white text-gray-800 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-italia-red focus:border-italia-red"
            >
              <option value="" disabled selected>Seleccione Ubicación Origen</option>
              <option v-for="ubicacion in ubicaciones" :key="ubicacion.id" :value="ubicacion.id">
                {{ ubicacion.nombre }}
              </option>
            </select>
          </div>
  
          <!-- Ubicación Destino -->
          <div>
            <label class="text-gray-300 text-sm mb-1 block">Ubicación Destino</label>
            <input
              v-model="formData.ubicacionDestino"
              type="text"
              placeholder="Ubicación Destino"
              class="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-italia-red focus:border-italia-red"
            />
          </div>
  
          <!-- Material -->
          <div>
            <label class="text-gray-300 text-sm mb-1 block">Material</label>
            <input
              v-model="formData.material"
              type="text"
              placeholder="Material"
              disabled
              class="w-full bg-gray-700 text-gray-400 p-3 rounded-lg border border-gray-600"
            />
          </div>
  
          <!-- Lote y Consecutivo Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-gray-300 text-sm mb-1 block">Lote</label>
              <input
                v-model="formData.lote"
                type="text"
                placeholder="Lote del material"
                disabled
                class="w-full bg-gray-700 text-gray-400 p-3 rounded-lg border border-gray-600"
              />
            </div>
            <div>
              <label class="text-gray-300 text-sm mb-1 block">Consecutivo estiba</label>
              <input
                v-model="formData.consecutivo"
                type="text"
                placeholder="Consecutivo estiba"
                disabled
                class="w-full bg-gray-700 text-gray-400 p-3 rounded-lg border border-gray-600"
              />
            </div>
          </div>
        </form>
      </main>
  
      <!-- Bottom Buttons -->
      <div class="p-4 grid grid-cols-2 gap-4 bg-gray-900">
        <button 
          @click="handleAccept"
          class="flex items-center justify-center gap-2 bg-italia-red text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700"
        >
          <span class="material-icons">check</span>
          Aceptar
        </button>
        <button 
          @click="goToMenu"
          class="flex items-center justify-center gap-2 bg-gray-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600"
        >
          <span class="material-icons">menu</span>
          Ir menú
        </button>
      </div>
  
      <!-- Footer -->
      <footer class="bg-italia-red text-white p-2 text-center text-sm">
        Cerámica Italia ©2024
      </footer>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  // Datos del formulario
  const formData = ref({
    lectura: '',
    cantidadBuena: '',
    ubicacionOrigen: '',
    ubicacionDestino: '',
    material: '',
    lote: '',
    consecutivo: ''
  })
  
  // Lista de ubicaciones (ejemplo)
  const ubicaciones = ref([
    { id: 1, nombre: 'Almacén Principal' },
    { id: 2, nombre: 'Zona de Picking' },
    { id: 3, nombre: 'Bodega A' },
    { id: 4, nombre: 'Bodega B' },
    { id: 5, nombre: 'Zona de Despacho' }
  ])
  
  // Funciones
  const handleAccept = () => {
    console.log('Procesando traslado:', formData.value)
    // Aquí implementar la lógica de traslado
  }
  
  const handleSubmit = () => {
    handleAccept()
  }
  
  const goToMenu = () => {
    router.push('/menu')
  }
  </script>
  
  <style scoped>
  /* Optimizaciones para dispositivos industriales */
  input, select, button {
    min-height: 44px;
    touch-action: manipulation;
  }
  
  /* Prevenir zoom en inputs */
  input, select {
    font-size: 16px;
  }
  
  /* Ajustes para mejor visibilidad en ambientes industriales */
  .material-icons {
    font-size: 20px;
  }
  
  /* Ajustes para campos deshabilitados */
  input:disabled {
    opacity: 0.7;
  }
  
  /* Asegurar contraste adecuado */
  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
  }
  </style>