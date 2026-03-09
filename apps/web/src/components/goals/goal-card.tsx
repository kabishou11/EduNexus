'use client';

import { Goal, Milestone } from '@/lib/goals/goal-storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Target, TrendingUp, CheckCircle2, Circle } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onUpdateProgress: (id: string, progress: number) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, onUpdateProgress, onToggleMilestone, onDelete }: GoalCardProps) {
  const getTypeLabel = (type: string) => {
    const labels = {
      'short-term': '短期',
      'mid-term': '中期',
      'long-term': '长期',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      exam: '考试',
      skill: '技能',
      project: '项目',
      habit: '习惯',
      other: '其他',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-blue-500',
      completed: 'bg-green-500',
      paused: 'bg-yellow-500',
      cancelled: 'bg-gray-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const daysRemaining = Math.ceil(
    (new Date(goal.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {goal.title}
            </CardTitle>
            <CardDescription className="mt-2">{goal.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{getTypeLabel(goal.type)}</Badge>
            <Badge variant="outline">{getCategoryLabel(goal.category)}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>进度</span>
            <span className="font-semibold">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>

        {goal.milestones.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              里程碑
            </h4>
            <div className="space-y-2">
              {goal.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-2 rounded"
                  onClick={() => onToggleMilestone(goal.id, milestone.id)}
                >
                  {milestone.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {daysRemaining > 0 ? `还剩 ${daysRemaining} 天` : '已到期'}
            </span>
          </div>
          <div className={`w-2 h-2 rounded-full ${getStatusColor(goal.status)}`} />
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateProgress(goal.id, Math.min(100, goal.progress + 10))}
          >
            更新进度
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(goal.id)}>
            删除
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
