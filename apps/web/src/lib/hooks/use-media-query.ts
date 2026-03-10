"use client";

import { useState, useEffect } from "react";

/**
 * 媒体查询 Hook
 * 用于响应式设计和移动端适配
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 现代浏览器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
    // 旧版浏览器兼容
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  // 避免 SSR 不匹配
  if (!mounted) {
    return false;
  }

  return matches;
}

/**
 * 预定义的断点查询
 */
export const useIsMobile = () => useMediaQuery("(max-width: 768px)");
export const useIsTablet = () => useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1025px)");
export const useIsSmallMobile = () => useMediaQuery("(max-width: 375px)");
