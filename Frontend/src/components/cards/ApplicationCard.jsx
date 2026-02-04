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
    <div className="bg-itc-surface border border-itc-border rounded-md p-5
                    hover:shadow-md transition group relative flex flex-col">

      {/* Favorite */}
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className={`absolute top-3 right-3 p-2 rounded-full transition
          ${isFavorite
            ? 'bg-yellow-50 text-yellow-600'
            : 'bg-gray-50 text-gray-300 hover:text-yellow-500'
          }`}
        title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      >
        ★
      </button>

      {/* Icon */}
      <div className="w-12 h-12 rounded-md bg-itc-bg
                      flex items-center justify-center
                      text-itc-blue font-semibold mb-4">
        {app.name.charAt(0).toUpperCase()}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-semibold text-itc-text-primary mb-1 truncate">
          {app.name}
        </h3>

        <p className="text-muted text-sm line-clamp-2">
          {app.description || 'No description available.'}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-itc-border flex items-center justify-between">
        <span className="text-xs text-itc-text-secondary uppercase tracking-wide">
          {app.category || 'Application'}
        </span>

        <a
          href={app.url}
          target="_blank"
          rel="noreferrer"
          className="text-itc-blue font-medium text-sm hover:underline"
        >
          Open →
        </a>
      </div>
    </div>
  );
}
