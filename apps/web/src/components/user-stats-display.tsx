'use client';

interface UserStats {
  learningMinutes: number;
  notesCreated: number;
  practiceCorrect: number;
  practiceWrong: number;
  knowledgePointsMastered: number;
  pathsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  postsCount: number;
  answersCount: number;
  answersAccepted: number;
  likesReceived: number;
}

interface UserStatsDisplayProps {
  stats: UserStats;
  className?: string;
}

export function UserStatsDisplay({ stats, className = '' }: UserStatsDisplayProps) {
  const learningHours = (stats.learningMinutes / 60).toFixed(1);
  const totalPractice = stats.practiceCorrect + stats.practiceWrong;
  const accuracy = totalPractice > 0
    ? ((stats.practiceCorrect / totalPractice) * 100).toFixed(1)
    : '0.0';

  const statGroups = [
    {
      title: '学习数据',
      icon: '📚',
      stats: [
        { label: '学习时长', value: `${learningHours} 小时`, icon: '⏱️' },
        { label: '掌握知识点', value: stats.knowledgePointsMastered, icon: '🎯' },
        { label: '完成路径', value: stats.pathsCompleted, icon: '🛤️' },
        { label: '创建笔记', value: stats.notesCreated, icon: '📝' }
      ]
    },
    {
      title: '练习数据',
      icon: '💪',
      stats: [
        { label: '练习题目', value: totalPractice, icon: '📊' },
        { label: '正确题数', value: stats.practiceCorrect, icon: '✅' },
        { label: '错误题数', value: stats.practiceWrong, icon: '❌' },
        { label: '正确率', value: `${accuracy}%`, icon: '🎯' }
      ]
    },
    {
      title: '社区数据',
      icon: '🤝',
      stats: [
        { label: '发帖数', value: stats.postsCount, icon: '💬' },
        { label: '回答数', value: stats.answersCount, icon: '🎤' },
        { label: '被采纳', value: stats.answersAccepted, icon: '🏆' },
        { label: '获赞数', value: stats.likesReceived, icon: '❤️' }
      ]
    },
    {
      title: '连续学习',
      icon: '🔥',
      stats: [
        { label: '当前连续', value: `${stats.currentStreak} 天`, icon: '📅' },
        { label: '最长连续', value: `${stats.longestStreak} 天`, icon: '🏅' }
      ]
    }
  ];

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">学习统计</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statGroups.map((group, idx) => (
          <div key={idx} className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{group.icon}</span>
              <h4 className="font-semibold">{group.title}</h4>
            </div>
            <div className="space-y-3">
              {group.stats.map((stat, statIdx) => (
                <div key={statIdx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{stat.icon}</span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
