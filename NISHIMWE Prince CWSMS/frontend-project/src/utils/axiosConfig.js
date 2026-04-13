import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add loading indicators here if needed
        console.log('Making request to:', config.url);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response received from:', response.config.url);
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.status, error.response?.data);
        
        if (error.response?.status === 401) {
            console.log('Unauthorized - redirecting to login');
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/login';
        } else if (error.response?.status === 403) {
            console.log('Forbidden - insufficient permissions');
            toast.error('You don\'t have permission to perform this action');
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;