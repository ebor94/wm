import axios from "axios";

const domain = "https://lilix.ceramicaitalia.com:3001";

export const infoDespachos = {
  async getEntregas(user) {
    return axios.post(
      `${domain}/transporte/listEntergaAlistamiento/`,
      { user: user },
      { headers: { "Content-Type": "application/json" } }
    );
  },

  async getEntregaStatus(entrega) {
    return axios.get(`${domain}/transporte/detalleEntrega${entrega}`, {
      headers: { "Content-Type": "application/json" },
    });
  },
};
