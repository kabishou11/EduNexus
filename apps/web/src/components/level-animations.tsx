'use client';

import { useEffect, useState } from 'react';

interface ExpGainAnimationProps {
  exp: number;
  message?: string;
  onComplete?: () => void;
}

export function ExpGainAnimation({ exp, message, onComplete }: ExpGainAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right duration-500">
      <div className="rounded-lg border bg-card shadow-lg p-4 min-w-[200px]">
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-bounce">✨</div>
          <div>
            <div className="text-lg font-bold text-primary">+{exp} EXP</div>
            {message && (
              <div className="text-sm text-muted-foreground">{message}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface LevelUpAnimationProps {
  level: number;
  title: string;
  titleEmoji: string;
  onComplete?: () => void;
}

export function LevelUpAnimation({ level, title, titleEmoji, onComplete }: LevelUpAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-in zoom-in duration-500">
        <div className="rounded-2xl border-4 border-primary bg-card shadow-2xl p-8 text-center max-w-md">
          <div className="text-8xl mb-4 animate-bounce">{titleEmoji}</div>
          <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            等级提升！
          </div>
          <div className="text-2xl font-semibold mb-2">Lv {level}</div>
          <div className="text-xl font-medium text-primary mb-4">{title}</div>
          <div className="text-sm text-muted-foreground">
            恭喜你达到新的高度！
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="text-2xl animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                🎉
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface BadgeUnlockAnimationProps {
  badgeName: string;
  badgeEmoji: string;
  badgeDescription: string;
  onComplete?: () => void;
}

export function BadgeUnlockAnimation({
  badgeName,
  badgeEmoji,
  badgeDescription,
  onComplete
}: BadgeUnlockAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right duration-500">
      <div className="rounded-lg border-2 border-primary bg-card shadow-xl p-4 min-w-[250px]">
        <div className="text-center">
          <div className="text-5xl mb-2 animate-bounce">{badgeEmoji}</div>
          <div className="text-sm font-bold text-primary mb-1">🎊 徽章解锁！</div>
          <div className="text-lg font-semibold mb-1">{badgeName}</div>
          <div className="text-xs text-muted-foreground">{badgeDescription}</div>
        </div>
      </div>
    </div>
  );
}
