# 防抖自动保存系统

知识宝库的防抖自动保存系统，确保用户编辑内容自动保存，支持离线保存和冲突检测。

## 功能特性

### 1. 防抖自动保存
- 停止输入 2-3 秒后自动保存
- 避免频繁保存造成性能问题
- 可自定义延迟时间

### 2. 保存状态指示器
- 实时显示保存状态（保存中/已保存/保存失败）
- 显示最后保存时间
- 错误信息提示

### 3. 离线保存支持
- 使用 IndexedDB 缓存未保存内容
- 网络恢复后自动同步
- 支持重试机制

### 4. 冲突检测和解决
- 检测多设备编辑冲突
- 提供多种解决策略
- 自动合并或手动处理

## 核心文件

### Hooks
- `apps/web/src/lib/hooks/use-debounce.ts` - 防抖 Hook
- `apps/web/src/lib/hooks/use-auto-save.ts` - 自动保存 Hook

### 组件
- `apps/web/src/components/kb/save-status-indicator.tsx` - 保存状态指示器

### 服务
- `apps/web/src/lib/client/offline-save-service.ts` - 离线保存服务
- `apps/web/src/lib/client/conflict-resolver.ts` - 冲突解决器

## 使用示例

### 基础用法

```typescript
import { useAutoSave } from '@/lib/hooks/use-auto-save';
import { SaveStatusIndicator } from '@/components/kb/save-status-indicator';

function MyEditor() {
  const [content, setContent] = useState('');

  const { status, lastSaved, error } = useAutoSave(content, {
    delay: 2000,
    onSave: async (data) => {
      await saveToServer(data);
    },
    onError: (err) => {
      console.error('Save failed:', err);
    },
  });

  return (
    <div>
      <SaveStatusIndicator
        status={status}
        lastSaved={lastSaved}
        error={error}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
}
```

### 离线保存

```typescript
import { offlineSaveService } from '@/lib/client/offline-save-service';

// 保存到离线缓存
await offlineSaveService.savePending(
  docId,
  'document',
  documentData,
  version
);

// 同步离线保存
const result = await offlineSaveService.syncPending(async (item) => {
  await saveToServer(item.data);
});

console.log(`成功同步 ${result.success} 个项目`);
```

### 冲突检测

```typescript
import { detectConflict, resolveConflict } from '@/lib/client/conflict-resolver';

// 检测冲突
const hasConflict = detectConflict(localVersion, remoteVersion);

if (hasConflict) {
  // 解决冲突
  const result = await resolveConflict(
    {
      local: { data: localData, version: localVersion, timestamp: localTime },
      remote: { data: remoteData, version: remoteVersion, timestamp: remoteTime },
    },
    'merge' // 或 'use-local', 'use-remote', 'manual'
  );

  console.log(result.message);
}
```

## API 文档

### useAutoSave

自动保存 Hook，提供防抖保存功能。

**参数：**
- `data: T` - 需要保存的数据
- `options: AutoSaveOptions<T>` - 配置选项
  - `delay?: number` - 防抖延迟（毫秒），默认 2000
  - `onSave: (data: T) => Promise<void>` - 保存函数
  - `onError?: (error: Error) => void` - 错误回调
  - `onSuccess?: () => void` - 成功回调
  - `enabled?: boolean` - 是否启用，默认 true

**返回值：**
- `status: SaveStatus` - 保存状态（idle/saving/saved/error）
- `lastSaved: Date | null` - 最后保存时间
- `error: Error | null` - 错误信息
- `triggerSave: () => Promise<void>` - 手动触发保存
- `reset: () => void` - 重置状态

### SaveStatusIndicator

保存状态指示器组件。

**Props：**
- `status: SaveStatus` - 保存状态
- `lastSaved: Date | null` - 最后保存时间
- `error?: Error | null` - 错误信息
- `className?: string` - 自定义类名
- `showDetails?: boolean` - 是否显示详细信息，默认 true

### OfflineSaveService

离线保存服务类。

**方法：**
- `init(): Promise<void>` - 初始化数据库
- `savePending(id, type, data, version): Promise<void>` - 保存待同步项
- `getPending(): Promise<PendingSaveItem[]>` - 获取所有待同步项
- `getPendingCount(): Promise<number>` - 获取待同步项数量
- `removePending(id): Promise<void>` - 删除待同步项
- `syncPending(syncFn): Promise<SyncResult>` - 同步所有待同步项
- `clearAll(): Promise<void>` - 清空所有待同步项

### ConflictResolver

冲突解决器。

**函数：**
- `detectConflict(localVersion, remoteVersion): boolean` - 检测冲突
- `resolveConflict(conflict, strategy): Promise<ConflictResolutionResult>` - 解决冲突
- `mergeDocumentContent(local, remote): string` - 合并文档内容
- `createConflictMarkers(local, remote): string` - 创建冲突标记

## 测试

运行测试：

```bash
cd apps/web
pnpm test:unit
```

测试文件位置：
- `apps/web/src/lib/hooks/__tests__/use-auto-save.test.ts`

## 设计要点

### 1. 防抖策略
- 使用 `useDebounce` Hook 实现防抖
- 默认延迟 2000ms，可自定义
- 避免频繁保存造成性能问题

### 2. 状态管理
- 使用 `useState` 管理保存状态
- 使用 `useRef` 避免闭包问题
- 清晰的状态转换：idle → saving → saved/error → idle

### 3. 错误处理
- 完整的 try-catch 包裹
- 错误信息传递给回调
- 支持重试机制

### 4. 离线支持
- 使用 IndexedDB 存储待同步数据
- 监听 online 事件自动同步
- 支持最大重试次数限制

### 5. 冲突解决
- 基于版本号检测冲突
- 提供多种解决策略
- 支持自动合并和手动处理

## 性能优化

1. **防抖优化**：避免频繁保存
2. **批量同步**：离线保存批量同步
3. **增量更新**：只更新变化的字段
4. **版本控制**：使用版本号减少冲突

## 注意事项

1. 确保在组件卸载时清理定时器
2. 离线保存有最大重试次数限制（默认 3 次）
3. 冲突解决策略需要根据实际场景选择
4. 保存状态指示器应放在显眼位置

## 未来改进

1. 支持更复杂的冲突合并算法（如 diff3）
2. 添加保存历史记录功能
3. 支持协同编辑
4. 优化大文档保存性能
5. 添加保存队列管理

## 相关文档

- [Phase 1 核心功能计划](../../../docs/plans/phase1-core-features.md)
- [知识宝库架构](../../../docs/architecture/knowledge-base.md)
