import axios from 'axios';
 
const api = axios.create({
    baseURL: 'http://localhost:5276/api/', // Ajusta según tu entorno
});
 
// Interceptor para añadir headers automáticamente
api.interceptors.request.use(config => {
    // Obtener datos del usuario desde localStorage
    const usuarioString = localStorage.getItem('usuario');
    const usuarioObj = usuarioString ? JSON.parse(usuarioString) : null;
    // Añadir token de autenticación si existe
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
 
    return config;
}, error => {
    return Promise.reject(error);
});
 
export default api;