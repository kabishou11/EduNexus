"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteScrollProps {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  loading?: boolean;
  threshold?: number;
  children: React.ReactNode;
}

/**
 * 无限滚动组件
 * 自动加载更多内容
 */
export function InfiniteScroll({
  onLoadMore,
  hasMore,
  loading = false,
  threshold = 200,
  children,
}: InfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!hasMore || loading || isLoading) return;

    const handleIntersection = async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsLoading(true);
        try {
          await onLoadMore();
        } finally {
          setIsLoading(false);
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: `${threshold}px`,
    });

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [hasMore, loading, isLoading, onLoadMore, threshold]);

  return (
    <>
      {children}
      {hasMore && (
        <div
          ref={loadMoreRef}
          className="flex items-center justify-center py-8"
        >
          {(loading || isLoading) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">加载中...</span>
            </div>
          )}
        </div>
      )}
      {!hasMore && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          没有更多内容了
        </div>
      )}
    </>
  );
}
