# 防抖自动保存系统 - 快速参考

## 🚀 快速开始

### 基础用法

```typescript
import { useAutoSave } from '@/lib/hooks/use-auto-save';
import { SaveStatusIndicator } from '@/components/kb/save-status-indicator';

const { status, lastSaved, error } = useAutoSave(data, {
  delay: 2000,
  onSave: async (data) => await saveToServer(data),
});

<SaveStatusIndicator status={status} lastSaved={lastSaved} error={error} />
```

## 📦 核心 API

### useAutoSave

```typescript
useAutoSave<T>(data: T, options: AutoSaveOptions<T>): AutoSaveReturn
```

**选项**:
- `delay?: number` - 延迟时间（默认 2000ms）
- `onSave: (data: T) => Promise<void>` - 保存函数
- `onError?: (error: Error) => void` - 错误回调
- `onSuccess?: () => void` - 成功回调
- `enabled?: boolean` - 是否启用（默认 true）

**返回值**:
- `status: SaveStatus` - 保存状态
- `lastSaved: Date | null` - 最后保存时间
- `error: Error | null` - 错误信息
- `triggerSave: () => Promise<void>` - 手动保存
- `reset: () => void` - 重置状态

### SaveStatusIndicator

```typescript
<SaveStatusIndicator
  status={status}
  lastSaved={lastSaved}
  error={error}
  showDetails={true}
/>
```

### OfflineSaveService

```typescript
import { offlineSaveService } from '@/lib/client/offline-save-service';

// 保存
await offlineSaveService.savePending(id, type, data, version);

// 同步
const result = await offlineSaveService.syncPending(syncFn);
```

### ConflictResolver

```typescript
import { detectConflict, resolveConflict } from '@/lib/client/conflict-resolver';

// 检测
const hasConflict = detectConflict(localVersion, remoteVersion);

// 解决
const result = await resolveConflict(conflict, 'merge');
```

## 🎨 状态说明

| 状态 | 图标 | 颜色 | 说明 |
|------|------|------|------|
| `idle` | 🕐 | 灰色 | 未保存 |
| `saving` | ⏳ | 琥珀色 | 保存中 |
| `saved` | ✅ | 绿色 | 已保存 |
| `error` | ⚠️ | 红色 | 保存失败 |

## 💡 常见场景

### 场景 1: 基础自动保存

```typescript
const { status } = useAutoSave(document, {
  onSave: async (doc) => {
    await storage.updateDocument(doc);
  },
});
```

### 场景 2: 离线保存

```typescript
const { status } = useAutoSave(document, {
  onSave: async (doc) => {
    if (navigator.onLine) {
      await storage.updateDocument(doc);
    } else {
      await offlineSaveService.savePending(doc.id, 'document', doc, doc.version);
    }
  },
});

// 监听在线事件
useEffect(() => {
  const handleOnline = async () => {
    await offlineSaveService.syncPending(async (item) => {
      await storage.updateDocument(item.data);
    });
  };
  window.addEventListener('online', handleOnline);
  return () => window.removeEventListener('online', handleOnline);
}, []);
```

### 场景 3: 冲突检测

```typescript
const { status } = useAutoSave(document, {
  onSave: async (doc) => {
    const remoteDoc = await fetchRemoteDoc(doc.id);

    if (detectConflict(doc.version, remoteDoc.version)) {
      const result = await resolveConflict(
        {
          local: { data: doc, version: doc.version, timestamp: Date.now() },
          remote: { data: remoteDoc, version: remoteDoc.version, timestamp: remoteDoc.updatedAt },
        },
        'merge'
      );
      await storage.updateDocument(result.data);
    } else {
      await storage.updateDocument(doc);
    }
  },
});
```

### 场景 4: 手动触发保存

```typescript
const { triggerSave } = useAutoSave(document, {
  onSave: async (doc) => await storage.updateDocument(doc),
});

// 手动保存
<Button onClick={triggerSave}>立即保存</Button>
```

## ⚙️ 配置建议

### 开发环境

```typescript
{
  delay: 1000,  // 更快的反馈
  enabled: true,
}
```

### 生产环境

```typescript
{
  delay: 2000,  // 平衡性能和体验
  enabled: true,
}
```

### 大文档

```typescript
{
  delay: 3000,  // 更长的延迟
  enabled: true,
}
```

## 🐛 故障排查

### 问题 1: 保存不触发

**原因**: `enabled` 为 false 或数据未变化

**解决**: 检查 `enabled` 选项和数据变化

### 问题 2: 频繁保存

**原因**: `delay` 设置过短

**解决**: 增加 `delay` 值（建议 2000ms+）

### 问题 3: 离线保存失败

**原因**: IndexedDB 不可用

**解决**: 检查浏览器支持和权限

### 问题 4: 冲突无法解决

**原因**: 版本号不一致

**解决**: 使用 `manual` 策略手动处理

## 📚 相关文档

- [完整文档](./apps/web/src/lib/hooks/AUTO_SAVE_README.md)
- [演示说明](./AUTO_SAVE_DEMO.md)
- [测试报告](./AUTO_SAVE_TEST_REPORT.md)

## 🔗 相关文件

```
apps/web/src/
├── lib/hooks/
│   ├── use-debounce.ts
│   └── use-auto-save.ts
├── lib/client/
│   ├── offline-save-service.ts
│   └── conflict-resolver.ts
└── components/kb/
    └── save-status-indicator.tsx
```

## 📞 支持

遇到问题？查看:
1. [使用文档](./apps/web/src/lib/hooks/AUTO_SAVE_README.md)
2. [测试报告](./AUTO_SAVE_TEST_REPORT.md)
3. [Phase 1 计划](./docs/plans/phase1-core-features.md)
