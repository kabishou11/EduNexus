# 知识库搜索功能优化 - 实现总结

## 概述

本次优化为 EduNexus 知识库系统添加了完整的全文搜索功能，包括中文分词、高级筛选、搜索历史、结果高亮等特性。

## 新增文件

### 1. 组件文件

#### `apps/web/src/components/kb/search-bar.tsx`
- 搜索输入框组件
- 支持搜索历史记录（最多10条）
- 自动补全和搜索建议
- 实时搜索功能
- 一键清除输入

#### `apps/web/src/components/kb/search-filters.tsx`
- 高级筛选面板组件
- 支持 AND/OR 逻辑模式
- 标签筛选（多选）
- 日期范围筛选
- 文档类型筛选
- 可折叠界面

#### `apps/web/src/components/kb/search-results.tsx`
- 搜索结果展示组件
- 结果高亮显示
- 智能摘要生成
- 支持多种排序方式（相关性、日期、标题）
- 卡片式结果布局

### 2. 核心库文件

#### `apps/web/src/lib/client/search-index.ts`
- 搜索索引管理器
- 中文分词功能
- 相关性评分算法
- 索引缓存机制（5分钟）
- 高亮片段生成

#### `apps/web/src/lib/client/use-kb-search.ts`
- React Hook for 搜索功能
- 支持本地搜索和服务端搜索
- 防抖处理（300ms）
- 搜索状态管理

#### `apps/web/src/lib/client/search-examples.ts`
- 搜索功能使用示例
- 8个完整的示例代码
- 涵盖所有主要功能

### 3. 文档文件

#### `apps/web/src/components/kb/SEARCH_README.md`
- 完整的功能文档
- API 接口说明
- 使用指南
- 性能指标
- 未来优化方向

## 修改文件

### 1. `apps/web/src/app/kb/page.tsx`
主要修改：
- 集成新的搜索组件
- 添加搜索状态管理
- 实现高级筛选逻辑
- 添加搜索结果标签页
- 集成搜索索引

关键改动：
```typescript
// 新增导入
import { SearchBar } from "@/components/kb/search-bar";
import { SearchFiltersPanel, type SearchFilters } from "@/components/kb/search-filters";
import { SearchResults } from "@/components/kb/search-results";
import { getSearchIndex } from "@/lib/client/search-index";

// 新增状态
const [sortBy, setSortBy] = useState<"relevance" | "date" | "title">("relevance");
const [searchFilters, setSearchFilters] = useState<SearchFilters>({...});
const [showSearchResults, setShowSearchResults] = useState(false);

// 使用搜索索引
const searchIndex = getSearchIndex();
const results = searchIndex.search(documents, searchQuery, {...});
```

### 2. `apps/web/src/app/api/kb/search/route.ts`
主要修改：
- 扩展 API 支持更多查询参数
- 添加多标签筛选
- 添加日期范围筛选
- 添加结果排序
- 添加结果限制
- 返回更详细的元数据

新增查询参数：
- `tags`: 多标签支持
- `logic`: AND/OR 逻辑
- `startDate`, `endDate`: 日期范围
- `limit`: 结果数量限制
- `sortBy`: 排序方式

## 核心功能实现

### 1. 中文分词算法

```typescript
function tokenize(text: string): string[] {
  // 1. 清理文本
  const cleaned = text.toLowerCase().replace(/[^\w\s\u4e00-\u9fa5]/g, " ");

  // 2. 分割单词
  const words = cleaned.split(/\s+/).filter(Boolean);

  // 3. 处理中英文
  words.forEach((word) => {
    if (/^[a-z0-9]+$/.test(word)) {
      tokens.push(word); // 英文单词
    } else {
      // 中文：单字、双字、三字词
      for (let i = 0; i < word.length; i++) {
        tokens.push(word[i]);
        if (i < word.length - 1) tokens.push(word.slice(i, i + 2));
        if (i < word.length - 2) tokens.push(word.slice(i, i + 3));
      }
    }
  });

  return [...new Set(tokens)]; // 去重
}
```

### 2. 相关性评分

评分规则：
- ID 完全匹配：+6 分
- ID 部分匹配：+3.5 分
- 标题包含关键词：+3 分
- 标签匹配：+2 分
- 内容匹配：+1.5 分/次
- 链接匹配：+1 分
- 新鲜度加成：最近7天 +5 分，30天内 +2 分

### 3. 搜索索引缓存

- 首次搜索时构建索引
- 索引缓存 5 分钟
- 自动检测过期并重建
- 支持手动清除索引

### 4. 搜索历史

- 使用 localStorage 存储
- 最多保存 10 条记录
- 自动去重
- 支持一键清除

### 5. 结果高亮

- 自动提取匹配片段
- 前后各显示 40 个字符
- 最多显示 3 个高亮片段
- 使用 `<mark>` 标签高亮

## 性能优化

### 1. 索引机制
- 预先构建索引，避免每次搜索都遍历
- 索引包含分词结果，加速匹配
- 5分钟缓存，平衡性能和实时性

### 2. 防抖处理
- 搜索输入防抖 300ms
- 减少不必要的搜索请求
- 提升用户体验

### 3. 结果限制
- 默认最多返回 50 个结果
- 支持自定义限制
- 避免大量结果影响性能

### 4. 懒加载
- 搜索建议按需显示
- 筛选面板可折叠
- 减少初始渲染负担

## UI/UX 改进

### 1. 搜索框
- 清晰的搜索图标
- 实时搜索建议下拉
- 历史记录快速访问
- 一键清除输入

### 2. 筛选面板
- 可折叠设计，节省空间
- 活跃筛选条件计数
- 一键清除所有筛选
- 直观的标签和类型选择

### 3. 搜索结果
- 卡片式布局，清晰易读
- 高亮显示匹配内容
- 显示相关元信息（日期、标签）
- 支持多种排序方式

### 4. 响应式设计
- 适配不同屏幕尺寸
- 移动端友好
- 流畅的动画过渡

## API 接口

### GET /api/kb/search

**请求参数：**
```
q: 搜索关键词（必需）
tags: 标签列表，逗号分隔
logic: AND | OR
startDate: 开始日期 (ISO 8601)
endDate: 结束日期 (ISO 8601)
limit: 结果数量限制（默认 50）
sortBy: relevance | date | title
```

**响应格式：**
```json
{
  "query": "React",
  "candidates": [
    {
      "docId": "doc_123",
      "score": 15.5,
      "snippet": "...React 是一个...",
      "reason": ["title_match", "content_match"]
    }
  ],
  "meta": {
    "total": 10,
    "limit": 50,
    "sortBy": "relevance",
    "filters": {
      "tags": ["前端"],
      "logicMode": "AND",
      "dateRange": null
    }
  }
}
```

## 使用示例

### 基础搜索
```typescript
const searchIndex = getSearchIndex();
const results = searchIndex.search(documents, "React", {
  maxResults: 10,
  minScore: 1,
});
```

### 使用 Hook
```typescript
const { searchState, search, clearSearch } = useKBSearch({
  documents,
  enableServerSearch: false,
  debounceMs: 300,
});

search("React Hooks");
```

### 组件使用
```tsx
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  suggestions={searchSuggestions}
  showHistory={true}
/>

<SearchFiltersPanel
  filters={searchFilters}
  onChange={setSearchFilters}
  availableTags={allTags}
  availableDocTypes={allDocTypes}
/>

<SearchResults
  documents={filteredDocuments}
  searchQuery={searchQuery}
  onSelectDocument={setSelectedDoc}
  sortBy={sortBy}
/>
```

## 测试建议

1. **功能测试**
   - 测试基础搜索功能
   - 测试高级筛选（标签、日期、类型）
   - 测试搜索历史记录
   - 测试搜索建议

2. **性能测试**
   - 测试大量文档（1000+）的搜索性能
   - 测试索引构建时间
   - 测试搜索响应时间

3. **边界测试**
   - 空查询
   - 特殊字符
   - 超长查询
   - 无结果情况

4. **兼容性测试**
   - 不同浏览器
   - 移动设备
   - 不同屏幕尺寸

## 未来优化方向

1. **更智能的分词**
   - 集成 jieba 等专业分词库
   - 支持拼音搜索
   - 错别字容错

2. **搜索分析**
   - 统计热门搜索词
   - 搜索趋势分析
   - 搜索失败分析

3. **索引持久化**
   - 将索引保存到 IndexedDB
   - 减少重复构建
   - 提升启动速度

4. **高级查询语法**
   - 支持 `title:关键词`
   - 支持 `tag:标签`
   - 支持正则表达式

5. **搜索结果优化**
   - 分页加载
   - 无限滚动
   - 结果导出

6. **性能监控**
   - 记录搜索性能指标
   - 慢查询分析
   - 优化建议

## 总结

本次优化为知识库系统添加了完整的搜索功能，包括：

✅ 全文搜索（支持中文分词）
✅ 搜索结果高亮
✅ 搜索历史记录
✅ 搜索建议（自动补全）
✅ 高级筛选（AND/OR 逻辑、标签、日期、类型）
✅ 搜索性能优化（索引、缓存、防抖）
✅ UI 改进（搜索框、筛选面板、结果展示）
✅ 完整的文档和示例

所有功能已经实现并集成到现有的知识库页面中，可以直接使用。
