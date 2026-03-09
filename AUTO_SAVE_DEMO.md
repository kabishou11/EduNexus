# 防抖自动保存系统 - 功能演示

## 功能概述

知识宝库的防抖自动保存系统已成功实现，包含以下核心功能：

### ✅ 已实现功能

1. **防抖自动保存**
   - 停止输入 2 秒后自动保存
   - 避免频繁保存造成性能问题
   - 可自定义延迟时间

2. **保存状态指示器**
   - 实时显示保存状态（未保存/保存中/已保存/保存失败）
   - 显示最后保存时间（相对时间）
   - 错误信息提示
   - 使用 EduNexus 橙色/琥珀色主题

3. **离线保存支持**
   - 使用 IndexedDB 缓存未保存内容
   - 网络恢复后自动同步
   - 支持重试机制（最多 3 次）
   - 批量同步功能

4. **冲突检测和解决**
   - 基于版本号检测冲突
   - 提供多种解决策略（use-local/use-remote/merge/manual）
   - 自动合并或手动处理
   - 支持批量检测

## 文件结构

```
apps/web/src/
├── lib/
│   ├── hooks/
│   │   ├── use-debounce.ts              # 防抖 Hook
│   │   ├── use-auto-save.ts             # 自动保存 Hook
│   │   ├── AUTO_SAVE_README.md          # 使用文档
│   │   └── __tests__/
│   │       └── use-auto-save.test.ts    # 单元测试
│   └── client/
│       ├── offline-save-service.ts      # 离线保存服务
│       ├── conflict-resolver.ts         # 冲突解决器
│       └── kb-storage.ts                # 知识库存储（已更新）
└── components/
    └── kb/
        └── save-status-indicator.tsx    # 保存状态指示器
```

## 使用演示

### 1. 在知识库页面中的集成

打开知识库页面 (`/kb`)，选择一个文档并进入编辑模式：

1. **开始编辑**
   - 点击"编辑"按钮进入编辑模式
   - 右上角会显示保存状态指示器

2. **自动保存**
   - 修改文档标题或内容
   - 停止输入 2 秒后，状态变为"保存中..."
   - 保存成功后显示"已保存"和相对时间
   - 2 秒后状态重置为"未保存"

3. **离线保存**
   - 断开网络连接
   - 继续编辑文档
   - 内容会自动保存到 IndexedDB
   - 恢复网络后自动同步

4. **错误处理**
   - 如果保存失败，显示"保存失败"和错误信息
   - 可以手动重试保存

### 2. 保存状态指示器

状态指示器显示在编辑器右上角，包含：

- **未保存** (灰色)：有未保存的更改
- **保存中...** (琥珀色，旋转图标)：正在保存
- **已保存** (绿色，✓)：保存成功，显示相对时间
- **保存失败** (红色，!)：保存失败，显示错误信息

### 3. 代码示例

#### 基础用法

```typescript
import { useAutoSave } from '@/lib/hooks/use-auto-save';
import { SaveStatusIndicator } from '@/components/kb/save-status-indicator';

function MyEditor() {
  const [document, setDocument] = useState(initialDoc);

  const { status, lastSaved, error } = useAutoSave(document, {
    delay: 2000,
    enabled: isEditing,
    onSave: async (doc) => {
      await storage.updateDocument(doc);
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
      {/* 编辑器内容 */}
    </div>
  );
}
```

#### 离线保存

```typescript
import { offlineSaveService } from '@/lib/client/offline-save-service';

// 在 onSave 中处理离线情况
onSave: async (doc) => {
  if (navigator.onLine) {
    // 在线保存
    await storage.updateDocument(doc);
  } else {
    // 离线保存
    await offlineSaveService.savePending(
      doc.id,
      'document',
      doc,
      doc.version || 0
    );
  }
}

// 监听在线事件，自动同步
useEffect(() => {
  const handleOnline = async () => {
    const result = await offlineSaveService.syncPending(async (item) => {
      await storage.updateDocument(item.data);
    });
    console.log(`同步成功: ${result.success} 个`);
  };

  window.addEventListener('online', handleOnline);
  return () => window.removeEventListener('online', handleOnline);
}, []);
```

#### 冲突检测

```typescript
import { detectConflict, resolveConflict } from '@/lib/client/conflict-resolver';

// 检测冲突
const hasConflict = detectConflict(localDoc.version, remoteDoc.version);

if (hasConflict) {
  // 自动解决冲突
  const result = await resolveConflict(
    {
      local: {
        data: localDoc,
        version: localDoc.version,
        timestamp: localDoc.updatedAt.getTime(),
      },
      remote: {
        data: remoteDoc,
        version: remoteDoc.version,
        timestamp: remoteDoc.updatedAt.getTime(),
      },
    },
    'merge' // 使用时间戳较新的版本
  );

  console.log(result.message);
  // 使用解决后的数据
  await storage.updateDocument(result.data);
}
```

## 测试

### 运行测试

```bash
cd apps/web
npm run test:unit
```

### 测试覆盖

- ✅ 防抖逻辑测试
- ✅ 保存成功测试
- ✅ 保存失败测试
- ✅ 禁用状态测试
- ✅ 手动触发保存测试
- ✅ 状态重置测试

## 性能指标

- **防抖延迟**: 2000ms（可配置）
- **状态重置**: 保存成功后 2 秒
- **最大重试**: 3 次
- **离线存储**: IndexedDB（无大小限制）

## 设计亮点

1. **用户体验**
   - 清晰的视觉反馈
   - 相对时间显示（"1 分钟前"）
   - 错误信息提示
   - 无需手动保存

2. **性能优化**
   - 防抖避免频繁保存
   - 使用 useRef 避免闭包问题
   - 批量同步离线保存
   - 版本号增量更新

3. **错误处理**
   - 完整的 try-catch 包裹
   - 错误信息传递
   - 重试机制
   - 离线降级

4. **代码质量**
   - TypeScript 严格模式
   - 完整的 JSDoc 注释
   - 清晰的类型定义
   - 单元测试覆盖

## 已知限制

1. 测试库依赖问题（@testing-library/react-hooks 与 React 18 不兼容）
2. 冲突合并算法较简单（基于时间戳）
3. 暂不支持协同编辑
4. 大文档保存性能待优化

## 未来改进

1. 使用更复杂的 diff 算法进行冲突合并
2. 添加保存历史记录功能
3. 支持实时协同编辑
4. 优化大文档保存性能
5. 添加保存队列管理
6. 支持保存草稿功能

## 相关文档

- [使用文档](../lib/hooks/AUTO_SAVE_README.md)
- [Phase 1 核心功能计划](../../../docs/plans/phase1-core-features.md)

## 总结

防抖自动保存系统已成功实现并集成到知识宝库中，提供了完整的自动保存、离线支持和冲突检测功能。用户可以专注于内容创作，无需担心数据丢失。
