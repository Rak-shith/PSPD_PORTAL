import { createContext, useContext, useState, useEffect } from 'react';
import { setLoadingFunctions } from '../api/axios';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loadingCount, setLoadingCount] = useState(0);
    const [showLoader, setShowLoader] = useState(false);

    const startLoading = () => {
        setLoadingCount(prev => prev + 1);
    };

    const stopLoading = () => {
        setLoadingCount(prev => Math.max(0, prev - 1));
    };

    const isLoading = loadingCount > 0;

    // Delay showing loader to prevent flicker on fast requests
    useEffect(() => {
        let timer;

        if (isLoading) {
            // Only show loader if loading takes more than 200ms
            timer = setTimeout(() => {
                setShowLoader(true);
            }, 200);
        } else {
            // Hide immediately when loading completes
            setShowLoader(false);
        }

        return () => clearTimeout(timer);
    }, [isLoading]);

    // Register loading functions with axios interceptors
    useEffect(() => {
        setLoadingFunctions(startLoading, stopLoading);
    }, []);

    return (
        <LoadingContext.Provider value={{ isLoading: showLoader, startLoading, stopLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within LoadingProvider');
    }
    return context;
};
