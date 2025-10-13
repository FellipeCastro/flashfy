import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Não redirecionar se já estiver na página de login
        const isLoginPage = window.location.pathname === '/login';
        
        if (error.response?.status === 401 && !isLoginPage) {
            console.warn(
                "Token inválido ou expirado. Redirecionando para login..."
            );
            localStorage.removeItem("authToken");
            localStorage.removeItem("idUser");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;