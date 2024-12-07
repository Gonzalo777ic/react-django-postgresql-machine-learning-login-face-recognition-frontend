import axios from 'axios';

// Función para obtener el token CSRF
export const getCSRFToken = async () => {
    try {
        const response = await axios.get('http://localhost:8000/csrf/', { withCredentials: true });
        const csrfToken = response.data.csrfToken;

        // Configura Axios para incluir el token CSRF en todas las solicitudes
        axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
        console.log('CSRF Token:', csrfToken);


        console.log('CSRF Token configurado:', csrfToken);
    } catch (error) {
        console.error('Error al obtener el token CSRF:', error);
    }
};
