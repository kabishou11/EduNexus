import type { QABadge, UserReputation } from './qa-types';

/**
 * 声誉系统配置
 */

// 声誉奖励规则
export const REPUTATION_REWARDS = {
  QUESTION_UPVOTE: 5,
  QUESTION_DOWNVOTE: -2,
  ANSWER_UPVOTE: 10,
  ANSWER_DOWNVOTE: -2,
  ANSWER_ACCEPTED: 15,
  ACCEPT_ANSWER: 2,
  BOUNTY_AWARDED: 0, // 悬赏金额本身
  EDIT_APPROVED: 2,
  HELPFUL_FLAG: 1
};

// 问答徽章配置
export const QA_BADGES: QABadge[] = [
  // 回答者徽章
  {
    badgeId: 'first_answer',
    name: '初出茅庐',
    description: '回答第一个问题',
    emoji: '🌱',
    category: 'answerer',
    requirement: {
      type: 'answers_given',
      threshold: 1
    },
    reputationReward: 10
  },
  {
    badgeId: 'helpful_answerer',
    name: '乐于助人',
    description: '回答 10 个问题',
    emoji: '🤝',
    category: 'answerer',
    requirement: {
      type: 'answers_given',
      threshold: 10
    },
    reputationReward: 50
  },
  {
    badgeId: 'expert_answerer',
    name: '答题专家',
    description: '回答 50 个问题',
    emoji: '🎓',
    category: 'answerer',
    requirement: {
      type: 'answers_given',
      threshold: 50
    },
    reputationReward: 200
  },
  {
    badgeId: 'answer_master',
    name: '答题大师',
    description: '回答 100 个问题',
    emoji: '👑',
    category: 'answerer',
    requirement: {
      type: 'answers_given',
      threshold: 100
    },
    reputationReward: 500
  },
  {
    badgeId: 'best_answer_bronze',
    name: '青铜答主',
    description: '获得 5 个最佳答案',
    emoji: '🥉',
    category: 'answerer',
    requirement: {
      type: 'answers_accepted',
      threshold: 5
    },
    reputationReward: 100
  },
  {
    badgeId: 'best_answer_silver',
    name: '白银答主',
    description: '获得 20 个最佳答案',
    emoji: '🥈',
    category: 'answerer',
    requirement: {
      type: 'answers_accepted',
      threshold: 20
    },
    reputationReward: 300
  },
  {
    badgeId: 'best_answer_gold',
    name: '黄金答主',
    description: '获得 50 个最佳答案',
    emoji: '🥇',
    category: 'answerer',
    requirement: {
      type: 'answers_accepted',
      threshold: 50
    },
    reputationReward: 800
  },
  {
    badgeId: 'popular_answer',
    name: '人气答主',
    description: '单个答案获得 50+ 赞',
    emoji: '⭐',
    category: 'answerer',
    requirement: {
      type: 'single_answer_votes',
      threshold: 50
    },
    reputationReward: 150
  },
  // 提问者徽章
  {
    badgeId: 'curious_mind',
    name: '好奇宝宝',
    description: '提出第一个问题',
    emoji: '❓',
    category: 'asker',
    requirement: {
      type: 'questions_asked',
      threshold: 1
    },
    reputationReward: 5
  },
  {
    badgeId: 'inquisitive',
    name: '好学者',
    description: '提出 10 个问题',
    emoji: '🔍',
    category: 'asker',
    requirement: {
      type: 'questions_asked',
      threshold: 10
    },
    reputationReward: 30
  },
  {
    badgeId: 'great_question',
    name: '好问题',
    description: '单个问题获得 25+ 赞',
    emoji: '💡',
    category: 'asker',
    requirement: {
      type: 'single_question_votes',
      threshold: 25
    },
    reputationReward: 100
  },
  // 投票者徽章
  {
    badgeId: 'critic',
    name: '评论家',
    description: '投票 100 次',
    emoji: '👍',
    category: 'voter',
    requirement: {
      type: 'votes_cast',
      threshold: 100
    },
    reputationReward: 20
  },
  {
    badgeId: 'civic_duty',
    name: '公民责任',
    description: '投票 300 次',
    emoji: '🗳️',
    category: 'voter',
    requirement: {
      type: 'votes_cast',
      threshold: 300
    },
    reputationReward: 50
  },
  // 特殊徽章
  {
    badgeId: 'teacher',
    name: '教师',
    description: '答案被采纳且获得 10+ 赞',
    emoji: '👨‍🏫',
    category: 'special',
    requirement: {
      type: 'quality_answer',
      threshold: 1
    },
    reputationReward: 100
  },
  {
    badgeId: 'enlightened',
    name: '启蒙者',
    description: '第一个答案就被采纳',
    emoji: '💫',
    category: 'special',
    requirement: {
      type: 'first_answer_accepted',
      threshold: 1
    },
    reputationReward: 50
  },
  {
    badgeId: 'guru',
    name: '大师',
    description: '获得 40 个最佳答案且声誉 2000+',
    emoji: '🧙',
    category: 'special',
    requirement: {
      type: 'guru_status',
      threshold: 1
    },
    reputationReward: 1000
  },
  {
    badgeId: 'generosity',
    name: '慷慨',
    description: '设置悬赏 500+ 积分',
    emoji: '💰',
    category: 'special',
    requirement: {
      type: 'bounty_offered',
      threshold: 500
    },
    reputationReward: 100
  },
  {
    badgeId: 'altruist',
    name: '利他主义者',
    description: '第一次回答就获得最佳答案',
    emoji: '🌟',
    category: 'special',
    requirement: {
      type: 'first_answer_accepted',
      threshold: 1
    },
    reputationReward: 50
  },
  {
    badgeId: 'necromancer',
    name: '复活术士',
    description: '回答 60 天前的问题并获得 5+ 赞',
    emoji: '⚰️',
    category: 'special',
    requirement: {
      type: 'old_question_answer',
      threshold: 1
    },
    reputationReward: 50
  },
  {
    badgeId: 'revival',
    name: '复兴',
    description: '回答 30 天无活动的问题并获得 10+ 赞',
    emoji: '🔄',
    category: 'special',
    requirement: {
      type: 'inactive_question_answer',
      threshold: 1
    },
    reputationReward: 30
  }
];

/**
 * 获取徽章
 */
export function getBadgeById(badgeId: string): QABadge | undefined {
  return QA_BADGES.find(b => b.badgeId === badgeId);
}

export function getBadgesByCategory(category: QABadge['category']): QABadge[] {
  return QA_BADGES.filter(b => b.category === category);
}

/**
 * 检查用户是否满足徽章条件
 */
export function checkBadgeEligibility(badge: QABadge, reputation: UserReputation): boolean {
  switch (badge.requirement.type) {
    case 'answers_given':
      return reputation.answersGiven >= badge.requirement.threshold;
    case 'answers_accepted':
      return reputation.answersAccepted >= badge.requirement.threshold;
    case 'questions_asked':
      return reputation.questionsAsked >= badge.requirement.threshold;
    case 'guru_status':
      return reputation.answersAccepted >= 40 && reputation.reputation >= 2000;
    default:
      return false;
  }
}

/**
 * 获取用户可获得的新徽章
 */
export function getEarnableBadges(reputation: UserReputation, currentBadges: string[]): QABadge[] {
  return QA_BADGES.filter(badge => {
    if (currentBadges.includes(badge.badgeId)) {
      return false;
    }
    return checkBadgeEligibility(badge, reputation);
  });
}

/**
 * 计算声誉等级
 */
export function getReputationLevel(reputation: number): {
  level: string;
  emoji: string;
  minRep: number;
  maxRep: number;
} {
  if (reputation >= 10000) {
    return { level: '传奇', emoji: '👑', minRep: 10000, maxRep: Infinity };
  } else if (reputation >= 5000) {
    return { level: '大师', emoji: '🧙', minRep: 5000, maxRep: 9999 };
  } else if (reputation >= 2000) {
    return { level: '专家', emoji: '🎓', minRep: 2000, maxRep: 4999 };
  } else if (reputation >= 1000) {
    return { level: '高级', emoji: '⭐', minRep: 1000, maxRep: 1999 };
  } else if (reputation >= 500) {
    return { level: '中级', emoji: '📚', minRep: 500, maxRep: 999 };
  } else if (reputation >= 100) {
    return { level: '初级', emoji: '🌱', minRep: 100, maxRep: 499 };
  } else {
    return { level: '新手', emoji: '👶', minRep: 0, maxRep: 99 };
  }
}

/**
 * 获取声誉权限
 */
export function getReputationPrivileges(reputation: number): {
  canVote: boolean;
  canComment: boolean;
  canDownvote: boolean;
  canEditOthers: boolean;
  canClosePosts: boolean;
  canModerate: boolean;
} {
  return {
    canVote: reputation >= 15,
    canComment: reputation >= 50,
    canDownvote: reputation >= 125,
    canEditOthers: reputation >= 2000,
    canClosePosts: reputation >= 3000,
    canModerate: reputation >= 10000
  };
}
