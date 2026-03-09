/**
 * 知识库搜索索引模块
 * 提供全文搜索、中文分词、索引缓存等功能
 */

import type { KBDocument } from "./kb-storage";

// 搜索索引项
type SearchIndexItem = {
  docId: string;
  title: string;
  content: string;
  tags: string[];
  tokens: string[]; // 分词后的词条
  updatedAt: Date;
};

// 搜索结果
export type SearchResult = {
  document: KBDocument;
  score: number;
  highlights: string[];
};

// 简单的中文分词（基于字符和常见词）
function tokenize(text: string): string[] {
  const tokens: string[] = [];

  // 移除标点符号和特殊字符
  const cleaned = text.toLowerCase().replace(/[^\w\s\u4e00-\u9fa5]/g, " ");

  // 按空格分割（处理英文单词）
  const words = cleaned.split(/\s+/).filter(Boolean);

  words.forEach((word) => {
    // 如果是英文单词，直接添加
    if (/^[a-z0-9]+$/.test(word)) {
      tokens.push(word);
    } else {
      // 中文按字符分割
      for (let i = 0; i < word.length; i++) {
        tokens.push(word[i]);
        // 添加双字词
        if (i < word.length - 1) {
          tokens.push(word.slice(i, i + 2));
        }
        // 添加三字词
        if (i < word.length - 2) {
          tokens.push(word.slice(i, i + 3));
        }
      }
    }
  });

  return [...new Set(tokens)]; // 去重
}

// 计算文档相关性得分
function calculateRelevance(
  doc: SearchIndexItem,
  queryTokens: string[],
  query: string
): number {
  let score = 0;
  const lowerQuery = query.toLowerCase();

  // 完全匹配标题（最高权重）
  if (doc.title.toLowerCase() === lowerQuery) {
    score += 100;
  }

  // 标题包含查询（高权重）
  if (doc.title.toLowerCase().includes(lowerQuery)) {
    score += 50;
  }

  // 标题词条匹配
  queryTokens.forEach((token) => {
    if (doc.title.toLowerCase().includes(token)) {
      score += 10;
    }
  });

  // 标签匹配（中等权重）
  doc.tags.forEach((tag) => {
    if (tag.toLowerCase().includes(lowerQuery)) {
      score += 20;
    }
    queryTokens.forEach((token) => {
      if (tag.toLowerCase().includes(token)) {
        score += 5;
      }
    });
  });

  // 内容词条匹配（基础权重）
  queryTokens.forEach((token) => {
    const regex = new RegExp(token, "gi");
    const matches = doc.content.match(regex);
    if (matches) {
      score += matches.length * 2;
    }
  });

  // 新鲜度加成（最近更新的文档得分略高）
  const daysSinceUpdate = (Date.now() - doc.updatedAt.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 7) {
    score += 5;
  } else if (daysSinceUpdate < 30) {
    score += 2;
  }

  return score;
}

// 生成高亮片段
function generateHighlights(content: string, query: string, maxHighlights: number = 3): string[] {
  const highlights: string[] = [];
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();

  let startIndex = 0;
  while (highlights.length < maxHighlights) {
    const index = lowerContent.indexOf(lowerQuery, startIndex);
    if (index === -1) break;

    const start = Math.max(0, index - 40);
    const end = Math.min(content.length, index + query.length + 40);
    const snippet = content.slice(start, end);

    highlights.push((start > 0 ? "..." : "") + snippet + (end < content.length ? "..." : ""));
    startIndex = index + query.length;
  }

  return highlights;
}

/**
 * 搜索索引管理器
 */
export class SearchIndexManager {
  private index: Map<string, SearchIndexItem> = new Map();
  private lastIndexTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

  /**
   * 构建索引
   */
  buildIndex(documents: KBDocument[]): void {
    this.index.clear();

    documents.forEach((doc) => {
      const tokens = [
        ...tokenize(doc.title),
        ...tokenize(doc.content),
        ...doc.tags.flatMap((tag) => tokenize(tag)),
      ];

      this.index.set(doc.id, {
        docId: doc.id,
        title: doc.title,
        content: doc.content,
        tags: doc.tags,
        tokens,
        updatedAt: doc.updatedAt,
      });
    });

    this.lastIndexTime = Date.now();
  }

  /**
   * 检查索引是否需要重建
   */
  needsRebuild(): boolean {
    return Date.now() - this.lastIndexTime > this.CACHE_DURATION;
  }

  /**
   * 搜索文档
   */
  search(
    documents: KBDocument[],
    query: string,
    options?: {
      maxResults?: number;
      minScore?: number;
    }
  ): SearchResult[] {
    // 如果索引过期或为空，重建索引
    if (this.needsRebuild() || this.index.size === 0) {
      this.buildIndex(documents);
    }

    if (!query.trim()) {
      return documents.map((doc) => ({
        document: doc,
        score: 0,
        highlights: [],
      }));
    }

    const queryTokens = tokenize(query);
    const results: SearchResult[] = [];

    documents.forEach((doc) => {
      const indexItem = this.index.get(doc.id);
      if (!indexItem) return;

      const score = calculateRelevance(indexItem, queryTokens, query);

      if (score >= (options?.minScore || 0)) {
        results.push({
          document: doc,
          score,
          highlights: generateHighlights(doc.content, query),
        });
      }
    });

    // 按得分排序
    results.sort((a, b) => b.score - a.score);

    // 限制结果数量
    if (options?.maxResults) {
      return results.slice(0, options.maxResults);
    }

    return results;
  }

  /**
   * 清除索引
   */
  clearIndex(): void {
    this.index.clear();
    this.lastIndexTime = 0;
  }

  /**
   * 获取索引统计信息
   */
  getStats() {
    return {
      indexSize: this.index.size,
      lastIndexTime: this.lastIndexTime,
      cacheAge: Date.now() - this.lastIndexTime,
    };
  }
}

// 单例实例
let searchIndexInstance: SearchIndexManager | null = null;

/**
 * 获取搜索索引管理器实例
 */
export function getSearchIndex(): SearchIndexManager {
  if (!searchIndexInstance) {
    searchIndexInstance = new SearchIndexManager();
  }
  return searchIndexInstance;
}
