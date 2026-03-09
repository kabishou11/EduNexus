/**
 * 技能树组件 - 使用 React Flow 展示技能树
 */

'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import SkillNodeComponent from './skill-node';
import type { SkillTree, SkillNode as SkillNodeType } from '@/lib/path/skill-tree-types';
import { SkillTreeEngine } from '@/lib/path/skill-tree-engine';

type SkillTreeProps = {
  tree: SkillTree;
  progress: any;
  onNodeClick?: (nodeId: string) => void;
  onNodeComplete?: (nodeId: string) => void;
};

const nodeTypes = {
  skillNode: SkillNodeComponent,
};

export default function SkillTreeView({
  tree,
  progress,
  onNodeClick,
  onNodeComplete,
}: SkillTreeProps) {
  const engine = useMemo(
    () => new SkillTreeEngine(tree, progress),
    [tree, progress]
  );

  // 转换技能节点为 React Flow 节点
  const initialNodes: Node[] = useMemo(
    () =>
      tree.nodes.map((node) => ({
        id: node.id,
        type: 'skillNode',
        position: node.position,
        data: {
          ...node,
          status: engine.getNodeStatus(node.id),
          onNodeClick,
        },
        draggable: false,
      })),
    [tree.nodes, engine, onNodeClick]
  );

  // 转换边
  const initialEdges: Edge[] = useMemo(
    () =>
      tree.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type === 'optional' ? 'step' : 'smoothstep',
        animated: edge.animated || edge.type === 'recommended',
        style: {
          stroke:
            edge.type === 'optional'
              ? '#94a3b8'
              : edge.type === 'recommended'
              ? '#3b82f6'
              : '#f59e0b',
          strokeWidth: edge.type === 'dependency' ? 3 : 2,
          strokeDasharray: edge.type === 'optional' ? '5,5' : undefined,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color:
            edge.type === 'optional'
              ? '#94a3b8'
              : edge.type === 'recommended'
              ? '#3b82f6'
              : '#f59e0b',
        },
      })),
    [tree.edges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 更新节点状态
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: engine.getNodeStatus(node.id),
        },
      }))
    );
  }, [progress, engine, setNodes]);

  // 节点颜色映射（用于小地图）
  const nodeColor = useCallback((node: Node) => {
    const status = node.data.status;
    switch (status) {
      case 'completed':
        return '#22c55e';
      case 'in_progress':
        return '#3b82f6';
      case 'available':
        return '#f59e0b';
      case 'locked':
      default:
        return '#9ca3af';
    }
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Strict}
        fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.5,
          maxZoom: 1.5,
        }}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background
          gap={20}
          size={2}
          color="#e2e8f0"
        />
        <Controls
          className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg"
          showInteractive={false}
        />
        <MiniMap
          nodeColor={nodeColor}
          className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}