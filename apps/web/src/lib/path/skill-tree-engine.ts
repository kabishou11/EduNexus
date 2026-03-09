/**
 * 技能树引擎 - 核心逻辑处理
 */

import type {
  SkillNode,
  SkillTree,
  SkillNodeStatus,
  SkillTreeProgress,
  AIRecommendation,
} from './skill-tree-types';

export class SkillTreeEngine {
  private tree: SkillTree;
  private progress: SkillTreeProgress;

  constructor(tree: SkillTree, progress: SkillTreeProgress) {
    this.tree = tree;
    this.progress = progress;
  }

  /**
   * 检查节点是否可以解锁
   */
  canUnlockNode(nodeId: string): boolean {
    const node = this.tree.nodes.find(n => n.id === nodeId);
    if (!node) return false;

    // 检查是否已完成
    if (this.progress.completedNodes.includes(nodeId)) {
      return false;
    }

    // 检查技能点是否足够
    if (node.skillPoints > this.progress.skillPoints) {
      return false;
    }

    // 检查所有依赖是否已完成
    return node.dependencies.every(depId =>
      this.progress.completedNodes.includes(depId)
    );
  }

  /**
   * 获取节点状态
   */
  getNodeStatus(nodeId: string): SkillNodeStatus {
    if (this.progress.completedNodes.includes(nodeId)) {
      return 'completed';
    }

    if (this.progress.inProgressNodes.includes(nodeId)) {
      return 'in_progress';
    }

    if (this.canUnlockNode(nodeId)) {
      return 'available';
    }

    return 'locked';
  }

  /**
   * 解锁节点
   */
  unlockNode(nodeId: string): boolean {
    if (!this.canUnlockNode(nodeId)) {
      return false;
    }

    const node = this.tree.nodes.find(n => n.id === nodeId);
    if (!node) return false;

    // 扣除技能点
    this.progress.skillPoints -= node.skillPoints;

    // 添加到进行中列表
    if (!this.progress.inProgressNodes.includes(nodeId)) {
      this.progress.inProgressNodes.push(nodeId);
    }

    return true;
  }

  /**
   * 完成节点
   */
  completeNode(nodeId: string): { success: boolean; expGained: number } {
    const node = this.tree.nodes.find(n => n.id === nodeId);
    if (!node) {
      return { success: false, expGained: 0 };
    }

    // 从进行中移除
    this.progress.inProgressNodes = this.progress.inProgressNodes.filter(
      id => id !== nodeId
    );

    // 添加到已完成
    if (!this.progress.completedNodes.includes(nodeId)) {
      this.progress.completedNodes.push(nodeId);
    }

    // 增加经验值
    this.progress.totalExp += node.exp;

    // 更新最后活动时间
    this.progress.lastActivityAt = new Date().toISOString();

    return { success: true, expGained: node.exp };
  }

  /**
   * 获取可用节点列表
   */
  getAvailableNodes(): SkillNode[] {
    return this.tree.nodes.filter(node =>
      this.getNodeStatus(node.id) === 'available'
    );
  }

  /**
   * 获取推荐学习路径
   */
  getRecommendedPath(): string[] {
    const available = this.getAvailableNodes();

    // 按优先级排序：
    // 1. 基础技能优先
    // 2. 解锁更多后续技能的优先
    // 3. 经验值高的优先
    return available
      .sort((a, b) => {
        // 基础技能优先
        const typeWeight = { basic: 3, advanced: 2, expert: 1, milestone: 0 };
        const typeDiff = typeWeight[a.type] - typeWeight[b.type];
        if (typeDiff !== 0) return -typeDiff;

        // 解锁更多技能的优先
        const unlockDiff = b.unlocks.length - a.unlocks.length;
        if (unlockDiff !== 0) return unlockDiff;

        // 经验值高的优先
        return b.exp - a.exp;
      })
      .map(node => node.id);
  }

  /**
   * 计算完成度
   */
  getCompletionPercentage(): number {
    if (this.tree.totalNodes === 0) return 0;
    return Math.round(
      (this.progress.completedNodes.length / this.tree.totalNodes) * 100
    );
  }

  /**
   * 获取下一个里程碑
   */
  getNextMilestone(): SkillNode | null {
    const milestones = this.tree.nodes.filter(
      node => node.type === 'milestone' && !this.progress.completedNodes.includes(node.id)
    );

    if (milestones.length === 0) return null;

    // 返回最接近完成的里程碑
    return milestones.reduce((closest, current) => {
      const closestReady = closest.dependencies.filter(depId =>
        this.progress.completedNodes.includes(depId)
      ).length;
      const currentReady = current.dependencies.filter(depId =>
        this.progress.completedNodes.includes(depId)
      ).length;

      return currentReady > closestReady ? current : closest;
    });
  }

  /**
   * 预测完成时间
   */
  estimateCompletionTime(): number {
    const remainingNodes = this.tree.nodes.filter(
      node => !this.progress.completedNodes.includes(node.id)
    );

    return remainingNodes.reduce(
      (total, node) => total + node.estimatedHours,
      0
    );
  }

  /**
   * 获取学习统计
   */
  getStats() {
    const completed = this.progress.completedNodes.length;
    const inProgress = this.progress.inProgressNodes.length;
    const available = this.getAvailableNodes().length;
    const locked = this.tree.totalNodes - completed - inProgress - available;

    return {
      total: this.tree.totalNodes,
      completed,
      inProgress,
      available,
      locked,
      completionPercentage: this.getCompletionPercentage(),
      totalExp: this.progress.totalExp,
      skillPoints: this.progress.skillPoints,
      estimatedHoursRemaining: this.estimateCompletionTime(),
    };
  }
}

/**
 * 生成 AI 推荐
 */
export function generateAIRecommendations(
  tree: SkillTree,
  progress: SkillTreeProgress,
  userPreferences?: {
    focusAreas?: string[];
    availableHoursPerWeek?: number;
    learningStyle?: 'visual' | 'practical' | 'theoretical';
  }
): AIRecommendation[] {
  const engine = new SkillTreeEngine(tree, progress);
  const availableNodes = engine.getAvailableNodes();

  const recommendations: AIRecommendation[] = availableNodes.map(node => {
    let priority: 'high' | 'medium' | 'low' = 'medium';
    let reason = '推荐学习此技能';

    // 基础技能优先级高
    if (node.type === 'basic') {
      priority = 'high';
      reason = '基础技能，建议优先掌握';
    }

    // 解锁多个后续技能的优先级高
    if (node.unlocks.length >= 3) {
      priority = 'high';
      reason = `完成后可解锁 ${node.unlocks.length} 个新技能`;
    }

    // 里程碑优先级高
    if (node.type === 'milestone') {
      priority = 'high';
      reason = '重要里程碑，完成后将获得显著进步';
    }

    // 根据用户偏好调整
    if (userPreferences?.focusAreas) {
      const matchesFocus = userPreferences.focusAreas.some(area =>
        node.title.toLowerCase().includes(area.toLowerCase())
      );
      if (matchesFocus) {
        priority = 'high';
        reason = '符合您的学习重点';
      }
    }

    return {
      nodeId: node.id,
      reason,
      priority,
      estimatedTime: node.estimatedHours,
      prerequisites: node.dependencies,
    };
  });

  // 按优先级排序
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return recommendations.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );
}
