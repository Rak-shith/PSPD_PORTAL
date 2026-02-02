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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Holiday Calendar</h1>
          <p className="text-gray-500 mt-1 font-medium">Plan your time and view company-wide holidays.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              value={selectedUnit}
              onChange={e => setSelectedUnit(e.target.value)}
            >
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Calendar Card */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-100 overflow-hidden">
          {/* Calendar Header */}
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold text-gray-800">{formatMonth}</h2>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
              >
                Today
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200 text-gray-600 shadow-sm hover:shadow"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200 text-gray-600 shadow-sm hover:shadow"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Calendar Body */}
          <div className="p-6">
            <div className="grid grid-cols-7 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-100 shadow-inner">
              {days.map((day, idx) => {
                if (!day) return <div key={idx} className="bg-gray-50 h-24 md:h-32" />;

                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isHoliday = holidayMap[dateStr];
                const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

                return (
                  <div
                    key={idx}
                    className={`bg-white h-24 md:h-32 p-2 relative group transition-all duration-300 hover:z-10 hover:shadow-2xl hover:scale-[1.02] ${isToday ? 'bg-blue-50/30' : ''
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isToday ? 'bg-blue-600 text-white animate-pulse' : 'text-gray-800'
                        }`}>
                        {day}
                      </span>
                    </div>

                    {isHoliday && (
                      <div className="mt-2 group-hover:block transition-all duration-300">
                        <div className="bg-red-50 text-red-600 text-[10px] md:text-xs p-1.5 rounded-lg font-bold border border-red-100 leading-tight">
                          <div className="flex items-center mb-0.5">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            Holiday
                          </div>
                          <span className="line-clamp-2">{isHoliday}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center space-x-6">
            <div className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
              <span className="w-3 h-3 bg-red-100 border border-red-200 rounded-full mr-2"></span>
              Public Holiday
            </div>
            <div className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
              <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
              Today
            </div>
          </div>
        </div>

        {/* Side Panel: Upcoming Holidays */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Upcoming Holidays</h3>
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="p-2">
              {upcomingHolidays.length > 0 ? (
                upcomingHolidays.map((h, i) => (
                  <div key={i} className="p-3 hover:bg-gray-50 rounded-xl transition-colors group flex items-start space-x-4 border-b last:border-0 border-gray-50">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <span className="text-[10px] font-black uppercase">{new Date(h.holiday_date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-lg font-black leading-none">{new Date(h.holiday_date).getDate()}</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-sm font-extrabold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{h.name}</h4>
                      <p className="text-xs font-bold text-gray-400 mt-0.5">
                        {new Date(h.holiday_date).toLocaleDateString('default', { weekday: 'long' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-gray-400">
                  <p className="text-sm font-bold italic">No upcoming holidays</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
