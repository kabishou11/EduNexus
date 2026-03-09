# 知识宝库组件说明

本目录包含知识宝库（Knowledge Base）的所有 UI 组件。

## 组件列表

### 核心组件

#### `vault-selector.tsx`
知识库选择器组件，用于切换和管理不同的知识库。

**功能**：
- 显示当前知识库
- 切换知识库
- 创建新知识库
- 删除知识库

**使用示例**：
```tsx
<VaultSelector
  currentVaultId={currentVaultId}
  onVaultChange={handleVaultChange}
/>
```

#### `template-selector.tsx`
模板选择器组件，提供多种预设笔记模板。

**功能**：
- 浏览预设模板
- 按分类筛选
- 搜索模板
- 自定义标题
- 选择模板创建笔记

**使用示例**：
```tsx
<TemplateSelector
  open={showTemplateSelector}
  onClose={() => setShowTemplateSelector(false)}
  onSelect={(title, content, tags) => {
    // 创建新文档
  }}
/>
```

#### `quick-note.tsx`
快速记录组件，用于快速创建笔记。

**功能**：
- 快速输入标题和内容
- 添加标签
- 保存笔记

**使用示例**：
```tsx
<QuickNote
  open={showQuickNote}
  onClose={() => setShowQuickNote(false)}
  onSave={async (title, content, tags) => {
    // 保存笔记
  }}
/>
```

#### `editor-toolbar.tsx`
编辑器工具栏组件，提供 Markdown 格式化工具。

**功能**：
- 插入标题
- 格式化文本（粗体、斜体、删除线、代码）
- 插入列表
- 插入链接、图片、引用、代码块、表格

**使用示例**：
```tsx
<EditorToolbar
  onInsert={(text) => {
    // 插入文本到编辑器
  }}
  onFormat={(format) => {
    // 应用格式
  }}
  disabled={!selectedDoc}
/>
```

#### `backlink-graph.tsx`
双链关系图组件，显示文档之间的链接关系。

**功能**：
- 显示出链（当前文档链接到的文档）
- 显示入链（链接到当前文档的文档）
- 显示相关文档（共享标签的文档）
- 统计信息

**使用示例**：
```tsx
<BacklinkGraph
  currentDocument={selectedDoc}
  allDocuments={documents}
  onDocumentClick={(doc) => {
    // 跳转到文档
  }}
/>
```

#### `ai-assistant.tsx`
AI 写作助手组件，提供 AI 辅助功能。

**功能**：
- 对话式交互
- 快捷操作（生成摘要、扩展内容、解释概念、改进写作）
- 一键插入到文档
- 最小化/展开

**使用示例**：
```tsx
<AIAssistant
  documentId={selectedDoc?.id}
  documentTitle={selectedDoc?.title}
  documentContent={selectedDoc?.content}
  selectedText={selectedText}
  onInsertText={(text) => {
    // 插入文本到编辑器
  }}
/>
```

### 搜索组件

#### `search-bar.tsx`
搜索栏组件，提供全文搜索功能。

**功能**：
- 输入搜索关键词
- 搜索建议
- 搜索历史

**使用示例**：
```tsx
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  suggestions={searchSuggestions}
  showHistory={true}
/>
```

#### `search-filters.tsx`
搜索筛选面板组件，提供高级筛选功能。

**功能**：
- 标签筛选（AND/OR 逻辑）
- 日期范围筛选
- 文档类型筛选

**使用示例**：
```tsx
<SearchFiltersPanel
  filters={searchFilters}
  onChange={setSearchFilters}
  availableTags={allTags}
  availableDocTypes={allDocTypes}
/>
```

#### `search-results.tsx`
搜索结果组件，显示搜索结果列表。

**功能**：
- 显示搜索结果
- 高亮关键词
- 排序（相关性、日期、标题）
- 点击跳转

**使用示例**：
```tsx
<SearchResults
  documents={filteredDocuments}
  searchQuery={searchQuery}
  onSelectDocument={setSelectedDoc}
  selectedDocId={selectedDoc?.id}
  sortBy={sortBy}
/>
```

## 组件依赖

### UI 组件库
- `@/components/ui/button`
- `@/components/ui/card`
- `@/components/ui/dialog`
- `@/components/ui/input`
- `@/components/ui/textarea`
- `@/components/ui/badge`
- `@/components/ui/separator`
- `@/components/ui/tabs`
- `@/components/ui/select`
- `@/components/ui/tooltip`

### 图标库
- `lucide-react`

### 工具库
- `@/lib/client/kb-storage` - 知识库存储管理
- `@/lib/client/search-index` - 搜索索引
- `@/lib/kb/templates` - 模板系统
- `@/lib/kb/ai-assistant` - AI 辅助功能

## 样式规范

所有组件遵循 EduNexus 的设计系统：

### 颜色方案
- **主色调**：琥珀色（amber）
- **辅助色**：橙色（orange）、玫瑰色（rose）
- **强调色**：蓝色（blue）、紫色（purple）

### 间距
- 小间距：`gap-1`, `gap-2`
- 中间距：`gap-3`, `gap-4`
- 大间距：`gap-6`, `gap-8`

### 圆角
- 小圆角：`rounded-lg`
- 大圆角：`rounded-xl`
- 圆形：`rounded-full`

### 阴影
- 小阴影：`shadow-sm`
- 中阴影：`shadow-md`
- 大阴影：`shadow-lg`, `shadow-xl`, `shadow-2xl`

## 开发指南

### 添加新组件

1. 在 `apps/web/src/components/kb/` 目录下创建新文件
2. 使用 TypeScript 和 React Hooks
3. 遵循现有组件的命名和结构规范
4. 添加 Props 类型定义
5. 添加必要的注释
6. 更新本 README

### 组件模板

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
// ... 其他导入

type MyComponentProps = {
  // Props 定义
};

export function MyComponent({ }: MyComponentProps) {
  // 状态管理
  const [state, setState] = useState();

  // 事件处理
  const handleAction = () => {
    // ...
  };

  return (
    <div>
      {/* 组件内容 */}
    </div>
  );
}
```

### 测试建议

1. **单元测试**：测试组件的基本功能
2. **集成测试**：测试组件之间的交互
3. **视觉测试**：确保样式正确
4. **可访问性测试**：确保符合 WCAG 标准

## 性能优化

### 使用 React Hooks
- `useMemo`：缓存计算结果
- `useCallback`：缓存函数引用
- `useRef`：访问 DOM 元素

### 避免不必要的重渲染
- 合理使用 `memo`
- 优化 Props 传递
- 使用 `key` 属性

### 懒加载
- 使用 `React.lazy` 和 `Suspense`
- 按需加载大型组件

## 常见问题

### Q: 如何自定义组件样式？
A: 所有组件都支持 `className` 属性，可以传入自定义的 Tailwind CSS 类名。

### Q: 如何处理组件错误？
A: 使用 Error Boundary 包裹组件，并提供友好的错误提示。

### Q: 如何优化组件性能？
A: 使用 React DevTools Profiler 分析性能瓶颈，合理使用 `useMemo` 和 `useCallback`。

## 更新日志

### v2.0.0 (2026-03-09)
- 新增模板选择器组件
- 新增快速记录组件
- 新增编辑器工具栏组件
- 新增双链关系图组件
- 优化 AI 助手组件
- 改进搜索组件

---

**维护者**：EduNexus 开发团队
**最后更新**：2026-03-09
