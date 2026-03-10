/**
 * 问答系统类型定义
 */

export type QuestionCategory = 'programming' | 'math' | 'language' | 'science' | 'other';

export type QuestionStatus = 'open' | 'answered' | 'closed';

export type Question = {
  questionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  category: QuestionCategory;
  tags: string[];
  bounty: number;
  status: QuestionStatus;
  viewCount: number;
  voteCount: number;
  answerCount: number;
  acceptedAnswerId?: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
};

export type Answer = {
  answerId: string;
  questionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  voteCount: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  commentId: string;
  targetId: string; // questionId or answerId
  targetType: 'question' | 'answer';
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
};

export type Vote = {
  voteId: string;
  targetId: string; // questionId or answerId
  targetType: 'question' | 'answer';
  userId: string;
  voteType: 'up' | 'down';
  createdAt: string;
};

export type QuestionFollow = {
  followId: string;
  questionId: string;
  userId: string;
  createdAt: string;
};

export type QuestionBookmark = {
  bookmarkId: string;
  questionId: string;
  userId: string;
  createdAt: string;
};

export type UserReputation = {
  userId: string;
  reputation: number;
  questionsAsked: number;
  answersGiven: number;
  answersAccepted: number;
  votesReceived: number;
  bestAnswerCount: number;
  helpfulCount: number;
  updatedAt: string;
};

export type QABadge = {
  badgeId: string;
  name: string;
  description: string;
  emoji: string;
  category: 'answerer' | 'asker' | 'voter' | 'special';
  requirement: {
    type: string;
    threshold: number;
  };
  reputationReward: number;
};

export type UserQABadge = {
  userBadgeId: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
};
