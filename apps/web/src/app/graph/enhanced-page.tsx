"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { cn } from "@/lib/utils";
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

const EMPTY_GRAPH: { nodes: GraphNode[]; edges: GraphEdge[] } = {
  nodes: [],
  edges: [],
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
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 初始化数据
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const res = await fetch('/api/graph/view');
        const json = await res.json();
        if (!json.success || !json.data) {
          throw new Error(json?.error?.message || '图谱数据返回失败');
        }

        const serverNodes = json.data.nodes || [];
        const serverEdges = json.data.edges || [];

        if (serverNodes.length === 0) {
          setGraphData(EMPTY_GRAPH);
          setRecommendedPaths([]);
          setCurrentPath(null);
          setNodeDetail(null);
          setSelectedNode(null);
          setLoadError('当前还没有可展示的真实图谱数据，请先沉淀知识笔记或同步学习路径。');
          return;
        }

        const nodes: GraphNode[] = serverNodes.map((n: any) => ({
          id: n.id,
          name: n.label,
          type: (n.domain === 'learning_path' ? 'topic' : n.domain === 'learning_task' ? 'skill' : 'concept') as NodeType,
          status: (n.mastery >= 0.7 ? 'mastered' : n.mastery > 0 ? 'learning' : 'unlearned') as NodeStatus,
          importance: n.risk || 0.5,
          mastery: n.mastery || 0,
          connections: serverEdges.filter((e: any) => e.source === n.id || e.target === n.id).length,
          noteCount: 0,
          practiceCount: 0,
          practiceCompleted: 0,
          documentIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        const edges: GraphEdge[] = serverEdges.map((e: any) => ({
          source: e.source,
          target: e.target,
          type: 'prerequisite',
          strength: e.weight || 1,
        }));

        setGraphData({ nodes, edges });

        const engine = new RecommendationEngine(nodes, edges);
        const paths = engine.recommendLearningPaths(3);
        setRecommendedPaths(paths);
      } catch (error) {
        console.error('Failed to fetch graph data:', error);
        setGraphData(EMPTY_GRAPH);
        setRecommendedPaths([]);
        setCurrentPath(null);
        setNodeDetail(null);
        setSelectedNode(null);
        setLoadError(error instanceof Error ? error.message : '图谱数据加载失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGraphData();
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
    async (node: GraphNode) => {
      setSelectedNode(node);

      try {
        const res = await fetch(`/api/graph/node/${encodeURIComponent(node.id)}`);
        const json = await res.json();
        if (!res.ok || !json.success || !json.data) {
          throw new Error(json?.error?.message || "节点详情加载失败");
        }

        const detail = json.data;
        setNodeDetail({
          node,
          prerequisites: detail.prerequisites ?? [],
          nextSteps: detail.nextSteps ?? [],
          relatedNotes: detail.relatedNotes ?? [],
          relatedPractices: detail.relatedPractices ?? [],
          learningProgress: detail.learningProgress ?? {
            totalTime: 0,
            reviewCount: 0,
          },
          evidences: detail.evidences ?? [],
        });
      } catch (error) {
        console.error("Failed to load node detail:", error);
        setNodeDetail({
          node,
          prerequisites: [],
          nextSteps: [],
          relatedNotes: [],
          relatedPractices: [],
          learningProgress: {
            totalTime: 0,
            reviewCount: 0,
          },
          evidences: [],
        });
      }
    },
    []
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
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="border-b bg-card/50 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10"
              >
                <Network className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-xl font-semibold">知识星图</h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-muted-foreground"
                >
                  {filteredNodes.length} 个节点 · {filteredEdges.length} 条关系 ·{" "}
                  {(stats.completionRate * 100).toFixed(1)}% 完成
                </motion.p>
              </div>
            </motion.div>

            {/* 搜索和控制 */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative w-64"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索节点..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </motion.div>

              {/* 布局选择 */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
              </motion.div>

              {/* 主题选择 */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
              </motion.div>

              {/* 功能按钮 */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLearningPath(!showLearningPath)}
                  className={cn(
                    "transition-all",
                    showLearningPath && "bg-primary text-primary-foreground"
                  )}
                >
                  <Route className="h-4 w-4 mr-1" />
                  学习路径
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1, rotate: -15 }} whileTap={{ scale: 0.9 }}>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* 筛选器 */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mt-4"
          >
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">节点类型:</span>
            {Object.entries(NODE_TYPE_CONFIG).map(([type, config], index) => {
              const isActive = activeTypeFilters.has(type as NodeType);
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTypeFilter(type as NodeType)}
                    className={cn(
                      "h-7 transition-all",
                      isActive && "bg-gradient-to-r from-primary to-accent shadow-md"
                    )}
                  >
                    {config.label}
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* 主内容区 */}
      <div className="flex-1 flex relative overflow-hidden">
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              正在加载真实图谱数据...
            </div>
          ) : loadError && graphData.nodes.length === 0 ? (
            <div className="flex h-full items-center justify-center p-8">
              <div className="max-w-xl rounded-2xl border bg-card/80 p-6 text-center shadow-sm">
                <AlertCircle className="mx-auto mb-3 h-10 w-10 text-amber-500" />
                <h2 className="mb-2 text-lg font-semibold">当前没有可展示的真实图谱</h2>
                <p className="text-sm text-muted-foreground">{loadError}</p>
              </div>
            </div>
          ) : (
            <>
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

              <ProgressLegend stats={stats} />
            </>
          )}
        </div>

        {showLearningPath && recommendedPaths.length > 0 && (
          <LearningPathOverlay
            paths={recommendedPaths}
            currentPath={currentPath}
            nodes={graphData.nodes}
            onSelectPath={handleSelectPath}
            onClearPath={handleClearPath}
          />
        )}

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
