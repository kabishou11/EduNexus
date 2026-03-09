/**
 * 解锁系统 - 管理技能解锁逻辑和成就系统
 */

import type {
  SkillNode,
  SkillTree,
  SkillTreeProgress,
  Achievement,
  AchievementRequirement,
} from './skill-tree-types';

export class UnlockSystem {
  /**
   * 检查成就是否完成
   */
  static checkAchievement(
    achievement: Achievement,
    progress: SkillTreeProgress,
    tree: SkillTree
  ): boolean {
    const req = achievement.requirement;

    switch (req.type) {
      case 'complete_nodes':
        return req.nodeIds
          ? req.nodeIds.every(id => progress.completedNodes.includes(id))
          : progress.completedNodes.length >= req.value;

      case 'complete_tree':
        return progress.completedNodes.length === tree.totalNodes;

      case 'earn_exp':
        return progress.totalExp >= req.value;

      case 'complete_in_time':
        if (!req.timeLimit) return false;
        const startTime = new Date(progress.startedAt).getTime();
        const currentTime = new Date().getTime();
        const hoursElapsed = (currentTime - startTime) / (1000 * 60 * 60);
        return (
          progress.completedNodes.length === tree.totalNodes &&
          hoursElapsed <= req.timeLimit
        );

      case 'perfect_score':
        // 需要额外的分数数据
        return false;

      default:
        return false;
    }
  }

  /**
   * 获取成就进度
   */
  static getAchievementProgress(
    achievement: Achievement,
    progress: SkillTreeProgress,
    tree: SkillTree
  ): number {
    const req = achievement.requirement;

    switch (req.type) {
      case 'complete_nodes':
        if (req.nodeIds) {
          const completed = req.nodeIds.filter(id =>
            progress.completedNodes.includes(id)
          ).length;
          return Math.round((completed / req.nodeIds.length) * 100);
        }
        return Math.min(
          100,
          Math.round((progress.completedNodes.length / req.value) * 100)
        );

      case 'complete_tree':
        return Math.round(
          (progress.completedNodes.length / tree.totalNodes) * 100
        );

      case 'earn_exp':
        return Math.min(100, Math.round((progress.totalExp / req.value) * 100));

      default:
        return 0;
    }
  }

  /**
   * 计算技能点奖励
   */
  static calculateSkillPointReward(node: SkillNode): number {
    const basePoints = 1;
    const typeMultiplier = {
      basic: 1,
      advanced: 2,
      expert: 3,
      milestone: 5,
    };

    return basePoints * typeMultiplier[node.type];
  }

  /**
   * 检查连击奖励
   */
  static checkStreakBonus(
    progress: SkillTreeProgress,
    lastCompletionDate: Date
  ): { hasBonus: boolean; multiplier: number; message: string } {
    const now = new Date();
    const lastActivity = new Date(progress.lastActivityAt);
    const hoursSinceLastActivity =
      (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

    // 24小时内完成多个节点有连击奖励
    if (hoursSinceLastActivity <= 24) {
      return {
        hasBonus: true,
        multiplier: 1.5,
        message: '连击奖励！经验值 +50%',
      };
    }

    return {
      hasBonus: false,
      multiplier: 1,
      message: '',
    };
  }

  /**
   * 解锁特殊功能
   */
  static unlockFeatures(level: number): string[] {
    const features: Record<number, string[]> = {
      5: ['自定义技能树'],
      10: ['AI 学习助手', '学习路径推荐'],
      15: ['技能树分享', '协作学习'],
      20: ['高级统计分析', '学习报告导出'],
      25: ['创建技能树模板', '社区贡献'],
      30: ['专家认证', '导师功能'],
    };

    return Object.entries(features)
      .filter(([lvl]) => level >= parseInt(lvl))
      .flatMap(([, feats]) => feats);
  }

  /**
   * 生成解锁动画配置
   */
  static getUnlockAnimation(nodeType: string) {
    const animations = {
      basic: {
        duration: 500,
        scale: [1, 1.2, 1],
        glow: 'rgba(34, 197, 94, 0.5)',
        particles: 10,
      },
      advanced: {
        duration: 700,
        scale: [1, 1.3, 1],
        glow: 'rgba(59, 130, 246, 0.6)',
        particles: 20,
      },
      expert: {
        duration: 900,
        scale: [1, 1.4, 1],
        glow: 'rgba(168, 85, 247, 0.7)',
        particles: 30,
      },
      milestone: {
        duration: 1200,
        scale: [1, 1.5, 1],
        glow: 'rgba(251, 191, 36, 0.8)',
        particles: 50,
      },
    };

    return animations[nodeType as keyof typeof animations] || animations.basic;
  }
}