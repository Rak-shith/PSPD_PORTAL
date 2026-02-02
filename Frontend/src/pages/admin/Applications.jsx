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
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {['name', 'description', 'url', 'image_url'].map(f => (
          <input
            key={f}
            className="border p-2"
            placeholder={f}
            value={form[f]}
            onChange={e => setForm({ ...form, [f]: e.target.value })}
          />
        ))}

        <select
          className="border p-2"
          value={form.category_id}
          onChange={e => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button
          onClick={submit}
          className="bg-blue-600 text-white py-2 rounded col-span-2"
        >
          Add Application
        </button>
      </div>

      <ul className="bg-white rounded shadow divide-y">
        {apps.map(app => (
          <li key={app.id} className="p-3">
            {app.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
