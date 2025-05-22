import axios from "axios";

const domain = "https://lilix.ceramicaitalia.com:3001";
let headers = { "Content-Type": "application/json" }
export const infoDespachos = {
  async getEntregas(user) {
    return axios.post(
      `${domain}/transporte/listEntergaAlistamiento/`,
      { user: user },
      { headers: headers }
    );
  },

  async getEntregaStatus(entrega) {
    //return axios.get(`${domain}/transporte/detalleEntrega/${entrega}`, {
      return axios.get(`${domain}/transporte/detalleEntrega/${entrega}`, {
      
      headers: headers,
    });
  },
  async getEntregaAcumulada(entrega, posot, ot) {
    
    return axios.get(`${domain}/transporte/alistamientoAcumulado/${entrega}/${posot}/${ot}`, {
      headers: headers,
    });
  },
  async indicadorDespacho(ptoExpedicion){
    return axios.get(`${domain}/transporte/indicadorDespacho/${ptoExpedicion}`, {
      headers: headers,
    });
  },
   async facturaEntrega(entrega, categoriaDocumento){
    return axios.get(`${domain}/transporte/wm/facturar/?entrega=${entrega}&categoriaDocumento=${categoriaDocumento}`, {
      headers: headers,
    });
   }

};

export const InfoWm = {
  async GetInfoPallet(pallet) {
    let ubicacionOrigen = "x";
    let ubicacionDestino = "x";
    let cantidad = "x";
    let material = "x";
    let lote = "x";
    let loteDestino = "x";
    let usuario = "x";
    let centro = localStorage.getItem("centro");
    let almacen = localStorage.getItem("almacen");
    let bandera = "2";
    let centrodestino = localStorage.getItem("centro");
    let almacendestino = localStorage.getItem("almacen");
    // console.log(
    //   `${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${material}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}/${almacendestino}/${centrodestino}`,
    //   { headers: headers }
    // );
    return axios.get(
      `${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${material}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}/${almacendestino}/${centrodestino}`,
      { headers: headers }
    );
  },

  async RegistryPicking(
    entrega,
    posicion,
    material,
    lote,
    consestib,
    cantbuena,
    cantrotura,
    UMBASE,
    usuario,
    bandera,
    IDX,
    POSOT,
    OT,
    TPLECTURA
  ) {
    return axios.post(
      `${domain}/transporte/Registraalistamiento`,
      {
        entrega: entrega,
        posicion: posicion,
        material: material,
        lote: lote,
        consestib: consestib,
        cantbuena: cantbuena,
        cantrotura: cantrotura,
        UMBASE: UMBASE,
        usuario: usuario,
        bandera: bandera,
        IDX: IDX,
        POSOT: POSOT,
        OT: OT,
        TPLECTURA: TPLECTURA,
      },
      { headers: headers }
    );
  },

  async GetInfoLocationMaterialBach(material, lote, pallet) {
    let ubicacionOrigen = "x";
    let ubicacionDestino = "x";
    let cantidad = "x";
    let codsap = material.slice(-6);
    let loteDestino = "x";
    let usuario = "x";
    let centro = localStorage.getItem("centro");
    let almacen = localStorage.getItem("almacen");
    let bandera = "2";
    let centrodestino = localStorage.getItem("centro");
    let almacendestino = localStorage.getItem("almacen");
    return axios.get(
      `${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${codsap}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}/${almacendestino}/${centrodestino}`,
      { headers: headers }
    );
  },

  async MoveMaterial(
    material,
    lote,
    pallet,
    cantidad,
    ubicacionOrigen,
    ubicacionDestino
  ) {
    let codsap = material.slice(-6);
    let loteDestino = "x";
    let usuario = localStorage.getItem("user");
    let centro = localStorage.getItem("centro");
    let almacen = localStorage.getItem("almacen");
    let bandera = "1";
    let centrodestino = localStorage.getItem("centro");
    let almacendestino = localStorage.getItem("almacen");
    return axios.get(
      `${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${codsap}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}/${almacendestino}/${centrodestino}`,
      { headers: headers }
    );
  },

  async MoveMaterialStores(
    material,
    lote,
    pallet,
    cantidad,
    ubicacionOrigen,
    ubicacionDestino,
    centroOrigen,
    centroDestino,
    almacenOrigen,
    almacenDestino
  ) {
    let codsap = material.slice(-6);
    let loteDestino = "x";
    let usuario = localStorage.getItem("user");
    let centro = centroOrigen;
    let almacen = almacenOrigen;
    let bandera = "11";
    let centrodestino = centroDestino;
    //let almacendestino = almacenDestino;
    return axios.get(
      `${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${codsap}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}/${almacenDestino}/${centrodestino}`,
      { headers: headers }
    );
  },
  async SerachLocationStockAvailable(ubicacionOrigen) {
    let ubicacionDestino = "x";
    let cantidad = "x";
    let codsap = "x";
    let loteDestino = "x";
    let lote = "x";
    let usuario = "x";
    let pallet = "x";
    let centro = localStorage.getItem("centro");
    let almacen = localStorage.getItem("almacen");
    let bandera = "6";
    let centrodestino = localStorage.getItem("centro");
    let almacendestino = localStorage.getItem("almacen");
    return axios.get(
      `${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${codsap}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}/${almacendestino}/${centrodestino}`,
      { headers: headers }
    );
  },
  async ClearLocationStockAvailable(ubicacionOrigen, ubicacionDestino) {
    let cantidad = "x";
    let codsap = "x";
    let loteDestino = "x";
    let lote = "x";
    let usuario = localStorage.getItem("user");
    let pallet = "x";
    let centro = localStorage.getItem("centro");
    let almacen = localStorage.getItem("almacen");
    let bandera = "7";
    let centrodestino = localStorage.getItem("centro");
    let almacendestino = localStorage.getItem("almacen");
    return axios.get(
      `${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${codsap}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}/${almacendestino}/${centrodestino}`,
      { headers: headers }
    );
  },
  async GetInfoMaterialAvailable(material) {
    let ubicacionOrigen = "x";
    let ubicacionDestino = "x";
    let cantidad = "x";
    let codsap = material;
    let loteDestino = "x";
    let lote = "x";
    let usuario = "x";
    let pallet = "x";
    let centro = localStorage.getItem("centro");
    let almacen = localStorage.getItem("almacen");
    let bandera = "10";
    let centrodestino = localStorage.getItem("centro");
    let almacendestino = localStorage.getItem("almacen");
    return axios.get(
      `${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${codsap}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}/${almacendestino}/${centrodestino}`,
      { headers: headers }
    );
  },
  async GetOtPending(user) {
    let data = {
      alacenwm: "110",
      tipoAlmacen: "920",
    };

    let response = await axios.post(`${domain}/transporte/lt22`, data, {
      headers: headers,
    });
    response.data.forEach(async (order) => {
      let userName = await axios.get(
        `${domain}/corporativo/empleado/${order.usuario}`
      );
      order.username = userName.data.data[0].NombreEmpleado;
    });

    return response;
  },

  async GetListOtOrder(entrega) {},

  async GetInfoStores(centro, almacenmm = "", almacenWm = "") {
    const url = `${domain}/transporte/wm/infoalmacen`;
    const token = localStorage.getItem("token");
    const headers = {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const data = {
      centro: centro,
      almacenmm: almacenmm,
      almacenWm: almacenWm,
    };

    return axios.post(url, data, { headers });
  },
};


export const InfoEntrega = {

  async saveActionText (entrega, texto, user) {
    let  data = {
      "codDestinatario": "A1",
      "codTipoDoc": "EN",
      "docNo": entrega,
      "texto": texto,
      "accion": "00160",
      "usuario": user
    }

    return axios.post(`${domain}/transporte/grabarAccionTexto`, data, {headers:headers})
  },

  async getGestion(entrega){

      return axios.post(`${domain}/transporte/listaAcciones/`,{
      "codDestinatario": "A1",
      "codTipoDoc": "EN",
      "ordNo": entrega,
      "campoLibre4": null,
      "campoLibre2": null
  },{ headers: headers });
  },

  async RegisterAccionFechahora(entrega, accion){
    let fecha = GetDateHour("F");
    let hora = GetDateHour("H");

    return axios.post(`${domain}/transporte/grabarAccionFecha`,{
      "codDestinatario": "A1",
      "codTipoDoc": "EN",
      "docNo": entrega,
      "fecha": fecha,
      "hora": hora,
      "accion": accion ,
      "usuario": localStorage.getItem('user')
    },{ headers: headers })
  },

  async finishOrder(order, Ot ){

    return axios.post(`${domain}/transporte/apruebaOt/`,{
      "entrega": order,
      "ot": Ot,
      "posicion": ""
    },{ headers: headers })
  },

  async getOrderTranport(entrega, part){
    let data = {
       "noentrega": entrega,
        "tipoInfo": part
    }
    return axios.post(`${domain}/transporte/listotEnterga/`,data, {headers: headers})
  },

  async confirmarPosicion(entrega, pos,ot){
    let data = {            
      "entrega": entrega,
      "ot": ot,
      "posicion": pos
  }
   return axios.post(`${domain}/transporte/apruebaOt/`,data, {headers: headers})
 },

 async confirmarOTCompleta(ot,entrega){
  let data = {            
    "entrega": entrega,
    "ot": ot,
    "posicion": ''
}
 return axios.post(`${domain}/transporte/apruebaOt/`,data, {headers: headers})
},

async Contabilizar(entrega){

  return axios.get(`${domain}/transporte/contab-entrega/${entrega}/x`,{headers:headers})
},

async GetWeight(entrega){ 
  return axios.get(`${domain}/transporte/pesoentrega/${entrega}`,{headers:headers})
},

async getListMt(entrega){
  try {
    const token = localStorage.getItem('token'); // O donde almacenes tu token
    
    const response = await axios.get(
      `${domain}/transporte/ingreso-mt/${entrega}/${localStorage.getItem('centro')}`,
      {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error al consultar ingreso MT:', error);
    throw error;
  }

},
async  getIngresoMaterialInfo( estado = 'L', entrega ,  centro = localStorage.getItem('centro'), almacen = localStorage.getItem('almacen'),consecutivo = '') {
  // Validar que se proporcionen los parámetros requeridos

  
  if (!localStorage.getItem('token')) {
    throw new Error('El token de autorización es requerido');
  }

  try {  // Construir los parámetros de consulta
 
      const params = {
      consecutivo,  
      estado,
      centro,
      almacen,
      entrega
    };
      
    // Hacer la petición GET con axios
    const response = await axios({
      method: 'GET',
      url: `${domain}/transporte/ingreso-mt-info/`,
      params,
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    return response.data;
  } catch (error) {
    // Manejar errores de la petición
    console.error('Error al obtener información de ingreso de material:', error.message);
    
    // Si hay una respuesta con error del servidor
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
      console.error('Código de estado:', error.response.status);
      throw new Error(`Error del servidor: ${error.response.status}`);
    } else if (error.request) {
      // Si la petición fue hecha pero no se recibió respuesta
      throw new Error('No se recibió respuesta del servidor');
    } else {
      // Error en la configuración de la petición
      throw error;
    }
  }
},  

async  enterPallet(VBELN, MATNR, CHARG, PALLET, CENTRO_ING, LGORT, UBICACION1, UBICACION2, POS_ENTREGA, CANTIDAD, COD_USUARIO, BANDERA) {
  try {
    // Validación básica de parámetros requeridos
    if (!VBELN || !MATNR || !PALLET || !CENTRO_ING) {
      throw new Error('Faltan parámetros obligatorios: VBELN, MATNR, PALLET y CENTRO_ING son requeridos');
    }

    const data = {
      VBELN,
      MATNR,
      CHARG,
      PALLET,
      CENTRO_ING,
      LGORT,
      UBICACION1,
      UBICACION2,
      POS_ENTREGA,
      CANTIDAD,
      COD_USUARIO,
      BANDERA
    };
    console.log(data);

    const endpoint = `${domain}/transporte/ingreso-mt-reg/`;
    
    
    const response = await axios.post(endpoint, data, { 
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      timeout: 10000 // Timeout de 10 segundos
    });

    if (typeof response.data.MENSAJE === 'string' && response.data.MENSAJE.includes('|')) {
      const [status, message] = response.data.split('|').map(item => item.trim());
      return {
        success: status.toLowerCase() === 'ok',
        status,
        message,
        raw: response.data
      };
    }
    
    return response.data;
  }catch (error) {
    // Manejo de errores mejorado
    if (error.response) {
      // Error de respuesta del servidor
      console.error(`Error del servidor: ${error.response.status}`, error.response.data);
      throw new Error(`Error al registrar pallet: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // Error de red (no se recibió respuesta)
      console.error('Error de red:', error.request);
      throw new Error('Error de conexión al registrar pallet. Verifique su conexión a internet.');
    } else {
      // Error en la configuración de la solicitud
      console.error('Error:', error.message);
      throw error;
    }
  }
}


}

export const InfoProduct = {

 async GetInfoPallet(pallet,lote,material){

  return axios.get(`${domain}/producto/infopallet/${pallet}/${lote}/${material}`, { headers: headers })

 }


}




function GetDateHour(bandera) {
  const ahora = new Date();
  let response = '';
  const año = ahora.getFullYear();
  const mes = ahora.getMonth() + 1; // Los meses van de 0 a 11
  const dia = ahora.getDate();
  const hora = ahora.getHours();
  const minutos = ahora.getMinutes();
  const segundos = ahora.getSeconds();

  if (bandera === 'F') {
    response = `${año}-${mes}-${dia}`;
  }
  if (bandera === 'H') {
    response = `${hora}:${minutos}:${segundos}`;
  }

  return response;


}
