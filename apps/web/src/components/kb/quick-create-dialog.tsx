"use client";

import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  FileText,
  Sparkles,
  Tag,
  Plus,
  X,
  Loader2,
  Link2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 创建类型
 */
export type CreateType = 'blank' | 'template' | 'quick' | 'from-selection';

/**
 * 创建数据接口
 */
export interface QuickCreateData {
  title: string;
  content: string;
  tags: string[];
  template?: string;
  linkedNodeId?: string;
  linkedNodeLabel?: string;
}

/**
 * 快速创建对话框属性
 */
interface QuickCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: CreateType;
  initialData?: Partial<QuickCreateData>;
  onConfirm: (data: QuickCreateData) => void | Promise<void>;
  templates?: Array<{ id: string; name: string; description: string }>;
}

/**
 * 快速创建对话框组件
 *
 * 提供统一的快速创建笔记对话框，支持多种创建方式
 */
export const QuickCreateDialog = memo(function QuickCreateDialog({
  open,
  onOpenChange,
  type = 'blank',
  initialData,
  onConfirm,
  templates = [],
}: QuickCreateDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [linkedNodeId, setLinkedNodeId] = useState<string | undefined>();
  const [linkedNodeLabel, setLinkedNodeLabel] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 初始化数据
  useEffect(() => {
    if (open && initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setTags(initialData.tags || []);
      setSelectedTemplate(initialData.template || null);
      setLinkedNodeId(initialData.linkedNodeId);
      setLinkedNodeLabel(initialData.linkedNodeLabel);
    }
  }, [open, initialData]);

  // 重置表单
  const resetForm = useCallback(() => {
    setTitle('');
    setContent('');
    setTags([]);
    setTagInput('');
    setSelectedTemplate(null);
    setLinkedNodeId(undefined);
    setLinkedNodeLabel(undefined);
    setIsSubmitting(false);
  }, []);

  // 处理确认
  const handleConfirm = useCallback(async () => {
    if (!title.trim()) {
      alert('请输入标题');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm({
        title: title.trim(),
        content: content.trim(),
        tags,
        template: selectedTemplate || undefined,
        linkedNodeId,
        linkedNodeLabel,
      });
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create note:', error);
      alert('创建失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  }, [title, content, tags, selectedTemplate, linkedNodeId, linkedNodeLabel, onConfirm, resetForm, onOpenChange]);

  // 添加标签
  const handleAddTag = useCallback(() => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags(prev => [...prev, trimmedTag]);
      setTagInput('');
    }
  }, [tagInput, tags]);

  // 删除标签
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

  // 处理标签输入键盘事件
  const handleTagInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag]);

  // 处理对话框关闭
  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen && !isSubmitting) {
      resetForm();
    }
    onOpenChange(newOpen);
  }, [isSubmitting, resetForm, onOpenChange]);

  // 获取对话框标题
  const getDialogTitle = () => {
    switch (type) {
      case 'blank':
        return '创建空白笔记';
      case 'template':
        return '使用模板创建';
      case 'quick':
        return '快速记录';
      case 'from-selection':
        return '从选中内容创建';
      default:
        return '创建笔记';
    }
  };

  // 获取对话框描述
  const getDialogDescription = () => {
    switch (type) {
      case 'blank':
        return '创建一个全新的空白笔记';
      case 'template':
        return '选择模板快速开始';
      case 'quick':
        return '快速记录你的想法和灵感';
      case 'from-selection':
        return '基于选中的内容创建新笔记';
      default:
        return '填写笔记信息';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-950">
            <Sparkles className="w-5 h-5 text-amber-600" />
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 标题输入 */}
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入笔记标题..."
              className="border-amber-200 focus:border-amber-400"
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          {/* 内容输入 */}
          <div className="space-y-2">
            <Label htmlFor="content">内容</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入笔记内容..."
              className="min-h-[150px] border-amber-200 focus:border-amber-400"
              disabled={isSubmitting}
            />
          </div>

          {/* 模板选择 */}
          {type === 'template' && templates.length > 0 && (
            <div className="space-y-2">
              <Label>选择模板</Label>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    disabled={isSubmitting}
                    className={cn(
                      'p-3 rounded-lg border-2 text-left transition-all',
                      selectedTemplate === template.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-amber-200 hover:border-amber-300 hover:bg-amber-50'
                    )}
                  >
                    <div className="font-medium text-sm text-amber-950">
                      {template.name}
                    </div>
                    <div className="text-xs text-amber-600 mt-1">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 关联节点 */}
          {linkedNodeId && linkedNodeLabel && (
            <div className="space-y-2">
              <Label>关联到</Label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Link2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-900">{linkedNodeLabel}</span>
              </div>
            </div>
          )}

          {/* 标签输入 */}
          <div className="space-y-2">
            <Label htmlFor="tags">标签</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="添加标签..."
                className="flex-1 border-amber-200 focus:border-amber-400"
                disabled={isSubmitting}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddTag}
                disabled={isSubmitting || !tagInput.trim()}
                className="border-amber-300 hover:bg-amber-50"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 pr-1"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      disabled={isSubmitting}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-amber-200">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
            className="border-amber-300 hover:bg-amber-50"
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting || !title.trim()}
            className="bg-amber-500 hover:bg-amber-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                创建中...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-1" />
                创建
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
