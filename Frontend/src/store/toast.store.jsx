import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { setToastFunctions } from '../api/axios';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        const newToast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);

        // Auto-dismiss after duration
        if (duration > 0) {
            setTimeout(() => {
                hideToast(id);
            }, duration);
        }

        return id;
    }, []);

    const hideToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showSuccess = useCallback((message, duration = 5000) => {
        return showToast(message, 'success', duration);
    }, [showToast]);

    const showError = useCallback((message, duration = 5000) => {
        return showToast(message, 'error', duration);
    }, [showToast]);

    const showInfo = useCallback((message, duration = 5000) => {
        return showToast(message, 'info', duration);
    }, [showToast]);

    const showWarning = useCallback((message, duration = 5000) => {
        return showToast(message, 'warning', duration);
    }, [showToast]);

    // Register toast functions with axios interceptors
    useEffect(() => {
        setToastFunctions(showSuccess, showError);
    }, [showSuccess, showError]);

    return (
        <ToastContext.Provider value={{
            toasts,
            showToast,
            hideToast,
            showSuccess,
            showError,
            showInfo,
            showWarning
        }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};
