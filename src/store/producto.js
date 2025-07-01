// stores/products.js
import { defineStore } from 'pinia'
import { infoEstiba } from '../services/product'

export const useProductsStore = defineStore('products', {
  state: () => ({
    // Array para almacenar todos los productos
    products: [],
    
    // Estados de carga y error
    loading: false,
    error: null,
    
    // Filtros y búsqueda
    filters: {
      material: '',
      lote: '',
    },
    
    // Configuración de paginación si es necesario
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  }),

  getters: {
    // Obtener productos filtrados
    filteredProducts: (state) => {
      return state.products.filter(product => {
        const matchMaterial = !state.filters.material || 
          product.material.toLowerCase().includes(state.filters.material.toLowerCase())
        
        const matchLote = !state.filters.lote || 
          product.lote.toLowerCase().includes(state.filters.lote.toLowerCase())
        

        
        return matchMaterial && matchLote
      })
    },

    // Obtener producto por material
    getProductByMaterial: (state) => {
      return (material) => state.products.find(product => product.material === material)
    },

    // Obtener productos por lote
    getProductsByLote: (state) => {
      return (lote) => state.products.filter(product => product.lote === lote)
    },

  },

  actions: {
    // Acción principal para obtener productos de la API
   async fetchInventarioLotes(material, centro, almacen) {
     this.loading = true
      this.error = null
      //console.log('Fetching inventario lotes for material:', material)
      try {
        // Usar tu función de servicio
        const result = await infoEstiba.getInventarioLotes(material, localStorage.getItem("centro"), localStorage.getItem("almacen"))
        
        if (result.success && Array.isArray(result.data)) {
          // Procesar y normalizar los datos
          const normalizedProducts = result.data.map(this.normalizeProduct)
          
          // Actualizar estado
          this.products = normalizedProducts         
          this.pagination.total = this.products.length
          
     
          
        } else {
          throw new Error('Formato de respuesta inválido o datos no encontrados')
        }
        
      } catch (err) {
        this.error = err.message
        this.products = []
        console.error('Error fetching inventario lotes:', err)
      } finally {
        this.loading = false
      }
    },

    // Normalizar datos del producto para asegurar consistencia
    normalizeProduct(product) {
      return {
        material: product.material || '',
        descripcion: product.descripcion || '',
        cantidad: Number(product.cantidad) || 0,
        enentrega: Number(product.enentrega) || 0,
        disponible: Number(product.disponible) || 0,
        lote: product.lote || '',
        cantlote: Number(product.cantlote) || 0,
        cantloteentrega: Number(product.cantloteentrega) || 0,
        m2cj: product.m2cj || '',
        pzcj: product.pzcj || '',
        m2st: product.m2st || '',
        uventa: product.uventa || '',
        ucajas: product.ucajas || '',
        m2cajas: Number(product.m2cajas) || 1,
        tono: product.tono || '',
        tamano: product.tamano || '',
        // Agregar timestamp para control
        updatedAt: new Date().toISOString()
      }
    },

    // Limpiar filtros
    clearFilters() {
      this.filters = {
        material: '',
        lote: '',
      }
    },



    // Resetear store
    resetStore() {
      this.products = []
      this.loading = false
      this.error = null
      this.clearFilters()
      this.pagination = {
        page: 1,
        limit: 10,
        total: 0
      }
    }
  }
})