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


}