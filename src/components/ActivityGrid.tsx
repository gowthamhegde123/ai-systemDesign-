'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useUserProgress } from '@/lib/hooks/useUserProgress';
import { Calendar, ChevronDown } from 'lucide-react';

interface ActivityData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 0 = no activity, 1-4 = activity levels
}

const ActivityGrid: React.FC = () => {
  const { progress } = useUserProgress();
  const [hoveredDay, setHoveredDay] = useState<ActivityData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    years.add(new Date().getFullYear());
    if (progress?.solvedDates) {
      Object.values(progress.solvedDates).forEach(date => {
        years.add(new Date(date).getFullYear());
      });
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [progress]);

  const activityData = useMemo((): ActivityData[] => {
    const data: ActivityData[] = [];
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    const firstSunday = new Date(startDate);
    firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay());

    const solvedByDate: Record<string, number> = {};
    if (progress?.solvedDates) {
      Object.values(progress.solvedDates).forEach(date => {
        if (new Date(date).getFullYear() === selectedYear) {
          solvedByDate[date] = (solvedByDate[date] || 0) + 1;
        }
      });
    }

    const currentDate = new Date(firstSunday);
    while (currentDate <= endDate || data.length % 7 !== 0) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const isCorrectYear = currentDate.getFullYear() === selectedYear;
      const count = isCorrectYear ? (solvedByDate[dateStr] || 0) : 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;

      if (count > 0) {
        if (count === 1) level = 1;
        else if (count === 2) level = 2;
        else if (count <= 4) level = 3;
        else level = 4;
      }

      data.push({
        date: isCorrectYear ? dateStr : '',
        count,
        level
      });

      currentDate.setDate(currentDate.getDate() + 1);
      if (data.length > 400) break;
    }

    return data;
  }, [progress, selectedYear]);

  const weeks = useMemo(() => {
    const w: ActivityData[][] = [];
    let currentWeek: ActivityData[] = [];
    activityData.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        w.push(currentWeek);
        currentWeek = [];
      }
    });
    return w;
  }, [activityData]);

  const getActivityColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-muted/10';
      case 1: return 'bg-green-900/40';
      case 2: return 'bg-green-700/60';
      case 3: return 'bg-green-500/80';
      case 4: return 'bg-green-400';
      default: return 'bg-muted/10';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const monthLabels = useMemo(() => {
    const labels: { month: string, index: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const firstDay = week.find(d => d.date);
      if (firstDay) {
        const m = new Date(firstDay.date).getMonth();
        if (m !== lastMonth) {
          labels.push({ month: new Date(firstDay.date).toLocaleString('en-US', { month: 'short' }), index: i });
          lastMonth = m;
        }
      }
    });
    return labels;
  }, [weeks]);

  const totalSolvedInYear = useMemo(() => {
    return activityData.reduce((acc, curr) => acc + curr.count, 0);
  }, [activityData]);

  const handleMouseEnter = (day: ActivityData, e: React.MouseEvent) => {
    if (!day.date) return;
    setHoveredDay(day);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="relative">
      <div className="bg-muted/5 rounded-3xl p-6 border border-border/40 overflow-visible">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Solve History</h4>
              <p className="text-[10px] font-black text-primary uppercase tracking-tighter">
                {totalSolvedInYear} Architectures Mastered in {selectedYear}
              </p>
            </div>
          </div>

          {/* Styled Dropdown Selector */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-muted/20 hover:bg-muted/30 border border-border/50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <span>{selectedYear}</span>
              <ChevronDown className={clsx("w-3 h-3 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-32 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-[60]"
                >
                  <div className="p-1.5 flex flex-col">
                    {availableYears.map(year => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setIsDropdownOpen(false);
                        }}
                        className={clsx(
                          "w-full px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                          selectedYear === year
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide pb-2">
          <div className="min-w-[750px]">
            <div className="relative h-4 mb-3">
              {monthLabels.map((label, i) => (
                <div
                  key={`${label.month}-${i}`}
                  className="absolute text-[8px] font-black text-muted-foreground/50 uppercase tracking-widest"
                  style={{ left: `${label.index * 13.5}px` }}
                >
                  {label.month}
                </div>
              ))}
            </div>

            <div className="flex gap-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedYear}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-1"
                >
                  {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-1">
                      {week.map((day, dayIdx) => (
                        <motion.div
                          key={day.date || `empty-${weekIdx}-${dayIdx}`}
                          className={clsx(
                            'w-[11px] h-[11px] rounded-[2px] transition-all duration-300',
                            !day.date ? 'bg-transparent pointer-events-none' : getActivityColor(day.level),
                            day.level > 0 && 'cursor-pointer hover:ring-2 hover:ring-primary hover:shadow-[0_0_12px_rgba(34,197,94,0.5)] hover:scale-125 hover:z-10'
                          )}
                          onMouseEnter={(e) => handleMouseEnter(day, e)}
                          onMouseLeave={() => setHoveredDay(null)}
                        />
                      ))}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-4 border-t border-border/10 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest text-center">
              Account Architecture Sync: Online
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Novice</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={clsx('w-2.5 h-2.5 rounded-[1.5px] transition-colors', getActivityColor(level))}
              />
            ))}
            <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Master</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-[200] bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] pointer-events-none"
            style={{ left: mousePosition.x + 20, top: mousePosition.y - 60 }}
          >
            <div className="flex items-center gap-3 mb-1">
              <div className={clsx("w-2 h-2 rounded-full", hoveredDay.count > 0 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-muted/50")} />
              <div className="text-[11px] font-black text-foreground uppercase tracking-tight">
                {hoveredDay.count === 0
                  ? 'Still In Progress'
                  : `${hoveredDay.count} ${hoveredDay.count === 1 ? 'Architecture' : 'Architectures'} Solved`
                }
              </div>
            </div>
            <div className="text-[9px] text-muted-foreground font-black uppercase tracking-widest pl-5 opacity-70">
              {formatDate(hoveredDay.date)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityGrid;