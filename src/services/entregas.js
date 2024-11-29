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
    return axios.get(`${domain}/transporte/detalleEntrega/${entrega}`, {
      headers: headers,
    });
  },
  async getEntregaAcumulada(entrega, posot, ot) {
    
    return axios.get(`${domain}/transporte/alistamientoAcumulado/${entrega}/${posot}/${ot}`, {
      headers: headers,
    });
  },
};

export const InfoWm = {
   
  async GetInfoPallet(pallet){
    let ubicacionOrigen   = 'x'
    let ubicacionDestino  = 'x';
    let cantidad          = 'x';
    let material          = 'x';
    let lote              = 'x';
    let loteDestino       = 'x';
    let usuario           = 'x';
    let centro            = '1100' ;
    let almacen           = '1101' ;
    let bandera           = '2' ;    
    return axios.get(`${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${material}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}`,{headers: headers})
  },

  async RegistryPicking(entrega,posicion,material,lote,consestib,cantbuena,cantrotura,UMBASE,usuario,bandera,IDX,POSOT,OT,TPLECTURA){

    return axios.post(
      `${domain}/transporte/Registraalistamiento`,
      { "entrega"   : entrega,
        "posicion"  : posicion,
        "material"  : material,
        "lote"      : lote,
        "consestib" : consestib,
        "cantbuena" : cantbuena,
        "cantrotura": cantrotura,
        "UMBASE"    : UMBASE,
        "usuario"   : usuario,
        "bandera"   : bandera,
        "IDX"       : IDX,
        "POSOT"     : POSOT,
        "OT"        : OT,
        "TPLECTURA" : TPLECTURA
       },
      { headers: headers }
    );

  },

  async GetInfoLocationMaterialBach(material,lote,pallet){
    let ubicacionOrigen   = 'x'
    let ubicacionDestino  = 'x';
    let cantidad          = 'x';
    let codsap            = material.slice(-6)
    let loteDestino       = 'x';
    let usuario           = 'x';
    let centro            = '1100' ;
    let almacen           = '1101' ;
    let bandera           = '2' ;    
    return axios.get(`${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${codsap}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}`,{headers: headers})
  },

  async MoveMaterial(material,lote,pallet,cantidad, ubicacionOrigen, ubicacionDestino){    
    let codsap            = material.slice(-6)
    let loteDestino       = 'x';
    let usuario           = localStorage.getItem('user');
    let centro            = '1100' ;
    let almacen           = '1101' ;
    let bandera           = '1' ;    
    return axios.get(`${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${codsap}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}`,{headers: headers})
  },
  async SerachLocationStockAvailable(ubicacionOrigen){    
    let ubicacionDestino  = 'x';
    let cantidad          = 'x';
    let codsap            = 'x';
    let loteDestino       = 'x';
    let lote              = 'x';
    let usuario           = 'x';
    let pallet            = 'x';
    let centro            = '1100' ;
    let almacen           = '1101' ;
    let bandera           = '6' ;    
    return axios.get(`${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${codsap}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}`,{headers: headers})
  },
  async ClearLocationStockAvailable(ubicacionOrigen,ubicacionDestino){    
    let cantidad          = 'x';
    let codsap            = 'x';
    let loteDestino       = 'x';
    let lote              = 'x';
    let usuario           = 'x';
    let pallet            = 'x';
    let centro            = '1100' ;
    let almacen           = '1101' ;
    let bandera           = '7' ;    
    return axios.get(`${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${codsap}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}`,{headers: headers})
  },
  async GetInfoMaterialAvailable(material){    
    let ubicacionOrigen   = 'x'
    let ubicacionDestino  = 'x';
    let cantidad          = 'x';
    let codsap            = material;
    let loteDestino       = 'x';
    let lote              = 'x';
    let usuario           = 'x';
    let pallet            = 'x';
    let centro            = '1100' ;
    let almacen           = '1101' ;
    let bandera           = '10' ;    
    return axios.get(`${domain}/transporte/alistamientoWm/${ubicacionOrigen}/${almacen}/${ubicacionDestino}/${centro}/${cantidad}/${codsap}/${lote}/${pallet}/${bandera}/${loteDestino}/${usuario}`,{headers: headers})
  },
  async GetOtPending(user){
    let data = {
      "alacenwm": "110",
      "tipoAlmacen": "920"
  }

   let response = await axios.post(`${domain}/transporte/lt22`,data,{headers: headers})    
      response.data.forEach(async(order) => {
      let userName = await axios.get(`${domain}/corporativo/empleado/${order.usuario}`)
      order.username = userName.data.data[0].NombreEmpleado
      })
      
    return response 
    },

    async GetListOtOrder(entrega){

    }





}


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
