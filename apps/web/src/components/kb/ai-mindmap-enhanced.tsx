"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Maximize2, Download, X, Brain } from "lucide-react";
import type { KBDocument } from "@/lib/client/kb-storage";
import { getModelConfig } from "@/lib/client/model-config";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";

interface AIMindMapEnhancedProps {
  document: KBDocument;
}

export function AIMindMapEnhanced({ document }: AIMindMapEnhancedProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showFloating, setShowFloating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMindMap = async () => {
    setIsGenerating(true);
    setProgress(0);
    setError(null);

    // 模拟进度
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const config = getModelConfig();

      const response = await fetch("/api/kb/mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: document.content,
          title: document.title,
          config: {
            apiKey: config.apiKey,
            apiEndpoint: config.apiEndpoint,
            model: config.model,
            temperature: config.temperature,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate mind map");
      }

      const data = await response.json();

      // 转换为 ReactFlow 节点和边
      const newNodes: Node[] = data.nodes.map((node: any, index: number) => ({
        id: node.id,
        type: "default",
        data: { label: node.label },
        position: {
          x: Math.cos((index * 2 * Math.PI) / data.nodes.length) * 200 + 250,
          y: Math.sin((index * 2 * Math.PI) / data.nodes.length) * 200 + 250,
        },
        style: {
          background: node.level === 0 ? "#6366f1" : "#e0e7ff",
          color: node.level === 0 ? "#fff" : "#000",
          border: "1px solid #6366f1",
          borderRadius: "8px",
          padding: "10px",
        },
      }));

      const newEdges: Edge[] = data.edges.map((edge: any) => ({
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        type: "smoothstep",
        animated: true,
      }));

      setNodes(newNodes);
      setEdges(newEdges);
      setProgress(100);
      clearInterval(progressInterval);
    } catch (error) {
      console.error("Failed to generate mind map:", error);
      setError(error instanceof Error ? error.message : "生成思维导图失败，请检查API配置");
      clearInterval(progressInterval);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 500);
    }
  };

  const exportAsImage = () => {
    // TODO: 实现导出为图片功能
    console.log("Export as image");
  };

  if (nodes.length === 0) {
    return (
      <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1">AI 思维导图</h4>
            <p className="text-xs text-muted-foreground">
              智能分析文档结构，生成可视化思维导图
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {isGenerating && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>正在生成思维导图...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        <Button
          onClick={generateMindMap}
          disabled={isGenerating || !document.content}
          size="sm"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              生成中...
            </>
          ) : (
            "生成思维导图"
          )}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <div className="border rounded-lg overflow-hidden h-[200px] bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            attributionPosition="bottom-right"
          >
            <Background />
          </ReactFlow>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowFloating(true)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Maximize2 className="h-3.5 w-3.5 mr-1.5" />
            全屏查看
          </Button>
          <Button
            onClick={exportAsImage}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            导出
          </Button>
        </div>
      </div>

      {/* 悬浮子页面 */}
      <AnimatePresence>
        {showFloating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowFloating(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl shadow-2xl w-full h-full max-w-7xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI 思维导图</h3>
                    <p className="text-xs opacity-90">{document.title}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFloating(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* 内容 */}
              <div className="h-[calc(90vh-140px)]">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  fitView
                >
                  <Background />
                  <Controls />
                  <MiniMap />
                </ReactFlow>
              </div>

              {/* 底部操作 */}
              <div className="flex gap-2 p-4 border-t bg-muted/30">
                <Button
                  onClick={exportAsImage}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  导出为图片
                </Button>
                <Button
                  onClick={generateMindMap}
                  disabled={isGenerating}
                  variant="default"
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      重新生成中...
                    </>
                  ) : (
                    "重新生成"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
