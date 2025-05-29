// composables/useProgressUtils.js
import { computed } from 'vue'

export const useProgressUtils = () => {
  
  // Helper para determinar color basado en estado
  const getColorByStatus = (acumulado, total) => {
    if (acumulado === undefined) return 'bg-gray-400' // Cargando
    // ✅ Convertir a números y considerar completado si acumulado >= total
    const acum = parseFloat(acumulado) || 0
    const tot = parseFloat(total) || 0
    if (acum >= tot && tot > 0) return 'bg-green-600'  // Completado (mayor o igual)
    if (acum > 0) return 'bg-yellow-600'               // En progreso
    return 'bg-red-600'                                // No iniciado
  }

  // Helper para texto de progreso
  const getProgressText = (acumulado, total) => {
    if (acumulado === undefined) return 'Cargando...'
    // ✅ Convertir a números y considerar completado si acumulado >= total
    const acum = parseFloat(acumulado) || 0
    const tot = parseFloat(total) || 0
    if (acum >= tot && tot > 0) return acum > tot ? 'Excedido' : 'Completado'
    if (acum > 0) return 'En progreso'
    return 'Pendiente'
  }

  // Helper para color del texto de progreso
  const getProgressTextColor = (acumulado, total) => {
    if (acumulado === undefined) return 'text-gray-500'
    // ✅ Convertir a números y considerar completado si acumulado >= total
    const acum = parseFloat(acumulado) || 0
    const tot = parseFloat(total) || 0
    if (acum >= tot && tot > 0) return acum > tot ? 'text-orange-600' : 'text-green-600'
    if (acum > 0) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Helper para porcentaje de progreso
  const getProgressPercentage = (acumulado, total) => {
    if (acumulado === undefined || total === 0) return 0
    const acum = parseFloat(acumulado) || 0
    const tot = parseFloat(total) || 0
    // ✅ Limitar al 100% máximo, pero mostrar si está excedido
    const percentage = (acum / tot) * 100
    return Math.min(percentage, 100) // Máximo 100% en la barra visual
  }

  // ✅ NUEVO: Helper para color dinámico de la barra de progreso (usando Tailwind)
  const getProgressBarColor = (acumulado, total) => {
    if (acumulado === undefined || total === 0) return 'bg-gray-300'
    
    const acum = parseFloat(acumulado) || 0
    const tot = parseFloat(total) || 0
    const percentage = Math.min((acum / tot) * 100, 100)
    
    // Usar clases de Tailwind para mejor compatibilidad
    if (percentage === 0) return 'bg-red-500'
    if (percentage >= 100) return 'bg-green-500'
    if (percentage >= 90) return 'bg-green-400'
    if (percentage >= 80) return 'bg-green-300'
    if (percentage >= 70) return 'bg-yellow-400'
    if (percentage >= 60) return 'bg-yellow-500'
    if (percentage >= 50) return 'bg-orange-400'
    if (percentage >= 40) return 'bg-orange-500'
    if (percentage >= 30) return 'bg-red-400'
    if (percentage >= 20) return 'bg-red-500'
    return 'bg-red-600'
  }

  // ✅ NUEVO: Helper para obtener estilo inline de la barra (solo width)
  const getProgressBarStyle = (acumulado, total) => {
    const percentage = getProgressPercentage(acumulado, total)
    
    return {
      width: `${percentage}%`
    }
  }

  // Helper para icono de estado
  const getStatusIcon = (acumulado, total) => {
    if (acumulado === undefined) return '⏳'
    if (acumulado === total) return '✅'
    if (acumulado > 0) return '🔄'
    return '❌'
  }

  // Función para calcular estadísticas de un array de materiales
  const calcularEstadisticas = (materiales, getAcumuladoFn) => {
    return computed(() => {
      // ✅ Acceder al .value del ref y validar que sea array
      const materialesArray = materiales.value || []
      const total = materialesArray.length
      
      if (total === 0) {
        return {
          total: 0,
          completados: 0,
          enProgreso: 0,
          pendientes: 0,
          porcentajeCompletado: 0
        }
      }
      
      const completados = materialesArray.filter(material => {
        const acumulado = getAcumuladoFn(material.vbeln, material.tapos, material.tanum).value
        // ✅ Convertir a números y considerar completado si acumulado >= total
        const acum = parseFloat(acumulado) || 0
        const tot = parseFloat(material.nsola) || 0
        return acum >= tot && tot > 0  // Completado si es mayor o igual
      }).length
      
      const enProgreso = materialesArray.filter(material => {
        const acumulado = getAcumuladoFn(material.vbeln, material.tapos, material.tanum).value
        // ✅ Convertir a números - en progreso solo si no está completado
        const acum = parseFloat(acumulado) || 0
        const tot = parseFloat(material.nsola) || 0
        return acum > 0 && acum < tot  // En progreso pero no completado
      }).length

      const pendientes = total - completados - enProgreso
      const porcentajeCompletado = total > 0 ? Math.round((completados / total) * 100) : 0

      return {
        total,
        completados,
        enProgreso,
        pendientes,
        porcentajeCompletado
      }
    })
  }

  // Función para verificar si puede terminar entrega
  const puedeTerminarEntrega = (materiales, getAcumuladoFn, accion) => {
    return computed(() => {
      // ✅ Acceder al .value del ref y validar
      const materialesArray = materiales.value || []
      const accionValue = accion.value || accion
      
      if (materialesArray.length === 0) return false
      
      if (accionValue === 'alistar') {
        // Para alistamiento, verificar que todos estén completados (acumulado >= total)
        return materialesArray.every(material => {
          const acumulado = getAcumuladoFn(material.vbeln, material.tapos, material.tanum).value
          // ✅ Convertir a números y considerar completado si acumulado >= total
          const acum = parseFloat(acumulado) || 0
          const tot = parseFloat(material.nsola) || 0
          return acum >= tot && tot > 0  // Completado si es mayor o igual
        })
      }
      return true // Para cargue siempre puede terminar
    })
  }

  return {
    getColorByStatus,
    getProgressText,
    getProgressTextColor,
    getProgressPercentage,
    getProgressBarColor,
    getProgressBarStyle,
    getStatusIcon,
    calcularEstadisticas,
    puedeTerminarEntrega
  }
}