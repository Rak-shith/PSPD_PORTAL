import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true
});

// Store reference to loading functions
let loadingStart = null;
let loadingStop = null;

// Store reference to toast functions
let toastSuccess = null;
let toastError = null;

// Function to set loading functions from the context
export const setLoadingFunctions = (start, stop) => {
    loadingStart = start;
    loadingStop = stop;
};

// Function to set toast functions from the context
export const setToastFunctions = (showSuccess, showError) => {
    toastSuccess = showSuccess;
    toastError = showError;
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

// Response interceptor - Stop loading and show toasts
api.interceptors.response.use(
    (response) => {
        if (loadingStop) {
            loadingStop();
        }

        // Show success toast if message exists and showToast flag is set
        if (toastSuccess && response.config.showSuccessToast && response.data?.message) {
            toastSuccess(response.data.message);
        }

        return response;
    },
    (error) => {
        if (loadingStop) {
            loadingStop();
        }

        // Show error toast
        if (toastError) {
            let errorMessage = 'An error occurred';

            if (error.response?.data?.message) {
                // Backend provided error message
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                // Alternative error field
                errorMessage = error.response.data.error;
            } else if (error.message === 'Network Error') {
                errorMessage = 'Network error. Please check your connection.';
            } else if (error.response?.status === 401) {
                errorMessage = 'Unauthorized. Please login again.';
            } else if (error.response?.status === 403) {
                errorMessage = 'Access forbidden.';
            } else if (error.response?.status === 404) {
                errorMessage = 'Resource not found.';
            } else if (error.response?.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            toastError(errorMessage);
        }

        return Promise.reject(error);
    }
);

export default api;
