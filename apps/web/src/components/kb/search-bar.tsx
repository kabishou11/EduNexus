"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type SearchSuggestion = {
  text: string;
  type: "history" | "suggestion";
  count?: number;
};

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: string[];
  showHistory?: boolean;
};

const MAX_HISTORY = 10;
const STORAGE_KEY = "kb_search_history";

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "搜索文档...",
  suggestions = [],
  showHistory = true,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 加载搜索历史
  useEffect(() => {
    if (showHistory) {
      const history = localStorage.getItem(STORAGE_KEY);
      if (history) {
        try {
          setSearchHistory(JSON.parse(history));
        } catch (e) {
          console.error("Failed to load search history:", e);
        }
      }
    }
  }, [showHistory]);

  // 保存搜索历史
  const saveToHistory = useCallback((query: string) => {
    if (!query.trim() || !showHistory) return;

    setSearchHistory((prev) => {
      const newHistory = [query, ...prev.filter((item) => item !== query)].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, [showHistory]);

  // 清除搜索历史
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // 处理搜索
  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      saveToHistory(query);
      onSearch(query);
      setShowSuggestions(false);
    }
  }, [onSearch, saveToHistory]);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(value);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 合并建议和历史
  const allSuggestions: SearchSuggestion[] = [];

  if (value.trim()) {
    // 添加匹配的建议
    suggestions
      .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5)
      .forEach((text) => {
        allSuggestions.push({ text, type: "suggestion" });
      });
  } else if (showHistory && searchHistory.length > 0) {
    // 显示历史记录
    searchHistory.forEach((text) => {
      allSuggestions.push({ text, type: "history" });
    });
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          className="pl-10 pr-10 bg-amber-50/50 border-amber-200 focus:border-amber-400"
        />
        {value && (
          <button
            onClick={() => {
              onChange("");
              setShowSuggestions(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 建议下拉框 */}
      {showSuggestions && allSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-amber-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {!value && showHistory && searchHistory.length > 0 && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-amber-100">
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <Clock className="w-4 h-4" />
                <span>搜索历史</span>
              </div>
              <button
                onClick={clearHistory}
                className="text-xs text-amber-500 hover:text-amber-700"
              >
                清除
              </button>
            </div>
          )}

          {value && allSuggestions.length > 0 && (
            <div className="px-4 py-2 border-b border-amber-100">
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <TrendingUp className="w-4 h-4" />
                <span>搜索建议</span>
              </div>
            </div>
          )}

          <div className="py-1">
            {allSuggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${index}`}
                onClick={() => {
                  onChange(suggestion.text);
                  handleSearch(suggestion.text);
                }}
                className="w-full px-4 py-2 text-left hover:bg-amber-50 transition-colors flex items-center gap-2"
              >
                {suggestion.type === "history" ? (
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                ) : (
                  <Search className="w-4 h-4 text-amber-400 flex-shrink-0" />
                )}
                <span className="text-sm text-amber-900 truncate">{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
