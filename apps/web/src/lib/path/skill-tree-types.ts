/**
 * 技能树系统类型定义
 */

export type SkillNodeType = 'basic' | 'advanced' | 'expert' | 'milestone';

export type SkillNodeStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export type SkillNode = {
  id: string;
  title: string;
  description: string;
  type: SkillNodeType;
  status: SkillNodeStatus;

  // 位置信息
  position: { x: number; y: number };

  // 依赖关系
  dependencies: string[]; // 前置技能 ID
  unlocks: string[];      // 解锁的技能 ID

  // 学习内容
  resources: SkillResource[];
  exercises: SkillExercise[];
  projects: SkillProject[];

  // 进度信息
  progress: number;       // 0-100
  exp: number;            // 完成后获得的经验值
  skillPoints: number;    // 需要的技能点数

  // 时间估算
  estimatedHours: number;
  actualHours?: number;

  // 学习笔记
  notes: string;

  // 数据联动字段
  documentIds: string[];     // 学习资源（关联的文档）
  graphNodeId?: string;      // 关联的知识点
  learningRecords: LearningRecord[]; // 学习记录

  // 时间戳
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

// 学习记录类型
export type LearningRecord = {
  id: string;
  timestamp: Date;
  action: 'start' | 'progress' | 'complete' | 'review';
  duration?: number; // 学习时长（分钟）
  notes?: string;
  metadata?: Record<string, any>;
};

export type SkillResource = {
  id: string;
  title: string;
  type: 'article' | 'video' | 'book' | 'course' | 'documentation';
  url: string;
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
};

export type SkillExercise = {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  completed: boolean;
  attempts: number;
  bestScore?: number;
};

export type SkillProject = {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  estimatedHours: number;
  completed: boolean;
  githubUrl?: string;
  demoUrl?: string;
};

export type SkillTree = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';

  // 节点和连接
  nodes: SkillNode[];
  edges: SkillEdge[];

  // 统计信息
  totalNodes: number;
  completedNodes: number;
  totalExp: number;
  earnedExp: number;

  // 技能点系统
  availableSkillPoints: number;
  totalSkillPoints: number;

  // 元数据
  author: string;
  tags: string[];
  rating: number;
  enrollments: number;
  isPublic: boolean;
  isTemplate: boolean;

  // 时间戳
  createdAt: string;
  updatedAt: string;
};

export type SkillEdge = {
  id: string;
  source: string;
  target: string;
  type: 'dependency' | 'optional' | 'recommended';
  animated?: boolean;
};

export type SkillTreeProgress = {
  userId: string;
  treeId: string;
  completedNodes: string[];
  inProgressNodes: string[];
  totalExp: number;
  skillPoints: number;
  startedAt: string;
  lastActivityAt: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'completion' | 'speed' | 'mastery' | 'exploration' | 'social';
  requirement: AchievementRequirement;
  reward: AchievementReward;
  unlockedAt?: string;
};

export type AchievementRequirement = {
  type: 'complete_nodes' | 'complete_tree' | 'earn_exp' | 'complete_in_time' |
        'perfect_score' | 'help_others' | 'create_tree' | 'custom';
  value: number;
  nodeIds?: string[];
  treeIds?: string[];
  timeLimit?: number; // 小时
};

export type AchievementReward = {
  exp: number;
  skillPoints: number;
  badge?: string;
  title?: string;
};

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  trees: string[]; // SkillTree IDs
  recommendedOrder: string[];
  totalDuration: number; // 小时
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt: string;
};

export type SkillTreeTemplate = {
  id: string;
  title: string;
  description: string;
  category: string;
  preview: string; // 预览图 URL
  nodes: Omit<SkillNode, 'status' | 'progress' | 'notes' | 'startedAt' | 'completedAt'>[];
  edges: SkillEdge[];
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  author: string;
  rating: number;
  downloads: number;
  createdAt: string;
};

export type AIRecommendation = {
  nodeId: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  prerequisites: string[];
};

export type SkillTreeStats = {
  totalTrees: number;
  completedTrees: number;
  totalNodes: number;
  completedNodes: number;
  totalExp: number;
  totalSkillPoints: number;
  averageCompletionTime: number;
  currentStreak: number;
  longestStreak: number;
};
