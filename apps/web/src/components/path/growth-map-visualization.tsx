'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GrowthMapVisualizationProps {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  totalProgress: number;
  estimatedTimeRemaining: string;
  className?: string;
}

export function GrowthMapVisualization({
  totalTasks,
  completedTasks,
  inProgressTasks,
  totalProgress,
  estimatedTimeRemaining,
  className = ''
}: GrowthMapVisualizationProps) {
  const stats = [
    {
      icon: Target,
      label: '总任务',
      value: totalTasks,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Trophy,
      label: '已完成',
      value: completedTasks,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Zap,
      label: '进行中',
      value: inProgressTasks,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Star,
      label: '完成度',
      value: `${totalProgress}%`,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">学习进度</h3>
                  <p className="text-sm text-muted-foreground">
                    预计剩余时间: {estimatedTimeRemaining}
                  </p>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="text-3xl font-bold text-orange-600"
                >
                  {totalProgress}%
                </motion.div>
              </div>
              <Progress value={totalProgress} className="h-3" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>已完成 {completedTasks} / {totalTasks} 个任务</span>
                <span>{totalTasks - completedTasks} 个待完成</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
