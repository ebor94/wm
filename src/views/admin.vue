<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <!-- Loader -->
    <LoaderComponent 
      v-if="isLoading"
      :loading-text="loadingText"
    />
    <Header title="🔐 Administrar Permisos"></Header>



    <!-- Contenido Principal -->
    <main class="p-6 space-y-6">
      <!-- Selector de Usuario -->
      <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <span class="material-icons text-blue-600">person</span>
            <h2 class="text-lg font-semibold text-gray-800">Seleccionar Usuario</h2>
          </div>
          
          <!-- Dropdown de usuarios -->
          <div class="relative">
            <select 
              v-model="selectedUser"
              @change="onUserChange"
              class="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none cursor-pointer"
              :disabled="loadingUsers"
            >
              <option value="">
                {{ loadingUsers ? 'Cargando usuarios...' : 'Seleccione un usuario' }}
              </option>
              <option 
                v-for="user in users" 
                :key="user.usercode" 
                :value="user.usercode"
              >
                {{ user.usercode }} - {{ user.username }}
              </option>
            </select>
            <!-- Icono del dropdown -->
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span class="material-icons text-gray-400">expand_more</span>
            </div>
          </div>

          <!-- Info del usuario seleccionado -->
          <div 
            v-if="selectedUserInfo" 
            class="bg-blue-50 rounded-xl p-4 border border-blue-200"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-sm">
                  {{ getUserInitials(selectedUserInfo.username) }}
                </span>
              </div>
              <div>
                <div class="font-semibold text-gray-800">{{ selectedUserInfo.username }}</div>
                <div class="text-sm text-gray-600">Código: {{ selectedUserInfo.usercode }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel de Permisos -->
      <div 
        v-if="selectedUser && allMenus.length > 0"
        class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20"
      >
        <div class="space-y-6">
          <!-- Header del panel -->
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="material-icons text-green-600">security</span>
              <h2 class="text-lg font-semibold text-gray-800">Permisos de Menú</h2>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="selectAllMenus"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Seleccionar Todo
              </button>
              <button 
                @click="deselectAllMenus"
                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Deseleccionar Todo
              </button>
            </div>
          </div>

          <!-- Grid de Menús -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="menu in allMenus" 
              :key="menu.id"
              class="group bg-gray-50 hover:bg-gray-100 rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer"
              :class="getUserMenuPermission(menu.action) ? 'border-green-300 bg-green-50' : 'border-gray-200'"
              @click="toggleMenuPermission(menu.action)"
            >
              <div class="flex items-center space-x-3">
                <!-- Checkbox personalizado -->
                <div class="relative">
                  <input 
                    type="checkbox"
                    :checked="getUserMenuPermission(menu.action)"
                    @click.stop
                    @change="toggleMenuPermission(menu.action)"
                    class="sr-only"
                  >
                  <div 
                    class="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200"
                    :class="getUserMenuPermission(menu.action) 
                      ? 'bg-green-500 border-green-500' 
                      : 'bg-white border-gray-300 group-hover:border-gray-400'"
                  >
                    <span 
                      v-if="getUserMenuPermission(menu.action)"
                      class="material-icons text-white text-sm"
                    >
                      check
                    </span>
                  </div>
                </div>

                <!-- Icono del menú -->
                <div 
                  class="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                  :style="getIconStyle(menu.action)"
                >
                  <span class="material-icons text-white text-sm">
                    {{ getMenuIcon(menu.action) }}
                  </span>
                </div>

                <!-- Info del menú -->
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-gray-800 text-sm truncate">
                    {{ menu.title }}
                  </div>
                  <div class="text-xs text-gray-500 truncate">
                    {{ menu.action }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Estadísticas -->
          <div class="bg-gray-100 rounded-xl p-4">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-blue-600">{{ totalMenus }}</div>
                <div class="text-sm text-gray-600">Total Menús</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-green-600">{{ userMenusCount }}</div>
                <div class="text-sm text-gray-600">Asignados</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-600">{{ totalMenus - userMenusCount }}</div>
                <div class="text-sm text-gray-600">Sin Asignar</div>
              </div>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex justify-center space-x-4">
            <button 
              @click="savePermissions"
              :disabled="!hasChanges || savingPermissions"
              class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              <div class="flex items-center space-x-2">
                <span class="material-icons" v-if="!savingPermissions">save</span>
                <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{{ savingPermissions ? 'Guardando...' : 'Guardar Cambios' }}</span>
              </div>
            </button>
            
            <button 
              @click="resetChanges"
              :disabled="!hasChanges"
              class="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium transition-all duration-200"
            >
              <div class="flex items-center space-x-2">
                <span class="material-icons">refresh</span>
                <span>Descartar Cambios</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div 
        v-else-if="selectedUser && allMenus.length === 0"
        class="bg-white/95 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 text-center"
      >
        <div class="space-y-4">
          <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
            <span class="material-icons text-gray-400 text-2xl">menu</span>
          </div>
          <div class="text-gray-600">
            <div class="font-medium">No se encontraron menús</div>
            <div class="text-sm">No hay menús disponibles para asignar</div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast de notificaciones -->
    <div 
      v-if="showToast"
      class="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 z-50"
      :class="toastType === 'success' ? 'bg-green-500' : 'bg-red-500'"
    >
      <div class="flex items-center space-x-2">
        <span class="material-icons text-sm">
          {{ toastType === 'success' ? 'check_circle' : 'error' }}
        </span>
        <span class="font-medium">{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuAPI } from '../composables/useMenuAPI'
import LoaderComponent from '../components/LoaderComponent.vue'
import Header from '../components/Header.vue'

const router = useRouter()
const {
  fetchAllMenus,
  fetchUserMenus,
  fetchAllUsers,
  assignMenusToUser,
  removeMenusFromUser,
  getMenuIcon
} = useMenuAPI()

// Estado reactivo
const users = ref([])
const selectedUser = ref('')
const selectedUserInfo = ref(null)
const allMenus = ref([])
const userMenus = ref([])
const originalUserMenus = ref([])
const loadingUsers = ref(false)
const isLoading = ref(false)
const loadingText = ref('')
const savingPermissions = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// Computed properties
const totalUsers = computed(() => users.value.length)
const totalMenus = computed(() => allMenus.value.length)
const userMenusCount = computed(() => userMenus.value.length)
const hasChanges = computed(() => {
  const original = originalUserMenus.value.sort()
  const current = userMenus.value.sort()
  return JSON.stringify(original) !== JSON.stringify(current)
})

// Obtener iniciales del usuario
const getUserInitials = (name) => {
  if (!name) return 'U'
  const words = name.split(' ')
  if (words.length === 1) return words[0].charAt(0).toUpperCase()
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
}

// Función para obtener estilos de iconos
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

// Cargar todos los usuarios
const loadUsers = async () => {
  try {
    loadingUsers.value = true
    const usersData = await fetchAllUsers()
    users.value = usersData
  } catch (error) {
    console.error('Error cargando usuarios:', error)
    showToastMessage('Error al cargar usuarios', 'error')
  } finally {
    loadingUsers.value = false
  }
}

// Cargar todos los menús disponibles
const loadAllMenus = async () => {
  try {
    const menus = await fetchAllMenus()
    allMenus.value = menus
  } catch (error) {
    console.error('Error cargando menús:', error)
    showToastMessage('Error al cargar menús', 'error')
  }
}

// Manejar cambio de usuario
const onUserChange = async () => {
  if (!selectedUser.value) {
    selectedUserInfo.value = null
    userMenus.value = []
    originalUserMenus.value = []
    return
  }

  try {
    isLoading.value = true
    loadingText.value = 'Cargando permisos del usuario...'

    // Obtener info del usuario
    const user = users.value.find(u => u.usercode === selectedUser.value)
    selectedUserInfo.value = user

    // Obtener menús del usuario
    const userMenuData = await fetchUserMenus(selectedUser.value)
    const menuActions = userMenuData.map(menu => menu.action)
    
    userMenus.value = [...menuActions]
    originalUserMenus.value = [...menuActions]

  } catch (error) {
    console.error('Error cargando permisos:', error)
    userMenus.value = []
    originalUserMenus.value = []
  } finally {
    isLoading.value = false
  }
}

// Verificar si el usuario tiene permiso para un menú
const getUserMenuPermission = (action) => {
  return userMenus.value.includes(action)
}

// Toggle permiso de menú
const toggleMenuPermission = (action) => {
  const index = userMenus.value.indexOf(action)
  if (index > -1) {
    userMenus.value.splice(index, 1)
  } else {
    userMenus.value.push(action)
  }
}

// Seleccionar todos los menús
const selectAllMenus = () => {
  userMenus.value = allMenus.value.map(menu => menu.action)
}

// Deseleccionar todos los menús
const deselectAllMenus = () => {
  userMenus.value = []
}

// Guardar permisos
const savePermissions = async () => {
  if (!selectedUser.value || !hasChanges.value) return

  try {
    savingPermissions.value = true
    
    const originalSet = new Set(originalUserMenus.value)
    const currentSet = new Set(userMenus.value)
    
    // Menús a agregar
    const menusToAdd = userMenus.value.filter(action => !originalSet.has(action))
    
    // Menús a remover
    const menusToRemove = originalUserMenus.value.filter(action => !currentSet.has(action))
    
    // Asignar nuevos permisos
    if (menusToAdd.length > 0) {
      await assignMenusToUser(selectedUser.value, menusToAdd)
    }
    
    // Remover permisos
    if (menusToRemove.length > 0) {
      await removeMenusFromUser(selectedUser.value, menusToRemove)
    }
    
    // Actualizar estado original
    originalUserMenus.value = [...userMenus.value]
    
    showToastMessage('Permisos guardados exitosamente', 'success')
    
  } catch (error) {
    console.error('Error guardando permisos:', error)
    showToastMessage('Error al guardar permisos', 'error')
  } finally {
    savingPermissions.value = false
  }
}

// Descartar cambios
const resetChanges = () => {
  userMenus.value = [...originalUserMenus.value]
}

// Mostrar toast
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Volver atrás
const goBack = () => {
  if (hasChanges.value) {
    if (confirm('¿Descartar cambios sin guardar?')) {
      router.go(-1)
    }
  } else {
    router.go(-1)
  }
}

// Lifecycle
onMounted(async () => {
  isLoading.value = true
  loadingText.value = 'Cargando datos...'
  
  await Promise.all([
    loadUsers(),
    loadAllMenus()
  ])
  
  isLoading.value = false
})
</script>

<style scoped>
/* Animaciones personalizadas */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Ocultar el dropdown nativo en algunos navegadores */
select {
  background-image: none;
}

/* Mejoras para dispositivos táctiles */
button, .cursor-pointer {
  -webkit-tap-highlight-color: transparent;
}

/* Scroll suave */
* {
  -webkit-overflow-scrolling: touch;
}
</style>