"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  recentSearches?: string[];
  popularSearches?: string[];
}

/**
 * 移动端搜索界面
 * 全屏搜索体验，包含历史记录和热门搜索
 */
export function MobileSearch({
  isOpen,
  onClose,
  onSearch,
  placeholder = "搜索知识、笔记、问题...",
  recentSearches = [],
  popularSearches = [],
}: MobileSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // 延迟聚焦以确保动画完成
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch(query.trim());
      onClose();
    }
  };

  const handleQuickSearch = (text: string) => {
    setQuery(text);
    if (onSearch) {
      onSearch(text);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-white dark:bg-gray-900 md:hidden overflow-y-auto"
        >
          {/* 搜索栏 */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={placeholder}
                  className="pl-10 pr-10 h-12 text-base rounded-full border-2 focus:border-primary"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <Button variant="ghost" onClick={onClose} className="h-12 px-4">
                取消
              </Button>
            </div>
          </div>

          {/* 搜索建议 */}
          <div className="p-4 space-y-6">
            {/* 最近搜索 */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    最近搜索
                  </h3>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(search)}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-accent transition-colors text-left"
                    >
                      <span className="text-sm">{search}</span>
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 热门搜索 */}
            {popularSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    热门搜索
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(search)}
                      className="px-4 py-2 rounded-full bg-accent hover:bg-accent/80 text-sm transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 空状态 */}
            {recentSearches.length === 0 && popularSearches.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">输入关键词开始搜索</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
