// composables/useAcumulados.js
import { ref, computed } from 'vue'
import { infoDespachos } from '../services/entregas'

export const useAcumulados = () => {
  // Estado reactivo para cache de acumulados
  const acumuladosCache = ref({})
  
  // Función para obtener acumulado con cache
  const getAcumulado = async (entrega, posOt, ot) => {
    const cacheKey = `${entrega}-${posOt}-${ot}`
    
    // Si ya está en cache, devolver inmediatamente
    if (acumuladosCache.value[cacheKey] !== undefined) {
      return acumuladosCache.value[cacheKey]
    }
    
    try {
      const responseDespachos = await infoDespachos.getEntregaAcumulada(entrega, posOt, ot)
      const acumulado = responseDespachos.data.success ? responseDespachos.data.data[0].acumulado : 0
      
      // Guardar en cache REACTIVO
      acumuladosCache.value = {
        ...acumuladosCache.value,
        [cacheKey]: acumulado
      }
      
      return acumulado
    } catch (error) {
      console.error('Error obteniendo acumulado:', error)
      acumuladosCache.value = {
        ...acumuladosCache.value,
        [cacheKey]: 0
      }
      return 0
    }
  }

  // Computed para acceso reactivo a acumulados
  const getAcumuladoComputed = (entrega, posOt, ot) => {
    return computed(() => {
      const cacheKey = `${entrega}-${posOt}-${ot}`
      return acumuladosCache.value[cacheKey]
    })
  }

  // Función para pre-cargar múltiples acumulados en paralelo
  const precargarAcumulados = async (entregas) => {
    const promises = entregas.map(({ entrega, posOt, ot }) => 
      getAcumulado(entrega, posOt, ot)
    )
    
    await Promise.all(promises)
  }

  // Limpiar cache (útil para refrescar datos)
  const limpiarCache = () => {
    acumuladosCache.value = {}
  }

  // Verificar si un acumulado está en cache
  const estaEnCache = (entrega, posOt, ot) => {
    const cacheKey = `${entrega}-${posOt}-${ot}`
    return acumuladosCache.value[cacheKey] !== undefined
  }

  return {
    acumuladosCache,
    getAcumulado,
    getAcumuladoComputed,
    precargarAcumulados,
    limpiarCache,
    estaEnCache
  }
}