/**
 * 可访问性 (A11y) 工具
 * 提供 ARIA 标签、键盘导航和焦点管理功能
 */

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * 焦点陷阱 Hook
 * 用于模态框等需要限制焦点的场景
 */
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
}

/**
 * 键盘导航 Hook
 */
export function useKeyboardNavigation(
  items: any[],
  options?: {
    onSelect?: (index: number) => void;
    loop?: boolean;
  }
) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const { loop = true } = options || {};

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev + 1;
            if (next >= items.length) {
              return loop ? 0 : prev;
            }
            return next;
          });
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev - 1;
            if (next < 0) {
              return loop ? items.length - 1 : prev;
            }
            return next;
          });
          break;

        case 'Home':
          e.preventDefault();
          setSelectedIndex(0);
          break;

        case 'End':
          e.preventDefault();
          setSelectedIndex(items.length - 1);
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          options?.onSelect?.(selectedIndex);
          break;
      }
    },
    [items.length, selectedIndex, options]
  );

  return {
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
  };
}

/**
 * 实时区域公告 Hook
 * 用于屏幕阅读器
 */
export function useAnnouncer() {
  const announcerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 创建隐藏的公告区域
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
    announcerRef.current = announcer;

    return () => {
      if (announcerRef.current) {
        document.body.removeChild(announcerRef.current);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcerRef.current) {
      announcerRef.current.setAttribute('aria-live', priority);
      announcerRef.current.textContent = message;
    }
  }, []);

  return announce;
}

/**
 * 跳过导航链接组件
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
    >
      跳转到主内容
    </a>
  );
}

/**
 * 生成唯一 ID
 */
export function useId(prefix: string = 'id'): string {
  const idRef = useRef<string>();

  if (!idRef.current) {
    idRef.current = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  return idRef.current;
}

/**
 * ARIA 属性辅助函数
 */
export const aria = {
  /**
   * 创建描述关系
   */
  describedBy: (id: string) => ({
    'aria-describedby': id,
  }),

  /**
   * 创建标签关系
   */
  labelledBy: (id: string) => ({
    'aria-labelledby': id,
  }),

  /**
   * 创建展开/折叠状态
   */
  expanded: (isExpanded: boolean) => ({
    'aria-expanded': isExpanded,
  }),

  /**
   * 创建选中状态
   */
  selected: (isSelected: boolean) => ({
    'aria-selected': isSelected,
  }),

  /**
   * 创建禁用状态
   */
  disabled: (isDisabled: boolean) => ({
    'aria-disabled': isDisabled,
  }),

  /**
   * 创建隐藏状态
   */
  hidden: (isHidden: boolean) => ({
    'aria-hidden': isHidden,
  }),

  /**
   * 创建当前状态
   */
  current: (type: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false') => ({
    'aria-current': type,
  }),

  /**
   * 创建实时区域
   */
  live: (priority: 'off' | 'polite' | 'assertive') => ({
    'aria-live': priority,
    'aria-atomic': 'true',
  }),
};

/**
 * 检查颜色对比度
 */
export function checkColorContrast(
  foreground: string,
  background: string
): {
  ratio: number;
  passAA: boolean;
  passAAA: boolean;
} {
  // 简化的对比度计算
  // 实际应用中应使用更精确的算法
  const getLuminance = (color: string): number => {
    // 这里应该实现完整的相对亮度计算
    // 简化版本仅作示例
    return 0.5;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio,
    passAA: ratio >= 4.5,
    passAAA: ratio >= 7,
  };
}

/**
 * 焦点可见性样式
 */
export const focusRing = {
  default: 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  error: 'focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2',
  none: 'focus:outline-none',
};

/**
 * 屏幕阅读器专用类
 */
export const srOnly = 'sr-only';
export const notSrOnly = 'not-sr-only';
