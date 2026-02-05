import { useState } from 'react';
import { addFavorite, removeFavorite } from '../../api/favorites.api';

export default function CompactApplicationCard({ app, isFavorite, onChange }) {
    const [loading, setLoading] = useState(false);

    const toggleFavorite = async (e) => {
        e.preventDefault(); // Prevent navigation when clicking star
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
        <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-itc-surface rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-itc-border hover:border-itc-blue group relative"
        >
            {/* Favorite Star */}
            <button
                onClick={toggleFavorite}
                disabled={loading}
                className={`absolute top-4 right-4 p-1.5 rounded-full transition-all z-10 ${isFavorite
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-gray-300 hover:text-yellow-500'
                    }`}
                title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            >
                <svg
                    className="w-5 h-5"
                    fill={isFavorite ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                </svg>
            </button>

            <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-itc-bg rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-itc-blue/10 transition-colors">
                    {app.icon || app.image_url ? (
                        <img src={app.icon || app.image_url} alt={app.name} className="w-7 h-7 object-contain" />
                    ) : (
                        <svg className="w-7 h-7 text-itc-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    )}
                </div>

                {/* App Name */}
                <div className="flex-1 min-w-0 pr-6">
                    <h3 className="font-semibold text-itc-text-primary text-base group-hover:text-itc-blue transition-colors truncate">
                        {app.name}
                    </h3>
                    {app.description && (
                        <p className="text-xs text-itc-text-secondary mt-0.5 truncate">
                            {app.description}
                        </p>
                    )}
                </div>
            </div>
        </a>
    );
}
