import { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
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
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">HR Updates</h1>

        {loading && <p>Loading...</p>}

        {!loading && updates.length === 0 && (
          <p className="text-gray-500">No HR updates available.</p>
        )}

        <div className="space-y-4">
          {updates.map(update => (
            <div
              key={update.id}
              className="bg-white p-4 rounded shadow"
            >
              <h2 className="text-lg font-semibold">
                {update.title}
              </h2>

              <p className="text-sm text-gray-600 mb-2">
                {new Date(update.created_at).toLocaleString()}
              </p>

              <p className="mb-2">{update.content}</p>

              {update.attachments && update.attachments.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium">Attachments:</p>
                  <ul className="list-disc ml-5">
                    {update.attachments.map(att => (
                      <li key={att.id}>
                        <a
                          href={att.file_path}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600"
                        >
                          {att.file_name}
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
    </div>
  );
}
