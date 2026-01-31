'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface ActivityData {
  date: string;
  count: number;
  level: number; // 0-4 intensity level
}

interface ActivityHeatmapProps {
  data: ActivityData[];
  year?: number;
  startDate?: string; // User's account creation date
}

export default function ActivityHeatmap({ data, year = 2024, startDate }: ActivityHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<ActivityData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate all days from account creation to end of year
  const yearData = useMemo(() => {
    // If startDate is provided and in the same year, use it; otherwise start from Jan 1
    const accountCreationDate = startDate ? new Date(startDate) : null;
    const isStartDateInYear = accountCreationDate && accountCreationDate.getFullYear() === year;
    
    const startOfRange = isStartDateInYear ? accountCreationDate : new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const today = new Date();
    
    // Don't show future dates
    const endOfRange = endDate > today ? today : endDate;
    
    const days: ActivityData[] = [];
    
    const currentDate = new Date(startOfRange);
    while (currentDate <= endOfRange) {
      const dateString = currentDate.toISOString().split('T')[0];
      const existingData = data.find(d => d.date === dateString);
      
      days.push({
        date: dateString,
        count: existingData?.count || 0,
        level: existingData?.level || 0
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  }, [data, year, startDate]);

  // Group days by weeks
  const weeks = useMemo(() => {
    const weeksArray: ActivityData[][] = [];
    let currentWeek: ActivityData[] = [];
    
    // Add empty days at the beginning to align with Sunday
    const firstDay = new Date(year, 0, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: '', count: 0, level: 0 });
    }
    
    yearData.forEach((day, index) => {
      currentWeek.push(day);
      
      if (currentWeek.length === 7) {
        weeksArray.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    // Fill the last week if needed
    while (currentWeek.length < 7 && currentWeek.length > 0) {
      currentWeek.push({ date: '', count: 0, level: 0 });
    }
    if (currentWeek.length > 0) {
      weeksArray.push(currentWeek);
    }
    
    return weeksArray;
  }, [yearData, year]);

  const getIntensityColor = (level: number) => {
    const colors = [
      'bg-gray-100', // 0 - no activity
      'bg-green-200', // 1 - low activity
      'bg-green-300', // 2 - medium activity
      'bg-green-500', // 3 - high activity
      'bg-green-700'  // 4 - very high activity
    ];
    return colors[level] || colors[0];
  };

  const handleMouseEnter = (day: ActivityData, event: React.MouseEvent) => {
    if (day.date) {
      setHoveredDay(day);
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  const totalContributions = yearData.reduce((sum, day) => sum + day.count, 0);
  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    const currentDate = new Date(today);
    
    while (currentDate >= new Date(year, 0, 1)) {
      const dateString = currentDate.toISOString().split('T')[0];
      const dayData = yearData.find(d => d.date === dateString);
      
      if (dayData && dayData.count > 0) {
        streak++;
      } else {
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  }, [yearData, year]);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {totalContributions} problems solved in {year}
        </h3>
        <div className="text-sm text-gray-600">
          Current streak: <span className="font-semibold text-green-600">{currentStreak} days</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-2">
            <div className="w-8"></div> {/* Space for weekday labels */}
            {months.map((month, index) => (
              <div key={month} className="text-xs text-gray-500 text-center" style={{ width: '52px' }}>
                {month}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex">
            {/* Weekday labels */}
            <div className="flex flex-col mr-2">
              {weekdays.map((day, index) => (
                <div key={day} className="h-3 flex items-center text-xs text-gray-500 mb-1">
                  {index % 2 === 1 ? day : ''}
                </div>
              ))}
            </div>

            {/* Activity squares */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`
                        w-3 h-3 rounded-sm cursor-pointer border border-gray-200
                        ${day.date ? getIntensityColor(day.level) : 'bg-transparent border-transparent'}
                      `}
                      whileHover={{ scale: day.date ? 1.2 : 1 }}
                      onMouseEnter={(e) => handleMouseEnter(day, e)}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-500">
              Less
            </div>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm border border-gray-200 ${getIntensityColor(level)}`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500">
              More
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 bg-gray-800 text-white text-xs rounded px-2 py-1 pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 30,
          }}
        >
          <div className="font-semibold">
            {hoveredDay.count} problems solved
          </div>
          <div className="text-gray-300">
            {new Date(hoveredDay.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      )}
    </div>
  );
}