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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">
        Create HR Update
      </h1>

      <div className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Content"
          rows={5}
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <div className="flex gap-4">
          <input
            type="date"
            className="border p-2 w-full"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="border p-2 w-full"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

        <input
          type="file"
          multiple
          onChange={e => setFiles(e.target.files)}
        />

        <button
          onClick={submit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
