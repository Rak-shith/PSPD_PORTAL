import { useState } from 'react';
import { createHRUpdate } from '../../api/hrUpdates.api';

export default function HRAdminUpdates() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title || !content) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);

    for (const file of files) {
      formData.append('attachments', file);
    }

    try {
      setLoading(true);
      await createHRUpdate(formData);
      alert('HR update created successfully');

      setTitle('');
      setContent('');
      setStartDate('');
      setEndDate('');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-itc-bg p-6 rounded-lg max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-h1 font-semibold text-itc-text-primary">
          HR Updates Management
        </h1>
        <p className="text-muted mt-1">
          Publish important HR announcements for employees
        </p>
      </div>

      {/* Form */}
      <div className="bg-itc-surface border border-itc-border rounded-md p-6 shadow-sm space-y-5">
        {/* Title */}
        <div>
          <label className="block text-muted mb-1">
            Update Title
          </label>
          <input
            className="w-full border border-itc-border rounded-md px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
            placeholder="Eg: New Leave Policy Update"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-muted mb-1">
            Update Content
          </label>
          <textarea
            rows={5}
            className="w-full border border-itc-border rounded-md px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
            placeholder="Enter detailed information for employees"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-muted mb-1">
              Visible From
            </label>
            <input
              type="date"
              className="w-full border border-itc-border rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-muted mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              className="w-full border border-itc-border rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-muted mb-1">
            Attachments (PDF / Images)
          </label>
          <input
            type="file"
            multiple
            className="block w-full text-sm text-itc-text-secondary
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:bg-itc-bg file:text-itc-text-primary
                       hover:file:bg-gray-100 transition"
            onChange={e => setFiles(e.target.files)}
          />
        </div>

        {/* Submit */}
        <div className="text-right pt-2">
          <button
            onClick={submit}
            disabled={loading}
            className="bg-itc-blue hover:bg-itc-blue-dark
                       text-white px-6 py-2 rounded-md
                       font-medium transition disabled:opacity-60"
          >
            {loading ? 'Publishing…' : 'Publish Update'}
          </button>
        </div>
      </div>
    </div>
  );
}
