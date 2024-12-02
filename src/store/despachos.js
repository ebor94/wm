import { defineStore } from 'pinia'
import { infoDespachos } from '../services/entregas'

export const UseDespachoStore = defineStore('despacho',{
    state: () => ({
        despachos: [],
        entregas:[],
        loading: false,
        error: null,
        consEstibaManual : 100,
        detalleEntregas: [],
    }),
    actions:{
        async fetchDespachos(){
            this.loading = true
            this.error = null
            try {
                 this.loading = true
                const responseDespachos = await infoDespachos.getEntregas(localStorage.getItem('user'))                
                this.despachos = responseDespachos.data
                //await this.getEntregas()
            }catch(error){
                console.log(error)
                this.error = error.message
            } finally {
                this.loading = false
              }
        },
       async  getEntregas() {
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

        async getConsecutivoManual(){
            this.consEstibaManual = this.consEstibaManual - 1;
            return this.consEstibaManual
        }
    }

})