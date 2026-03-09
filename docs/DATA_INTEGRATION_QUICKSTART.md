# 数据联动系统快速开始指南

## 5 分钟快速上手

### 1. 基础使用

#### 在知识宝库中使用

```typescript
import { useDataSync } from '@/lib/hooks/use-data-sync';
import { getKBStorage } from '@/lib/client/kb-storage';

function KnowledgeBase() {
  const { syncDocument } = useDataSync();
  const storage = getKBStorage();

  const handleSave = async (document) => {
    // 1. 保存到本地
    await storage.updateDocument(document);

    // 2. 自动同步（异步，不阻塞）
    syncDocument(document);
  };

  return <div>...</div>;
}
```

#### 显示同步状态

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

### 2. 自动同步

使用 Hook 实现自动同步：

```typescript
import { useAutoSyncDocument } from '@/lib/hooks/use-data-sync';

function DocumentEditor({ document }) {
  // 文档更新时自动同步
  useAutoSyncDocument(document, true);

  return <div>...</div>;
}
```

### 3. 查看关联信息

```typescript
import { getKGSyncService } from '@/lib/graph/kg-sync-service';

async function showRelations(documentId) {
  const kgSync = getKGSyncService();

  // 获取知识图谱节点
  const nodeId = `kg_${documentId}`;
  const node = await kgSync.getNode(nodeId);

  console.log('关联节点:', node);
  console.log('关联文档:', node.documentIds);
}
```

## 常见场景

### 场景 1: 创建笔记

```typescript
async function createNote(title, content) {
  const storage = getKBStorage();
  const syncManager = getDataSyncManager();

  // 创建笔记
  const doc = await storage.createDocument(vaultId, title, content);

  // 自动同步
  syncManager.syncDocument(doc);

  return doc;
}
```

### 场景 2: 编辑笔记（防抖）

```typescript
function Editor({ document }) {
  const { syncDocument } = useDataSync();
  const [content, setContent] = useState(document.content);

  useEffect(() => {
    const timer = setTimeout(() => {
      syncDocument({ ...document, content }, { immediate: false });
    }, 2000);
    return () => clearTimeout(timer);
  }, [content]);

  return <textarea value={content} onChange={e => setContent(e.target.value)} />;
}
```

### 场景 3: 完成技能

```typescript
async function completeSkill(skillNode) {
  const syncManager = getDataSyncManager();

  skillNode.status = 'completed';
  skillNode.progress = 100;

  // 立即同步
  await syncManager.syncSkillNode(skillNode, { immediate: true });
}
```

### 场景 4: 查看学习统计

```typescript
import { getLearningTracker } from '@/lib/path/learning-tracker';

async function showStats() {
  const tracker = getLearningTracker();

  // 获取最近 7 天的学习报告
  const report = await tracker.generateLearningReport('user_123', 7);

  console.log('总学习时间:', report.totalTime, '秒');
  console.log('创建文档:', report.documentsCreated);
  console.log('完成技能:', report.skillsCompleted);
}
```

## API 速查

### 内容提取

```typescript
import { extractTags, extractKeywords, extractAll } from '@/lib/kb/content-extractor';

const tags = extractTags(content);
const keywords = extractKeywords(content, 10);
const all = extractAll(content);
```

### 知识图谱

```typescript
import { getKGSyncService } from '@/lib/graph/kg-sync-service';

const kgSync = getKGSyncService();

// 同步文档
await kgSync.syncDocumentToGraph({ documentId, title, content, tags });

// 获取节点
const node = await kgSync.getNode(nodeId);

// 查找相似节点
const similar = await kgSync.findSimilarNodes(keywords, 5);
```

### 学习追踪

```typescript
import { getLearningTracker } from '@/lib/path/learning-tracker';

const tracker = getLearningTracker();

// 记录事件
await tracker.trackEvent({ userId, documentId, action: 'edit' });

// 获取学习记录
const records = await tracker.getDocumentLearningRecords(documentId);

// 生成报告
const report = await tracker.generateLearningReport(userId, 7);
```

### 数据同步

```typescript
import { getDataSyncManager } from '@/lib/client/data-sync-manager';

const syncManager = getDataSyncManager();

// 同步文档
await syncManager.syncDocument(document, { immediate: false });

// 获取状态
const status = syncManager.getSyncStatus();

// 重试失败任务
syncManager.retryFailedTasks();
```

## 调试技巧

### 1. 查看同步状态

```typescript
const { syncState } = useDataSync();

console.log('队列长度:', syncState.queueLength);
console.log('待处理:', syncState.pendingCount);
console.log('失败:', syncState.failedCount);
```

### 2. 启用调试日志

打开浏览器控制台，所有模块都会输出调试信息：

```
[KGSync] Syncing document: doc_123
[LearningTracker] Tracking event: edit
[DataSyncManager] Created task: task_456
```

### 3. 检查 IndexedDB

在浏览器开发者工具中：
1. 打开 Application 标签
2. 选择 IndexedDB
3. 查看 EduNexusKB、EduNexusKG、EduNexusLearning 数据库

## 最佳实践

### ✅ 推荐做法

```typescript
// 1. 使用防抖避免频繁同步
const debouncedSync = useMemo(
  () => debounce((doc) => syncDocument(doc), 2000),
  []
);

// 2. 异步同步不阻塞 UI
syncDocument(document, { immediate: false });

// 3. 处理错误
try {
  await syncDocument(document, { immediate: true });
} catch (error) {
  toast.error('同步失败');
}

// 4. 监听在线状态
useEffect(() => {
  const handleOnline = () => syncManager.retryFailedTasks();
  window.addEventListener('online', handleOnline);
  return () => window.removeEventListener('online', handleOnline);
}, []);
```

### ❌ 避免做法

```typescript
// 1. 避免频繁同步
// 不好
onChange={() => syncDocument(document)}

// 好
onChange={() => debouncedSync(document)}

// 2. 避免阻塞 UI
// 不好
await syncDocument(document, { immediate: true });

// 好
syncDocument(document, { immediate: false });

// 3. 避免忽略错误
// 不好
syncDocument(document);

// 好
syncDocument(document).catch(error => console.error(error));
```

## 故障排查

### 问题 1: 同步失败

**症状**: 任务一直失败

**解决方案**:
1. 检查网络连接
2. 查看控制台错误日志
3. 手动重试: `syncManager.retryFailedTasks()`

### 问题 2: 同步缓慢

**症状**: 同步队列堆积

**解决方案**:
1. 检查是否有大量任务
2. 等待批量处理完成
3. 必要时清空队列: `syncManager.clearQueue()`

### 问题 3: 数据不一致

**症状**: 关联信息不正确

**解决方案**:
1. 检查文档版本号
2. 重新同步: `syncDocument(document, { immediate: true })`
3. 清除缓存并刷新

## 下一步

- 📖 阅读完整文档: [DATA_INTEGRATION.md](./DATA_INTEGRATION.md)
- 🔄 查看数据流程: [DATA_FLOW_DIAGRAM.md](./DATA_FLOW_DIAGRAM.md)
- 🧪 查看测试报告: [INTEGRATION_TEST_REPORT.md](./INTEGRATION_TEST_REPORT.md)
- 💡 查看集成示例: `apps/web/src/lib/kb/integration-examples.tsx`

## 获取帮助

遇到问题？
1. 查看文档
2. 检查控制台日志
3. 提交 Issue

---

**版本**: v1.0
**更新**: 2026-03-09
