# 第一阶段详细计划：核心功能

**阶段**: Phase 1 - Core Features
**时间**: 2026-03-09 ~ 2026-03-23 (2周)
**目标**: 实现防抖自动保存、多入口创建、基础数据联动

---

## 📋 目录

1. [阶段概览](#阶段概览)
2. [功能 1：防抖自动保存系统](#功能-1防抖自动保存系统)
3. [功能 2：多入口快速创建系统](#功能-2多入口快速创建系统)
4. [功能 3：基础数据联动](#功能-3基础数据联动)
5. [测试计划](#测试计划)
6. [部署计划](#部署计划)

---

## 阶段概览

### 目标

- 提升用户创作效率
- 减少手动操作
- 打通基础数据流转

### 成功标准

- ✅ 自动保存成功率 >99%
- ✅ 笔记创建时间 <30秒
- ✅ 数据同步成功率 >95%
- ✅ 测试覆盖率 >80%
- ✅ 无阻塞性 Bug

### 技术栈

- React 18 + TypeScript
- Next.js 14
- IndexedDB (本地存储)
- Framer Motion (动画)
- Tailwind CSS (样式)

---

## 功能 1：防抖自动保存系统

### 功能描述

实现智能的自动保存机制，用户停止输入 2-3 秒后自动保存，支持离线保存和冲突检测。

### 技术设计

#### 1.1 核心 Hook：useAutoSave

**文件位置**: `apps/web/src/lib/hooks/use-auto-save.ts`

```typescript
import { useState, useEffect, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

export interface AutoSaveOptions<T> {
  delay?: number;
  onSave: (data: T) => Promise<void>;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
  enabled?: boolean;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface AutoSaveReturn<T> {
  save: (data: T) => void;
  status: SaveStatus;
  lastSaved: Date | null;
  error: Error | null;
  reset: () => void;
}

export function useAutoSave<T>(
  options: AutoSaveOptions<T>
): AutoSaveReturn<T> {
  const {
    delay = 2000,
    onSave,
    onError,
    onSuccess,
    enabled = true,
  } = options;

  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // 防抖保存函数
  const debouncedSave = useMemo(
    () =>
      debounce(async (data: T) => {
        if (!enabled) return;

        try {
          setStatus('saving');
          setError(null);
          await onSave(data);
          setStatus('saved');
          setLastSaved(new Date());
          onSuccess?.();

          // 2秒后重置为 idle
          setTimeout(() => {
            setStatus('idle');
          }, 2000);
        } catch (err) {
          const error = err as Error;
          setStatus('error');
          setError(error);
          onError?.(error);
        }
      }, delay),
    [delay, onSave, onError, onSuccess, enabled]
  );

  // 清理函数
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return {
    save: debouncedSave,
    status,
    lastSaved,
    error,
    reset,
  };
}
```

#### 1.2 保存状态指示器

**文件位置**: `apps/web/src/components/kb/save-status-indicator.tsx`

```typescript
'use client';

import { Clock, Loader2, Check, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { SaveStatus } from '@/lib/hooks/use-auto-save';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  lastSaved: Date | null;
  error?: Error | null;
  className?: string;
}

export function SaveStatusIndicator({
  status,
  lastSaved,
  error,
  className,
}: SaveStatusIndicatorProps) {
  const statusConfig = {
    idle: {
      icon: Clock,
      text: '未保存',
      color: 'text-gray-400',
      bgColor: 'bg-gray-50',
    },
    saving: {
      icon: Loader2,
      text: '保存中...',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      animate: true,
    },
    saved: {
      icon: Check,
      text: '已保存',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    error: {
      icon: AlertCircle,
      text: '保存失败',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors',
        config.bgColor,
        className
      )}
    >
      <Icon
        className={cn(
          'w-4 h-4',
          config.color,
          config.animate && 'animate-spin'
        )}
      />
      <div className="flex flex-col">
        <span className={cn('text-sm font-medium', config.color)}>
          {config.text}
        </span>
        {lastSaved && status === 'saved' && (
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(lastSaved, {
              addSuffix: true,
              locale: zhCN,
            })}
          </span>
        )}
        {error && status === 'error' && (
          <span className="text-xs text-red-600">{error.message}</span>
        )}
      </div>
    </div>
  );
}
```

#### 1.3 离线保存服务

**文件位置**: `apps/web/src/lib/client/offline-save.ts`

```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineSaveDB extends DBSchema {
  pendingSaves: {
    key: string;
    value: {
      id: string;
      type: 'document' | 'note';
      data: any;
      timestamp: number;
      version: number;
    };
  };
}

class OfflineSaveService {
  private db: IDBPDatabase<OfflineSaveDB> | null = null;

  async init() {
    if (this.db) return;

    this.db = await openDB<OfflineSaveDB>('offline-saves', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('pendingSaves')) {
          db.createObjectStore('pendingSaves', { keyPath: 'id' });
        }
      },
    });
  }

  async savePending(
    id: string,
    type: 'document' | 'note',
    data: any,
    version: number
  ) {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.put('pendingSaves', {
      id,
      type,
      data,
      timestamp: Date.now(),
      version,
    });
  }

  async getPending() {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.getAll('pendingSaves');
  }

  async removePending(id: string) {
    await this.init();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.delete('pendingSaves', id);
  }

  async syncPending(
    syncFn: (item: any) => Promise<void>
  ): Promise<{ success: number; failed: number }> {
    const pending = await this.getPending();
    let success = 0;
    let failed = 0;

    for (const item of pending) {
      try {
        await syncFn(item);
        await this.removePending(item.id);
        success++;
      } catch (error) {
        console.error(`Failed to sync ${item.id}:`, error);
        failed++;
      }
    }

    return { success, failed };
  }
}

export const offlineSaveService = new OfflineSaveService();
```

#### 1.4 冲突检测和解决

**文件位置**: `apps/web/src/lib/client/conflict-resolver.ts`

```typescript
export interface ConflictData<T> {
  local: {
    data: T;
    version: number;
    timestamp: number;
  };
  remote: {
    data: T;
    version: number;
    timestamp: number;
  };
}

export type ConflictResolution = 'use-local' | 'use-remote' | 'merge';

export async function detectConflict<T>(
  localData: T,
  localVersion: number,
  remoteVersion: number
): Promise<boolean> {
  return localVersion !== remoteVersion;
}

export async function resolveConflict<T>(
  conflict: ConflictData<T>,
  resolution: ConflictResolution
): Promise<T> {
  switch (resolution) {
    case 'use-local':
      return conflict.local.data;
    case 'use-remote':
      return conflict.remote.data;
    case 'merge':
      // 简单合并策略：使用时间戳较新的
      return conflict.local.timestamp > conflict.remote.timestamp
        ? conflict.local.data
        : conflict.remote.data;
    default:
      throw new Error(`Unknown resolution: ${resolution}`);
  }
}
```

#### 1.5 集成到知识库编辑器

**文件位置**: `apps/web/src/app/kb/page.tsx` (修改)

```typescript
// 在组件中使用
const { save, status, lastSaved, error } = useAutoSave<KBDocument>({
  delay: 2000,
  onSave: async (doc) => {
    // 检查是否在线
    if (navigator.onLine) {
      // 在线保存
      await storage.saveDocument(doc);
    } else {
      // 离线保存
      await offlineSaveService.savePending(
        doc.id,
        'document',
        doc,
        doc.version || 0
      );
    }
  },
  onError: (err) => {
    console.error('Auto-save failed:', err);
    toast.error('自动保存失败');
  },
  onSuccess: () => {
    console.log('Auto-saved successfully');
  },
});

// 监听内容变化
useEffect(() => {
  if (editContent || editTitle) {
    save({
      ...selectedDoc,
      title: editTitle,
      content: editContent,
      updatedAt: new Date(),
    });
  }
}, [editContent, editTitle]);

// 监听在线状态
useEffect(() => {
  const handleOnline = async () => {
    const result = await offlineSaveService.syncPending(async (item) => {
      await storage.saveDocument(item.data);
    });
    if (result.success > 0) {
      toast.success(`已同步 ${result.success} 个离线保存`);
    }
  };

  window.addEventListener('online', handleOnline);
  return () => window.removeEventListener('online', handleOnline);
}, []);
```

### 实施步骤

1. **Day 1-2**: 创建 useAutoSave Hook 和单元测试
2. **Day 3**: 实现保存状态指示器组件
3. **Day 4**: 实现离线保存服务
4. **Day 5**: 实现冲突检测和解决
5. **Day 6**: 集成到知识库编辑器
6. **Day 7**: 测试和修复 Bug

### 测试用例

```typescript
describe('useAutoSave', () => {
  it('should debounce save calls', async () => {
    const onSave = jest.fn();
    const { result } = renderHook(() =>
      useAutoSave({ onSave, delay: 1000 })
    );

    act(() => {
      result.current.save({ id: '1', content: 'test' });
      result.current.save({ id: '1', content: 'test2' });
      result.current.save({ id: '1', content: 'test3' });
    });

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave).toHaveBeenCalledWith({ id: '1', content: 'test3' });
    });
  });

  it('should handle save errors', async () => {
    const onError = jest.fn();
    const onSave = jest.fn().mockRejectedValue(new Error('Save failed'));
    const { result } = renderHook(() =>
      useAutoSave({ onSave, onError, delay: 100 })
    );

    act(() => {
      result.current.save({ id: '1', content: 'test' });
    });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
      expect(onError).toHaveBeenCalled();
    });
  });

  it('should save offline when offline', async () => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    const savePending = jest.spyOn(offlineSaveService, 'savePending');
    // ... test implementation
  });
});
```

---

## 功能 2：多入口快速创建系统

### 功能描述

提供多种方式快速创建笔记：全局快捷键、浮动按钮、智能创建。

### 技术设计

#### 2.1 全局快捷键系统

**文件位置**: `apps/web/src/lib/hooks/use-global-shortcuts.ts`

```typescript
import { useEffect, useCallback } from 'react';

export interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  description?: string;
}

export function useGlobalShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey : true;
        const metaMatch = shortcut.meta ? e.metaKey : true;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && metaMatch && shiftMatch && altMatch && keyMatch) {
          e.preventDefault();
          shortcut.handler();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
```

#### 2.2 浮动创建按钮

**文件位置**: `apps/web/src/components/kb/floating-create-button.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Plus, FileText, Sparkles, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CreateOption {
  icon: typeof FileText;
  label: string;
  onClick: () => void;
  color: string;
}

export function FloatingCreateButton() {
  const [isOpen, setIsOpen] = useState(false);

  const options: CreateOption[] = [
    {
      icon: FileText,
      label: '空白笔记',
      onClick: () => handleCreate('blank'),
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: Sparkles,
      label: 'AI 生成',
      onClick: () => handleCreate('ai'),
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      icon: FileCode,
      label: '使用模板',
      onClick: () => handleCreate('template'),
      color: 'bg-green-500 hover:bg-green-600',
    },
  ];

  const handleCreate = (type: string) => {
    setIsOpen(false);
    // 触发创建逻辑
    window.dispatchEvent(
      new CustomEvent('quick-create', { detail: { type } })
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-2 space-y-2"
          >
            {options.map((option, index) => (
              <motion.div
                key={option.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  onClick={option.onClick}
                  className={cn(
                    'w-full justify-start gap-2 text-white shadow-lg',
                    option.color
                  )}
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'rounded-full w-14 h-14 shadow-lg transition-transform',
          isOpen && 'rotate-45'
        )}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}
```

#### 2.3 快速创建对话框

**文件位置**: `apps/web/src/components/kb/quick-create-dialog.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TemplateSelector } from './template-selector';

interface QuickCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'blank' | 'ai' | 'template';
  onConfirm: (data: any) => void;
}

export function QuickCreateDialog({
  open,
  onOpenChange,
  type,
  onConfirm,
}: QuickCreateDialogProps) {
  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    null
  );

  const handleConfirm = () => {
    onConfirm({
      title,
      type,
      template: selectedTemplate,
    });
    onOpenChange(false);
    setTitle('');
    setSelectedTemplate(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'blank' && '创建空白笔记'}
            {type === 'ai' && 'AI 生成笔记'}
            {type === 'template' && '使用模板创建'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">标题</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入笔记标题..."
              autoFocus
            />
          </div>

          {type === 'template' && (
            <div>
              <label className="text-sm font-medium">选择模板</label>
              <TemplateSelector
                value={selectedTemplate}
                onChange={setSelectedTemplate}
              />
            </div>
          )}

          {type === 'ai' && (
            <div>
              <label className="text-sm font-medium">主题</label>
              <Input placeholder="输入要生成的主题..." />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={handleConfirm} disabled={!title}>
              创建
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 实施步骤

1. **Day 1**: 创建全局快捷键系统
2. **Day 2**: 实现浮动创建按钮
3. **Day 3**: 实现快速创建对话框
4. **Day 4**: 实现智能创建功能
5. **Day 5**: 集成到各个页面
6. **Day 6**: 测试和优化

---

## 功能 3：基础数据联动

### 功能描述

笔记保存时自动提取标签、关键词，同步到知识图谱，更新学习记录。

### 技术设计

#### 3.1 标签和关键词提取

**文件位置**: `apps/web/src/lib/kb/content-extractor.ts`

```typescript
// 提取 Markdown 标签
export function extractTags(content: string): string[] {
  const tagRegex = /#([^\s#]+)/g;
  const matches = content.matchAll(tagRegex);
  const tags = Array.from(matches, (m) => m[1]);
  return [...new Set(tags)];
}

// 提取关键词 (简单 TF-IDF)
export function extractKeywords(
  content: string,
  maxKeywords: number = 10
): string[] {
  // 分词
  const words = content
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 1);

  // 计算词频
  const freq = new Map<string, number>();
  words.forEach((word) => {
    freq.set(word, (freq.get(word) || 0) + 1);
  });

  // 排序并返回前 N 个
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}
```

#### 3.2 知识图谱同步服务

**文件位置**: `apps/web/src/lib/kb/kg-sync-service.ts`

```typescript
import { getKGStorage } from '@/lib/client/kg-storage';

export interface SyncToKGOptions {
  nodeId: string;
  label: string;
  tags: string[];
  keywords: string[];
  type: 'document' | 'concept' | 'skill';
}

export async function syncToKnowledgeGraph(
  options: SyncToKGOptions
): Promise<void> {
  const kgStorage = getKGStorage();

  // 创建或更新节点
  await kgStorage.upsertNode({
    id: options.nodeId,
    label: options.label,
    type: options.type,
    data: {
      tags: options.tags,
      keywords: options.keywords,
    },
  });

  // 基于标签创建关联
  for (const tag of options.tags) {
    const tagNodes = await kgStorage.findNodesByTag(tag);
    for (const tagNode of tagNodes) {
      if (tagNode.id !== options.nodeId) {
        await kgStorage.upsertEdge({
          source: options.nodeId,
          target: tagNode.id,
          type: 'related',
          weight: 0.5,
        });
      }
    }
  }
}
```

#### 3.3 学习记录服务

**文件位置**: `apps/web/src/lib/analytics/learning-tracker.ts`

```typescript
export interface LearningEvent {
  userId: string;
  documentId: string;
  action: 'create' | 'edit' | 'view' | 'delete';
  timestamp: Date;
  duration?: number;
  metadata?: Record<string, any>;
}

export async function trackLearningEvent(
  event: LearningEvent
): Promise<void> {
  // 保存到 IndexedDB
  const db = await openDB('learning-analytics', 1);
  await db.add('events', event);

  // 更新统计
  await updateLearningStats(event);
}

async function updateLearningStats(event: LearningEvent): Promise<void> {
  // 更新文档访问次数
  // 更新学习时长
  // 更新活跃度
  // ...
}
```

### 实施步骤

1. **Day 1**: 实现标签和关键词提取
2. **Day 2**: 实现知识图谱同步服务
3. **Day 3**: 实现学习记录服务
4. **Day 4**: 集成到保存流程
5. **Day 5**: 测试数据流转
6. **Day 6**: 优化和修复

---

## 测试计划

### 单元测试

- useAutoSave Hook
- 标签提取函数
- 关键词提取函数
- 冲突解决逻辑

### 集成测试

- 自动保存 → 离线保存 → 同步
- 快速创建 → 保存 → 数据联动
- 笔记编辑 → 自动保存 → 知识图谱同步

### E2E 测试

- 用户创建笔记完整流程
- 离线编辑和同步流程
- 冲突解决流程

### 性能测试

- 自动保存响应时间
- 大文档保存性能
- 知识图谱同步性能

---

## 部署计划

### 部署步骤

1. 代码审查和合并
2. 运行完整测试套件
3. 构建生产版本
4. 灰度发布（10% 用户）
5. 监控和收集反馈
6. 全量发布

### 回滚计划

- 保留上一版本
- 准备回滚脚本
- 监控关键指标
- 快速回滚机制

---

**文档版本**: v1.0
**最后更新**: 2026-03-09
