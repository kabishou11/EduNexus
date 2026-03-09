/**
 * 知识库搜索功能使用示例
 */

import { getSearchIndex } from "@/lib/client/search-index";
import { getKBStorage } from "@/lib/client/kb-storage";

// ============================================
// 示例 1: 基础搜索
// ============================================

async function basicSearchExample() {
  const storage = getKBStorage();
  await storage.initialize();

  // 获取所有文档
  const documents = await storage.getDocumentsByVault("vault_123");

  // 创建搜索索引
  const searchIndex = getSearchIndex();

  // 执行搜索
  const results = searchIndex.search(documents, "React", {
    maxResults: 10,
    minScore: 1,
  });

  console.log("搜索结果：", results);
  results.forEach((result) => {
    console.log(`- ${result.document.title} (得分: ${result.score})`);
    console.log(`  高亮: ${result.highlights[0]}`);
  });
}

// ============================================
// 示例 2: 高级筛选搜索
// ============================================

async function advancedSearchExample() {
  const storage = getKBStorage();
  await storage.initialize();

  const documents = await storage.getDocumentsByVault("vault_123");
  const searchIndex = getSearchIndex();

  // 搜索查询
  const query = "前端开发";

  // 应用筛选条件
  const filters = {
    tags: ["React", "TypeScript"],
    logicMode: "AND" as const,
    dateRange: {
      start: new Date("2026-01-01"),
      end: new Date("2026-12-31"),
    },
  };

  // 执行搜索
  let results = searchIndex.search(documents, query);

  // 应用标签筛选
  if (filters.tags.length > 0) {
    results = results.filter((result) => {
      if (filters.logicMode === "AND") {
        return filters.tags.every((tag) => result.document.tags.includes(tag));
      } else {
        return filters.tags.some((tag) => result.document.tags.includes(tag));
      }
    });
  }

  // 应用日期筛选
  if (filters.dateRange) {
    results = results.filter((result) => {
      const docDate = result.document.updatedAt.getTime();
      return (
        docDate >= filters.dateRange!.start.getTime() &&
        docDate <= filters.dateRange!.end.getTime()
      );
    });
  }

  console.log("高级搜索结果：", results);
}

// ============================================
// 示例 3: 使用搜索 Hook（在 React 组件中）
// ============================================

/*
import { useKBSearch } from "@/lib/client/use-kb-search";

function SearchComponent() {
  const [documents, setDocuments] = useState([]);

  const { searchState, search, clearSearch } = useKBSearch({
    documents,
    enableServerSearch: false,
    debounceMs: 300,
  });

  const handleSearch = (query: string) => {
    search(query);
  };

  return (
    <div>
      <input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="搜索..."
      />

      {searchState.isSearching && <div>搜索中...</div>}

      {searchState.error && <div>错误: {searchState.error}</div>}

      <div>
        {searchState.results.map((result) => (
          <div key={result.document.id}>
            <h3>{result.document.title}</h3>
            <p>得分: {result.score}</p>
            {result.highlights.map((highlight, i) => (
              <p key={i}>{highlight}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
*/

// ============================================
// 示例 4: 服务端搜索 API 调用
// ============================================

async function serverSearchExample() {
  const query = "React Hooks";
  const tags = ["前端", "React"];
  const logicMode = "AND";
  const limit = 20;

  const params = new URLSearchParams({
    q: query,
    tags: tags.join(","),
    logic: logicMode,
    limit: limit.toString(),
    sortBy: "relevance",
  });

  const response = await fetch(`/api/kb/search?${params}`);
  const data = await response.json();

  console.log("服务端搜索结果：", data);
  console.log("总结果数：", data.meta.total);
  console.log("筛选条件：", data.meta.filters);

  data.candidates.forEach((candidate: any) => {
    console.log(`- ${candidate.docId} (得分: ${candidate.score})`);
    console.log(`  摘要: ${candidate.snippet}`);
    console.log(`  匹配原因: ${candidate.reason.join(", ")}`);
  });
}

// ============================================
// 示例 5: 搜索索引管理
// ============================================

async function indexManagementExample() {
  const storage = getKBStorage();
  await storage.initialize();

  const documents = await storage.getDocumentsByVault("vault_123");
  const searchIndex = getSearchIndex();

  // 构建索引
  console.log("构建搜索索引...");
  searchIndex.buildIndex(documents);

  // 获取索引统计
  const stats = searchIndex.getStats();
  console.log("索引统计：", stats);
  console.log(`- 索引大小: ${stats.indexSize} 个文档`);
  console.log(`- 缓存年龄: ${Math.round(stats.cacheAge / 1000)} 秒`);

  // 检查是否需要重建
  if (searchIndex.needsRebuild()) {
    console.log("索引已过期，需要重建");
    searchIndex.buildIndex(documents);
  }

  // 清除索引
  searchIndex.clearIndex();
  console.log("索引已清除");
}

// ============================================
// 示例 6: 搜索结果高亮
// ============================================

function highlightExample() {
  const text = "React 是一个用于构建用户界面的 JavaScript 库";
  const query = "React";

  // 简单的高亮实现
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  const highlighted = parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase()
      ? `<mark>${part}</mark>`
      : part
  ).join("");

  console.log("原文：", text);
  console.log("高亮后：", highlighted);
}

// ============================================
// 示例 7: 搜索历史管理
// ============================================

function searchHistoryExample() {
  const STORAGE_KEY = "kb_search_history";
  const MAX_HISTORY = 10;

  // 保存搜索历史
  function saveSearchHistory(query: string) {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const newHistory = [
      query,
      ...history.filter((item: string) => item !== query),
    ].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  }

  // 获取搜索历史
  function getSearchHistory(): string[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }

  // 清除搜索历史
  function clearSearchHistory() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // 使用示例
  saveSearchHistory("React Hooks");
  saveSearchHistory("TypeScript 类型");
  console.log("搜索历史：", getSearchHistory());
}

// ============================================
// 示例 8: 中文分词示例
// ============================================

function tokenizeExample() {
  function tokenize(text: string): string[] {
    const tokens: string[] = [];
    const cleaned = text.toLowerCase().replace(/[^\w\s\u4e00-\u9fa5]/g, " ");
    const words = cleaned.split(/\s+/).filter(Boolean);

    words.forEach((word) => {
      if (/^[a-z0-9]+$/.test(word)) {
        tokens.push(word);
      } else {
        for (let i = 0; i < word.length; i++) {
          tokens.push(word[i]);
          if (i < word.length - 1) {
            tokens.push(word.slice(i, i + 2));
          }
          if (i < word.length - 2) {
            tokens.push(word.slice(i, i + 3));
          }
        }
      }
    });

    return [...new Set(tokens)];
  }

  const text = "React 是一个用于构建用户界面的 JavaScript 库";
  const tokens = tokenize(text);
  console.log("原文：", text);
  console.log("分词结果：", tokens);
}

// 导出示例函数
export {
  basicSearchExample,
  advancedSearchExample,
  serverSearchExample,
  indexManagementExample,
  highlightExample,
  searchHistoryExample,
  tokenizeExample,
};
