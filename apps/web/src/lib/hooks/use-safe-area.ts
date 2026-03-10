"use client";

import { useState, useEffect } from "react";

/**
 * 安全区域 Hook
 * 处理刘海屏、圆角屏幕等安全区域
 */
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const updateSafeArea = () => {
      // 获取 CSS 环境变量
      const top = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue("env(safe-area-inset-top)")
          .replace("px", "") || "0"
      );
      const right = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue("env(safe-area-inset-right)")
          .replace("px", "") || "0"
      );
      const bottom = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue("env(safe-area-inset-bottom)")
          .replace("px", "") || "0"
      );
      const left = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue("env(safe-area-inset-left)")
          .replace("px", "") || "0"
      );

      setSafeArea({ top, right, bottom, left });
    };

    updateSafeArea();
    window.addEventListener("resize", updateSafeArea);
    window.addEventListener("orientationchange", updateSafeArea);

    return () => {
      window.removeEventListener("resize", updateSafeArea);
      window.removeEventListener("orientationchange", updateSafeArea);
    };
  }, []);

  return safeArea;
}
