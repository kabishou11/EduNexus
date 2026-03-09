'use client';

import { Habit } from '@/lib/goals/goal-storage';
import { habitAnalyzer } from '@/lib/goals/habit-analyzer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, TrendingUp, Calendar, Award } from 'lucide-react';
import { useMemo } from 'react';

interface HabitTrackerProps {
  habits: Habit[];
  onCheckIn: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

export function HabitTracker({ habits, onCheckIn, onDelete }: HabitTrackerProps) {
  const today = new Date().toISOString().split('T')[0];

  const habitAnalyses = useMemo(() => {
    return habits.map(habit => ({
      habit,
      analysis: habitAnalyzer.analyzeHabit(habit),
    }));
  }, [habits]);

  const handleCheckIn = (habitId: string) => {
    onCheckIn(habitId);
  };

  return (
    <div className="space-y-4">
      {habitAnalyses.map(({ habit, analysis }) => {
        const checkedInToday = habit.checkIns[today];

        return (
          <Card key={habit.id} className={checkedInToday ? 'border-green-500' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {checkedInToday && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  <span>{habit.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={checkedInToday ? 'outline' : 'default'}
                    onClick={() => handleCheckIn(habit.id)}
                    disabled={checkedInToday}
                  >
                    {checkedInToday ? '已打卡' : '打卡'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(habit.id)}>
                    删除
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">当前连续</p>
                    <p className="text-lg font-bold">{habit.streak} 天</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">最长连续</p>
                    <p className="text-lg font-bold">{habit.longestStreak} 天</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">总打卡</p>
                    <p className="text-lg font-bold">{analysis.totalCheckIns} 次</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">完成率</p>
                    <p className="text-lg font-bold">{analysis.completionRate.toFixed(0)}%</p>
                  </div>
                </div>
              </div>

              {habit.description && (
                <p className="text-sm text-muted-foreground mt-4">{habit.description}</p>
              )}

              {analysis.monthlyTrend.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">月度趋势</p>
                  <div className="flex gap-2">
                    {analysis.monthlyTrend.map((trend) => (
                      <div key={trend.month} className="flex-1">
                        <div className="h-20 bg-muted rounded flex items-end p-1">
                          <div
                            className="w-full bg-green-500 rounded"
                            style={{ height: `${trend.rate}%` }}
                          />
                        </div>
                        <p className="text-xs text-center mt-1 text-muted-foreground">
                          {trend.month.split('-')[1]}月
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
