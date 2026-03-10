"use client";

import { useState, useRef, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  maxPullDistance?: number;
}

/**
 * 下拉刷新组件
 * 移动端常见的下拉刷新交互
 */
export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  maxPullDistance = 120,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = (e: TouchEvent) => {
    const container = containerRef.current;
    if (!container || isRefreshing) return;

    // 只在滚动到顶部时启用下拉刷新
    if (container.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    const container = containerRef.current;
    if (!container || isRefreshing || startY.current === 0) return;

    currentY.current = e.touches[0].clientY;
    const distance = currentY.current - startY.current;

    if (distance > 0 && container.scrollTop === 0) {
      // 阻止默认滚动
      e.preventDefault();

      // 计算拉动距离（使用阻尼效果）
      const dampedDistance = Math.min(
        distance * 0.5,
        maxPullDistance
      );
      setPullDistance(dampedDistance);
      setCanRefresh(dampedDistance >= threshold);
    }
  };

  const handleTouchEnd = async () => {
    if (isRefreshing) return;

    if (canRefresh) {
      setIsRefreshing(true);
      setPullDistance(threshold);

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        setCanRefresh(false);
      }
    } else {
      setPullDistance(0);
      setCanRefresh(false);
    }

    startY.current = 0;
    currentY.current = 0;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isRefreshing, canRefresh]);

  const rotation = (pullDistance / threshold) * 360;
  const opacity = Math.min(pullDistance / threshold, 1);

  return (
    <div ref={containerRef} className="relative h-full overflow-y-auto">
      {/* 刷新指示器 */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200"
        style={{
          height: `${pullDistance}px`,
          opacity,
        }}
      >
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg",
            isRefreshing && "animate-spin"
          )}
          style={{
            transform: isRefreshing
              ? undefined
              : `rotate(${rotation}deg)`,
          }}
        >
          <RefreshCw className="h-5 w-5" />
        </div>
      </div>

      {/* 内容 */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
