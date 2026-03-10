"use client";

import { useState, useEffect } from "react";

export type Orientation = "portrait" | "landscape";

/**
 * 屏幕方向 Hook
 * 检测和响应屏幕方向变化
 */
export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>("portrait");

  useEffect(() => {
    const updateOrientation = () => {
      if (window.matchMedia("(orientation: portrait)").matches) {
        setOrientation("portrait");
      } else {
        setOrientation("landscape");
      }
    };

    updateOrientation();
    window.addEventListener("orientationchange", updateOrientation);
    window.addEventListener("resize", updateOrientation);

    return () => {
      window.removeEventListener("orientationchange", updateOrientation);
      window.removeEventListener("resize", updateOrientation);
    };
  }, []);

  return orientation;
}
