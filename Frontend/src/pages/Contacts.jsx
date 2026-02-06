import { useEffect, useState } from 'react';
import { getContacts } from '../api/contacts.api';
import { useDebounce } from '../hooks/useDebounce';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const load = async () => {
    const res = await getContacts(debouncedSearch);
    setContacts(res.data);
  };

  useEffect(() => {
    load();
  }, [debouncedSearch]);

  return (
    <div className="bg-itc-bg p-6 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h1 font-semibold text-itc-text-primary">
          Important Contacts
        </h1>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <span className="absolute inset-y-0 left-3 flex items-center text-itc-text-secondary">
          🔍
        </span>
        <input
          className="w-full border border-itc-border rounded-md pl-9 pr-3 py-2 text-body
                     focus:outline-none focus:ring-2 focus:ring-itc-blue/30
                     bg-itc-surface"
          placeholder="Search by name, designation or department"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-itc-surface border border-itc-border rounded-md overflow-hidden shadow-sm">
        <table className="w-full text-body">
          <thead className="bg-gray-50">
            <tr className="border-b border-itc-border">
              <th className="px-4 py-3 text-left text-muted font-medium">Name</th>
              <th className="px-4 py-3 text-left text-muted font-medium">Designation</th>
              <th className="px-4 py-3 text-left text-muted font-medium">Department</th>
              <th className="px-4 py-3 text-left text-muted font-medium">Email</th>
              <th className="px-4 py-3 text-left text-muted font-medium">Phone</th>
            </tr>
          </thead>

          <tbody>
            {contacts.map(c => (
              <tr
                key={c.id}
                className="border-b last:border-b-0 hover:bg-itc-bg transition"
              >
                <td className="px-4 py-3 font-medium">
                  {c.name}
                </td>
                <td className="px-4 py-3 text-itc-text-secondary">
                  {c.designation}
                </td>
                <td className="px-4 py-3 text-itc-text-secondary">
                  {c.department}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`mailto:${c.email}`}
                    className="text-itc-blue hover:underline"
                  >
                    {c.email}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`tel:${c.phone}`}
                    className="text-itc-blue hover:underline"
                  >
                    {c.phone}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {contacts.length === 0 && (
          <div className="p-8 text-center text-itc-text-secondary">
            No contacts found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
