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
    <div className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-100 transition-all duration-300 relative flex flex-col h-full transform hover:-translate-y-1">
      {/* Favorite Button */}
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${isFavorite
            ? 'bg-yellow-50 text-yellow-500'
            : 'bg-gray-50 text-gray-300 hover:text-yellow-400'
          }`}
        title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      >
        <svg className={`w-5 h-5 ${isFavorite ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>

      {/* App Icon Placeholder */}
      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-5 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
        {app.name.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate mb-2">
          {app.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed h-10">
          {app.description || 'No description available for this application.'}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
          {app.category}
        </span>

        <a
          href={app.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors group/link"
        >
          Explore
          <svg className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
