import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { diaryApi } from '../../api/diary.api';
import type { CalendarEntry } from '../../types/diary.types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function Calendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        // setIsLoading(true);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const data = await diaryApi.getCalendar(year, month);
        setEntries(data);
      } catch (err) {
        console.error('Takvim yüklenemedi:', err);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchCalendar();
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Ayın ilk günü hangi gün (0=Pazar, 6=Cumartesi)
  const startDayOfWeek = monthStart.getDay();

  // Önceki aydan gösterilecek günler
  const paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  // Günlük var mı kontrol et
  const hasEntry = (day: Date) => {
    return entries.some((entry) => isSameDay(new Date(entry.entryDate), day));
  };

  // Günlük detayına git
  const handleDayClick = (day: Date) => {
    const entry = entries.find((e) => isSameDay(new Date(e.entryDate), day));
    if (entry) {
      const dateString = format(day, 'yyyy-MM-dd');
      navigate(`/diary/${dateString}`);
    }
  };

  // Önceki/Sonraki ay
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-100">
          {format(currentDate, 'MMMM yyyy', { locale: tr })}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 text-gray-300 hover:text-cyan-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 text-gray-300 hover:text-cyan-400"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-bold text-cyan-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid - Responsive */}
      <div className="grid grid-cols-7 gap-2">
        {/* Padding days */}
        {Array.from({ length: paddingDays }).map((_, i) => (
          <div key={`padding-${i}`} className="aspect-square" />
        ))}

        {/* Month days */}
        {daysInMonth.map((day) => {
          const hasDiary = hasEntry(day);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => hasDiary && handleDayClick(day)}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-xl
                transition-all duration-300
                ${
                  hasDiary
                    ? 'cursor-pointer bg-cyan-500/20 hover:bg-cyan-500/30 hover:scale-105 border border-cyan-400/30'
                    : 'hover:bg-white/5 border border-white/5'
                }
                ${isCurrentDay ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/20' : ''}
              `}
            >
              <span
                className={`text-sm font-bold ${
                  hasDiary ? 'text-gray-100' : 'text-gray-400'
                }`}
              >
                {format(day, 'd')}
              </span>
              {hasDiary && (
                <Star className="w-4 h-4 text-cyan-400 fill-cyan-400 mt-1 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}