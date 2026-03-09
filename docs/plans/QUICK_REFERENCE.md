# 功能整合和用户体验优化 - 快速参考

**快速导航**: [设计文档](#设计文档) | [实施计划](#实施计划) | [第一阶段](#第一阶段) | [关键代码](#关键代码)

---

## 📚 文档索引

### 设计文档
**文件**: `docs/plans/2026-03-09-integration-optimization-design.md` (670 行)

**包含内容**:
- 项目概述和愿景
- 核心目标和成功指标
- 系统架构图
- 三个阶段的详细功能设计
- 完整数据模型和 Schema
- UI/UX 设计规范
- 技术选型
- 风险评估和应对策略

### 实施计划
**文件**: `docs/plans/2026-03-09-integration-optimization-plan.md` (471 行)

**包含内容**:
- 工作分解结构 (WBS)
- 详细任务列表（每个任务的工时、依赖、验收标准）
- 三个里程碑和交付物
- 甘特图时间表
- 资源分配和人员配置
- 风险管理计划
- 质量保证策略

### 第一阶段详细计划
**文件**: `docs/plans/phase1-core-features.md` (955 行)

**包含内容**:
- 防抖自动保存系统（完整代码）
- 多入口快速创建系统（完整代码）
- 基础数据联动（完整代码）
- 测试用例和测试计划
- 部署和回滚计划

### 项目摘要
**文件**: `docs/plans/PROJECT_SUMMARY.md` (345 行)

**包含内容**:
- 项目概览和核心价值
- 三大阶段总结
- 成功指标表
- 技术架构概览
- 下一步行动建议

---

## 🎯 三阶段速览

### Phase 1: 核心功能 (1-2周)
```
防抖自动保存 → 多入口创建 → 基础数据联动
     ↓              ↓              ↓
  2-3秒自动保存   快捷键+浮动按钮   标签提取+图谱同步
```

**关键文件**:
- `lib/hooks/use-auto-save.ts`
- `lib/hooks/use-global-shortcuts.ts`
- `components/kb/floating-create-button.tsx`
- `lib/kb/content-extractor.ts`

### Phase 2: 智能化 (2-3周)
```
AI内容分析 → 学习路径推荐 → 知识盲区识别
     ↓            ↓              ↓
  摘要+概念    个性化路径      薄弱环节识别
```

**关键文件**:
- `lib/kb/ai-assistant.ts`
- `lib/learning/path-recommender.ts`
- `lib/learning/blind-spot-detector.ts`

### Phase 3: 视觉优化 (1-2周)
```
统一设计系统 → 动画效果库 → 沉浸式体验
      ↓            ↓            ↓
   设计令牌     流畅动画     多种编辑模式
```

**关键文件**:
- `lib/design/tokens.ts`
- `components/ui/animations.tsx`
- `components/kb/immersive-editor.tsx`

---

## 💻 关键代码片段

### 1. 自动保存 Hook

```typescript
// apps/web/src/lib/hooks/use-auto-save.ts
import { useState, useMemo } from 'react';
import { debounce } from 'lodash';

export function useAutoSave<T>(options: {
  delay?: number;
  onSave: (data: T) => Promise<void>;
}) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const debouncedSave = useMemo(
    () => debounce(async (data: T) => {
      try {
        setStatus('saving');
        await options.onSave(data);
        setStatus('saved');
      } catch (error) {
        setStatus('error');
      }
    }, options.delay ?? 2000),
    [options]
  );

  return { save: debouncedSave, status };
}
```

**使用方式**:
```typescript
const { save, status } = useAutoSave({
  delay: 2000,
  onSave: async (doc) => await storage.saveDocument(doc),
});

// 在内容变化时调用
useEffect(() => {
  save({ ...document, content: editContent });
}, [editContent]);
```

### 2. 全局快捷键

```typescript
// apps/web/src/lib/hooks/use-global-shortcuts.ts
export function useGlobalShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if ((e.ctrlKey || e.metaKey) && e.key === shortcut.key) {
          e.preventDefault();
          shortcut.handler();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
```

**使用方式**:
```typescript
useGlobalShortcuts([
  { key: 'n', ctrl: true, handler: () => openQuickCreate() },
  { key: 'k', ctrl: true, handler: () => openQuickSearch() },
]);
```

### 3. 浮动创建按钮

```typescript
// apps/web/src/components/kb/floating-create-button.tsx
export function FloatingCreateButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {/* 创建选项 */}
          </motion.div>
        )}
      </AnimatePresence>

      <Button onClick={() => setIsOpen(!isOpen)}>
        <Plus />
      </Button>
    </div>
  );
}
```

### 4. 标签提取

```typescript
// apps/web/src/lib/kb/content-extractor.ts
export function extractTags(content: string): string[] {
  const tagRegex = /#([^\s#]+)/g;
  const matches = content.matchAll(tagRegex);
  return [...new Set(Array.from(matches, m => m[1]))];
}

export function extractKeywords(content: string): string[] {
  // TF-IDF 算法实现
  const words = content.toLowerCase().split(/\s+/);
  const freq = new Map<string, number>();
  words.forEach(w => freq.set(w, (freq.get(w) || 0) + 1));
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}
```

---

## 📊 任务清单

### Week 1 (2026-03-09 ~ 2026-03-15)

- [ ] **Day 1-2**: 防抖自动保存
  - [ ] 创建 useAutoSave Hook
  - [ ] 实现保存状态指示器
  - [ ] 编写单元测试

- [ ] **Day 3-4**: 多入口创建
  - [ ] 实现全局快捷键
  - [ ] 创建浮动按钮
  - [ ] 实现快速创建对话框

- [ ] **Day 5-6**: 基础数据联动
  - [ ] 实现标签提取
  - [ ] 实现知识图谱同步
  - [ ] 集成到保存流程

- [ ] **Day 7**: 测试和修复
  - [ ] 运行完整测试
  - [ ] 修复 Bug
  - [ ] 代码审查

### Week 2 (2026-03-16 ~ 2026-03-22)

- [ ] 完善第一阶段功能
- [ ] 集成测试
- [ ] 性能优化
- [ ] 文档完善
- [ ] 内部演示

---

## 🎯 成功指标速查

| 指标 | 目标 | 测量 |
|------|------|------|
| 笔记创建时间 | <30秒 | 用户行为分析 |
| 自动保存成功率 | >99% | 系统日志 |
| 知识关联准确率 | >80% | 用户反馈 |
| 页面加载时间 | <1秒 | 性能监控 |
| 测试覆盖率 | >80% | 代码分析 |

---

## 🚀 快速开始

### 1. 创建开发分支
```bash
git checkout -b feature/integration-optimization
```

### 2. 安装依赖
```bash
cd apps/web
npm install lodash date-fns idb
npm install -D @types/lodash
```

### 3. 创建文件结构
```bash
mkdir -p src/lib/hooks
mkdir -p src/lib/client
mkdir -p src/lib/kb
mkdir -p src/components/kb
```

### 4. 开始开发
从 `useAutoSave` Hook 开始，按照 `phase1-core-features.md` 中的代码实现。

---

## 📞 获取帮助

- **设计问题**: 查看 `2026-03-09-integration-optimization-design.md`
- **实施问题**: 查看 `2026-03-09-integration-optimization-plan.md`
- **代码问题**: 查看 `phase1-core-features.md`
- **项目概览**: 查看 `PROJECT_SUMMARY.md`

---

## 📝 文档更新

- **v1.0** (2026-03-09): 初始版本，完整的设计和实施计划

---

**提示**: 这是一个快速参考文档，详细内容请查看对应的完整文档。
