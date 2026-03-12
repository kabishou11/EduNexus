'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, TrendingUp, Clock, Brain, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Suggestion {
  id: string;
  type: 'priority' | 'time' | 'difficulty' | 'dependency';
  title: string;
  description: string;
  taskId?: string;
  icon: any;
  color: string;
}

interface AILearningSuggestionsProps {
  tasks: any[];
  currentProgress: number;
  className?: string;
}

export function AILearningSuggestions({
  tasks,
  currentProgress,
  className = ''
}: AILearningSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 生成AI建议
    const generatedSuggestions: Suggestion[] = [];

    // 1. 优先级建议
    const notStartedTasks = tasks.filter(t => t.status === 'not_started');
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');

    if (inProgressTasks.length > 0) {
      const task = inProgressTasks[0];
      generatedSuggestions.push({
        id: 'continue-task',
        type: 'priority',
        title: '继续学习进行中的任务',
        description: `建议先完成"${task.title}"，当前进度 ${task.progress}%`,
        taskId: task.id,
        icon: TrendingUp,
        color: 'text-blue-500'
      });
    }

    // 2. 时间管理建议
    const shortTasks = notStartedTasks.filter(t => {
      const hours = parseInt(t.estimatedTime);
      return !isNaN(hours) && hours <= 2;
    });

    if (shortTasks.length > 0) {
      generatedSuggestions.push({
        id: 'quick-win',
        type: 'time',
        title: '快速完成短任务',
        description: `有 ${shortTasks.length} 个任务可在2小时内完成，建议优先处理`,
        icon: Clock,
        color: 'text-green-500'
      });
    }

    // 3. 难度建议
    if (currentProgress < 30 && notStartedTasks.length > 0) {
      generatedSuggestions.push({
        id: 'start-easy',
        type: 'difficulty',
        title: '从简单任务开始',
        description: '建议先完成基础任务，建立信心后再挑战难题',
        icon: Lightbulb,
        color: 'text-yellow-500'
      });
    }

    // 4. 依赖关系建议
    const tasksWithDeps = notStartedTasks.filter(t => t.dependencies && t.dependencies.length > 0);
    const completedIds = tasks.filter(t => t.status === 'completed').map(t => t.id);
    const readyTasks = tasksWithDeps.filter(t =>
      t.dependencies.every((dep: string) => completedIds.includes(dep))
    );

    if (readyTasks.length > 0) {
      generatedSuggestions.push({
        id: 'ready-tasks',
        type: 'dependency',
        title: '解锁新任务',
        description: `有 ${readyTasks.length} 个任务的前置条件已满足，可以开始学习了`,
        icon: Brain,
        color: 'text-purple-500'
      });
    }

    // 5. 进度激励
    if (currentProgress >= 50 && currentProgress < 100) {
      generatedSuggestions.push({
        id: 'halfway',
        type: 'priority',
        title: '已完成一半，继续加油！',
        description: '你已经完成了一半的学习任务，坚持下去就能看到成果',
        icon: Sparkles,
        color: 'text-orange-500'
      });
    }

    setSuggestions(generatedSuggestions);
  }, [tasks, currentProgress]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={className}
    >
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI 学习建议
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence mode="popLayout">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="p-3 rounded-lg bg-white border border-purple-100 hover:border-purple-300 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-50">
                      <Icon className={`h-4 w-4 ${suggestion.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold">{suggestion.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.type === 'priority' && '优先'}
                          {suggestion.type === 'time' && '时间'}
                          {suggestion.type === 'difficulty' && '难度'}
                          {suggestion.type === 'dependency' && '依赖'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-2 border-t border-purple-100"
          >
            <p className="text-xs text-muted-foreground text-center">
              💡 这些建议基于你的学习进度和任务依赖关系生成
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
