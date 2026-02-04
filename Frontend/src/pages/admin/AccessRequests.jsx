import { useEffect, useState } from 'react';
import {
  getAccessRequests,
  updateAccessRequest
} from '../../api/accessRequests.api';
import { useToast } from '../../store/toast.store';

export default function AccessRequestsAdmin() {
  const { showSuccess } = useToast();
  const [requests, setRequests] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const load = async () => {
    setRequests((await getAccessRequests()).data);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, status) => {
    try {
      setLoadingId(id);
      await updateAccessRequest(id, status);
      load();
      showSuccess(`Access request ${status.toLowerCase()} successfully!`);
    } finally {
      setLoadingId(null);
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-itc-success';
      case 'REJECTED':
        return 'bg-red-100 text-itc-danger';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="bg-itc-bg p-6 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-h1 font-semibold text-itc-text-primary">
          Access Requests
        </h1>
        <p className="text-muted mt-1">
          Review and manage application access requests
        </p>
      </div>

      {/* Table */}
      <div className="bg-itc-surface border border-itc-border rounded-md shadow-sm overflow-hidden">
        <table className="w-full text-body">
          <thead className="bg-gray-50">
            <tr className="border-b border-itc-border">
              <th className="px-4 py-3 text-left text-muted font-medium">
                User
              </th>
              <th className="px-4 py-3 text-left text-muted font-medium">
                Application
              </th>
              <th className="px-4 py-3 text-left text-muted font-medium">
                Reason
              </th>
              <th className="px-4 py-3 text-left text-muted font-medium">
                Status
              </th>
              <th className="px-4 py-3 text-left text-muted font-medium">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {requests.map(r => (
              <tr
                key={r.id}
                className="border-b last:border-b-0 hover:bg-itc-bg transition"
              >
                <td className="px-4 py-3 font-medium">
                  {r.requested_by}
                </td>

                <td className="px-4 py-3">
                  {r.application}
                </td>

                <td className="px-4 py-3 text-itc-text-secondary">
                  {r.reason}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(r.status)}`}
                  >
                    {r.status}
                  </span>
                </td>

                <td className="px-4 py-3 space-x-2">
                  {r.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => update(r.id, 'APPROVED')}
                        disabled={loadingId === r.id}
                        className="px-3 py-1 rounded-md text-white
                                   bg-itc-success hover:opacity-90 transition"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => update(r.id, 'REJECTED')}
                        disabled={loadingId === r.id}
                        className="px-3 py-1 rounded-md text-white
                                   bg-itc-danger hover:opacity-90 transition"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-muted text-sm">
                      Action completed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {requests.length === 0 && (
          <div className="p-8 text-center text-itc-text-secondary">
            No access requests available.
          </div>
        )}
      </div>
    </div>
  );
}
