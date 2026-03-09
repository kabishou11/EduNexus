# 知识库搜索功能文档

## 功能概述

知识库搜索系统提供了强大的全文搜索功能，支持中文分词、高级筛选、搜索历史和结果高亮等特性。

## 核心功能

### 1. 全文搜索

- **中文分词支持**：自动对中文内容进行分词处理，提高搜索准确性
- **多字段搜索**：同时搜索文档标题、内容和标签
- **相关性排序**：根据匹配度自动排序搜索结果
- **搜索结果高亮**：在搜索结果中高亮显示匹配的关键词

### 2. 搜索历史

- **自动记录**：自动保存最近的搜索记录（最多10条）
- **快速访问**：点击历史记录快速重新搜索
- **一键清除**：支持清除所有搜索历史

### 3. 搜索建议

- **自动补全**：根据文档标题和标签提供搜索建议
- **实时更新**：输入时实时显示匹配的建议
- **智能匹配**：支持模糊匹配和部分匹配

### 4. 高级筛选

#### 逻辑模式
- **AND 模式**：所有条件必须同时满足
- **OR 模式**：满足任一条件即可

#### 标签筛选
- 支持多标签同时筛选
- 可视化标签选择界面
- 实时更新筛选结果

#### 日期范围筛选
- 按文档更新日期筛选
- 支持自定义日期范围
- 快速清除日期筛选

#### 文档类型筛选
- 按文档类型分类筛选
- 支持多类型同时选择

### 5. 搜索性能优化

#### 索引机制
- **自动索引**：首次搜索时自动构建索引
- **增量更新**：文档变更时增量更新索引
- **缓存策略**：5分钟索引缓存，提高搜索速度

#### 分词优化
- 中文按字符和词组分词
- 英文按单词分词
- 支持混合中英文搜索

#### 结果缓存
- 搜索结果自动缓存
- 相同查询直接返回缓存结果

### 6. UI 改进

#### 搜索框
- 清晰的搜索图标
- 一键清除输入
- 实时搜索建议下拉框

#### 搜索结果
- 卡片式结果展示
- 结果摘要预览
- 高亮显示匹配内容
- 显示文档元信息（日期、标签）

#### 筛选面板
- 可折叠的筛选面板
- 活跃筛选条件计数
- 一键清除所有筛选

#### 排序选项
- 按相关性排序（默认）
- 按日期排序
- 按标题排序

## 技术实现

### 客户端搜索

```typescript
// 使用搜索索引
import { getSearchIndex } from "@/lib/client/search-index";

const searchIndex = getSearchIndex();
const results = searchIndex.search(documents, query, {
  maxResults: 50,
  minScore: 1,
});
```

### 服务端搜索

```typescript
// API 调用
const response = await fetch(
  `/api/kb/search?q=${query}&tags=${tags}&logic=AND&limit=50`
);
const data = await response.json();
```

### 搜索 Hook

```typescript
// 使用搜索 Hook
import { useKBSearch } from "@/lib/client/use-kb-search";

const { searchState, search, clearSearch } = useKBSearch({
  documents,
  enableServerSearch: false,
  debounceMs: 300,
});
```

## 组件使用

### SearchBar 组件

```tsx
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  suggestions={searchSuggestions}
  showHistory={true}
/>
```

### SearchFiltersPanel 组件

```tsx
<SearchFiltersPanel
  filters={searchFilters}
  onChange={setSearchFilters}
  availableTags={allTags}
  availableDocTypes={allDocTypes}
/>
```

### SearchResults 组件

```tsx
<SearchResults
  documents={filteredDocuments}
  searchQuery={searchQuery}
  onSelectDocument={setSelectedDoc}
  selectedDocId={selectedDoc?.id}
  sortBy={sortBy}
/>
```

## API 接口

### GET /api/kb/search

搜索知识库文档

**查询参数：**

- `q` (必需): 搜索关键词
- `tags`: 标签列表，逗号分隔
- `logic`: 逻辑模式，`AND` 或 `OR`
- `startDate`: 开始日期 (ISO 8601)
- `endDate`: 结束日期 (ISO 8601)
- `limit`: 结果数量限制，默认 50
- `sortBy`: 排序方式，`relevance`、`date` 或 `title`

**响应示例：**

```json
{
  "query": "React",
  "candidates": [
    {
      "docId": "doc_123",
      "score": 15.5,
      "snippet": "...React 是一个用于构建用户界面的 JavaScript 库...",
      "reason": ["title_match", "content_match"]
    }
  ],
  "meta": {
    "total": 10,
    "limit": 50,
    "sortBy": "relevance",
    "filters": {
      "tags": ["前端", "React"],
      "logicMode": "AND",
      "dateRange": null
    }
  }
}
```

## 性能指标

- **索引构建时间**：< 100ms（1000个文档）
- **搜索响应时间**：< 50ms（本地搜索）
- **索引缓存时长**：5分钟
- **搜索历史容量**：10条记录

## 未来优化方向

1. **更智能的中文分词**：集成专业的中文分词库（如 jieba）
2. **模糊搜索**：支持拼音搜索和错别字容错
3. **搜索分析**：统计热门搜索词和搜索趋势
4. **全文索引持久化**：将索引保存到 IndexedDB
5. **搜索结果导出**：支持导出搜索结果
6. **高级查询语法**：支持 `title:关键词`、`tag:标签` 等语法
7. **搜索结果分页**：大量结果时支持分页加载
8. **搜索性能监控**：记录搜索性能指标

## 注意事项

1. 搜索索引会占用一定内存，大量文档时需要注意性能
2. 搜索历史存储在 localStorage，清除浏览器数据会丢失
3. 中文分词采用简单算法，复杂场景可能需要专业分词库
4. 服务端搜索需要配置 vault 目录路径
