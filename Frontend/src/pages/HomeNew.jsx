import { useEffect, useState } from 'react';
import api from '../api/axios';
import { getFavorites } from '../api/favorites.api';
import { getCategories } from '../api/categories.api';

export default function HomeNew() {
    const [apps, setApps] = useState([]);
    const [categories, setCategories] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
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
        } catch (error) {
            console.error('Failed to load home data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredApps = selectedCategory === 'all'
        ? apps
        : apps.filter(app => app.category === selectedCategory);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-itc-blue"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Favorites Section */}
            <div>
                <h2 className="text-lg font-bold text-itc-text-primary mb-4">Favorites</h2>
                <div className="bg-itc-surface rounded-xl p-6 shadow-sm border border-itc-border">
                    <p className="text-sm text-itc-text-secondary">No favorites yet</p>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="bg-itc-surface rounded-xl shadow-sm p-3 border border-itc-border">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${selectedCategory === 'all'
                                ? 'bg-itc-blue text-white shadow-md'
                                : 'bg-transparent text-itc-text-secondary hover:bg-itc-bg'
                            }`}
                    >
                        All Updates
                    </button>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.name)}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${selectedCategory === category.name
                                    ? 'bg-itc-blue text-white shadow-md'
                                    : 'bg-transparent text-itc-text-secondary hover:bg-itc-bg'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Applications Grid */}
            <div className="grid grid-cols-3 gap-4">
                {filteredApps.length > 0 ? (
                    filteredApps.map(app => (
                        <a
                            key={app.id}
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-itc-surface rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-itc-border hover:border-itc-blue group"
                        >
                            <div className="flex items-center gap-4">
                                {/* Icon */}
                                <div className="w-12 h-12 bg-itc-bg rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-itc-blue/10 transition-colors">
                                    {app.icon ? (
                                        <img src={app.icon} alt={app.name} className="w-7 h-7" />
                                    ) : (
                                        <svg className="w-7 h-7 text-itc-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    )}
                                </div>

                                {/* App Name */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-itc-text-primary text-base group-hover:text-itc-blue transition-colors">
                                        {app.name}
                                    </h3>
                                </div>
                            </div>
                        </a>
                    ))
                ) : (
                    <div className="col-span-3 py-16 text-center">
                        <div className="w-16 h-16 bg-itc-bg rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-itc-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H3" />
                            </svg>
                        </div>
                        <h3 className="text-base font-medium text-itc-text-primary">No applications found</h3>
                        <p className="text-sm text-itc-text-secondary mt-1">Try selecting a different category</p>
                    </div>
                )}
            </div>
        </div>
    );
}
