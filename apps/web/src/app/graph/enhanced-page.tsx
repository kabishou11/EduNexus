"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Network,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Download,
  Share2,
  Settings,
  Route,
  AlertCircle,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { InteractiveGraph } from "@/components/graph/interactive-graph";
import { NodeDetailPanel } from "@/components/graph/node-detail-panel";
import { LearningPathOverlay } from "@/components/graph/learning-path-overlay";
import { ProgressLegend } from "@/components/graph/progress-legend";
import { RecommendationEngine } from "@/lib/graph/recommendation-engine";
import { ProgressTracker } from "@/lib/graph/progress-tracker";
import type {
  GraphNode,
  GraphEdge,
  NodeDetail,
  LearningPath,
  LayoutType,
  ThemeType,
  NodeType,
  NodeStatus,
} from "@/lib/graph/types";

// 节点类型配置
const NODE_TYPE_CONFIG = {
  concept: { label: "概念", color: "bg-purple-500" },
  topic: { label: "主题", color: "bg-blue-500" },
  resource: { label: "资源", color: "bg-pink-500" },
  skill: { label: "技能", color: "bg-orange-500" },
};

// 生成模拟数据
const generateMockData = (): { nodes: GraphNode[]; edges: GraphEdge[] } => {
  const now = new Date();
  const nodes: GraphNode[] = [
    {
      id: "1",
      name: "React 基础",
      type: "concept",
      status: "mastered",
      importance: 0.9,
      mastery: 0.85,
      connections: 5,
      noteCount: 3,
      practiceCount: 5,
      practiceCompleted: 5,
      lastReviewedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    },
    {
      id: "2",
      name: "JSX 语法",
      type: "concept",
      status: "mastered",
      importance: 0.7,
      mastery: 0.9,
      connections: 3,
      noteCount: 2,
      practiceCount: 3,
      practiceCompleted: 3,
      lastReviewedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 55 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    },
    {
      id: "3",
      name: "组件化开发",
      type: "topic",
      status: "learning",
      importance: 0.8,
      mastery: 0.6,
      connections: 4,
      noteCount: 4,
      practiceCount: 6,
      practiceCompleted: 3,
      createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    },
    {
      id: "4",
      name: "Hooks",
      type: "concept",
      status: "learning",
      importance: 0.85,
      mastery: 0.5,
      connections: 6,
      noteCount: 5,
      practiceCount: 8,
      practiceCompleted: 4,
      createdAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    },
    {
      id: "5",
      name: "useState",
      type: "skill",
      status: "mastered",
      importance: 0.6,
      mastery: 0.8,
      connections: 2,
      noteCount: 2,
      practiceCount: 4,
      practiceCompleted: 4,
      lastReviewedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    },
    {
      id: "6",
      name: "useEffect",
      type: "skill",
      status: "learning",
      importance: 0.7,
      mastery: 0.55,
      connections: 3,
      noteCount: 3,
      practiceCount: 5,
      practiceCompleted: 2,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    },
    {
      id: "7",
      name: "状态管理",
      type: "topic",
      status: "unlearned",
      importance: 0.75,
      mastery: 0.2,
      connections: 4,
      noteCount: 1,
      practiceCount: 6,
      practiceCompleted: 0,
      createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    },
    {
      id: "8",
      name: "Redux",
      type: "resource",
      status: "unlearned",
      importance: 0.5,
      mastery: 0.1,
      connections: 2,
      noteCount: 0,
      practiceCount: 4,
      practiceCompleted: 0,
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    },
    {
      id: "9",
      name: "Context API",
      type: "resource",
      status: "unlearned",
      importance: 0.6,
      mastery: 0.15,
      connections: 2,
      noteCount: 1,
      practiceCount: 3,
      practiceCompleted: 0,
      createdAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    },
    {
      id: "10",
      name: "路由",
      type: "topic",
      status: "review",
      importance: 0.7,
      mastery: 0.75,
      connections: 3,
      noteCount: 2,
      practiceCount: 4,
      practiceCompleted: 3,
      lastReviewedAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    },
  ];

  const edges: GraphEdge[] = [
    { source: "1", target: "2", type: "contains", strength: 0.9 },
    { source: "1", target: "3", type: "contains", strength: 0.8 },
    { source: "1", target: "4", type: "contains", strength: 0.85 },
    { source: "4", target: "5", type: "contains", strength: 0.7 },
    { source: "4", target: "6", type: "contains", strength: 0.75 },
    { source: "1", target: "7", type: "related", strength: 0.6 },
    { source: "7", target: "8", type: "applies", strength: 0.5 },
    { source: "7", target: "9", type: "applies", strength: 0.6 },
    { source: "1", target: "10", type: "related", strength: 0.7 },
    { source: "3", target: "7", type: "prerequisite", strength: 0.8 },
  ];

  return { nodes, edges };
};

export default function EnhancedGraphPage() {
  // 状态管理
  const [graphData, setGraphData] = useState<{
    nodes: GraphNode[];
    edges: GraphEdge[];
  }>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState<LayoutType>("force");
  const [theme, setTheme] = useState<ThemeType>("tech");
  const [activeTypeFilters, setActiveTypeFilters] = useState<Set<NodeType>>(
    new Set(["concept", "topic", "resource", "skill"])
  );
  const [activeStatusFilters, setActiveStatusFilters] = useState<Set<NodeStatus>>(
    new Set(["unlearned", "learning", "mastered", "review"])
  );
  const [showLearningPath, setShowLearningPath] = useState(false);
  const [currentPath, setCurrentPath] = useState<LearningPath | null>(null);
  const [recommendedPaths, setRecommendedPaths] = useState<LearningPath[]>([]);
  const [nodeDetail, setNodeDetail] = useState<NodeDetail | null>(null);

  // 初始化数据
  useEffect(() => {
    const data = generateMockData();
    setGraphData(data);

    // 生成推荐路径
    const engine = new RecommendationEngine(data.nodes, data.edges);
    const paths = engine.recommendLearningPaths(3);
    setRecommendedPaths(paths);
  }, []);

  // 筛选节点
  const filteredNodes = graphData.nodes.filter((node) => {
    // 类型筛选
    if (!activeTypeFilters.has(node.type)) return false;
    // 状态筛选
    if (!activeStatusFilters.has(node.status)) return false;
    // 搜索筛选
    if (
      searchQuery &&
      !node.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const filteredEdges = graphData.edges.filter((edge) => {
    const sourceId = typeof edge.source === "string" ? edge.source : edge.source.id;
    const targetId = typeof edge.target === "string" ? edge.target : edge.target.id;
    return (
      filteredNodes.some((n) => n.id === sourceId) &&
      filteredNodes.some((n) => n.id === targetId)
    );
  });

  // 计算进度统计
  const stats = ProgressTracker.calculateStats(graphData.nodes);

  // 处理节点点击
  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      setSelectedNode(node);

      // 生成节点详情
      const engine = new RecommendationEngine(graphData.nodes, graphData.edges);
      const nextSteps = engine.recommendNextSteps(node.id, 3);

      // 获取前置知识
      const prerequisites = graphData.edges
        .filter((e) => {
          const targetId = typeof e.target === "string" ? e.target : e.target.id;
          return targetId === node.id && e.type === "prerequisite";
        })
        .map((e) => {
          const sourceId = typeof e.source === "string" ? e.source : e.source.id;
          return graphData.nodes.find((n) => n.id === sourceId);
        })
        .filter((n): n is GraphNode => n !== undefined);

      setNodeDetail({
        node,
        prerequisites,
        nextSteps,
        relatedNotes: [
          {
            id: "note1",
            title: `${node.name} 学习笔记`,
            excerpt: "这是关于该知识点的学习笔记摘要...",
          },
        ],
        relatedPractices: [
          {
            id: "practice1",
            title: `${node.name} 练习题`,
            completed: node.practiceCompleted > 0,
          },
        ],
        learningProgress: {
          totalTime: Math.floor(Math.random() * 120) + 30,
          lastStudied: node.lastReviewedAt,
          reviewCount: Math.floor(Math.random() * 5),
        },
      });
    },
    [graphData]
  );

  // 切换类型筛选
  const toggleTypeFilter = (type: NodeType) => {
    const newFilters = new Set(activeTypeFilters);
    if (newFilters.has(type)) {
      newFilters.delete(type);
    } else {
      newFilters.add(type);
    }
    setActiveTypeFilters(newFilters);
  };

  // 选择学习路径
  const handleSelectPath = (path: LearningPath) => {
    setCurrentPath(path);
    setShowLearningPath(true);
  };

  // 清除学习路径
  const handleClearPath = () => {
    setCurrentPath(null);
    setShowLearningPath(false);
  };

  // 导出图谱
  const handleExport = () => {
    alert("导出功能：将图谱导出为 PNG/SVG 格式");
  };

  // 分享图谱
  const handleShare = () => {
    alert("分享功能：生成分享链接");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 头部 */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Network className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">知识星图</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredNodes.length} 个节点 · {filteredEdges.length} 条关系 ·{" "}
                  {(stats.completionRate * 100).toFixed(1)}% 完成
                </p>
              </div>
            </div>

            {/* 搜索和控制 */}
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索节点..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* 布局选择 */}
              <Select value={layout} onValueChange={(v) => setLayout(v as LayoutType)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="force">力导向</SelectItem>
                  <SelectItem value="hierarchical">层次</SelectItem>
                  <SelectItem value="radial">径向</SelectItem>
                  <SelectItem value="timeline">时间轴</SelectItem>
                </SelectContent>
              </Select>

              {/* 主题选择 */}
              <Select value={theme} onValueChange={(v) => setTheme(v as ThemeType)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">科技风</SelectItem>
                  <SelectItem value="nature">自然风</SelectItem>
                  <SelectItem value="minimal">简约风</SelectItem>
                </SelectContent>
              </Select>

              {/* 功能按钮 */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLearningPath(!showLearningPath)}
              >
                <Route className="h-4 w-4 mr-1" />
                学习路径
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 筛选器 */}
          <div className="flex items-center gap-2 mt-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">节点类型:</span>
            {Object.entries(NODE_TYPE_CONFIG).map(([type, config]) => {
              const isActive = activeTypeFilters.has(type as NodeType);
              return (
                <Button
                  key={type}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTypeFilter(type as NodeType)}
                  className="h-7"
                >
                  {config.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex relative">
        {/* 图谱画布 */}
        <div className="flex-1">
          <InteractiveGraph
            nodes={filteredNodes}
            edges={filteredEdges}
            selectedNode={selectedNode}
            onNodeClick={handleNodeClick}
            onNodeHover={setHoveredNode}
            layout={layout}
            theme={theme}
            showLearningPath={showLearningPath}
            pathNodes={currentPath?.nodes || []}
          />

          {/* 学习路径叠加层 */}
          {showLearningPath && (
            <LearningPathOverlay
              paths={recommendedPaths}
              currentPath={currentPath}
              nodes={graphData.nodes}
              onSelectPath={handleSelectPath}
              onClearPath={handleClearPath}
            />
          )}

          {/* 进度图例 */}
          <ProgressLegend stats={stats} />
        </div>

        {/* 节点详情面板 */}
        {selectedNode && nodeDetail && (
          <NodeDetailPanel
            detail={nodeDetail}
            onClose={() => {
              setSelectedNode(null);
              setNodeDetail(null);
            }}
            onNavigate={(nodeId) => {
              const node = graphData.nodes.find((n) => n.id === nodeId);
              if (node) handleNodeClick(node);
            }}
          />
        )}
      </div>
    </div>
  );
}
