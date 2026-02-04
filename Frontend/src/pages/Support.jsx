import { useEffect, useState } from 'react';
import { getSupport } from '../api/support.api';

export default function Support() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState('');

  const load = async () => {
    const res = await getSupport(search);
    setTeams(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="bg-itc-bg p-6 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-h1 font-semibold text-itc-text-primary">
          Support Directory
        </h1>
        <p className="text-muted mt-1">
          Contact internal support teams for assistance
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <span className="absolute inset-y-0 left-3 flex items-center text-itc-text-secondary">
          🔍
        </span>
        <input
          className="w-full border border-itc-border rounded-md pl-9 pr-3 py-2
                     bg-itc-surface text-body
                     focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
          placeholder="Search by team name or service"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyUp={load}
        />
      </div>

      {/* Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map(t => (
          <div
            key={t.id}
            className="bg-itc-surface border border-itc-border
                       rounded-md p-5 shadow-sm
                       hover:shadow-md transition"
          >
            <h3 className="text-h3 font-semibold mb-1">
              {t.team_name}
            </h3>

            <p className="text-muted text-sm mb-4">
              {t.description}
            </p>

            <div className="space-y-1 text-body">
              <p>
                📧{' '}
                <a
                  href={`mailto:${t.email}`}
                  className="text-itc-blue hover:underline"
                >
                  {t.email}
                </a>
              </p>

              <p>
                📞{' '}
                <a
                  href={`tel:${t.phone}`}
                  className="text-itc-blue hover:underline"
                >
                  {t.phone}
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {teams.length === 0 && (
        <div className="mt-8 text-center text-itc-text-secondary">
          No support teams found.
        </div>
      )}
    </div>
  );
}
