import { useEffect, useState } from 'react';
import { getHRUpdates } from '../api/hrUpdates.api';

export default function HRUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHRUpdates().then(res => {
      setUpdates(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-itc-bg p-6 rounded-lg max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-h1 font-semibold text-itc-text-primary">
          HR Updates
        </h1>
        <p className="text-muted mt-1">
          Latest announcements and HR communications
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-itc-text-secondary">
          Loading updates…
        </div>
      )}

      {/* Empty */}
      {!loading && updates.length === 0 && (
        <div className="bg-itc-surface border border-itc-border rounded-md p-8 text-center text-itc-text-secondary">
          No HR updates available at the moment.
        </div>
      )}

      {/* Updates */}
      <div className="space-y-5">
        {updates.map(update => (
          <div
            key={update.id}
            className="bg-itc-surface border border-itc-border rounded-md p-5 shadow-sm"
          >
            {/* Title */}
            <h2 className="text-h2 font-medium mb-1">
              {update.title}
            </h2>

            {/* Meta */}
            <div className="text-xs text-muted mb-3">
              Published on{' '}
              {new Date(update.created_at).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>

            {/* Content */}
            <p className="text-body mb-3 whitespace-pre-line">
              {update.content}
            </p>

            {/* Attachments */}
            {update.attachments && update.attachments.length > 0 && (
              <div className="mt-4 pt-3 border-t border-itc-border">
                <p className="text-sm font-medium mb-2">
                  Attachments
                </p>

                <ul className="space-y-1">
                  {update.attachments.map(att => (
                    <li key={att.id}>
                      <a
                        href={att.file_path}
                        target="_blank"
                        rel="noreferrer"
                        className="text-itc-blue hover:underline text-sm"
                      >
                        📎 {att.file_name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
