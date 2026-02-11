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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {format(currentDate, 'MMMM yyyy', { locale: tr })}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

        {/* Calendar Grid - Responsive */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
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
                aspect-square flex flex-col items-center justify-center rounded-lg
                transition-all
                ${hasDiary ? 'cursor-pointer bg-primary-50 hover:bg-primary-100' : 'hover:bg-gray-50'}
                ${isCurrentDay ? 'ring-2 ring-primary-500' : ''}
                `}
            >
                <span
                className={`text-xs sm:text-sm font-medium ${
                    hasDiary ? 'text-primary-900' : 'text-gray-700'
                }`}
                >
                {format(day, 'd')}
                </span>
                {hasDiary && (
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500 mt-0.5 sm:mt-1" />
                )}
            </div>
            );
        })}
        </div>
    </div>
  );
}