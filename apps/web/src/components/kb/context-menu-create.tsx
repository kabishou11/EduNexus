"use client";

import React, { useCallback, memo } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '@/components/ui/context-menu';
import { Save, FileText, Link2, Tag } from 'lucide-react';

/**
 * 右键菜单创建属性
 */
interface ContextMenuCreateProps {
  children: React.ReactNode;
  onSaveToKB?: (selectedText: string) => void;
  onCreateLink?: (selectedText: string) => void;
  onExtractTags?: (selectedText: string) => void;
  disabled?: boolean;
}

/**
 * 右键菜单创建组件
 *
 * 提供选中文字后右键保存到知识宝库的功能
 */
export const ContextMenuCreate = memo(function ContextMenuCreate({
  children,
  onSaveToKB,
  onCreateLink,
  onExtractTags,
  disabled = false,
}: ContextMenuCreateProps) {
  // 获取选中的文本
  const getSelectedText = useCallback(() => {
    const selection = window.getSelection();
    return selection?.toString().trim() || '';
  }, []);

  // 保存到知识宝库
  const handleSaveToKB = useCallback(() => {
    const selectedText = getSelectedText();
    if (selectedText && onSaveToKB) {
      onSaveToKB(selectedText);
    }
  }, [getSelectedText, onSaveToKB]);

  // 创建链接
  const handleCreateLink = useCallback(() => {
    const selectedText = getSelectedText();
    if (selectedText && onCreateLink) {
      onCreateLink(selectedText);
    }
  }, [getSelectedText, onCreateLink]);

  // 提取标签
  const handleExtractTags = useCallback(() => {
    const selectedText = getSelectedText();
    if (selectedText && onExtractTags) {
      onExtractTags(selectedText);
    }
  }, [getSelectedText, onExtractTags]);

  // 检查是否有选中文本
  const hasSelection = useCallback(() => {
    return getSelectedText().length > 0;
  }, [getSelectedText]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {onSaveToKB && (
          <>
            <ContextMenuItem
              onClick={handleSaveToKB}
              disabled={disabled || !hasSelection()}
              className="cursor-pointer"
            >
              <Save className="w-4 h-4 mr-2" />
              保存到知识宝库
              <ContextMenuShortcut>⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}

        {onCreateLink && (
          <ContextMenuItem
            onClick={handleCreateLink}
            disabled={disabled || !hasSelection()}
            className="cursor-pointer"
          >
            <Link2 className="w-4 h-4 mr-2" />
            创建双向链接
          </ContextMenuItem>
        )}

        {onExtractTags && (
          <ContextMenuItem
            onClick={handleExtractTags}
            disabled={disabled || !hasSelection()}
            className="cursor-pointer"
          >
            <Tag className="w-4 h-4 mr-2" />
            提取标签
          </ContextMenuItem>
        )}

        <ContextMenuItem
          onClick={() => {
            const text = getSelectedText();
            if (text) {
              navigator.clipboard.writeText(text);
            }
          }}
          disabled={!hasSelection()}
          className="cursor-pointer"
        >
          <FileText className="w-4 h-4 mr-2" />
          复制文本
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
});

/**
 * 使用右键菜单创建的 Hook
 *
 * @example
 * ```tsx
 * const { handleSaveSelection } = useContextMenuCreate({
 *   onSave: async (text) => {
 *     await createNote({ content: text });
 *   }
 * });
 * ```
 */
export function useContextMenuCreate(options: {
  onSave?: (text: string) => void | Promise<void>;
  onCreateLink?: (text: string) => void | Promise<void>;
  onExtractTags?: (text: string) => void | Promise<void>;
}) {
  const { onSave, onCreateLink, onExtractTags } = options;

  const handleSaveSelection = useCallback(async (selectedText: string) => {
    if (onSave) {
      await onSave(selectedText);
    }
  }, [onSave]);

  const handleCreateLink = useCallback(async (selectedText: string) => {
    if (onCreateLink) {
      await onCreateLink(selectedText);
    }
  }, [onCreateLink]);

  const handleExtractTags = useCallback(async (selectedText: string) => {
    if (onExtractTags) {
      await onExtractTags(selectedText);
    }
  }, [onExtractTags]);

  return {
    handleSaveSelection,
    handleCreateLink,
    handleExtractTags,
  };
}
