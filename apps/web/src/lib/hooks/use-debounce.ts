/**
 * 防抖 Hook
 * 用于延迟执行函数，直到停止调用一段时间后才执行
 */

import { useEffect, useState } from 'react';

/**
 * 防抖值 Hook
 * @param value - 需要防抖的值
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的值
 *
 * @example
 * const debouncedSearchQuery = useDebounce(searchQuery, 500);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 设置定时器
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函数：在值变化或组件卸载时清除定时器
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
