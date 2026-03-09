"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { GraphNode, GraphEdge, LayoutType, ThemeType } from "@/lib/graph/types";
import { LayoutAlgorithms } from "@/lib/graph/layout-algorithms";

// 动态导入以避免 SSR 问题
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-muted-foreground">加载图谱中...</div>
    </div>
  ),
});

// 节点状态颜色
const STATUS_COLORS = {
  unlearned: "#94a3b8", // 灰色
  learning: "#fbbf24", // 黄色
  mastered: "#10b981", // 绿色
  review: "#f97316", // 橙色
};

// 主题配置
const THEMES = {
  tech: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    particleColor: "#ffffff",
    glowColor: "#667eea",
  },
  nature: {
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    particleColor: "#ffffff",
    glowColor: "#f093fb",
  },
  minimal: {
    background: "#ffffff",
    particleColor: "#000000",
    glowColor: "#3b82f6",
  },
};

interface InteractiveGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNode: GraphNode | null;
  onNodeClick: (node: GraphNode) => void;
  onNodeHover: (node: GraphNode | null) => void;
  layout: LayoutType;
  theme: ThemeType;
  showLearningPath?: boolean;
  pathNodes?: string[];
}

export function InteractiveGraph({
  nodes,
  edges,
  selectedNode,
  onNodeClick,
  onNodeHover,
  layout,
  theme,
  showLearningPath = false,
  pathNodes = [],
}: InteractiveGraphProps) {
  const graphRef = useRef<any>(null);
  const [layoutedNodes, setLayoutedNodes] = useState<GraphNode[]>(nodes);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  // 应用布局算法
  useEffect(() => {
    const newNodes = LayoutAlgorithms.applyLayout(
      nodes,
      edges,
      layout,
      selectedNode?.id
    );
    setLayoutedNodes(newNodes);
  }, [nodes, edges, layout, selectedNode]);

  // 自动缩放到合适大小
  useEffect(() => {
    if (graphRef.current && layoutedNodes.length > 0) {
      setTimeout(() => {
        graphRef.current?.zoomToFit(400, 50);
      }, 100);
    }
  }, [layoutedNodes]);

  const handleNodeClick = useCallback(
    (node: any) => {
      onNodeClick(node as GraphNode);
    },
    [onNodeClick]
  );

  const handleNodeHover = useCallback(
    (node: any) => {
      const graphNode = node as GraphNode | null;
      setHoveredNode(graphNode);
      onNodeHover(graphNode);
    },
    [onNodeHover]
  );

  // 绘制节点
  const nodeCanvasObject = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const graphNode = node as GraphNode;
      const label = graphNode.name;
      const fontSize = 12 / globalScale;

      // 节点大小基于重要性和连接数
      const baseSize = 3;
      const importanceSize = graphNode.importance * 5;
      const connectionSize = Math.min(graphNode.connections * 0.5, 3);
      const nodeSize = baseSize + importanceSize + connectionSize;

      // 节点颜色基于状态
      const nodeColor = STATUS_COLORS[graphNode.status];

      // 绘制光晕效果（选中或悬停时）
      if (
        selectedNode?.id === graphNode.id ||
        hoveredNode?.id === graphNode.id
      ) {
        const gradient = ctx.createRadialGradient(
          graphNode.x || 0,
          graphNode.y || 0,
          nodeSize,
          graphNode.x || 0,
          graphNode.y || 0,
          nodeSize * 2
        );
        gradient.addColorStop(0, nodeColor);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(graphNode.x || 0, graphNode.y || 0, nodeSize * 2, 0, 2 * Math.PI);
        ctx.fill();
      }

      // 绘制节点圆圈
      ctx.beginPath();
      ctx.arc(graphNode.x || 0, graphNode.y || 0, nodeSize, 0, 2 * Math.PI);
      ctx.fillStyle = nodeColor;
      ctx.fill();

      // 绘制边框
      ctx.strokeStyle =
        selectedNode?.id === graphNode.id
          ? "#ffffff"
          : hoveredNode?.id === graphNode.id
            ? "#ffffff"
            : "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth =
        selectedNode?.id === graphNode.id || hoveredNode?.id === graphNode.id
          ? 3 / globalScale
          : 1.5 / globalScale;
      ctx.stroke();

      // 绘制进度环（掌握程度）
      if (graphNode.mastery > 0) {
        ctx.beginPath();
        ctx.arc(
          graphNode.x || 0,
          graphNode.y || 0,
          nodeSize + 2 / globalScale,
          -Math.PI / 2,
          -Math.PI / 2 + graphNode.mastery * 2 * Math.PI
        );
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2 / globalScale;
        ctx.stroke();
      }

      // 绘制标签
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#1a1a1a";
      ctx.fillText(
        label,
        graphNode.x || 0,
        (graphNode.y || 0) + nodeSize + fontSize + 2
      );

      // 绘制图标（笔记和练习数量）
      if (graphNode.noteCount > 0 || graphNode.practiceCount > 0) {
        const iconSize = 8 / globalScale;
        const iconY = (graphNode.y || 0) - nodeSize - iconSize;
        ctx.font = `${iconSize}px Inter, sans-serif`;
        ctx.fillStyle = "#6b7280";
        ctx.fillText(
          `📝${graphNode.noteCount} 🎯${graphNode.practiceCount}`,
          graphNode.x || 0,
          iconY
        );
      }
    },
    [selectedNode, hoveredNode]
  );

  // 绘制连接线
  const linkColor = useCallback(
    (link: any) => {
      const graphLink = link as GraphEdge;
      const sourceId =
        typeof graphLink.source === "string"
          ? graphLink.source
          : graphLink.source.id;
      const targetId =
        typeof graphLink.target === "string"
          ? graphLink.target
          : graphLink.target.id;

      // 学习路径高亮
      if (
        showLearningPath &&
        pathNodes.includes(sourceId) &&
        pathNodes.includes(targetId)
      ) {
        return "#3b82f6";
      }

      // 根据关系类型设置颜色
      const typeColors = {
        prerequisite: "rgba(239, 68, 68, 0.4)",
        related: "rgba(59, 130, 246, 0.4)",
        contains: "rgba(16, 185, 129, 0.4)",
        applies: "rgba(251, 191, 36, 0.4)",
      };

      return typeColors[graphLink.type] || "rgba(156, 163, 175, 0.3)";
    },
    [showLearningPath, pathNodes]
  );

  // 连接线宽度基于强度
  const linkWidth = useCallback((link: any) => {
    const graphLink = link as GraphEdge;
    return 1 + graphLink.strength * 2;
  }, []);

  return (
    <div
      className="w-full h-full relative"
      style={{ background: THEMES[theme].background }}
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={{ nodes: layoutedNodes, links: edges }}
        nodeLabel="name"
        nodeCanvasObject={nodeCanvasObject}
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkDirectionalParticles={showLearningPath ? 4 : 2}
        linkDirectionalParticleWidth={3}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleColor={() => THEMES[theme].particleColor}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        cooldownTicks={layout === "force" ? 100 : 0}
        enableNodeDrag={layout === "force"}
        enableZoomInteraction={true}
        enablePanInteraction={true}
      />
    </div>
  );
}
