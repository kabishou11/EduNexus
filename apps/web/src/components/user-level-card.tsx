'use client';

import { Progress } from '@/components/ui/progress';

interface UserLevelCardProps {
  level: number;
  title: string;
  titleEmoji: string;
  titleDescription: string;
  currentExp: number;
  totalExp: number;
  nextLevel?: {
    level: number;
    title: string;
    titleEmoji: string;
    expNeeded: number;
    progressPercent: number;
  } | null;
  className?: string;
}

export function UserLevelCard({
  level,
  title,
  titleEmoji,
  titleDescription,
  currentExp,
  totalExp,
  nextLevel,
  className = ''
}: UserLevelCardProps) {
  return (
    <div className={`rounded-lg border bg-card p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="text-6xl">{titleEmoji}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Lv {level}</span>
              <h3 className="text-2xl font-bold">{title}</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{titleDescription}</p>
            <p className="mt-2 text-xs text-muted-foreground">总经验值: {totalExp.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {nextLevel && (
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              距离 Lv {nextLevel.level} {nextLevel.titleEmoji} {nextLevel.title}
            </span>
            <span className="font-medium">
              {nextLevel.expNeeded.toLocaleString()} EXP
            </span>
          </div>
          <Progress value={nextLevel.progressPercent} className="h-3" />
          <p className="mt-1 text-xs text-muted-foreground text-right">
            {nextLevel.progressPercent.toFixed(1)}%
          </p>
        </div>
      )}

      {!nextLevel && (
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-primary">🎉 已达到最高等级！</p>
        </div>
      )}
    </div>
  );
}
