'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface Badge {
  badgeId: string;
  name: string;
  description: string;
  emoji: string;
  category: 'learning' | 'practice' | 'community' | 'special' | 'limited';
  expReward: number;
  isUnlocked: boolean;
  progress: number;
  unlockedAt?: string;
}

interface BadgeDisplayProps {
  badges: Badge[];
  className?: string;
}

export function BadgeDisplay({ badges, className = '' }: BadgeDisplayProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: '全部' },
    { value: 'learning', label: '学习' },
    { value: 'practice', label: '练习' },
    { value: 'community', label: '社区' },
    { value: 'special', label: '特殊' },
    { value: 'limited', label: '限时' }
  ];

  const filteredBadges = selectedCategory === 'all'
    ? badges
    : badges.filter(b => b.category === selectedCategory);

  const unlockedCount = filteredBadges.filter(b => b.isUnlocked).length;

  return (
    <div className={className}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">徽章收藏</h3>
        <p className="text-sm text-muted-foreground">
          已解锁 {unlockedCount} / {filteredBadges.length} 个徽章
        </p>
        <Progress value={(unlockedCount / filteredBadges.length) * 100} className="mt-2 h-2" />
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map(cat => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBadges.map(badge => (
              <BadgeCard key={badge.badgeId} badge={badge} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BadgeCard({ badge }: { badge: Badge }) {
  const isLocked = !badge.isUnlocked;

  return (
    <div
      className={`relative rounded-lg border p-4 transition-all ${
        isLocked
          ? 'bg-muted/50 opacity-60 grayscale'
          : 'bg-card hover:shadow-lg hover:scale-105'
      }`}
    >
      <div className="text-center">
        <div className="text-5xl mb-2">{badge.emoji}</div>
        <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
        <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>

        {isLocked ? (
          <div className="mt-3">
            <Progress value={badge.progress} className="h-2 mb-1" />
            <p className="text-xs text-muted-foreground">
              进度: {badge.progress.toFixed(0)}%
            </p>
          </div>
        ) : (
          <div className="mt-3">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <span>✓</span>
              <span>已解锁</span>
            </div>
            {badge.unlockedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(badge.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        <div className="mt-2 text-xs text-muted-foreground">
          +{badge.expReward} EXP
        </div>
      </div>

      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl opacity-30">🔒</div>
        </div>
      )}
    </div>
  );
}
