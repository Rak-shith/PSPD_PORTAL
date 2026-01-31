import { useState } from 'react';
import { addFavorite, removeFavorite } from '../../api/favorites.api';

export default function ApplicationCard({ app, isFavorite, onChange }) {
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async () => {
    try {
      setLoading(true);
      if (isFavorite) {
        await removeFavorite(app.application_id || app.id);
      } else {
        await addFavorite(app.id);
      }
      onChange();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition relative">
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className="absolute top-2 right-2 text-xl"
        title="Toggle Favorite"
      >
        {isFavorite ? '⭐' : '☆'}
      </button>

      <h3 className="font-semibold">{app.name}</h3>
      <p className="text-sm text-gray-600 mb-2">
        {app.description}
      </p>

      <a
        href={app.url}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 text-sm"
      >
        Open Application
      </a>
    </div>
  );
}
