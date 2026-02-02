import { useEffect, useState } from 'react';
import api from '../api/axios';
import ApplicationCard from '../components/cards/ApplicationCard';
import CategoryCard from '../components/cards/CategoryCard';
import { getFavorites } from '../api/favorites.api';
import { getCategories } from '../api/categories.api';

export default function Home() {
  const [apps, setApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  const filteredApps = selectedCategory
    ? apps.filter(app => app.category === selectedCategory.name)
    : apps;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Categories Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Categories
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center transition-colors"
            >
              Clear Filter
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all border-2 text-center flex items-center justify-center ${!selectedCategory
                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                : 'bg-white border-transparent text-gray-600 hover:border-gray-200'
              }`}
          >
            All Updates
          </button>
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              isActive={selectedCategory?.id === category.id}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
      </div>

      {/* Applications Section */}
      <div>
        <div className="flex items-center mb-6">
          <div className="h-4 w-1 bg-blue-600 rounded-full mr-3"></div>
          <h2 className="text-xl font-bold text-gray-900">
            {selectedCategory ? `${selectedCategory.name} Applications` : 'All Applications'}
          </h2>
          <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
            {filteredApps.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredApps.length > 0 ? (
            filteredApps.map(app => (
              <ApplicationCard
                key={app.id}
                app={app}
                isFavorite={favoriteIds.includes(app.id)}
                onChange={loadData}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-3.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H3" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No applications here</h3>
              <p className="text-gray-500 mt-1">There are no applications listed for the current selection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
