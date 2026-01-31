import { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import api from '../api/axios';
import ApplicationCard from '../components/cards/ApplicationCard';
import { getFavorites } from '../api/favorites.api';

export default function Home() {
  const [apps, setApps] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const loadData = async () => {
    const [appsRes, favRes] = await Promise.all([
      api.get('/applications'),
      getFavorites()
    ]);

    setApps(appsRes.data);
    setFavoriteIds(favRes.data.map(f => f.application_id));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold mb-4">Applications</h1>

        <div className="grid grid-cols-4 gap-4">
          {apps.map(app => (
            <ApplicationCard
              key={app.id}
              app={app}
              isFavorite={favoriteIds.includes(app.id)}
              onChange={loadData}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
