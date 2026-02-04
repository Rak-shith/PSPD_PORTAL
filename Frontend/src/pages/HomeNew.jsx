import { useState } from 'react';
import { useApplications } from '../store/applications.store';
import CompactApplicationCard from '../components/cards/CompactApplicationCard';

export default function HomeNew() {
    const { apps, categories, favoriteIds, loading, refreshFavorites } = useApplications();
    const [selectedCategory, setSelectedCategory] = useState('all');

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
                        <CompactApplicationCard
                            key={app.id}
                            app={app}
                            isFavorite={favoriteIds.includes(app.id)}
                            onChange={refreshFavorites}
                        />
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
