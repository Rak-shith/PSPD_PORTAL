import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true
});

// Store reference to loading functions
let loadingStart = null;
let loadingStop = null;

// Function to set loading functions from the context
export const setLoadingFunctions = (start, stop) => {
    loadingStart = start;
    loadingStop = stop;
};

// Request interceptor - Start loading
api.interceptors.request.use(
    (config) => {
        if (loadingStart) {
            loadingStart();
        }
        return config;
    },
    (error) => {
        if (loadingStop) {
            loadingStop();
        }
        return Promise.reject(error);
    }
);

// Response interceptor - Stop loading
api.interceptors.response.use(
    (response) => {
        if (loadingStop) {
            loadingStop();
        }
        return response;
    },
    (error) => {
        if (loadingStop) {
            loadingStop();
        }
        return Promise.reject(error);
    }
);

export default api;
