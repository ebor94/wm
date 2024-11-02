// composables/useLoader.js
import { ref } from 'vue'

export function useLoader() {
  const isLoading = ref(false)
  const loadingText = ref('Cargando...')

  const showLoader = (text = 'Cargando...') => {
    loadingText.value = text
    isLoading.value = true
  }

  const hideLoader = () => {
    isLoading.value = false
  }

  return {
    isLoading,
    loadingText,
    showLoader,
    hideLoader
  }
}