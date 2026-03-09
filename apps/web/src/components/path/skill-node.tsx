/**
 * 技能节点组件 - 技能树中的单个节点
 */

'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import {
  Circle,
  Hexagon,
  Star,
  Diamond,
  Lock,
  CheckCircle2,
  PlayCircle,
  Clock,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SkillNode, SkillNodeStatus } from '@/lib/path/skill-tree-types';

type SkillNodeData = SkillNode & {
  onNodeClick?: (nodeId: string) => void;
};

const SkillNodeComponent = memo(({ data }: NodeProps<SkillNodeData>) => {
  const { id, title, type, status, progress, exp, estimatedHours } = data;

  // 节点形状和颜色配置
  const nodeConfig = {
    basic: {
      Icon: Circle,
      bgColor: 'from-green-400 to-emerald-500',
      borderColor: 'border-green-500',
      shadowColor: 'shadow-green-500/50',
      size: 'w-24 h-24',
    },
    advanced: {
      Icon: Hexagon,
      bgColor: 'from-blue-400 to-cyan-500',
      borderColor: 'border-blue-500',
      shadowColor: 'shadow-blue-500/50',
      size: 'w-28 h-28',
    },
    expert: {
      Icon: Star,
      bgColor: 'from-purple-400 to-pink-500',
      borderColor: 'border-purple-500',
      shadowColor: 'shadow-purple-500/50',
      size: 'w-32 h-32',
    },
    milestone: {
      Icon: Diamond,
      bgColor: 'from-amber-400 to-orange-500',
      borderColor: 'border-amber-500',
      shadowColor: 'shadow-amber-500/50',
      size: 'w-36 h-36',
    },
  };

  const config = nodeConfig[type];
  const NodeShapeIcon = config.Icon;

  // 状态图标
  const StatusIcon = {
    locked: Lock,
    available: Zap,
    in_progress: PlayCircle,
    completed: CheckCircle2,
  }[status];

  // 状态样式
  const statusStyles = {
    locked: 'opacity-40 grayscale cursor-not-allowed',
    available: 'opacity-100 hover:scale-110 cursor-pointer animate-pulse',
    in_progress: 'opacity-100 hover:scale-110 cursor-pointer ring-4 ring-blue-400',
    completed: 'opacity-90 cursor-pointer',
  };

  const handleClick = () => {
    if (status !== 'locked' && data.onNodeClick) {
      data.onNodeClick(id);
    }
  };

  return (
    <div
      className={cn(
        'relative transition-all duration-300',
        config.size,
        statusStyles[status]
      )}
      onClick={handleClick}
    >
      {/* 连接点 */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-gray-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-gray-400 border-2 border-white"
      />

      {/* 节点主体 */}
      <div
        className={cn(
          'relative w-full h-full rounded-full',
          'bg-gradient-to-br',
          config.bgColor,
          'border-4',
          config.borderColor,
          'shadow-2xl',
          config.shadowColor,
          'flex flex-col items-center justify-center',
          'backdrop-blur-sm'
        )}
      >
        {/* 进度环 */}
        {status === 'in_progress' && progress > 0 && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeDasharray={`${progress * 3.01} 301`}
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* 完成标记 */}
        {status === 'completed' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
        )}

        {/* 节点图标 */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <StatusIcon className="w-8 h-8 text-white drop-shadow-lg" />
          <div className="text-center px-2">
            <p className="text-xs font-bold text-white drop-shadow-md line-clamp-2">
              {title}
            </p>
          </div>
        </div>

        {/* 经验值标签 */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-full px-2 py-0.5 shadow-lg border-2 border-gray-200">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="text-xs font-bold text-gray-700">{exp}</span>
          </div>
        </div>

        {/* 时间标签 */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white rounded-full px-2 py-0.5 shadow-lg border-2 border-gray-200">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-500" />
            <span className="text-xs font-bold text-gray-700">{estimatedHours}h</span>
          </div>
        </div>

        {/* 锁定遮罩 */}
        {status === 'locked' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
            <Lock className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
        )}
      </div>

      {/* 光效 */}
      {status === 'available' && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent animate-pulse" />
      )}
    </div>
  );
});

SkillNodeComponent.displayName = 'SkillNode';

export default SkillNodeComponent;