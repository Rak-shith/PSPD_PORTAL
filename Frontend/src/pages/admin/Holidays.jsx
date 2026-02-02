import { useEffect, useState } from 'react';
import { getUnits } from '../../api/holidays.api';
import api from '../../api/axios';

export default function HolidaysAdmin() {
  const [units, setUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    getUnits().then(res => setUnits(res.data));
  }, []);

  const toggleUnit = (id) => {
    setSelectedUnits(u =>
      u.includes(id) ? u.filter(x => x !== id) : [...u, id]
    );
  };

  const submit = async () => {
    await api.post('/holidays', {
      holiday_date: date,
      name,
      unit_ids: selectedUnits
    });

    setName('');
    setDate('');
    setSelectedUnits([]);
    alert('Holiday created');
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Create Holiday</h1>

      <input
        type="date"
        className="border p-2 w-full mb-2"
        value={date}
        onChange={e => setDate(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="Holiday name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <div className="mb-4">
        <p className="font-medium mb-2">Units</p>
        {units.map(u => (
          <label key={u.id} className="block">
            <input
              type="checkbox"
              checked={selectedUnits.includes(u.id)}
              onChange={() => toggleUnit(u.id)}
            />
            <span className="ml-2">{u.name}</span>
          </label>
        ))}
      </div>

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Holiday
      </button>
    </div>
  );
}
