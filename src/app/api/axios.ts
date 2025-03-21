import axios from 'axios';
import Cookies from 'js-cookie';
// const baseUrl = "https://policiadigitalchaco.com.ar/VERIFICACIONES_API/api/"
const baseUrl = "http://localhost:5082/api/"
// Creamos una instancia de axios con la URL base

const instance = axios.create({
    baseURL: baseUrl,

})

instance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('AuthToken'); // Recupera el token desde la cookie
        // Si el token existe, lo agregamos al header Authorization
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config; // No olvides devolver el config modificado
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Exportamos la instancia
export default instance