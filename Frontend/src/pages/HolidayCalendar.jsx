import { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { getUnits, getHolidaysByUnit } from '../api/holidays.api';
import {
  getDaysInMonth,
  getFirstDayOfMonth
} from '../utils/calendar';

export default function HolidayCalendar() {
  const today = new Date();

  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [holidays, setHolidays] = useState([]);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  useEffect(() => {
    getUnits().then(res => {
      setUnits(res.data);
      if (res.data.length) {
        setSelectedUnit(res.data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedUnit) {
      getHolidaysByUnit(selectedUnit).then(res => {
        setHolidays(res.data);
      });
    }
  }, [selectedUnit]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const holidayMap = {};
  holidays.forEach(h => {
    holidayMap[h.holiday_date] = h.name;
  });

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">
          Holiday Calendar
        </h1>

        {/* Unit Selector */}
        <div className="mb-4">
          <label className="mr-2 font-medium">Unit:</label>
          <select
            className="border p-2"
            value={selectedUnit}
            onChange={e => setSelectedUnit(e.target.value)}
          >
            {units.map(unit => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-4 mb-4">
          <button
            className="px-2 py-1 border"
            onClick={() => setMonth(m => (m === 0 ? 11 : m - 1))}
          >
            ◀
          </button>

          <span className="font-semibold">
            {new Date(year, month).toLocaleString('default', {
              month: 'long',
              year: 'numeric'
            })}
          </span>

          <button
            className="px-2 py-1 border"
            onClick={() => setMonth(m => (m === 11 ? 0 : m + 1))}
          >
            ▶
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="font-semibold">{d}</div>
          ))}

          {days.map((day, idx) => {
            if (!day) return <div key={idx} />;

            const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const isHoliday = holidayMap[dateStr];

            return (
              <div
                key={idx}
                className={`border p-2 h-20 text-sm ${
                  isHoliday
                    ? 'bg-red-100 border-red-400'
                    : 'bg-white'
                }`}
              >
                <div className="font-medium">{day}</div>
                {isHoliday && (
                  <div className="text-red-700 text-xs mt-1">
                    {isHoliday}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
