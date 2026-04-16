'use client';

import { useState, useEffect, useCallback } from 'react';
import { Goal, goalStorage, Habit, habitStorage } from '@/lib/goals/goal-storage';
import { pathStorage } from '@/lib/client/path-storage';
import { getDataSyncEventManager, SyncEventType } from '@/lib/sync/data-sync-events';
import { GoalWizard } from '@/components/goals/goal-wizard';
import { GoalCard } from '@/components/goals/goal-card';
import { HabitCalendar } from '@/components/goals/habit-calendar';
import { HabitTracker } from '@/components/goals/habit-tracker';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Target, Calendar, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [showHabitDialog, setShowHabitDialog] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', description: '' });
  const [linkedPathsData, setLinkedPathsData] = useState<Record<string, { count: number; progress: number }>>({});
  const [showGoalDeleteDialog, setShowGoalDeleteDialog] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [showHabitDeleteDialog, setShowHabitDeleteDialog] = useState(false);


  const loadData = useCallback(async () => {
    const goals = goalStorage.getGoals();
    const habits = habitStorage.getHabits();
    const paths = await pathStorage.getAllPaths();

    setGoals(goals);
    setHabits(habits);

    // 加载关联路径数据
    const pathsData: Record<string, { count: number; progress: number }> = {};

    for (const goal of goals) {
      const linkedPaths = paths.filter(p => p.goalId === goal.id);
      const avgProgress = linkedPaths.length > 0
        ? Math.round(linkedPaths.reduce((sum, p) => sum + p.progress, 0) / linkedPaths.length)
        : 0;

      pathsData[goal.id] = {
        count: linkedPaths.length,
        progress: avgProgress
      };
    }

    setLinkedPathsData(pathsData);
  }, []);

  useEffect(() => {
    loadData();

    const eventManager = getDataSyncEventManager();
    const unsubscribeCreated = eventManager.on(SyncEventType.PATH_CREATED, () => {
      void loadData();
    });
    const unsubscribeUpdated = eventManager.on(SyncEventType.PATH_UPDATED, () => {
      void loadData();
    });
    const unsubscribeDeleted = eventManager.on(SyncEventType.PATH_DELETED, () => {
      void loadData();
    });
    const unsubscribeProgressUpdated = eventManager.on(SyncEventType.PATH_PROGRESS_UPDATED, () => {
      void loadData();
    });

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
      unsubscribeProgressUpdated();
    };
  }, [loadData]);


  const handleCreateGoal = (goal: Goal) => {
    goalStorage.saveGoal(goal);
    loadData();
    setShowWizard(false);
    toast.success('目标创建成功！');
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    goalStorage.updateProgress(id, progress);
    loadData();
    toast.success('进度已更新');
  };


  const handleDeleteGoal = async () => {
    if (!goalToDelete) return;

    await pathStorage.unlinkGoal(goalToDelete.id);
    goalStorage.deleteGoal(goalToDelete.id);
    await loadData();
    setGoalToDelete(null);
    setShowGoalDeleteDialog(false);
    toast.success('目标已删除');
  };

  const handleCreateHabit = () => {
    if (!newHabit.name.trim()) return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      description: newHabit.description,
      frequency: 'daily',
      targetDays: [0, 1, 2, 3, 4, 5, 6],
      checkIns: {},
      streak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString(),
    };

    habitStorage.saveHabit(habit);
    setHabits(habitStorage.getHabits());
    setNewHabit({ name: '', description: '' });
    setShowHabitDialog(false);
  };

  const handleCheckIn = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    habitStorage.checkIn(habitId, today);
    setHabits(habitStorage.getHabits());
  };

  const handleDeleteHabit = () => {
    if (!habitToDelete) return;
    habitStorage.deleteHabit(habitToDelete.id);
    setHabits(habitStorage.getHabits());
    setHabitToDelete(null);
    setShowHabitDeleteDialog(false);
  };

  const activeGoals = goals.filter(g => g.status === 'active').length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const avgProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0;

  const renderDeleteDialog = (
    open: boolean,
    setOpen: (open: boolean) => void,
    title: string,
    description: string,
    onConfirm: () => void,
    onReset: () => void
  ) => (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        onReset();
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => {
            setOpen(false);
            onReset();
          }}>
            取消
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            删除
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-rose-50/30">
      <div className="page-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500">
              <Target className="h-6 w-6 text-white" />
            </div>
            目标管理
          </h1>
          <p className="text-muted-foreground">
            设定目标，关联学习路径，追踪成长进度
          </p>

          {/* 统计卡片 */}
          {goals.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border shadow-sm">
                <div className="text-sm text-muted-foreground">进行中</div>
                <div className="text-2xl font-bold text-blue-500">{activeGoals}</div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border shadow-sm">
                <div className="text-sm text-muted-foreground">已完成</div>
                <div className="text-2xl font-bold text-green-500">{completedGoals}</div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border shadow-sm">
                <div className="text-sm text-muted-foreground">平均进度</div>
                <div className="text-2xl font-bold text-purple-500">{avgProgress}%</div>
              </div>
            </div>
          )}
        </div>

      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            我的目标
          </TabsTrigger>
          <TabsTrigger value="habits" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            习惯养成
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">目标列表</h2>
            <Button
              onClick={() => setShowWizard(true)}
              className="bg-gradient-to-br from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              创建新目标
            </Button>
          </div>

          {showWizard && (
            <GoalWizard
              onComplete={handleCreateGoal}
              onCancel={() => setShowWizard(false)}
            />
          )}

          {goals.length === 0 && !showWizard && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Target className="w-8 h-8 text-orange-500 opacity-50" />
              </div>
              <p className="text-muted-foreground mb-4">
                还没有目标，点击上方按钮创建你的第一个目标
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onUpdateProgress={handleUpdateProgress}
                onDelete={(goalId) => {
                  const goal = goals.find((item) => item.id === goalId) || null;
                  setGoalToDelete(goal);
                  setShowGoalDeleteDialog(Boolean(goal));
                }}
                linkedPathsCount={linkedPathsData[goal.id]?.count || 0}
                linkedPathsProgress={linkedPathsData[goal.id]?.progress || 0}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="habits" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">习惯追踪</h2>
            <Dialog open={showHabitDialog} onOpenChange={setShowHabitDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-br from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600">
                  <Plus className="w-4 h-4 mr-2" />
                  创建新习惯
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>创建新习惯</DialogTitle>
                  <DialogDescription>
                    设定一个你想要养成的习惯，每天打卡记录
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="habit-name">习惯名称</Label>
                    <Input
                      id="habit-name"
                      value={newHabit.name}
                      onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                      placeholder="例如：每天阅读30分钟"
                    />
                  </div>
                  <div>
                    <Label htmlFor="habit-description">描述（可选）</Label>
                    <Textarea
                      id="habit-description"
                      value={newHabit.description}
                      onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                      placeholder="描述这个习惯的目的和意义..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleCreateHabit} className="w-full">
                    创建习惯
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {habits.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-orange-500 opacity-50" />
              </div>
              <p className="text-muted-foreground mb-4">
                还没有习惯，点击上方按钮创建你的第一个习惯
              </p>
            </div>
          )}

          <HabitTracker
            habits={habits}
            onCheckIn={handleCheckIn}
            onDelete={(habitId) => {
              const habit = habits.find((item) => item.id === habitId) || null;
              setHabitToDelete(habit);
              setShowHabitDeleteDialog(Boolean(habit));
            }}
          />

          <div className="space-y-6 mt-8">
            {habits.map((habit) => (
              <HabitCalendar
                key={habit.id}
                habit={habit}
                onCheckIn={(date) => habitStorage.checkIn(habit.id, date)}
              />
            ))}
          </div>
        </TabsContent>
      {renderDeleteDialog(
        showGoalDeleteDialog,
        setShowGoalDeleteDialog,
        '删除目标',
        goalToDelete ? `确定要删除“${goalToDelete.title}”吗？` : '此操作无法撤销。',
        handleDeleteGoal,
        () => setGoalToDelete(null)
      )}
      {renderDeleteDialog(
        showHabitDeleteDialog,
        setShowHabitDeleteDialog,
        '删除习惯',
        habitToDelete ? `确定要删除“${habitToDelete.name}”吗？` : '此操作无法撤销。',
        handleDeleteHabit,
        () => setHabitToDelete(null)
      )}
      </Tabs>
      </div>
    </div>
  );
}
