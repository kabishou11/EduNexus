'use client';

import { Goal } from '@/lib/goals/goal-storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface GoalProgressProps {
  goal: Goal;
}

export function GoalProgress({ goal }: GoalProgressProps) {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (goal.progress === 100 && goal.status === 'completed') {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [goal.progress, goal.status]);

  const completedMilestones = goal.milestones.filter(m => m.completed).length;
  const totalMilestones = goal.milestones.length;

  return (
    <Card className="relative overflow-hidden">
      {showCelebration && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center animate-bounce">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">目标达成！</h3>
            <p className="text-muted-foreground mt-2">恭喜你完成了这个目标</p>
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {goal.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
          {goal.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">总体进度</span>
            <span className="font-bold text-lg">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-3" />
        </div>

        {totalMilestones > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">里程碑完成</span>
              <span className="font-semibold">
                {completedMilestones} / {totalMilestones}
              </span>
            </div>
            <Progress value={(completedMilestones / totalMilestones) * 100} className="h-2" />
            <div className="mt-4 space-y-2">
              {goal.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    milestone.completed ? 'bg-green-50 dark:bg-green-950' : 'bg-muted'
                  }`}
                >
                  <CheckCircle2
                    className={`w-5 h-5 mt-0.5 ${
                      milestone.completed ? 'text-green-500' : 'text-muted-foreground'
                    }`}
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${milestone.completed ? 'line-through' : ''}`}>
                      {milestone.title}
                    </p>
                    {milestone.description && (
                      <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                    )}
                    {milestone.completedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        完成于 {new Date(milestone.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">开始日期</p>
            <p className="font-medium">{new Date(goal.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">目标日期</p>
            <p className="font-medium">{new Date(goal.endDate).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
