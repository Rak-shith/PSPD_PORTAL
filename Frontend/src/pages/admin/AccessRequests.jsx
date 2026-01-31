import { useEffect, useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import {
  getAccessRequests,
  updateAccessRequest
} from '../../api/accessRequests.api';

export default function AccessRequestsAdmin() {
  const [requests, setRequests] = useState([]);

  const load = async () => {
    setRequests((await getAccessRequests()).data);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, status) => {
    await updateAccessRequest(id, status);
    load();
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Access Requests</h1>

        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="border-b">
              <th className="p-2">User</th>
              <th className="p-2">Application</th>
              <th className="p-2">Reason</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id} className="border-b">
                <td className="p-2">{r.requested_by}</td>
                <td className="p-2">{r.application}</td>
                <td className="p-2">{r.reason}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => update(r.id, 'APPROVED')}
                    className="text-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => update(r.id, 'REJECTED')}
                    className="text-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
