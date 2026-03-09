/**
 * AI 规划器 - 智能生成和优化学习路径
 */

import type {
  SkillTree,
  SkillNode,
  SkillTreeProgress,
  AIRecommendation,
  SkillNodeType,
} from './skill-tree-types';

export class AIPlanner {
  /**
   * 根据用户水平生成个性化技能树
   */
  static generatePersonalizedTree(params: {
    topic: string;
    userLevel: 'beginner' | 'intermediate' | 'advanced';
    goals: string[];
    availableHoursPerWeek: number;
    learningStyle: 'visual' | 'practical' | 'theoretical';
  }): Partial<SkillTree> {
    const { topic, userLevel, goals, availableHoursPerWeek } = params;

    // 根据用户水平调整节点数量和难度
    const nodeCount = {
      beginner: { basic: 8, advanced: 4, expert: 2, milestone: 2 },
      intermediate: { basic: 4, advanced: 8, expert: 4, milestone: 3 },
      advanced: { basic: 2, advanced: 4, expert: 8, milestone: 4 },
    };

    const counts = nodeCount[userLevel];

    return {
      title: `${topic} 学习路径`,
      description: `为 ${userLevel} 水平定制的 ${topic} 学习计划`,
      difficulty: userLevel === 'beginner' ? 'beginner' : userLevel === 'intermediate' ? 'intermediate' : 'advanced',
      // 实际节点生成需要调用 AI API
    };
  }

  /**
   * 优化学习路径
   */
  static optimizeLearningPath(
    tree: SkillTree,
    progress: SkillTreeProgress,
    constraints: {
      targetCompletionDate?: Date;
      dailyHours?: number;
      priorityNodes?: string[];
    }
  ): string[] {
    const remainingNodes = tree.nodes.filter(
      node => !progress.completedNodes.includes(node.id)
    );

    // 计算每个节点的优先级分数
    const scoredNodes = remainingNodes.map(node => {
      let score = 0;

      // 基础技能加分
      if (node.type === 'basic') score += 10;

      // 解锁更多节点加分
      score += node.unlocks.length * 5;

      // 优先节点加分
      if (constraints.priorityNodes?.includes(node.id)) {
        score += 20;
      }

      // 依赖已完成的节点加分
      const completedDeps = node.dependencies.filter(depId =>
        progress.completedNodes.includes(depId)
      ).length;
      score += completedDeps * 3;

      // 时间约束考虑
      if (constraints.targetCompletionDate && constraints.dailyHours) {
        const daysRemaining =
          (constraints.targetCompletionDate.getTime() - Date.now()) /
          (1000 * 60 * 60 * 24);
        const hoursAvailable = daysRemaining * constraints.dailyHours;
        const totalHoursNeeded = remainingNodes.reduce(
          (sum, n) => sum + n.estimatedHours,
          0
        );

        // 如果时间紧张，优先短时间任务
        if (hoursAvailable < totalHoursNeeded) {
          score += (10 - node.estimatedHours) * 2;
        }
      }

      return { node, score };
    });

    // 按分数排序
    return scoredNodes
      .sort((a, b) => b.score - a.score)
      .map(item => item.node.id);
  }

  /**
   * 预测学习难度
   */
  static predictDifficulty(
    node: SkillNode,
    userProgress: SkillTreeProgress
  ): 'easy' | 'medium' | 'hard' {
    // 基于用户已完成的相关技能预测难度
    const relatedCompleted = node.dependencies.filter(depId =>
      userProgress.completedNodes.includes(depId)
    ).length;

    const completionRate = relatedCompleted / Math.max(node.dependencies.length, 1);

    if (completionRate >= 0.8) return 'easy';
    if (completionRate >= 0.5) return 'medium';
    return 'hard';
  }

  /**
   * 生成学习建议
   */
  static generateLearningTips(
    node: SkillNode,
    userProgress: SkillTreeProgress
  ): string[] {
    const tips: string[] = [];

    // 检查前置技能
    const missingDeps = node.dependencies.filter(
      depId => !userProgress.completedNodes.includes(depId)
    );

    if (missingDeps.length > 0) {
      tips.push(`建议先完成 ${missingDeps.length} 个前置技能`);
    }

    // 时间建议
    if (node.estimatedHours > 10) {
      tips.push('这是一个较长的学习任务，建议分多天完成');
    }

    // 资源建议
    if (node.resources.length > 5) {
      tips.push('学习资源较多，建议先浏览概览再深入学习');
    }

    // 练习建议
    if (node.exercises.length > 0) {
      tips.push(`包含 ${node.exercises.length} 个练习题，建议边学边练`);
    }

    return tips;
  }

  /**
   * 动态调整难度
   */
  static adjustDifficulty(
    tree: SkillTree,
    userPerformance: {
      averageCompletionTime: number; // 相对于预估时间的比例
      averageScore: number; // 0-100
      strugglingNodes: string[];
    }
  ): {
    recommendation: string;
    adjustedNodes: Array<{ nodeId: string; newEstimatedHours: number }>;
  } {
    const adjustedNodes: Array<{ nodeId: string; newEstimatedHours: number }> = [];
    let recommendation = '';

    // 如果用户完成速度快且分数高，建议增加难度
    if (
      userPerformance.averageCompletionTime < 0.8 &&
      userPerformance.averageScore > 85
    ) {
      recommendation = '您的学习进度很快！建议尝试更高难度的内容。';

      tree.nodes.forEach(node => {
        if (node.type === 'basic' && !node.completedAt) {
          adjustedNodes.push({
            nodeId: node.id,
            newEstimatedHours: node.estimatedHours * 0.8,
          });
        }
      });
    }

    // 如果用户完成慢或分数低，建议降低难度
    if (
      userPerformance.averageCompletionTime > 1.5 ||
      userPerformance.averageScore < 60
    ) {
      recommendation = '建议放慢节奏，加强基础知识的学习。';

      tree.nodes.forEach(node => {
        if (
          (node.type === 'advanced' || node.type === 'expert') &&
          !node.completedAt
        ) {
          adjustedNodes.push({
            nodeId: node.id,
            newEstimatedHours: node.estimatedHours * 1.3,
          });
        }
      });
    }

    return { recommendation, adjustedNodes };
  }

  /**
   * 生成每周学习计划
   */
  static generateWeeklyPlan(
    tree: SkillTree,
    progress: SkillTreeProgress,
    hoursPerDay: number
  ): Array<{
    day: string;
    nodes: string[];
    totalHours: number;
  }> {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const plan = days.map(day => ({ day, nodes: [] as string[], totalHours: 0 }));

    const availableNodes = tree.nodes.filter(
      node =>
        !progress.completedNodes.includes(node.id) &&
        node.dependencies.every(depId => progress.completedNodes.includes(depId))
    );

    let dayIndex = 0;
    for (const node of availableNodes) {
      if (plan[dayIndex].totalHours + node.estimatedHours <= hoursPerDay) {
        plan[dayIndex].nodes.push(node.id);
        plan[dayIndex].totalHours += node.estimatedHours;
      } else {
        dayIndex++;
        if (dayIndex >= days.length) break;
        plan[dayIndex].nodes.push(node.id);
        plan[dayIndex].totalHours = node.estimatedHours;
      }
    }

    return plan;
  }
}