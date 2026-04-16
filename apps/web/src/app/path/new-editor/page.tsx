'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EnhancedPathEditor from '@/components/path/enhanced-path-editor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Node, Edge } from 'reactflow';
import { PathNodeData } from '@/lib/path/path-types';
import { pathStorage, type LearningPath, type TaskStatus } from '@/lib/client/path-storage';
import { toast } from 'sonner';

function parseEstimatedMinutes(value?: string) {
  const matched = value?.match(/\d+/);
  const minutes = matched ? Number(matched[0]) : 30;
  return Number.isFinite(minutes) && minutes > 0 ? minutes : 30;
}

function toEditorNodes(path: LearningPath): Node<PathNodeData>[] {
  return path.tasks.map((task, index) => ({
    id: task.id,
    type: 'default',
    position: { x: 240 + (index % 2) * 280, y: 120 + index * 140 },
    data: {
      label: task.title,
      description: task.description,
      type: (task.resources[0]?.type === 'video'
        ? 'video'
        : task.resources[0]?.type === 'document'
          ? 'document'
          : 'practice') as PathNodeData['type'],
      estimatedTime: parseEstimatedMinutes(task.estimatedTime),
      difficulty: task.resources.length > 0 ? 'intermediate' : 'beginner',
      status: task.status,
      resourceUrl: task.resources[0]?.url,
      resourceId: task.resources[0]?.id,
    },
  }));
}

function toEditorEdges(path: LearningPath): Edge[] {
  return path.tasks.flatMap((task) =>
    task.dependencies.map((dependencyId) => ({
      id: `edge_${dependencyId}_${task.id}`,
      source: dependencyId,
      target: task.id,
      type: 'smoothstep',
      animated: true,
    }))
  );
}

function NewPathEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathId = searchParams.get('id');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPath, setEditingPath] = useState<LearningPath | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPath = async () => {
      if (!pathId) {
        setEditingPath(null);
        return;
      }

      try {
        setIsLoading(true);
        const path = await pathStorage.getPath(pathId);
        if (!cancelled) {
          if (path) {
            setEditingPath(path);
          } else {
            toast.error('未找到要编辑的学习路径');
            router.replace('/path');
          }
        }
      } catch (error) {
        console.error('加载路径失败:', error);
        if (!cancelled) {
          toast.error('加载路径失败');
          router.replace('/path');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadPath();
    return () => {
      cancelled = true;
    };
  }, [pathId, router]);

  const initialNodes = useMemo(() => (editingPath ? toEditorNodes(editingPath) : []), [editingPath]);
  const initialEdges = useMemo(() => (editingPath ? toEditorEdges(editingPath) : []), [editingPath]);

  const handleSave = async (nodes: Node<PathNodeData>[], edges: Edge[]) => {
    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      const tagSet = new Set<string>();
      nodes.forEach((node) => {
        if (node.data.type) {
          tagSet.add(node.data.type);
        }
        if (node.data.difficulty) {
          tagSet.add(node.data.difficulty);
        }
      });

      const now = Date.now();
      const tasks = nodes.map((node, index) => {
        const rawMinutes = Number(node.data.estimatedTime ?? 30);
        const minutes = Number.isFinite(rawMinutes) && rawMinutes > 0 ? Math.round(rawMinutes) : 30;
        const prerequisiteIds = edges
          .filter((edge) => String(edge.target) === node.id)
          .map((edge) => String(edge.source));
        const taskStatus: TaskStatus =
          node.data.status === 'completed'
            ? 'completed'
            : node.data.status === 'in_progress'
              ? 'in_progress'
              : 'not_started';

        return {
          id: node.id,
          title: node.data.label?.trim() || `学习节点 ${index + 1}`,
          description: node.data.description?.trim() || '',
          estimatedTime: `${minutes}分钟`,
          progress: taskStatus === 'completed' ? 100 : taskStatus === 'in_progress' ? 50 : 0,
          status: taskStatus,
          dependencies: prerequisiteIds,
          resources: node.data.resourceUrl
            ? [
                {
                  id: node.data.resourceId || `res_${node.id}`,
                  title: `${node.data.label || '学习资源'} 资料`,
                  type: 'document' as const,
                  url: node.data.resourceUrl,
                },
              ]
            : [],
          notes: '',
          createdAt: editingPath?.tasks[index]?.createdAt || new Date(now + index),
          startedAt: node.data.status === 'in_progress' || node.data.status === 'completed' ? new Date() : undefined,
          completedAt: node.data.status === 'completed' ? new Date() : undefined,
        };
      });

      const completedCount = tasks.filter((task) => task.status === 'completed').length;
      const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

      if (editingPath) {
        const updatedPath = await pathStorage.updatePath(editingPath.id, {
          title: editingPath.title,
          description: editingPath.description,
          status: progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started',
          progress,
          tags: Array.from(tagSet),
          tasks,
          milestones: editingPath.milestones,
        });
        toast.success('路径已更新！');
        router.push(`/path?selected=${updatedPath.id}`);
        return;
      }

      const createdPath = await pathStorage.createPath({
        title: `学习路径 ${new Date().toLocaleDateString('zh-CN')}`,
        description: `由可视化编排编辑器生成，共 ${tasks.length} 个学习节点`,
        status: progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started',
        progress,
        tags: Array.from(tagSet),
        tasks,
        milestones: [],
      });

      toast.success('路径已保存！');
      router.push(`/path?selected=${createdPath.id}`);
    } catch (error) {
      console.error('保存路径失败:', error);
      toast.error('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">
          {editingPath ? `编辑学习路径：${editingPath.title}` : '学习路径编辑器'}
        </h1>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">正在加载路径...</div>
        ) : (
          <EnhancedPathEditor
            key={editingPath?.id || 'new'}
            initialNodes={initialNodes}
            initialEdges={initialEdges}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}

export default function NewPathEditorPage() {
  return (
    <Suspense>
      <NewPathEditorContent />
    </Suspense>
  );
}
