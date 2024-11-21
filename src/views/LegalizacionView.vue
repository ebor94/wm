<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header - Reducido el padding -->
    <header class="bg-gray-800 text-white p-2">
      <h1 class="text-center text-lg font-bold">
        LEGALIZACION
      </h1>
    </header>

    <!-- Main Content -->
    <main class="flex-1 p-2 bg-gray-800 text-white">
      <form @submit.prevent="handleSubmit" class="space-y-2">
        <!-- Etiqueta - Campo único de ancho completo -->
        <div class="w-full">
          <label class="text-xs font-bold text-white">Etiqueta</label>
          <input v-model="formData.etiqueta" type="text"
             class="w-full p-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm placeholder-slate-500" />
        </div>

        <!-- Grid de 2 columnas para el resto de campos -->
        <div class="grid grid-cols-2 gap-2">
          <!-- Código -->
          <div>
            <label class="text-xs font-bold text-white">Código</label>
            <input v-model="formData.codigo" type="text"
               class="w-full p-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm placeholder-slate-500" />
          </div>

          <!-- Lote -->
          <div>
            <label class="text-xs font-bold text-white">Lote</label>
            <input v-model="formData.lote" type="text"
               class="w-full p-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm placeholder-slate-500" />
          </div>

          <!-- Número de Estiba -->
          <div>
            <label class="text-xs font-bold text-white">Número de Estiba</label>
            <input v-model="formData.numeroEstiba" type="text"
               class="w-full p-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm placeholder-slate-500" />
          </div>

          <!-- Cantidad -->
          <div>
            <label class="text-xs font-bold text-white">Cantidad</label>
            <input v-model="formData.cantidad" type="number"
               class="w-full p-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm placeholder-slate-500" />
          </div>

          <!-- Centro -->
          <div>
            <label class="text-xs font-bold text-white">Centro</label>
            <input v-model="formData.centro" type="text"
               class="w-full p-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm placeholder-slate-500" />
          </div>

          <!-- Almacén -->
          <div>
            <label class="text-xs font-bold text-white">Almacén</label>
            <input v-model="formData.almacen" type="text"
               class="w-full p-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm placeholder-slate-500" />
          </div>

          <!-- Destino -->
          <div>
            <label class="text-xs font-bold text-white">Destino</label>
            <input v-model="formData.destino" type="text"
              class="w-full p-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm placeholder-slate-500" />
          </div>

          <!-- Calidad -->
          <div>
            <label class="text-xs font-bold text-white">Calidad</label>
            <input v-model="formData.calidad" type="text"
               class="w-full p-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm placeholder-slate-500" />
          </div>

          <!-- Peso -->
          <div>
            <label class="text-xs font-bold text-white">Peso</label>
            <input v-model="formData.peso" type="number"
               class="w-full p-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm placeholder-slate-500" />
          </div>

          <!-- Usuario -->
          <div>
            <label class="text-xs font-bold text-white">Usuario</label>
            <div class="relative">
              <input v-model="formData.usuario" type="text"
              class="w-full p-2 bg-slate-800 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-sm placeholder-slate-500"/>
              <span class="absolute right-2 top-1/2 transform -translate-y-1/2">
                <span class="material-icons text-gray-400 text-sm">person</span>
              </span>
            </div>
          </div>
        </div>
      </form>
    </main>

    <!-- Footer - Botones en grid -->
    <footer class="bg-slate-900 p-2 text-center text-xs">
      <div class="grid grid-cols-3 gap-2 mb-2">
        <button @click="handleRegistroAutomatico"
          class="bg-red-500 text-white p-2 rounded flex items-center justify-center space-x-1 hover:bg-red-600">
          <span class="material-icons text-sm">auto_mode</span>
          <span>Registro automático</span>
        </button>

        <button @click="handleConfirmarOrden"
          class="bg-gray-500 text-white p-2 rounded flex items-center justify-center space-x-1 hover:bg-green-600">
          <span class="material-icons text-sm">check_circle</span>
          <span>Confirmar Orden</span>
        </button>

        <button @click="handlePendienteTraslado"
          class="bg-blue-500 text-white p-2 rounded flex items-center justify-center space-x-1 hover:bg-blue-600">
          <span class="material-icons text-sm">pending</span>
          <span>Pendiente</span>
        </button>
      </div>
      <div class="text-white">
        Dirección T.I. - 2024 — Todos los derechos reservados
        <div class="text-right text-xs">V.2.1</div>
      </div>
    </footer>
    <TrasladoModal :isOpen="showTrasladoModal" @close="showTrasladoModal = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TrasladoModal from '../components/TrasladoModal.vue'

const showTrasladoModal = ref(false)
const router = useRouter()

const formData = ref({
  etiqueta: '', // Nuevo campo añadido
  codigo: '',
  lote: '',
  numeroEstiba: '',
  cantidad: '',
  centro: '',
  almacen: '',
  destino: '',
  calidad: '',
  peso: '',
  usuario: ''
})

const handleRegistroAutomatico = () => {
  console.log('Registro automático:', formData.value)
}

const handleConfirmarOrden = () => {
  console.log('Confirmando orden:', formData.value)
}

const handlePendienteTraslado = () => {
  showTrasladoModal.value = true
}

const handleSubmit = () => {
  console.log('Form submitted:', formData.value)
}
</script>

<style scoped>
/* Optimizaciones para dispositivos industriales */
input,
button {
  min-height: 36px;
  touch-action: manipulation;
}

/* Prevenir zoom en inputs */
input {
  font-size: 14px;
}

/* Transiciones suaves */
button {
  transition: background-color 0.2s ease;
  font-size: 12px;
}

/* Ajustes para campos deshabilitados */
input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Asegurar que el contenido principal no genere scroll */
main {
  height: calc(100vh - 140px);
}
</style>