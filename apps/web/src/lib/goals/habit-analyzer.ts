// 习惯分析器
import { Habit } from './goal-storage';

export interface HabitAnalysis {
  completionRate: number;
  totalCheckIns: number;
  currentStreak: number;
  longestStreak: number;
  bestTimeOfDay?: string;
  weekdayPerformance: Record<string, number>;
  monthlyTrend: { month: string; rate: number }[];
}

export const habitAnalyzer = {
  analyzeHabit(habit: Habit): HabitAnalysis {
    const checkIns = Object.entries(habit.checkIns);
    const totalCheckIns = checkIns.filter(([_, checked]) => checked).length;

    const daysSinceCreation = Math.floor(
      (Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    const completionRate = daysSinceCreation > 0
      ? (totalCheckIns / daysSinceCreation) * 100
      : 0;

    const weekdayPerformance = this.calculateWeekdayPerformance(habit);
    const monthlyTrend = this.calculateMonthlyTrend(habit);

    return {
      completionRate,
      totalCheckIns,
      currentStreak: habit.streak,
      longestStreak: habit.longestStreak,
      weekdayPerformance,
      monthlyTrend,
    };
  },

  calculateWeekdayPerformance(habit: Habit): Record<string, number> {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const performance: Record<string, number> = {};
    const counts: Record<number, { total: number; checked: number }> = {};

    for (let i = 0; i < 7; i++) {
      counts[i] = { total: 0, checked: 0 };
    }

    Object.entries(habit.checkIns).forEach(([dateStr, checked]) => {
      const date = new Date(dateStr);
      const day = date.getDay();
      counts[day].total++;
      if (checked) counts[day].checked++;
    });

    weekdays.forEach((name, index) => {
      const count = counts[index];
      performance[name] = count.total > 0
        ? (count.checked / count.total) * 100
        : 0;
    });

    return performance;
  },

  calculateMonthlyTrend(habit: Habit): { month: string; rate: number }[] {
    const months: Record<string, { total: number; checked: number }> = {};

    Object.entries(habit.checkIns).forEach(([dateStr, checked]) => {
      const date = new Date(dateStr);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!months[monthKey]) {
        months[monthKey] = { total: 0, checked: 0 };
      }

      months[monthKey].total++;
      if (checked) months[monthKey].checked++;
    });

    return Object.entries(months)
      .map(([month, data]) => ({
        month,
        rate: (data.checked / data.total) * 100,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  },

  getHeatmapData(habit: Habit, months: number = 12): Record<string, number> {
    const heatmap: Record<string, number> = {};
    const today = new Date();

    for (let i = 0; i < months * 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      heatmap[dateStr] = habit.checkIns[dateStr] ? 1 : 0;
    }

    return heatmap;
  },
};
