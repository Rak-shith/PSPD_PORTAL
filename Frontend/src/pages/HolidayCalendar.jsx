import { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUnits().then(res => {
      setUnits(res.data);
      if (res.data.length) {
        setSelectedUnit(res.data[0].id);
      }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedUnit) {
      setLoading(true);
      getHolidaysByUnit(selectedUnit).then(res => {
        setHolidays(res.data);
      }).finally(() => setLoading(false));
    }
  }, [selectedUnit]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const holidayMap = {};
  holidays.forEach(h => {
    holidayMap[h.holiday_date] = h.name;
  });

  const upcomingHolidays = holidays
    .filter(h => new Date(h.holiday_date) >= today)
    .sort((a, b) => new Date(a.holiday_date) - new Date(b.holiday_date))
    .slice(0, 5);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const goToToday = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };

  const formatMonth = new Date(year, month).toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  if (loading && units.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
  <div className="space-y-6 max-w-7xl mx-auto bg-itc-bg p-6 rounded-lg">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-h1 font-semibold text-itc-text-primary">
          Holiday Calendar
        </h1>
        <p className="text-muted mt-1">
          View unit-wise holidays and plan ahead
        </p>
      </div>

      {/* Unit Selector */}
      <select
        className="bg-itc-surface border border-itc-border rounded-md px-4 py-2
                   font-medium text-itc-text-primary
                   focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
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

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-3 bg-itc-surface border border-itc-border rounded-md shadow-sm">
        {/* Calendar Header */}
        <div className="px-5 py-4 border-b border-itc-border flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-4">
            <h2 className="text-h2 font-medium">
              {formatMonth}
            </h2>
            <button
              onClick={goToToday}
              className="text-sm text-itc-blue font-medium hover:underline"
            >
              Today
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="px-3 py-1 border border-itc-border rounded-md text-itc-text-secondary hover:bg-itc-bg"
            >
              ◀
            </button>
            <button
              onClick={nextMonth}
              className="px-3 py-1 border border-itc-border rounded-md text-itc-text-secondary hover:bg-itc-bg"
            >
              ▶
            </button>
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 bg-itc-bg border-b border-itc-border">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div
              key={d}
              className="text-center text-muted text-sm font-medium py-2"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-px bg-itc-border">
          {days.map((day, idx) => {
            if (!day) {
              return <div key={idx} className="bg-itc-bg h-20 md:h-24" />;
            }

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isHoliday = holidayMap[dateStr];
            const isToday =
              today.getDate() === day &&
              today.getMonth() === month &&
              today.getFullYear() === year;

            return (
              <div
                key={idx}
                className={`
                  h-20 md:h-24 p-2 border border-itc-border relative
                  ${isHoliday ? 'bg-red-50' : 'bg-itc-surface'}
                  ${isToday ? 'ring-2 ring-itc-blue/40' : ''}
                `}
              >
                {/* Holiday accent bar */}  
                {isHoliday && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-red-400 rounded-l" />
                )}
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`text-sm font-semibold ${
                      isToday ? 'text-itc-blue' : 'text-itc-text-primary'
                    }`}
                  >
                    {day}
                  </span>
                </div>

                {isHoliday && (
                  <div className="mt-1 text-xs text-red-700 bg-red-50
                                  border border-red-100 rounded px-1 py-0.5">
                    {isHoliday}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="px-5 py-3 bg-gray-50 border-t border-itc-border flex gap-6 text-xs text-muted">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-100 border border-red-200 rounded"></span>
            Holiday
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-200 rounded"></span>
            Today
          </span>
        </div>
      </div>

      {/* Upcoming Holidays */}
      <div className="bg-itc-surface border border-itc-border rounded-md shadow-sm">
        <div className="px-4 py-3 border-b border-itc-border">
          <h3 className="font-medium text-itc-text-primary">
            Upcoming Holidays
          </h3>
        </div>

        <div className="divide-y">
          {upcomingHolidays.length > 0 ? (
            upcomingHolidays.map((h, i) => (
              <div key={i} className="px-4 py-3">
                <div className="text-sm font-medium">
                  {h.name}
                </div>
                <div className="text-xs text-muted">
                  {new Date(h.holiday_date).toDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-muted text-sm">
              No upcoming holidays
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

}
