import { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { getContacts } from '../api/contacts.api';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');

  const load = async () => {
    const res = await getContacts(search);
    setContacts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Important Contacts</h1>

        <input
          className="border p-2 mb-4 w-full max-w-md"
          placeholder="Search by name / department"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyUp={load}
        />

        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Designation</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c.id} className="border-b">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.designation}</td>
                <td className="p-2">{c.department}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {contacts.length === 0 && (
          <p className="text-gray-500 mt-4">No contacts found.</p>
        )}
      </div>
    </div>
  );
}
