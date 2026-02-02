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
    await createCategory({ name });
    setName('');
    load();
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Category name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button
          onClick={submit}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <ul className="bg-white rounded shadow divide-y">
        {categories.map(cat => (
          <li key={cat.id} className="p-3">{cat.name}</li>
        ))}
      </ul>
    </div>
  );
}
