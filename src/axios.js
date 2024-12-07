import axios from 'axios';

// Crear instancia de Axios con la configuración base
const instance = axios.create({
  baseURL: 'http://localhost:8000/',  // Cambia si tu API está en otro puerto o URL
  withCredentials: true, // Permitir envío de cookies

});

export default instance;
