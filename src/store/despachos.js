import { defineStore } from 'pinia'
import { infoDespachos } from '../services/entregas'

export const UseDespachoStore = defineStore('despacho',{
    state: () => ({
        despachos: [],
        entregas:[],
        loading: false,
        error: null,
        detalleEntregas: [],
    }),
    actions:{
        async fetchDespachos(){
            this.loading = true
            this.error = null
            try {
                 this.loading = true
                const responseDespachos = await infoDespachos.getEntregas('9979')
                console.log(responseDespachos)
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
            this.detalleEntregas = this.entregas.map(async entrega =>  {
                await infoDespachos.getEntregaStatus(entrega)
            })
        }
    }

})