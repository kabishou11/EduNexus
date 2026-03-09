/**
 * 知识库搜索 Hook
 * 提供客户端搜索功能，支持本地搜索和服务端搜索
 */

import { useState, useCallback, useEffect } from "react";
import type { KBDocument } from "./kb-storage";
import { getSearchIndex, type SearchResult } from "./search-index";

export type UseSearchOptions = {
  documents: KBDocument[];
  enableServerSearch?: boolean;
  debounceMs?: number;
};

export type SearchState = {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  error: string | null;
};

export function useKBSearch(options: UseSearchOptions) {
  const { documents, enableServerSearch = false, debounceMs = 300 } = options;
  const searchIndex = getSearchIndex();

  const [searchState, setSearchState] = useState<SearchState>({
    query: "",
    results: [],
    isSearching: false,
    error: null,
  });

  // 本地搜索
  const searchLocal = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setSearchState({
          query,
          results: documents.map((doc) => ({
            document: doc,
            score: 0,
            highlights: [],
          })),
          isSearching: false,
          error: null,
        });
        return;
      }

      setSearchState((prev) => ({ ...prev, isSearching: true, error: null }));

      try {
        const results = searchIndex.search(documents, query, {
          maxResults: 50,
          minScore: 1,
        });

        setSearchState({
          query,
          results,
          isSearching: false,
          error: null,
        });
      } catch (error) {
        setSearchState({
          query,
          results: [],
          isSearching: false,
          error: error instanceof Error ? error.message : "搜索失败",
        });
      }
    },
    [documents, searchIndex]
  );

  // 服务端搜索
  const searchServer = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchState({
        query,
        results: [],
        isSearching: false,
        error: null,
      });
      return;
    }

    setSearchState((prev) => ({ ...prev, isSearching: true, error: null }));

    try {
      const response = await fetch(`/api/kb/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "搜索失败");
      }

      // 将服务端结果转换为 SearchResult 格式
      const results: SearchResult[] = data.candidates.map((candidate: any) => {
        const doc = documents.find((d) => d.id === candidate.docId);
        return {
          document: doc!,
          score: candidate.score,
          highlights: [candidate.snippet],
        };
      }).filter((r: SearchResult) => r.document);

      setSearchState({
        query,
        results,
        isSearching: false,
        error: null,
      });
    } catch (error) {
      setSearchState({
        query,
        results: [],
        isSearching: false,
        error: error instanceof Error ? error.message : "搜索失败",
      });
    }
  }, [documents]);

  // 执行搜索（带防抖）
  const search = useCallback(
    (query: string) => {
      const searchFn = enableServerSearch ? searchServer : searchLocal;

      // 简单的防抖实现
      const timeoutId = setTimeout(() => {
        searchFn(query);
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    },
    [enableServerSearch, searchServer, searchLocal, debounceMs]
  );

  // 清除搜索
  const clearSearch = useCallback(() => {
    setSearchState({
      query: "",
      results: documents.map((doc) => ({
        document: doc,
        score: 0,
        highlights: [],
      })),
      isSearching: false,
      error: null,
    });
  }, [documents]);

  // 获取搜索统计
  const getStats = useCallback(() => {
    return searchIndex.getStats();
  }, [searchIndex]);

  return {
    searchState,
    search,
    clearSearch,
    getStats,
  };
}
