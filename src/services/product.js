import axios from "axios";

const domain = "https://lilix.ceramicaitalia.com:3001";
let headers = { "Content-Type": "application/json" }

export const infoEstiba = { 

    async getInfoEtiqueta(pallet) {
        return axios.get(
          `${domain}/producto/etiqueta/${pallet}`,
          { headers: headers }
        );
      },
      async getInfoEtiquetaFull(pallet) {
        return axios.get(
          `${domain}/producto/etiqueta-info/${pallet}`,
          { headers: headers }
        );
      },
    async freePicking(pallet) {
    let ubicacionDestino = "x";
    let cantidad = "x";
    let codsap = "x";
    let loteDestino = "x";
    let lote = "x";
    let usuario = "x";
    let pallet = pallet;
    let centro =  "x";
    let almacen =  "x";
    let bandera = "13";
    let centrodestino =  "x";
    let almacendestino =  "x";
    return axios.get(
      `${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${codsap}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}/${almacendestino}/${centrodestino}`,
      { headers: headers }
    );
  },


}