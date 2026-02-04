import { useEffect, useState } from 'react';
import { getFavorites } from '../api/favorites.api';
import ApplicationCard from '../components/cards/ApplicationCard';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    const res = await getFavorites();
    setFavorites(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <div className="bg-itc-bg p-6 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-h1 font-semibold text-itc-text-primary">
          My Favorites
        </h1>
        <p className="text-muted mt-1">
          Quick access to your frequently used applications
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-itc-text-secondary">
          Loading favorites…
        </div>
      )}

      {/* Empty */}
      {!loading && favorites.length === 0 && (
        <div className="bg-itc-surface border border-itc-border rounded-md p-8 text-center text-itc-text-secondary">
          You haven’t added any applications to favorites yet.
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {favorites.map(app => (
          <ApplicationCard
            key={app.application_id}
            app={{
              id: app.application_id,
              name: app.name,
              description: app.description,
              url: app.url,
              category: app.category
            }}
            isFavorite={true}
            onChange={loadFavorites}
          />
        ))}
      </div>
    </div>
  );
}
