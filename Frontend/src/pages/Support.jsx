import { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
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
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Support</h1>

        <input
          className="border p-2 mb-4 w-full max-w-md"
          placeholder="Search support team"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyUp={load}
        />

        <div className="grid grid-cols-3 gap-4">
          {teams.map(t => (
            <div
              key={t.id}
              className="bg-white p-4 rounded shadow"
            >
              <h3 className="font-semibold">{t.team_name}</h3>
              <p className="text-sm text-gray-600">
                {t.description}
              </p>

              <p className="mt-2 text-sm">
                📧 {t.email}
              </p>
              <p className="text-sm">
                📞 {t.phone}
              </p>
            </div>
          ))}
        </div>

        {teams.length === 0 && (
          <p className="text-gray-500 mt-4">
            No support teams found.
          </p>
        )}
      </div>
    </div>
  );
}
