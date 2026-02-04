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
    if (!date || !name || selectedUnits.length === 0) return;

    await api.post('/holidays', {
      holiday_date: date,
      name,
      unit_ids: selectedUnits
    });

    setName('');
    setDate('');
    setSelectedUnits([]);
    alert('Holiday created successfully');
  };

  return (
    <div className="bg-itc-bg p-6 rounded-lg max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-h1 font-semibold text-itc-text-primary">
          Holiday Management
        </h1>
        <p className="text-muted mt-1">
          Create and assign holidays to one or more units
        </p>
      </div>

      {/* Form */}
      <div className="bg-itc-surface border border-itc-border rounded-md p-6 shadow-sm">
        <h2 className="text-h2 font-medium mb-4">
          Create Holiday
        </h2>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-muted mb-1">
            Holiday Date
          </label>
          <input
            type="date"
            className="w-full border border-itc-border rounded-md px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        {/* Name */}
        <div className="mb-6">
          <label className="block text-muted mb-1">
            Holiday Name
          </label>
          <input
            className="w-full border border-itc-border rounded-md px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
            placeholder="Eg: Independence Day"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* Units */}
        <div className="mb-6">
          <label className="block text-muted mb-2">
            Applicable Units
          </label>

          <div className="grid grid-cols-2 gap-3">
            {units.map(u => (
              <label
                key={u.id}
                className="flex items-center gap-2 p-2 border
                           border-itc-border rounded-md hover:bg-itc-bg
                           cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={selectedUnits.includes(u.id)}
                  onChange={() => toggleUnit(u.id)}
                />
                <span className="font-medium">
                  {u.name}
                </span>
              </label>
            ))}
          </div>

          <p className="text-muted text-sm mt-2">
            Select one or more units where this holiday applies
          </p>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            onClick={submit}
            className="bg-itc-blue hover:bg-itc-blue-dark
                       text-white px-6 py-2 rounded-md font-medium transition"
          >
            Create Holiday
          </button>
        </div>
      </div>
    </div>
  );
}
