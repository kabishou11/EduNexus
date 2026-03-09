# 数据联动系统文档

## 概述

EduNexus 数据联动系统实现了知识宝库、知识星图、成长地图三大功能模块的数据自动同步和关联，提供统一的数据流转机制。

## 架构设计

### 核心组件

```
┌─────────────────────────────────────────────────────────────┐
│                     数据联动系统架构                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  知识宝库     │    │  知识星图     │    │  成长地图     │  │
│  │  (KB)        │    │  (Graph)     │    │  (Path)      │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│         │                   │                   │           │
│         └───────────────────┼───────────────────┘           │
│                             │                               │
│                    ┌────────▼────────┐                      │
│                    │  DataSyncManager │                      │
│                    │  数据同步管理器   │                      │
│                    └────────┬────────┘                      │
│                             │                               │
│         ┌───────────────────┼───────────────────┐           │
│         │                   │                   │           │
│  ┌──────▼───────┐  ┌────────▼────────┐  ┌──────▼───────┐  │
│  │ContentExtractor│ │  KGSyncService  │  │LearningTracker│ │
│  │  内容提取器    │  │ 知识图谱同步    │  │  学习追踪     │  │
│  └──────────────┘  └─────────────────┘  └──────────────┘  │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    IndexedDB                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │  │
│  │  │Documents │  │  Nodes   │  │  Learning Events │    │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 数据流程

```
用户操作 → 本地存储 → 数据同步管理器 → 并行同步
                                    ├─→ 知识图谱同步
                                    ├─→ 学习记录追踪
                                    └─→ 技能节点更新
```

## 核心模块

### 1. 内容提取器 (ContentExtractor)

**文件**: `apps/web/src/lib/kb/content-extractor.ts`

**功能**:
- 提取 Markdown 标签 (`#tag`)
- 提取双链引用 (`[[reference]]`)
- 提取关键词 (TF-IDF 算法)
- 提取代码块和数学公式
- 提取标题层级结构
- 计算内容相似度

**API**:

```typescript
// 提取标签
const tags = extractTags(content);
// 返回: ['javascript', 'react', 'hooks']

// 提取关键词
const keywords = extractKeywords(content, 10);
// 返回: ['react', 'component', 'state', ...]

// 提取双链
const wikiLinks = extractWikiLinks(content);
// 返回: ['React Hooks', 'State Management']

// 综合提取
const extracted = extractAll(content);
// 返回: { tags, keywords, wikiLinks, codeBlocks, ... }

// 计算相似度
const similarity = calculateSimilarity(content1, content2);
// 返回: 0.75 (0-1 之间)
```

### 2. 知识图谱同步服务 (KGSyncService)

**文件**: `apps/web/src/lib/graph/kg-sync-service.ts`

**功能**:
- 文档到知识图谱的同步
- 自动创建和更新图谱节点
- 基于标签、双链、关键词建立节点关联
- 管理节点和边的 CRUD 操作

**API**:

```typescript
import { getKGSyncService } from '@/lib/graph/kg-sync-service';

const kgSync = getKGSyncService();

// 同步文档到知识图谱
const nodeId = await kgSync.syncDocumentToGraph({
  documentId: 'doc_123',
  title: 'React Hooks 详解',
  content: '...',
  tags: ['react', 'hooks'],
  createNode: true,
  updateExisting: true,
});

// 获取节点
const node = await kgSync.getNode(nodeId);

// 查找相似节点
const similarNodes = await kgSync.findSimilarNodes(['react', 'hooks'], 5);

// 获取节点的关联文档
const documentIds = await kgSync.getNodeDocuments(nodeId);

// 删除文档关联
await kgSync.removeDocumentFromGraph('doc_123');
```

**数据结构**:

```typescript
interface GraphNode {
  id: string;
  name: string;
  type: 'concept' | 'topic' | 'resource' | 'skill';
  status: 'unlearned' | 'learning' | 'mastered' | 'review';
  importance: number;
  mastery: number;
  documentIds: string[];     // 关联的文档
  skillNodeId?: string;      // 关联的技能
  keywords?: string[];       // 关键词
  // ...
}
```

### 3. 学习追踪服务 (LearningTracker)

**文件**: `apps/web/src/lib/path/learning-tracker.ts`

**功能**:
- 记录学习事件（创建、编辑、查看、完成等）
- 管理学习会话（自动开始/结束）
- 计算专注度评分
- 生成学习统计和报告

**API**:

```typescript
import { getLearningTracker } from '@/lib/path/learning-tracker';

const tracker = getLearningTracker();

// 记录学习事件
await tracker.trackEvent({
  userId: 'user_123',
  documentId: 'doc_123',
  action: 'edit',
  duration: 300, // 秒
  metadata: { wordCount: 500 },
});

// 获取文档的学习记录
const records = await tracker.getDocumentLearningRecords('doc_123');

// 获取技能节点的学习记录
const skillRecords = await tracker.getSkillNodeLearningRecords('skill_123');

// 生成学习报告
const report = await tracker.generateLearningReport('user_123', 7);
// 返回: { totalTime, averageTime, documentsCreated, ... }

// 计算学习时长
const duration = await tracker.calculateLearningDuration(
  'user_123',
  '2026-03-01',
  '2026-03-09'
);
```

**学习事件类型**:

```typescript
interface LearningEvent {
  id: string;
  userId: string;
  documentId?: string;
  skillNodeId?: string;
  graphNodeId?: string;
  action: 'create' | 'edit' | 'view' | 'delete' | 'complete' | 'review' | 'practice';
  timestamp: Date;
  duration?: number;
  metadata?: Record<string, any>;
}
```

### 4. 数据同步管理器 (DataSyncManager)

**文件**: `apps/web/src/lib/client/data-sync-manager.ts`

**功能**:
- 统一管理所有数据同步任务
- 任务队列和批量处理
- 自动重试机制
- 离线任务持久化

**API**:

```typescript
import { getDataSyncManager } from '@/lib/client/data-sync-manager';

const syncManager = getDataSyncManager();

// 同步文档（异步）
const result = await syncManager.syncDocument(document, {
  immediate: false,
  retryOnError: true,
  maxRetries: 3,
});

// 同步文档（立即）
const result = await syncManager.syncDocument(document, {
  immediate: true,
});

// 同步技能节点
await syncManager.syncSkillNode(skillNode);

// 获取同步状态
const status = syncManager.getSyncStatus();
// 返回: { queueLength, isProcessing, pendingCount, failedCount, ... }

// 重试失败的任务
syncManager.retryFailedTasks();

// 清空队列
syncManager.clearQueue();
```

**同步流程**:

1. 创建同步任务并加入队列
2. 批量处理任务（默认每批 5 个）
3. 并行执行：
   - 同步到知识图谱
   - 记录学习事件
   - 更新关联数据
4. 失败自动重试（最多 3 次）
5. 持久化未完成任务

## React Hooks

### useDataSync

**文件**: `apps/web/src/lib/hooks/use-data-sync.ts`

**功能**: 简化数据同步的使用

```typescript
import { useDataSync } from '@/lib/hooks/use-data-sync';

function MyComponent() {
  const { syncState, syncDocument, syncSkillNode, retryFailed } = useDataSync();

  const handleSave = async () => {
    await syncDocument(document, { immediate: true });
  };

  return (
    <div>
      <p>队列: {syncState.queueLength}</p>
      <p>待处理: {syncState.pendingCount}</p>
      <p>失败: {syncState.failedCount}</p>
      {syncState.failedCount > 0 && (
        <button onClick={retryFailed}>重试</button>
      )}
    </div>
  );
}
```

### useAutoSyncDocument

**功能**: 自动同步文档

```typescript
import { useAutoSyncDocument } from '@/lib/hooks/use-data-sync';

function DocumentEditor({ document }) {
  // 文档更新时自动同步
  useAutoSyncDocument(document, true);

  return <div>...</div>;
}
```

### useAutoSyncSkillNode

**功能**: 自动同步技能节点

```typescript
import { useAutoSyncSkillNode } from '@/lib/hooks/use-data-sync';

function SkillNodeEditor({ skillNode }) {
  // 技能节点更新时自动同步
  useAutoSyncSkillNode(skillNode, true);

  return <div>...</div>;
}
```

## UI 组件

### SyncStatusIndicator

**文件**: `apps/web/src/components/sync-status-indicator.tsx`

**功能**: 显示同步状态

```typescript
import { SyncStatusIndicator } from '@/components/sync-status-indicator';

function Header() {
  return (
    <div className="flex items-center gap-4">
      <h1>知识宝库</h1>
      <SyncStatusIndicator showDetails />
    </div>
  );
}
```

**状态显示**:
- 离线: 灰色云图标
- 同步中: 蓝色旋转图标
- 已同步: 绿色对勾图标
- 同步失败: 红色警告图标

## 数据模型扩展

### KBDocument

```typescript
export type KBDocument = {
  // ... 原有字段
  graphNodeId?: string;      // 关联的知识星图节点
  skillNodeIds?: string[];   // 关联的技能节点
  relatedDocs?: string[];    // 相关文档
  extractedKeywords?: string[]; // 提取的关键词
  lastSyncedAt?: Date;       // 最后同步时间
  version?: number;          // 版本号（用于冲突检测）
};
```

### GraphNode

```typescript
export interface GraphNode {
  // ... 原有字段
  documentIds: string[];     // 关联的文档
  skillNodeId?: string;      // 关联的技能
  keywords?: string[];       // 关键词
}
```

### SkillNode

```typescript
export type SkillNode = {
  // ... 原有字段
  documentIds: string[];     // 学习资源（关联的文档）
  graphNodeId?: string;      // 关联的知识点
  learningRecords: LearningRecord[]; // 学习记录
};
```

## 使用场景

### 场景 1: 创建笔记时自动建立关联

```typescript
import { getKBStorage } from '@/lib/client/kb-storage';
import { getDataSyncManager } from '@/lib/client/data-sync-manager';

async function createNote(title: string, content: string) {
  const storage = getKBStorage();
  const syncManager = getDataSyncManager();

  // 1. 创建笔记
  const document = await storage.createDocument(
    vaultId,
    title,
    content,
    ['react', 'hooks']
  );

  // 2. 自动同步（异步，不阻塞）
  syncManager.syncDocument(document, { immediate: false });

  return document;
}
```

### 场景 2: 编辑笔记时更新关联

```typescript
import { useDataSync } from '@/lib/hooks/use-data-sync';

function DocumentEditor({ document }) {
  const { syncDocument } = useDataSync();
  const [content, setContent] = useState(document.content);

  // 防抖同步
  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedDoc = { ...document, content };
      syncDocument(updatedDoc, { immediate: false });
    }, 2000);

    return () => clearTimeout(timer);
  }, [content]);

  return (
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
  );
}
```

### 场景 3: 完成技能时更新学习记录

```typescript
import { getDataSyncManager } from '@/lib/client/data-sync-manager';

async function completeSkill(skillNode: SkillNode) {
  const syncManager = getDataSyncManager();

  // 更新技能状态
  skillNode.status = 'completed';
  skillNode.completedAt = new Date().toISOString();
  skillNode.progress = 100;

  // 立即同步
  await syncManager.syncSkillNode(skillNode, { immediate: true });

  // 这会自动：
  // 1. 更新知识图谱中的节点状态
  // 2. 记录学习完成事件
  // 3. 更新学习统计
}
```

### 场景 4: 查看文档的关联信息

```typescript
import { getKGSyncService } from '@/lib/graph/kg-sync-service';
import { getLearningTracker } from '@/lib/path/learning-tracker';

async function getDocumentRelations(documentId: string) {
  const kgSync = getKGSyncService();
  const tracker = getLearningTracker();

  // 获取知识图谱节点
  const nodeId = `kg_${documentId}`;
  const graphNode = await kgSync.getNode(nodeId);

  // 获取学习记录
  const learningRecords = await tracker.getDocumentLearningRecords(documentId);

  // 获取相似文档
  if (graphNode?.keywords) {
    const similarNodes = await kgSync.findSimilarNodes(graphNode.keywords, 5);
    const relatedDocs = similarNodes.flatMap(node => node.documentIds);
  }

  return {
    graphNode,
    learningRecords,
    relatedDocs,
  };
}
```

## 性能优化

### 1. 批量处理

同步管理器使用批量处理机制，每批处理 5 个任务，避免并发过多。

```typescript
private readonly BATCH_SIZE = 5;
```

### 2. 防抖同步

使用防抖避免频繁同步：

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    syncDocument(document);
  }, 2000); // 2秒防抖

  return () => clearTimeout(timer);
}, [document]);
```

### 3. 增量同步

只同步变更的数据：

```typescript
if (document.version !== lastSyncedVersion) {
  syncDocument(document);
  setLastSyncedVersion(document.version);
}
```

### 4. 离线持久化

未完成的任务会保存到 localStorage，页面刷新后自动恢复。

### 5. 索引优化

IndexedDB 使用多个索引加速查询：

```typescript
// 节点索引
nodeStore.createIndex('type', 'type', { unique: false });
nodeStore.createIndex('keywords', 'keywords', { multiEntry: true });

// 事件索引
eventStore.createIndex('documentId', 'documentId', { unique: false });
eventStore.createIndex('timestamp', 'timestamp', { unique: false });
```

## 错误处理

### 1. 自动重试

同步失败时自动重试，最多 3 次：

```typescript
if (task.retryCount < task.maxRetries) {
  task.status = 'pending';
  setTimeout(() => {
    this.scheduleProcessing();
  }, this.RETRY_DELAY * task.retryCount);
}
```

### 2. 错误日志

所有错误都会记录到控制台：

```typescript
console.error('[DataSyncManager] Task failed:', taskId, error);
```

### 3. 用户提示

失败任务会在 UI 中显示，用户可以手动重试：

```typescript
{syncState.failedCount > 0 && (
  <button onClick={retryFailed}>
    {syncState.failedCount} 个任务失败，点击重试
  </button>
)}
```

## 测试

### 单元测试

```typescript
// 测试内容提取
describe('ContentExtractor', () => {
  it('should extract tags', () => {
    const content = 'This is #react and #hooks';
    const tags = extractTags(content);
    expect(tags).toEqual(['react', 'hooks']);
  });

  it('should extract keywords', () => {
    const content = 'React is a JavaScript library for building user interfaces';
    const keywords = extractKeywords(content, 3);
    expect(keywords).toContain('react');
  });
});

// 测试同步服务
describe('KGSyncService', () => {
  it('should sync document to graph', async () => {
    const kgSync = getKGSyncService();
    const nodeId = await kgSync.syncDocumentToGraph({
      documentId: 'doc_test',
      title: 'Test',
      content: 'Test content #test',
      tags: ['test'],
    });
    expect(nodeId).toBe('kg_doc_test');
  });
});
```

### 集成测试

```typescript
describe('Data Integration', () => {
  it('should sync document and create learning record', async () => {
    const syncManager = getDataSyncManager();
    const tracker = getLearningTracker();

    // 同步文档
    await syncManager.syncDocument(document, { immediate: true });

    // 验证学习记录
    const records = await tracker.getDocumentLearningRecords(document.id);
    expect(records.length).toBeGreaterThan(0);
  });
});
```

## 调试

### 启用调试日志

所有模块都使用 `console.debug` 输出调试信息：

```typescript
console.debug('[KGSync] Syncing document:', documentId);
console.debug('[LearningTracker] Tracking event:', action);
console.debug('[DataSyncManager] Created task:', taskId);
```

在浏览器控制台中启用调试级别日志即可查看。

### 监控同步状态

使用 `SyncStatusIndicator` 组件实时监控：

```typescript
<SyncStatusIndicator showDetails />
```

或使用 Hook 获取详细状态：

```typescript
const { syncState } = useDataSync();
console.log('Queue:', syncState.queueLength);
console.log('Pending:', syncState.pendingCount);
console.log('Failed:', syncState.failedCount);
```

## 最佳实践

### 1. 使用防抖避免频繁同步

```typescript
const debouncedSync = useMemo(
  () => debounce((doc) => syncDocument(doc), 2000),
  [syncDocument]
);
```

### 2. 异步同步不阻塞 UI

```typescript
// 好的做法
syncDocument(document, { immediate: false });

// 避免阻塞
await syncDocument(document, { immediate: true }); // 仅在必要时使用
```

### 3. 处理同步错误

```typescript
try {
  await syncDocument(document, { immediate: true });
} catch (error) {
  toast.error('同步失败，请稍后重试');
  console.error(error);
}
```

### 4. 清理资源

```typescript
useEffect(() => {
  return () => {
    // 组件卸载时清理
    tracker.cleanup();
  };
}, []);
```

### 5. 监听在线状态

```typescript
useEffect(() => {
  const handleOnline = () => {
    syncManager.retryFailedTasks();
  };

  window.addEventListener('online', handleOnline);
  return () => window.removeEventListener('online', handleOnline);
}, []);
```

## 未来扩展

### 1. 服务端同步

当前实现基于本地 IndexedDB，未来可以扩展到服务端：

```typescript
// 添加服务端同步
async syncToServer(data: any): Promise<void> {
  await fetch('/api/sync', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

### 2. 冲突解决

实现更智能的冲突解决策略：

```typescript
// 三方合并
async resolveConflict(local, remote, base): Promise<any> {
  // 实现三方合并算法
}
```

### 3. 实时协作

使用 WebSocket 实现实时同步：

```typescript
// WebSocket 同步
const ws = new WebSocket('ws://localhost:3000/sync');
ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  applyUpdate(update);
};
```

### 4. AI 增强

使用 AI 提取更准确的关键词和关联：

```typescript
// AI 关键词提取
async extractKeywordsWithAI(content: string): Promise<string[]> {
  const response = await fetch('/api/ai/extract-keywords', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  return response.json();
}
```

## 常见问题

### Q: 同步失败怎么办？

A: 系统会自动重试 3 次。如果仍然失败，可以在 UI 中手动重试。

### Q: 如何查看同步状态？

A: 使用 `SyncStatusIndicator` 组件或 `useDataSync` Hook。

### Q: 同步会影响性能吗？

A: 不会。同步是异步的，使用批量处理和防抖机制，不会阻塞 UI。

### Q: 离线时能同步吗？

A: 离线时任务会保存到本地，恢复在线后自动同步。

### Q: 如何清空同步队列？

A: 调用 `syncManager.clearQueue()` 或使用 UI 中的清空按钮。

## 总结

EduNexus 数据联动系统提供了完整的数据同步解决方案，实现了知识宝库、知识星图、成长地图的无缝集成。系统具有以下特点：

- ✅ 自动化：无需手动操作，自动提取和同步
- ✅ 高性能：批量处理、防抖、增量同步
- ✅ 可靠性：自动重试、离线持久化、错误处理
- ✅ 易用性：简洁的 API、React Hooks、UI 组件
- ✅ 可扩展：模块化设计，易于扩展新功能

---

**文档版本**: v1.0
**最后更新**: 2026-03-09
**维护者**: EduNexus Team
