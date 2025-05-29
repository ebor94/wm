import { defineStore } from 'pinia'
import { infoDespachos } from '../services/entregas'

export const UseDespachoStore = defineStore('despacho', {
    state: () => ({
        despachos: [],
        entregas: [],
        loading: false,
        error: null,
        consEstibaManual: 100,
        detalleEntregas: [],
    }),
    actions: {
        async fetchDespachos() {
            this.loading = true
            this.error = null
            try {
                this.loading = true
                const responseDespachos = await infoDespachos.getEntregas(localStorage.getItem('user'))
                this.despachos = responseDespachos.data
                //await this.getEntregas()
            } catch (error) {
                console.log(error)
                this.error = error.message
            } finally {
                this.loading = false
            }
        },
        async getEntregas() {
            this.entregas = this.despachos.flatMap(item => item.ordenes.map(orden => orden.entrega))
            await this.getEntregasDetails();
        },
        async getEntregasDetails() {
            this.detalleEntregas = await Promise.all(
                this.entregas.map(async entrega => {
                    let response = await infoDespachos.getEntregaStatus(entrega)
                    response.data.entrega = entrega;
                    return response.data
                })
            )
        },

        async getConsecutivoManual() {
            this.consEstibaManual = this.consEstibaManual - 1;
            return this.consEstibaManual
        },
        async updateEntregaStatus(entrega) {
            try {
                const response = await infoDespachos.getEntregaStatus(entrega)
                const estadoActualizado = {
                    ...response.data,
                    entrega: entrega
                }

                const index = this.detalleEntregas.findIndex(detalle => detalle.entrega === entrega)
                if (index !== -1) {
                    this.detalleEntregas[index] = estadoActualizado
                } else {
                    this.detalleEntregas.push(estadoActualizado)
                }

                return estadoActualizado
            } catch (error) {
                console.error('Error updating entrega status:', error)
                throw error
            }
        },

        // Método para obtener el estado de una entrega
        getEntregaStatus(entrega) {
            return this.detalleEntregas.find(detalle => detalle.entrega === entrega)
        },
      resetStore() {
            this.despachos = []
            this.entregas = []
            this.loading = false
            this.error = null
            this.consEstibaManual = 100
            this.detalleEntregas = []
        },
    },


      getters: {
        // Obtener despachos filtrados para cargue
        despachosParaCargue: (state) => {
                return (accion) => {
                return state.despachos.filter(despacho => 
                    despacho.ordenes.some(orden => orden.accion === accion)
                ).map(despacho => ({
                    ...despacho,
                    // Filtrar solo las órdenes de la acción específica
                    ordenes: despacho.ordenes.filter(orden => orden.accion === accion)
                }))
            }
        },
        
        // Obtener estado de entrega por ID
        getEstadoEntregaById: (state) => {
            return (entrega) => state.detalleEntregas.find(detalle => detalle.entrega === entrega)
        }
    }

})