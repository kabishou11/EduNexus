// 布局算法

import type { GraphNode, GraphEdge, LayoutType } from "./types";

export class LayoutAlgorithms {
  /**
   * 力导向布局（默认）
   */
  static forceDirected(
    nodes: GraphNode[],
    edges: GraphEdge[]
  ): GraphNode[] {
    // react-force-graph 会自动处理力导向布局
    // 这里只需要返回节点，不需要手动计算位置
    return nodes;
  }

  /**
   * 层次布局
   */
  static hierarchical(
    nodes: GraphNode[],
    edges: GraphEdge[]
  ): GraphNode[] {
    // 计算每个节点的层级
    const levels = new Map<string, number>();
    const visited = new Set<string>();

    // 找到根节点（没有入边的节点）
    const inDegree = new Map<string, number>();
    nodes.forEach((n) => inDegree.set(n.id, 0));
    edges.forEach((e) => {
      const targetId = typeof e.target === "string" ? e.target : e.target.id;
      inDegree.set(targetId, (inDegree.get(targetId) || 0) + 1);
    });

    const roots = nodes.filter((n) => inDegree.get(n.id) === 0);

    // BFS 分配层级
    const queue: Array<{ nodeId: string; level: number }> = roots.map((n) => ({
      nodeId: n.id,
      level: 0,
    }));

    while (queue.length > 0) {
      const { nodeId, level } = queue.shift()!;
      if (visited.has(nodeId)) continue;

      visited.add(nodeId);
      levels.set(nodeId, level);

      // 找到所有子节点
      const children = edges
        .filter((e) => {
          const sourceId =
            typeof e.source === "string" ? e.source : e.source.id;
          return sourceId === nodeId;
        })
        .map((e) => (typeof e.target === "string" ? e.target : e.target.id));

      children.forEach((childId) => {
        if (!visited.has(childId)) {
          queue.push({ nodeId: childId, level: level + 1 });
        }
      });
    }

    // 计算每层的节点数量
    const levelCounts = new Map<number, number>();
    levels.forEach((level) => {
      levelCounts.set(level, (levelCounts.get(level) || 0) + 1);
    });

    // 分配位置
    const levelIndices = new Map<number, number>();
    const width = 1200;
    const height = 800;
    const levelHeight = height / (Math.max(...levels.values()) + 1);

    return nodes.map((node) => {
      const level = levels.get(node.id) || 0;
      const levelCount = levelCounts.get(level) || 1;
      const index = levelIndices.get(level) || 0;
      levelIndices.set(level, index + 1);

      return {
        ...node,
        fx: (width / (levelCount + 1)) * (index + 1) - width / 2,
        fy: level * levelHeight - height / 2,
      };
    });
  }

  /**
   * 径向布局
   */
  static radial(
    nodes: GraphNode[],
    edges: GraphEdge[],
    centerNodeId?: string
  ): GraphNode[] {
    // 找到中心节点（最重要的节点或指定节点）
    const centerNode = centerNodeId
      ? nodes.find((n) => n.id === centerNodeId)
      : nodes.reduce((max, n) => (n.importance > max.importance ? n : max));

    if (!centerNode) return nodes;

    // 计算每个节点到中心的距离
    const distances = new Map<string, number>();
    distances.set(centerNode.id, 0);

    const queue: string[] = [centerNode.id];
    const visited = new Set<string>([centerNode.id]);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentDist = distances.get(currentId)!;

      // 找到所有相邻节点
      const neighbors = edges
        .filter((e) => {
          const sourceId =
            typeof e.source === "string" ? e.source : e.source.id;
          const targetId =
            typeof e.target === "string" ? e.target : e.target.id;
          return sourceId === currentId || targetId === currentId;
        })
        .map((e) => {
          const sourceId =
            typeof e.source === "string" ? e.source : e.source.id;
          const targetId =
            typeof e.target === "string" ? e.target : e.target.id;
          return sourceId === currentId ? targetId : sourceId;
        });

      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          distances.set(neighborId, currentDist + 1);
          queue.push(neighborId);
        }
      }
    }

    // 按距离分组
    const layers = new Map<number, string[]>();
    distances.forEach((dist, nodeId) => {
      if (!layers.has(dist)) layers.set(dist, []);
      layers.get(dist)!.push(nodeId);
    });

    // 分配位置
    const maxRadius = 400;
    return nodes.map((node) => {
      const dist = distances.get(node.id) || 0;
      if (dist === 0) {
        return { ...node, fx: 0, fy: 0 };
      }

      const layer = layers.get(dist)!;
      const index = layer.indexOf(node.id);
      const angleStep = (2 * Math.PI) / layer.length;
      const angle = index * angleStep;
      const radius = (dist / Math.max(...distances.values())) * maxRadius;

      return {
        ...node,
        fx: Math.cos(angle) * radius,
        fy: Math.sin(angle) * radius,
      };
    });
  }

  /**
   * 时间轴布局
   */
  static timeline(nodes: GraphNode[]): GraphNode[] {
    // 按创建时间排序
    const sorted = [...nodes].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );

    const width = 1200;
    const height = 600;
    const xStep = width / (sorted.length + 1);

    return sorted.map((node, index) => ({
      ...node,
      fx: (index + 1) * xStep - width / 2,
      fy: (Math.random() - 0.5) * height * 0.6, // 添加一些随机性
    }));
  }

  /**
   * 应用布局
   */
  static applyLayout(
    nodes: GraphNode[],
    edges: GraphEdge[],
    layout: LayoutType,
    centerNodeId?: string
  ): GraphNode[] {
    switch (layout) {
      case "hierarchical":
        return this.hierarchical(nodes, edges);
      case "radial":
        return this.radial(nodes, edges, centerNodeId);
      case "timeline":
        return this.timeline(nodes);
      case "force":
      default:
        return this.forceDirected(nodes, edges);
    }
  }
}
