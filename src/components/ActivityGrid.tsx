'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useUserProgress } from '@/lib/hooks/useUserProgress';

interface ActivityData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 0 = no activity, 1-4 = activity levels
}

const ActivityGrid: React.FC = () => {
  const { progress } = useUserProgress();
  const [hoveredDay, setHoveredDay] = useState<ActivityData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Generate activity data based on user progress
  const generateActivityData = (): ActivityData[] => {
    const data: ActivityData[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 12);
    
    // Start from the first Sunday before the start date
    const firstSunday = new Date(startDate);
    firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay());
    
    const currentDate = new Date(firstSunday);
    
    // Count solved questions by date
    const solvedByDate: Record<string, number> = {};
    if (progress?.solvedDates) {
      Object.values(progress.solvedDates).forEach(date => {
        solvedByDate[date] = (solvedByDate[date] || 0) + 1;
      });
    }
    
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = solvedByDate[dateStr] || 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      
      if (count > 0) {
        if (count === 1) level = 1;
        else if (count <= 2) level = 2;
        else if (count <= 3) level = 3;
        else level = 4;
      }
      
      data.push({
        date: dateStr,
        count,
        level
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };

  const activityData = generateActivityData();
  
  // Group data by weeks
  const weeks: ActivityData[][] = [];
  let currentWeek: ActivityData[] = [];
  
  activityData.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  const getActivityColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-muted/30';
      case 1: return 'bg-green-500/30';
      case 2: return 'bg-green-500/50';
      case 3: return 'bg-green-500/70';
      case 4: return 'bg-green-500';
      default: return 'bg-muted/30';
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleMouseEnter = (day: ActivityData, event: React.MouseEvent) => {
    setHoveredDay(day);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };
  
  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  // Month labels
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const totalSolved = activityData.filter(d => d.count > 0).length;
  
  return (
    <div className="relative">
      <div className="bg-muted/20 rounded-2xl p-4 border border-border/50 overflow-x-auto">
        {/* Month labels */}
        <div className="flex mb-2 ml-6">
          {monthLabels.map((month, index) => (
            <div key={month} className="flex-1 text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
              {index % 3 === 0 ? month : ''}
            </div>
          ))}
        </div>
        
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-2">
            {dayLabels.map((day, index) => (
              <div key={day} className="h-2 flex items-center">
                <span className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">
                  {index % 2 === 1 ? day.slice(0, 1) : ''}
                </span>
              </div>
            ))}
          </div>
          
          {/* Activity grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={day.date}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                    className={clsx(
                      'w-2 h-2 rounded-sm cursor-pointer transition-all duration-200 hover:scale-125',
                      getActivityColor(day.level),
                      'hover:ring-1 hover:ring-primary/50'
                    )}
                    onMouseEnter={(e) => handleMouseEnter(day, e)}
                    onMouseLeave={handleMouseLeave}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
            {progress?.totalSolved || 0} problems solved this year
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[7px] font-bold text-muted-foreground mr-1">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={clsx('w-2 h-2 rounded-sm', getActivityColor(level))}
              />
            ))}
            <span className="text-[7px] font-bold text-muted-foreground ml-1">More</span>
          </div>
        </div>
      </div>
      
      {/* Tooltip */}
      {hoveredDay && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed z-[200] bg-card border border-border rounded-lg px-3 py-2 shadow-xl pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 40,
          }}
        >
          <div className="text-xs font-bold text-foreground">
            {hoveredDay.count === 0 
              ? 'No problems solved' 
              : `${hoveredDay.count} problem${hoveredDay.count === 1 ? '' : 's'} solved`
            }
          </div>
          <div className="text-[10px] text-muted-foreground font-medium">
            {formatDate(hoveredDay.date)}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ActivityGrid;