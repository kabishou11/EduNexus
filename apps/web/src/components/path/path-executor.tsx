'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Panel,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Award, Download } from 'lucide-react';
import { nodeTypes } from './node-types';
import { LearningPath, PathProgress, PathNodeData } from '@/lib/path/path-types';
import { pathStorage, type LearningPath as ClientLearningPath, type TaskStatus } from '@/lib/client/path-storage';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathSync } from '@/lib/sync';

interface PathExecutorProps {
  path: LearningPath;
  onComplete?: () => void;
}

const SKIPPED_NODE_TYPES = new Set<PathNodeData['type']>(['start', 'end']);

function toClientPath(path: LearningPath): ClientLearningPath {
  const activeNodes = path.nodes.filter((node) => !SKIPPED_NODE_TYPES.has(node.data.type));
  const activeNodeIds = new Set(activeNodes.map((node) => node.id));
  const createdAt = new Date(path.createdAt);
  const updatedAt = new Date(path.updatedAt);

  const tasks = activeNodes.map((node, index) => {
    const taskStatus: TaskStatus =
      node.data.status === 'completed'
        ? 'completed'
        : node.data.status === 'in_progress'
          ? 'in_progress'
          : 'not_started';
    const estimatedMinutes = Number.isFinite(node.data.estimatedTime)
      ? Math.max(0, Math.round(node.data.estimatedTime || 0))
      : 0;

    return {
      id: node.id,
      title: node.data.label?.trim() || `学习节点 ${index + 1}`,
      description: node.data.description?.trim() || '',
      estimatedTime: `${estimatedMinutes || 30}分钟`,
      progress: taskStatus === 'completed' ? 100 : taskStatus === 'in_progress' ? 50 : 0,
      status: taskStatus,
      dependencies: path.edges
        .filter((edge) => edge.target === node.id && activeNodeIds.has(String(edge.source)))
        .map((edge) => String(edge.source)),
      resources: node.data.resourceUrl
        ? [
            {
              id: node.data.resourceId || `res_${node.id}`,
              title: `${node.data.label || '学习资源'} 资料`,
              type: node.data.type === 'video' ? ('video' as const) : ('document' as const),
              url: node.data.resourceUrl,
            },
          ]
        : [],
      notes: '',
      createdAt: new Date(createdAt.getTime() + index),
      startedAt: taskStatus === 'in_progress' || taskStatus === 'completed' ? updatedAt : undefined,
      completedAt: taskStatus === 'completed' ? new Date(node.data.completedAt || path.updatedAt) : undefined,
      actualTime: taskStatus === 'completed' ? estimatedMinutes || undefined : undefined,
    };
  });

  const completedCount = tasks.filter((task) => task.status === 'completed').length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return {
    id: path.id,
    title: path.title,
    description: path.description,
    status: progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started',
    progress,
    tags: Array.from(new Set([path.category, path.difficulty, ...path.tags].filter(Boolean))),
    createdAt,
    updatedAt,
    tasks,
    milestones: [],
  };
}

function buildLegacyProgress(path: ClientLearningPath): PathProgress {
  const completedNodes = path.tasks.filter((task) => task.status === 'completed').map((task) => task.id);
  const currentNode = path.tasks.find((task) => task.status === 'in_progress')?.id;
  const totalTasks = path.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedNodes.length / totalTasks) * 100) : 0;
  const startedAt =
    path.tasks
      .map((task) => task.startedAt?.toISOString())
      .find(Boolean) || path.createdAt.toISOString();
  const completedAt = progress === 100 ? path.updatedAt.toISOString() : undefined;

  return {
    pathId: path.id,
    userId: 'default-user',
    completedNodes,
    currentNode,
    startedAt,
    lastAccessedAt: path.updatedAt.toISOString(),
    completedAt,
    progress,
  };
}

function parseEstimatedMinutes(value?: string): number {
  const matched = value?.match(/\d+/);
  const minutes = matched ? Number(matched[0]) : 0;
  return Number.isFinite(minutes) && minutes > 0 ? minutes : 0;
}

function PathExecutorInner({ path, onComplete }: PathExecutorProps) {
  const [progress, setProgress] = useState<PathProgress | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<PathNodeData>(path.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(path.edges as Edge[]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const updateNodesStatus = useCallback((prog: PathProgress) => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: prog.completedNodes.includes(node.id)
            ? 'completed'
            : prog.currentNode === node.id
              ? 'in_progress'
              : 'not_started',
        },
      }))
    );
  }, [setNodes]);

  const loadProgress = useCallback(async () => {
    const existingPath = await pathStorage.getPath(path.id);
    if (!existingPath) {
      const seeded = await pathStorage.savePath(toClientPath(path));
      const seededProgress = buildLegacyProgress(seeded);
      setProgress(seededProgress);
      updateNodesStatus(seededProgress);
      return;
    }

    const nextProgress = buildLegacyProgress(existingPath);
    setProgress(nextProgress);
    updateNodesStatus(nextProgress);
  }, [path, updateNodesStatus]);

  // 监听路径变化，自动刷新进度
  usePathSync(() => {
    void loadProgress();
  });

  useEffect(() => {
    void loadProgress();
  }, [loadProgress]);

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: any) => {
      setSelectedNode(node.id);
    },
    []
  );

  const handleCompleteNode = async () => {
    if (!selectedNode || !progress) return;

    const existingPath = await pathStorage.getPath(path.id);
    const basePath = existingPath || toClientPath(path);
    const now = new Date();
    const updated = await pathStorage.savePath({
      ...basePath,
      tasks: basePath.tasks.map((task) => {
        if (task.id !== selectedNode) {
          return task;
        }

        return {
          ...task,
          status: 'completed',
          progress: 100,
          startedAt: task.startedAt || now,
          completedAt: now,
          actualTime: task.actualTime || parseEstimatedMinutes(task.estimatedTime) || undefined,
        };
      }),
      updatedAt: now,
    });

    const updatedProgress = buildLegacyProgress(updated);
    setProgress(updatedProgress);
    updateNodesStatus(updatedProgress);

    if (updatedProgress.progress === 100) {
      setShowCertificate(true);
      onComplete?.();
    }
  };

  const handleDownloadCertificate = () => {
    // 简单的证书生成（实际应该使用 PDF 库）
    const certificate = `
学习路径完成证书

路径名称: ${path.title}
完成时间: ${new Date().toLocaleDateString('zh-CN')}
总时长: ${Math.round(totalEstimatedMinutes / 60)} 小时

恭喜你完成了这个学习路径！
    `.trim();

    const blob = new Blob([certificate], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${path.title}-证书.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const learningNodes = nodes.filter((n) => !SKIPPED_NODE_TYPES.has(n.data.type));
  const totalEstimatedMinutes = learningNodes.reduce(
    (sum, node) => sum + (node.data.estimatedTime || 0),
    0
  );
  const selectedNodeData = nodes.find((n) => n.id === selectedNode);
  const isNodeCompleted = progress?.completedNodes.includes(selectedNode || '');

  return (
    <div className="w-full h-full flex">
      {/* 左侧：路径可视化 */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background />
          <Controls showInteractive={false} />
          <MiniMap />

          <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="font-bold text-lg mb-2">{path.title}</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>总时长: {Math.round(totalEstimatedMinutes / 60)} 小时</span>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>完成进度</span>
                  <span>{progress?.progress || 0}%</span>
                </div>
                <Progress value={progress?.progress || 0} />
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* 右侧：节点详情 */}
      <div className="w-96 border-l bg-gray-50 p-6 overflow-y-auto">
        {selectedNodeData ? (
          <Card>
            <CardHeader>
              <CardTitle>{selectedNodeData.data.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedNodeData.data.description && (
                <p className="text-sm text-gray-600">
                  {selectedNodeData.data.description}
                </p>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">类型:</span>
                  <span className="font-medium">
                    {selectedNodeData.data.type === 'document' && '文档'}
                    {selectedNodeData.data.type === 'video' && '视频'}
                    {selectedNodeData.data.type === 'practice' && '练习'}
                    {selectedNodeData.data.type === 'quiz' && '测验'}
                  </span>
                </div>
                {selectedNodeData.data.estimatedTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">预计时长:</span>
                    <span className="font-medium">
                      {selectedNodeData.data.estimatedTime} 分钟
                    </span>
                  </div>
                )}
                {selectedNodeData.data.difficulty && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">难度:</span>
                    <span className="font-medium">
                      {selectedNodeData.data.difficulty === 'beginner' && '初级'}
                      {selectedNodeData.data.difficulty === 'intermediate' && '中级'}
                      {selectedNodeData.data.difficulty === 'advanced' && '高级'}
                    </span>
                  </div>
                )}
              </div>

              {isNodeCompleted ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">已完成</span>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleCompleteNode}
                  disabled={selectedNodeData.data.type === 'start' || selectedNodeData.data.type === 'end'}
                >
                  标记为完成
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            <p>点击节点查看详情</p>
          </div>
        )}

        {/* 学习统计 */}
        {progress && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">学习统计</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">已完成节点:</span>
                <span className="font-medium">
                  {progress.completedNodes.length} /{' '}
                  {nodes.filter((n) => n.data.type !== 'start' && n.data.type !== 'end').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">开始时间:</span>
                <span className="font-medium">
                  {new Date(progress.startedAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
              {progress.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">完成时间:</span>
                  <span className="font-medium">
                    {new Date(progress.completedAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* 完成证书弹窗 */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCertificate(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-8 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <Award className="w-20 h-20 text-yellow-500 mx-auto" />
                </motion.div>
                <h2 className="text-2xl font-bold">恭喜完成！</h2>
                <p className="text-gray-600">
                  你已经完成了「{path.title}」学习路径
                </p>
                <div className="space-y-2">
                  <Button className="w-full" onClick={handleDownloadCertificate}>
                    <Download className="w-4 h-4 mr-2" />
                    下载证书
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowCertificate(false)}
                  >
                    关闭
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PathExecutor(props: PathExecutorProps) {
  return (
    <ReactFlowProvider>
      <PathExecutorInner {...props} />
    </ReactFlowProvider>
  );
}