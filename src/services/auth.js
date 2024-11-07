// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://lilix.ceramicaitalia.com:3001',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const authService = {
  login: async (usuario, contraseña) => {
    try {
      const response = await api.post('/transporte/sesionwm/', {
        usuario,
        contraseña,
        bandera: "SESSION"
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default api