import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../store/applications.store';
import { useDebounce } from '../hooks/useDebounce';
import CompactApplicationCard from '../components/cards/CompactApplicationCard';

export default function HomeNew() {
    const navigate = useNavigate();
    const { apps, categories, favoriteIds, loading, refreshFavorites, refreshAll } = useApplications();
    const [selectedCategory, setSelectedCategory] = useState('Finance');
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Refresh data when component mounts to show newly added content
    useEffect(() => {
        refreshAll();
    }, []);

    // Filter applications based on search query and selected category
    const filteredApps = apps.filter(app => {
        // If there's a search query, search across all categories
        if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.toLowerCase();
            return (
                app.name.toLowerCase().includes(query) ||
                app.description?.toLowerCase().includes(query) ||
                app.category.toLowerCase().includes(query)
            );
        }
        // Otherwise, filter by selected category
        return app.category === selectedCategory;
    });

    // Determine if we're in search mode
    const isSearching = debouncedSearchQuery.trim().length > 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-itc-blue"></div>
            </div>
        );
    }

    return (
        <div className="flex gap-6">
            {/* Main Content - Left Side */}
            <div className="flex-1 space-y-6">
                {/* Search Bar */}
                <div className="bg-itc-surface rounded-xl shadow-sm p-4 border border-itc-border">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-itc-blue focus:border-transparent text-sm"
                            placeholder="Search applications across all categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Tabs - Hidden when searching */}
                {!isSearching && (
                    <div className="bg-itc-surface rounded-xl shadow-sm p-3 border border-itc-border">
                        <div className="flex flex-wrap gap-2">
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
                )}

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
                                    {isSearching ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H3" />
                                    )}
                                </svg>
                            </div>
                            <h3 className="text-base font-medium text-itc-text-primary">
                                {isSearching ? 'No applications found' : 'No applications in this category'}
                            </h3>
                            <p className="text-sm text-itc-text-secondary mt-1">
                                {isSearching
                                    ? `No results for "${searchQuery}". Try a different search term.`
                                    : 'Try selecting a different category'
                                }
                            </p>
                            {isSearching && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-4 px-4 py-2 bg-itc-blue text-white rounded-lg text-sm font-medium hover:bg-itc-blue-dark transition-colors"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side Panel */}
            <div className="w-80 space-y-4">
                {/* Quick Actions Widget */}
                <div className="bg-itc-surface rounded-xl shadow-sm border border-itc-border p-5">
                    <h3 className="text-base font-semibold text-itc-text-primary mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-itc-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/hr-updates')}
                            className="w-full px-4 py-3 bg-itc-blue text-white text-sm font-semibold rounded-lg hover:bg-itc-blue-dark transition-all shadow-sm hover:shadow-md flex items-center justify-between group"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                                HR Updates
                            </span>
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => navigate('/holidays')}
                            className="w-full px-4 py-3 bg-itc-surface border-2 border-itc-border text-itc-text-primary text-sm font-semibold rounded-lg hover:border-itc-blue hover:text-itc-blue transition-all flex items-center justify-between group"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Holiday Calendar
                            </span>
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Important Links Widget */}
                {/* <div className="bg-itc-surface rounded-xl shadow-sm border border-itc-border p-5">
                    <h3 className="text-base font-semibold text-itc-text-primary mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-itc-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Important Links
                    </h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => navigate('/contacts')}
                            className="w-full px-3 py-2.5 text-left text-sm text-itc-text-primary hover:bg-itc-bg rounded-lg transition-colors flex items-center justify-between group"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-itc-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Important Contacts
                            </span>
                            <svg className="w-4 h-4 text-itc-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => navigate('/support')}
                            className="w-full px-3 py-2.5 text-left text-sm text-itc-text-primary hover:bg-itc-bg rounded-lg transition-colors flex items-center justify-between group"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-itc-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                IT Support
                            </span>
                            <svg className="w-4 h-4 text-itc-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div> */}

                {/* Stats Widget */}
                {/* <div className="bg-gradient-to-br from-itc-blue to-blue-600 rounded-xl shadow-sm p-5 text-white">
                    <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Quick Stats
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-90">Total Applications</span>
                            <span className="text-2xl font-bold">{apps.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-90">Categories</span>
                            <span className="text-2xl font-bold">{categories.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-90">Favorites</span>
                            <span className="text-2xl font-bold">{favoriteIds.length}</span>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}
