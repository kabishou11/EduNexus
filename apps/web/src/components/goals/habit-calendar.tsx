'use client';

import { Habit } from '@/lib/goals/goal-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';

interface HabitCalendarProps {
  habit: Habit;
  onCheckIn: (date: string) => void;
}

export function HabitCalendar({ habit, onCheckIn }: HabitCalendarProps) {
  const heatmapData = useMemo(() => {
    const data: { date: string; level: number }[] = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const level = habit.checkIns[dateStr] ? 4 : 0;
      data.push({ date: dateStr, level });
    }

    return data;
  }, [habit.checkIns]);

  const weeks = useMemo(() => {
    const result: typeof heatmapData[] = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
      result.push(heatmapData.slice(i, i + 7));
    }
    return result;
  }, [heatmapData]);

  const getLevelColor = (level: number) => {
    const colors = {
      0: 'bg-muted',
      1: 'bg-green-200 dark:bg-green-900',
      2: 'bg-green-300 dark:bg-green-800',
      3: 'bg-green-400 dark:bg-green-700',
      4: 'bg-green-500 dark:bg-green-600',
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  const handleCellClick = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateStr <= today) {
      onCheckIn(dateStr);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{habit.name}</span>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-normal text-muted-foreground">
              当前连续：<span className="font-bold text-foreground">{habit.streak}</span> 天
            </span>
            <span className="font-normal text-muted-foreground">
              最长连续：<span className="font-bold text-foreground">{habit.longestStreak}</span> 天
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <div className="inline-flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={`w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-primary transition-all ${getLevelColor(
                        day.level
                      )}`}
                      onClick={() => handleCellClick(day.date)}
                      title={`${day.date} ${day.level > 0 ? '已完成' : '未完成'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>少</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div key={level} className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`} />
              ))}
            </div>
            <span>多</span>
          </div>

          {habit.description && (
            <p className="text-sm text-muted-foreground">{habit.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
