"use client";

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { vote, getUserVote } from '@/lib/qa/qa-storage';

interface VoteButtonsProps {
  targetId: string;
  targetType: 'question' | 'answer';
  initialVoteCount: number;
  userId: string;
  vertical?: boolean;
}

export function VoteButtons({
  targetId,
  targetType,
  initialVoteCount,
  userId,
  vertical = true
}: VoteButtonsProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [userVote, setUserVote] = useState(() => {
    const existingVote = getUserVote(targetId, userId);
    return existingVote?.voteType;
  });

  const handleVote = (voteType: 'up' | 'down') => {
    const oldVote = userVote;

    if (oldVote === voteType) {
      // 取消投票
      setUserVote(undefined);
      setVoteCount(prev => prev + (voteType === 'up' ? -1 : 1));
    } else if (oldVote) {
      // 改变投票
      setUserVote(voteType);
      setVoteCount(prev => prev + (voteType === 'up' ? 2 : -2));
    } else {
      // 新投票
      setUserVote(voteType);
      setVoteCount(prev => prev + (voteType === 'up' ? 1 : -1));
    }

    vote(targetId, targetType, userId, voteType);
  };

  const containerClass = vertical
    ? 'flex flex-col items-center gap-1'
    : 'flex items-center gap-2';

  return (
    <div className={containerClass}>
      <button
        onClick={() => handleVote('up')}
        className={`p-1 rounded hover:bg-gray-100 transition-colors ${
          userVote === 'up'
            ? 'text-orange-600 bg-orange-50'
            : 'text-gray-400 hover:text-orange-600'
        }`}
        title="赞同"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      <div
        className={`text-lg font-semibold ${
          voteCount > 0
            ? 'text-orange-600'
            : voteCount < 0
            ? 'text-gray-400'
            : 'text-gray-600'
        }`}
      >
        {voteCount}
      </div>

      <button
        onClick={() => handleVote('down')}
        className={`p-1 rounded hover:bg-gray-100 transition-colors ${
          userVote === 'down'
            ? 'text-gray-600 bg-gray-100'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        title="反对"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </div>
  );
}
