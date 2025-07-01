<!-- ScannerInput.vue -->
<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <label class="block text-sm font-medium text-white">
        {{ label }}
      </label>
      <input
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :disabled="disabled"
        @keyup.enter="handleChange"
        class="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-italia-red focus:border-italia-red"
        :placeholder="placeholder"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { infoEstiba } from '../services/product'
import { useAuthStore } from '../store/auth'

const codSap = ref('')

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Valor de etiqueta'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Escanee o ingrese el valor'
  },
  // Servicio para consulta EAN13
  infoEstibaService: {
    type: Object,
    default: null
  },
  // Store de autenticación para EAN13
  authStore: {
    type: Object,
    default: null
  },
  // Material esperado para validación EAN13
  expectedMaterial: {
    type: String,
    default: ''
  },
  // Nombre del producto para mensajes de error
  productName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'update:modelValue', 
  'onChange', 
  'onCodeProcessed',
  'onError',
  'onLoading'
])

// Detectar tipo de código
const detectarTipoCodigo = (codigo) => {
  switch (codigo.length) {
    case 6:
      return 'CODIGO_PRODUCTO'
    case 13:
      return 'EAN13'
    case 18:
      return 'CODIGO_18'
    case 38:
      return 'ETIQUETA_COMPLETA'
    default:
      return null
  }
}

// Dividir etiqueta completa (38 caracteres)
const divideEtiquetas = (codigo) => {
  codigo = codigo.trim()
  const material = codigo.slice(0, 18)
  const lote = codigo.slice(18, 28)
  const pallet = codigo.slice(-10)
  
  return { material, lote, pallet }
}

// Procesar EAN13 - Consultar servicio y retornar código de material
const procesarEAN13 = async (codigo) => {
   try{
    emit('onLoading', true)
    const response = await infoEstiba.getInfoProducto(codigo, 'E',useAuthStore.ptoExpedicion,useAuthStore.almaceMM,'1000','60');
    console.log('Respuesta del servicio:', response.data)    
    codSap.value = response.data[0].material
    // Retornar código de material obtenido del EAN13
    emit('onCodeProcessed', {
      tipo: 'EAN13',
      materialCode: response.data[0].material,
      codigoCompleto: response.data[0].codigo,
      codigoOriginal: codigo,
      nameProduct: response.data[0].descripcion,
      tipoLectura: 'M'
    })
    
  } catch (error) {
    emit('onError', {
      title: 'Error de Servicio',
      message: 'Error al consultar información del código EAN13',
      type: 'error'
    })
  } finally {
    emit('onLoading', false)
  }
}

// Procesar código de producto (6 caracteres) - Retornar el mismo código
const procesarCodigoProducto = (codigo) => {
  codSap.value = codigo
  emit('onCodeProcessed', {
    tipo: 'CODIGO_PRODUCTO',
    materialCode: codigo,
    codigoOriginal: codigo,
    tipoLectura: 'M'
  })
}

// Procesar código de 18 caracteres - Extraer y retornar código de producto
const procesarCodigo18 = (codigo) => {
  const materialCode = codigo.slice(12, 18) // Extraer los últimos 6 caracteres
  codSap.value = materialCode
  
  emit('onCodeProcessed', {
    tipo: 'CODIGO_18',
    materialCode: materialCode,
    codigoCompleto: codigo,
    codigoOriginal: codigo,
    tipoLectura: 'M'
  })
}

// Procesar etiqueta completa (38 caracteres) - Dividir y retornar todos los componentes
const procesarEtiquetaCompleta = (codigo) => {
  const { material, lote, pallet } = divideEtiquetas(codigo)
  codSap.value = material
  
  emit('onCodeProcessed', {
    tipo: 'ETIQUETA_COMPLETA',
    materialCode: material,
    lote: lote,
    pallet: pallet,
    codigoOriginal: codigo,
    tipoLectura: 'A'
  })
}

// Manejador principal del cambio
const handleChange = async (event) => {
  const codigo = event.target.value.trim()
  
  // Emitir evento onChange original para compatibilidad
  emit('onChange', codigo)
  
  if (!codigo || codigo.length === 0) {
    emit('onError', {
      title: 'Error de Validación',
      message: 'Debe escanear o ingresar un código',
      type: 'warning'
    })
    return
  }

  const tipoCodigoDetectado = detectarTipoCodigo(codigo)
  console.log('Tipo de código detectado:', tipoCodigoDetectado)
  if (!tipoCodigoDetectado.length) {
    emit('onError', {
      title: 'Error de Validación',
      message: 'Código no válido. Debe ser de 6, 13, 18 o 38 caracteres',
      type: 'error'
    })
    return
  }

  // Procesar según el tipo de código
  try {
    switch (tipoCodigoDetectado) {
      case 'EAN13':
        await procesarEAN13(codigo)
        break
      case 'CODIGO_PRODUCTO':
        procesarCodigoProducto(codigo)
        break
      case 'CODIGO_18':
        procesarCodigo18(codigo)
        break
      case 'ETIQUETA_COMPLETA':
        procesarEtiquetaCompleta(codigo)
        break
    }


 

  } catch (error) {
    emit('onError', {
      title: 'Error de Procesamiento',
      message: 'Error al procesar el código escaneado' + error,
      type: 'error'
    })
  }
}
</script>

<style scoped>
.italia-red {
  --tw-ring-color: rgb(205, 33, 34);
  --tw-border-opacity: 1;
  border-color: rgb(205, 33, 34);
}
</style>