import { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
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
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">My Favorites</h1>

        {loading && <p>Loading...</p>}

        {!loading && favorites.length === 0 && (
          <p className="text-gray-500">No favorites added yet.</p>
        )}

        <div className="grid grid-cols-4 gap-4">
          {favorites.map(app => (
            <ApplicationCard
              key={app.application_id}
              app={{
                id: app.application_id,
                name: app.name,
                description: app.description,
                url: app.url
              }}
              isFavorite={true}
              onChange={loadFavorites}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
