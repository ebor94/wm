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
  async freePicking(estiba, alamcen) {
    let ubicacionDestino = "x";
    let cantidad = "x";
    let codsap = "x";
    let loteDestino = "x";
    let lote = "x";
    let usuario = "x";
    let pallet = estiba;
    let centro = "x";
    let almacen = alamcen;
    let bandera = "13";
    let centrodestino = "x";
    let almacendestino = "x";
    let ubicacionOrigen = 'x';
    return axios.get(
      `${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${codsap}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}/${almacendestino}/${centrodestino}`,
      { headers: headers }
    );
  },

  /**
   * Retrieves product information based on the provided search parameters.
   *
   * @async
   * @function getInfoProducto
   * @param {string} busqueda - The search term or product identifier.
   * @param {string} dtlUbica - The detailed location information.
   * @param {string} centro - The center code.
   * @param {string} almacen - The warehouse code.
   * @param {string} orgVta - The sales organization code.
   * @param {string} canal - The sales channel code.
   * @returns {Promise<Object>} The Axios response containing product information.
   * @throws {Error} Throws an error if the request fails.
   */
  async getInfoProducto(busqueda, dtlUbica, centro, almacen, orgVta, canal) {
    const data = {
      BUSQUEDA: busqueda,
      DTLUBICA: dtlUbica,
      PARCENTRO: centro,
      PARALMACEN: almacen,
      PARORGVTA: orgVta,
      PARACANAL: canal
    };
    try {
      const response = await axios.post(
        `${domain}/clientes/inventario/`,
        data,
        { headers }
      );
      return response;
    } catch (error) {
      // Optionally, handle/log error here or rethrow
      throw error;
    }
  },


}