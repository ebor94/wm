// composables/useMenuAPI.js
import { ref, computed } from 'vue'

export function useMenuAPI() {
  const menus = ref([])
  const loading = ref(false)
  const error = ref(null)

  // URL base de la API (configúrala según tu entorno)
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/menu'

  /**
   * Obtiene todos los usuarios activos
   * @returns {Promise<Array>} Array de usuarios
   */
  const fetchAllUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/users`)
      const data = await response.json()

      if (data.success) {
        return data.users
      } else {
        throw new Error(data.message || 'Error al obtener usuarios')
      }
    } catch (err) {
      error.value = err.message
      console.error('Error al obtener usuarios:', err)
      return []
    } finally {
      loading.value = false
    }
  }
  
  const fetchUserMenus = async (usercode) => {
    if (!usercode) {
      throw new Error('UserCode es requerido')
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/user-menu/${usercode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Agregar headers de autenticación si es necesario
          // 'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Usuario no encontrado o sin permisos asignados')
        }
        throw new Error(`Error del servidor: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        menus.value = data.menu
        return data.menu
      } else {
        throw new Error(data.message || 'Error al obtener menús')
      }
    } catch (err) {
      error.value = err.message
      console.error('Error al obtener menús:', err)
      // Retornar menús por defecto en caso de error
      return getDefaultMenus()
    } finally {
      loading.value = false
    }
  }

  /**
   * Verifica si un usuario existe
   * @param {string} usercode - Código del usuario
   * @returns {Promise<Object>} Datos del usuario
   */
  const checkUserExists = async (usercode) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/user-exists/${usercode}`)
      const data = await response.json()

      if (data.success) {
        return data.user
      } else {
        throw new Error(data.message || 'Usuario no encontrado')
      }
    } catch (err) {
      error.value = err.message
      console.error('Error al verificar usuario:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtiene todos los menús disponibles
   * @returns {Promise<Array>} Array de todos los menús
   */
  const fetchAllMenus = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/menus`)
      const data = await response.json()

      if (data.success) {
        return data.menus
      } else {
        throw new Error(data.message || 'Error al obtener menús')
      }
    } catch (err) {
      error.value = err.message
      console.error('Error al obtener todos los menús:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Asigna menús específicos a un usuario
   * @param {string} usercode - Código del usuario
   * @param {Array<string>} menuActions - Array de acciones de menú
   * @returns {Promise<Object>} Resultado de la asignación
   */
  const assignMenusToUser = async (usercode, menuActions) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/assign-menus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usercode,
          menuActions
        })
      })

      const data = await response.json()

      if (data.success) {
        return data
      } else {
        throw new Error(data.message || 'Error al asignar menús')
      }
    } catch (err) {
      error.value = err.message
      console.error('Error al asignar menús:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Remueve permisos de menú de un usuario
   * @param {string} usercode - Código del usuario
   * @param {Array<string>} menuActions - Array de acciones de menú a remover
   * @returns {Promise<Object>} Resultado de la remoción
   */
  const removeMenusFromUser = async (usercode, menuActions) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/remove-menus`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usercode,
          menuActions
        })
      })

      const data = await response.json()

      if (data.success) {
        return data
      } else {
        throw new Error(data.message || 'Error al remover menús')
      }
    } catch (err) {
      error.value = err.message
      console.error('Error al remover menús:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Menús por defecto (fallback)
   * @returns {Array} Array de menús por defecto
   */
  const getDefaultMenus = () => {
    return [
      { title: 'Alistamiento', action: 'alistamiento' },
      { title: 'Cargue', action: 'cargue' },
      { title: 'Traslado ubicacion', action: 'traslado' },
      { title: 'Consultar Ubicacion', action: 'consultar-ubicacion' },
      { title: 'OT Pendiente confirmar', action: 'ot-pendiente' },
      { title: 'Consultar material', action: 'consultar-material' },
      { title: 'Gestion Entrega', action: 'gestion-entrega' },
      { title: 'Indicador De Despacho', action: 'indicator' },
      { title: 'Validar Etiqueta', action: 'info-etiqueta' },
      { title: 'Traslado entre Almacenes', action: 'traslado-almacenes' },
      { title: 'Liberar Picking', action: 'freepicking' },
      { title: 'Ingreso De Mercancia', action: 'ingreso-mcia' },
       { title: 'Admin', action: 'admin' },
    ]
  }

  /**
   * Mapeo de iconos para cada acción de menú
   * @param {string} action - Acción del menú
   * @returns {string} Nombre del icono Material Icons
   */
  const getMenuIcon = (action) => {
    const iconMap = {
      'alistamiento': 'inventory_2',
      'cargue': 'local_shipping',
      'traslado': 'swap_horiz',
      'consultar-ubicacion': 'location_searching',
      'ot-pendiente': 'pending_actions',
      'consultar-material': 'search',
      'gestion-entrega': 'delivery_dining',
      'indicator': 'dashboard',
      'info-etiqueta': 'qr_code_scanner',
      'traslado-almacenes': 'warehouse',
      'freepicking': 'shopping_cart',
      'ingreso-mcia': 'input'
    }
    return iconMap[action] || 'apps'
  }



  // Computed properties
  const hasMenus = computed(() => menus.value.length > 0)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  // Reset function
  const resetState = () => {
    menus.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    menus,
    loading,
    error,
    
    // Computed
    hasMenus,
    isLoading,
    hasError,

    // Methods
    fetchUserMenus,
    fetchAllUsers,
    checkUserExists,
    fetchAllMenus,
    assignMenusToUser,
    removeMenusFromUser,
    getDefaultMenus,
    getMenuIcon,
    resetState
  }
}