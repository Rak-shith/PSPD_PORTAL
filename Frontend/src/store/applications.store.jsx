import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { getFavorites } from '../api/favorites.api';
import { getCategories } from '../api/categories.api';

const ApplicationsContext = createContext();

export const ApplicationsProvider = ({ children }) => {
    const [apps, setApps] = useState([]);
    const [categories, setCategories] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    const loadData = async (force = false) => {
        // Skip if already loaded and not forcing refresh
        if (initialized && !force) {
            return;
        }

        setLoading(true);
        try {
            const [appsRes, favRes, catRes] = await Promise.all([
                api.get('/applications'),
                getFavorites(),
                getCategories()
            ]);

            setApps(appsRes.data);
            setFavoriteIds(favRes.data.map(f => f.application_id));
            setCategories(catRes.data);
            setInitialized(true);
        } catch (error) {
            console.error('Failed to load applications data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    // Refresh only favorites (useful after adding/removing favorites)
    const refreshFavorites = async () => {
        try {
            const favRes = await getFavorites();
            setFavoriteIds(favRes.data.map(f => f.application_id));
        } catch (error) {
            console.error('Failed to refresh favorites:', error);
        }
    };

    // Refresh all data
    const refreshAll = () => {
        loadData(true);
    };

    const value = {
        apps,
        categories,
        favoriteIds,
        loading,
        initialized,
        refreshFavorites,
        refreshAll
    };

    return (
        <ApplicationsContext.Provider value={value}>
            {children}
        </ApplicationsContext.Provider>
    );
};

export const useApplications = () => {
    const context = useContext(ApplicationsContext);
    if (!context) {
        throw new Error('useApplications must be used within ApplicationsProvider');
    }
    return context;
};
