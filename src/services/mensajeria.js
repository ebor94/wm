// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://lilix.ceramicaitalia.com:3001',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const MessageService = {
  async sendSms(number, message) {
     try {
    const response = await axios({
      method: 'POST',
      url: 'https://lilix.ceramicaitalia.com:3001/mensajeria/sms/',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        phoneNumber: number,
        message: message
      }
    });
    
    console.log('SMS enviado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error enviando SMS:', error);
    throw error;
  }
  }
}

export default api