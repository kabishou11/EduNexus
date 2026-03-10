"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useIsMobile } from "@/lib/hooks/use-media-query";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { MobileFAB } from "@/components/mobile/mobile-fab";
import { MobileSearch } from "@/components/mobile/mobile-search";
import { PullToRefresh } from "@/components/mobile/pull-to-refresh";
import { InfiniteScroll } from "@/components/mobile/infinite-scroll";
import { Button } from "@/components/ui/button";

interface MobileKBLayoutProps {
  children: React.ReactNode;
  onNewDocument?: () => void;
  onSearch?: (query: string) => void;
  onRefresh?: () => Promise<void>;
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
}

/**
 * 知识宝库移动端布局
 * 提供移动端优化的交互体验
 */
export function MobileKBLayout({
  children,
  onNewDocument,
  onSearch,
  onRefresh,
  onLoadMore,
  hasMore = false,
}: MobileKBLayoutProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <>{children}</>;
  }

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };

  const handleLoadMore = async () => {
    if (onLoadMore) {
      await onLoadMore();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 移动端顶部栏 */}
      <MobileHeader
        title="知识宝库"
        actions={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        }
      />

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden">
        {onRefresh ? (
          <PullToRefresh onRefresh={handleRefresh}>
            {onLoadMore ? (
              <InfiniteScroll
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
              >
                <div className="p-4 space-y-4">{children}</div>
              </InfiniteScroll>
            ) : (
              <div className="p-4 space-y-4">{children}</div>
            )}
          </PullToRefresh>
        ) : (
          <div className="h-full overflow-y-auto">
            {onLoadMore ? (
              <InfiniteScroll
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
              >
                <div className="p-4 space-y-4">{children}</div>
              </InfiniteScroll>
            ) : (
              <div className="p-4 space-y-4">{children}</div>
            )}
          </div>
        )}
      </div>

      {/* 浮动操作按钮 */}
      {onNewDocument && (
        <MobileFAB
          icon={<Plus className="h-6 w-6" />}
          onClick={onNewDocument}
        />
      )}

      {/* 搜索界面 */}
      {onSearch && (
        <MobileSearch
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSearch={onSearch}
          placeholder="搜索知识、笔记..."
          recentSearches={["React Hooks", "TypeScript", "Next.js"]}
          popularSearches={["前端开发", "算法", "数据结构", "设计模式"]}
        />
      )}
    </div>
  );
}
