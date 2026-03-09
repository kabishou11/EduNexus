// 进度追踪器

import type { GraphNode, NodeStatus } from "./types";

export interface ProgressStats {
  total: number;
  unlearned: number;
  learning: number;
  mastered: number;
  review: number;
  completionRate: number;
  averageMastery: number;
}

export class ProgressTracker {
  /**
   * 计算整体进度统计
   */
  static calculateStats(nodes: GraphNode[]): ProgressStats {
    const stats = {
      total: nodes.length,
      unlearned: 0,
      learning: 0,
      mastered: 0,
      review: 0,
      completionRate: 0,
      averageMastery: 0,
    };

    let totalMastery = 0;

    for (const node of nodes) {
      stats[node.status]++;
      totalMastery += node.mastery;
    }

    stats.completionRate = stats.total > 0 ? stats.mastered / stats.total : 0;
    stats.averageMastery = stats.total > 0 ? totalMastery / stats.total : 0;

    return stats;
  }

  /**
   * 更新节点状态
   */
  static updateNodeStatus(
    node: GraphNode,
    practiceCompleted?: number
  ): NodeStatus {
    const completionRate =
      node.practiceCount > 0
        ? (practiceCompleted ?? node.practiceCompleted) / node.practiceCount
        : 0;

    // 根据掌握程度和练习完成率判断状态
    if (node.mastery >= 0.8 && completionRate >= 0.8) {
      // 检查是否需要复习
      if (
        node.lastReviewedAt &&
        Date.now() - node.lastReviewedAt.getTime() > 14 * 24 * 60 * 60 * 1000
      ) {
        return "review";
      }
      return "mastered";
    } else if (node.mastery >= 0.3 || completionRate > 0) {
      return "learning";
    } else {
      return "unlearned";
    }
  }

  /**
   * 计算节点重要性
   */
  static calculateImportance(
    node: GraphNode,
    allNodes: GraphNode[],
    edges: Array<{ source: string; target: string }>
  ): number {
    // 基于连接数
    const connectionScore = Math.min(node.connections / 10, 1) * 0.4;

    // 基于被依赖程度（有多少节点依赖这个节点）
    const dependencyCount = edges.filter((e) => e.source === node.id).length;
    const dependencyScore = Math.min(dependencyCount / 5, 1) * 0.3;

    // 基于笔记和练习数量
    const contentScore =
      Math.min((node.noteCount + node.practiceCount) / 10, 1) * 0.3;

    return connectionScore + dependencyScore + contentScore;
  }

  /**
   * 生成学习报告
   */
  static generateReport(nodes: GraphNode[]): {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  } {
    const stats = this.calculateStats(nodes);
    const masteredNodes = nodes.filter((n) => n.status === "mastered");
    const weakNodes = nodes.filter((n) => n.mastery < 0.3);

    const summary = `
      总共 ${stats.total} 个知识点，已掌握 ${stats.mastered} 个（${(stats.completionRate * 100).toFixed(1)}%）。
      平均掌握程度：${(stats.averageMastery * 100).toFixed(1)}%。
    `.trim();

    const strengths: string[] = [];
    if (masteredNodes.length > 0) {
      const topMastered = masteredNodes
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 3)
        .map((n) => n.name);
      strengths.push(`已掌握重要知识点：${topMastered.join("、")}`);
    }
    if (stats.completionRate > 0.5) {
      strengths.push("整体学习进度良好");
    }

    const weaknesses: string[] = [];
    if (weakNodes.length > 0) {
      const topWeak = weakNodes
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 3)
        .map((n) => n.name);
      weaknesses.push(`需要加强的知识点：${topWeak.join("、")}`);
    }
    if (stats.review > stats.total * 0.2) {
      weaknesses.push("有较多知识点需要复习");
    }

    const recommendations: string[] = [];
    if (stats.learning > 0) {
      recommendations.push("继续完成正在学习的知识点");
    }
    if (stats.review > 0) {
      recommendations.push("及时复习已掌握的知识点，防止遗忘");
    }
    if (weakNodes.length > 0) {
      recommendations.push("重点关注薄弱知识点，增加练习");
    }

    return { summary, strengths, weaknesses, recommendations };
  }

  /**
   * 计算学习时间线
   */
  static calculateTimeline(
    nodes: GraphNode[]
  ): Array<{ date: Date; event: string; nodeId: string }> {
    const events: Array<{ date: Date; event: string; nodeId: string }> = [];

    for (const node of nodes) {
      events.push({
        date: node.createdAt,
        event: `创建知识点：${node.name}`,
        nodeId: node.id,
      });

      if (node.lastReviewedAt) {
        events.push({
          date: node.lastReviewedAt,
          event: `复习：${node.name}`,
          nodeId: node.id,
        });
      }
    }

    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
