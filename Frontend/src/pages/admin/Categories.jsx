import { useEffect, useState } from 'react';
import { getCategories, createCategory } from '../../api/categories.api';

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  const load = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!name.trim()) return;
    await createCategory({ name });
    setName('');
    load();
  };

  return (
    <div className="bg-itc-bg p-6 rounded-lg max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-h1 font-semibold text-itc-text-primary">
          Category Master
        </h1>
        <p className="text-muted mt-1">
          Manage application categories used across the portal
        </p>
      </div>

      {/* Add Category */}
      <div className="bg-itc-surface border border-itc-border rounded-md p-6 shadow-sm mb-6">
        <h2 className="text-h2 font-medium mb-4">
          Add New Category
        </h2>

        <div className="flex gap-3">
          <input
            className="flex-1 border border-itc-border rounded-md px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
            placeholder="Enter category name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <button
            onClick={submit}
            className="bg-itc-blue hover:bg-itc-blue-dark
                       text-white px-5 rounded-md font-medium transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-itc-surface border border-itc-border rounded-md shadow-sm">
        <div className="px-6 py-4 border-b border-itc-border">
          <h2 className="text-h2 font-medium">
            Existing Categories
          </h2>
        </div>

        <ul className="divide-y">
          {categories.map(cat => (
            <li
              key={cat.id}
              className="px-6 py-3 hover:bg-itc-bg transition"
            >
              <span className="font-medium">
                {cat.name}
              </span>
            </li>
          ))}
        </ul>

        {categories.length === 0 && (
          <div className="p-8 text-center text-itc-text-secondary">
            No categories created yet.
          </div>
        )}
      </div>
    </div>
  );
}
