"use client";

import { useState, useRef } from "react";
import { ZoomIn, ZoomOut, Maximize2, Search } from "lucide-react";
import { useIsMobile } from "@/lib/hooks/use-media-query";
import { useTouchGesture } from "@/lib/hooks/use-touch-gesture";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileGraphLayoutProps {
  children: React.ReactNode;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  onSearch?: () => void;
}

/**
 * 知识星图移动端布局
 * 支持触摸缩放和拖拽
 */
export function MobileGraphLayout({
  children,
  onZoomIn,
  onZoomOut,
  onReset,
  onSearch,
}: MobileGraphLayoutProps) {
  const [scale, setScale] = useState(1);
  const isMobile = useIsMobile();

  const containerRef = useTouchGesture<HTMLDivElement>({
    onPinch: (newScale) => {
      setScale((prev) => Math.max(0.5, Math.min(3, prev * newScale)));
    },
    onDoubleTap: () => {
      if (onReset) {
        onReset();
        setScale(1);
      }
    },
  });

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* 移动端顶部栏 */}
      <MobileHeader
        title="知识星图"
        actions={
          onSearch && (
            <Button variant="ghost" size="icon" onClick={onSearch}>
              <Search className="h-5 w-5" />
            </Button>
          )
        }
      />

      {/* 图形容器 */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div
          className="w-full h-full transition-transform duration-200"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          {children}
        </div>

        {/* 缩放控制 */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => {
              if (onZoomIn) onZoomIn();
              setScale((prev) => Math.min(3, prev * 1.2));
            }}
            className="h-12 w-12 rounded-full shadow-lg"
          >
            <ZoomIn className="h-5 w-5" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={() => {
              if (onZoomOut) onZoomOut();
              setScale((prev) => Math.max(0.5, prev / 1.2));
            }}
            className="h-12 w-12 rounded-full shadow-lg"
          >
            <ZoomOut className="h-5 w-5" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={() => {
              if (onReset) onReset();
              setScale(1);
            }}
            className="h-12 w-12 rounded-full shadow-lg"
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        </div>

        {/* 提示信息 */}
        <div className="absolute top-4 left-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <p className="text-xs text-muted-foreground text-center">
            双指捏合缩放 · 双击重置 · 拖拽移动
          </p>
        </div>
      </div>
    </div>
  );
}
