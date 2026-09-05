/*
 * File Path: src/components/WeeklyTickCalendar.jsx
 * Description: Attendance tracking calendar component displaying weekly workout/attendance check-in grids.
 * Props: title (string), personId (string/number), attendance (object), onToggle (func).
 */
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WeeklyTickCalendar({ title, personId, attendance = {}, onToggle }) {
  return (
    <div className="panel">
      <h2 className="mb-4 text-lg font-bold text-ink-900">{title}</h2>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((week) => (
          <div key={week} className="grid grid-cols-8 gap-2">
            <div className="flex items-center text-sm font-bold text-slate-600">Week {week}</div>
            {days.map((day, index) => {
              const dateKey = `2026-07-W${week}-${day}`;
              const checked = Boolean(attendance?.[personId]?.[dateKey]);
              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => onToggle(personId, dateKey)}
                  className={`min-h-14 rounded-lg border text-xs font-bold transition ${
                    checked ? 'border-mint-600 bg-mint-100 text-mint-800' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-teal-300'
                  }`}
                  aria-label={`Toggle ${day} week ${week}`}
                >
                  {day}
                  <span className="block text-lg">{checked ? '✓' : index + 1}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
