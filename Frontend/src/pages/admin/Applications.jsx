import { useEffect, useState } from 'react';
import { getApplications, createApplication } from '../../api/applications.api';
import { getCategories } from '../../api/categories.api';

export default function ApplicationsAdmin() {
  const [apps, setApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    url: '',
    image_url: '',
    category_id: ''
  });

  const load = async () => {
    setApps((await getApplications()).data);
    setCategories((await getCategories()).data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    await createApplication(form);
    setForm({
      name: '',
      description: '',
      url: '',
      image_url: '',
      category_id: ''
    });
    load();
  };

  return (
    <div className="bg-itc-bg p-6 rounded-lg max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-h1 font-semibold text-itc-text-primary">
          Applications Management
        </h1>
        <p className="text-muted mt-1">
          Add and manage applications visible on the portal
        </p>
      </div>

      {/* Form */}
      <div className="bg-itc-surface border border-itc-border rounded-md p-6 shadow-sm mb-8">
        <h2 className="text-h2 font-medium mb-4">
          Add New Application
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Application Name */}
          <div>
            <label className="block text-muted mb-1">
              Application Name
            </label>
            <input
              className="w-full border border-itc-border rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-muted mb-1">
              Category
            </label>
            <select
              className="w-full border border-itc-border rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
              value={form.category_id}
              onChange={e => setForm({ ...form, category_id: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-muted mb-1">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full border border-itc-border rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-muted mb-1">
              Application URL
            </label>
            <input
              className="w-full border border-itc-border rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
              value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-muted mb-1">
              Image URL
            </label>
            <input
              className="w-full border border-itc-border rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
              value={form.image_url}
              onChange={e => setForm({ ...form, image_url: e.target.value })}
            />
          </div>

          {/* Submit */}
          <div className="col-span-2 text-right mt-2">
            <button
              onClick={submit}
              className="bg-itc-blue hover:bg-itc-blue-dark
                         text-white px-6 py-2 rounded-md font-medium transition"
            >
              Add Application
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-itc-surface border border-itc-border rounded-md shadow-sm">
        <div className="px-6 py-4 border-b border-itc-border">
          <h2 className="text-h2 font-medium">
            Existing Applications
          </h2>
        </div>

        <ul className="divide-y">
          {apps.map(app => (
            <li
              key={app.id}
              className="px-6 py-4 hover:bg-itc-bg transition"
            >
              <div className="font-medium">
                {app.name}
              </div>
              <div className="text-muted text-sm">
                {app.description}
              </div>
            </li>
          ))}
        </ul>

        {apps.length === 0 && (
          <div className="p-8 text-center text-itc-text-secondary">
            No applications added yet.
          </div>
        )}
      </div>
    </div>
  );
}
