/**
 * 自动保存 Hook
 * 实现防抖自动保存逻辑，包含状态管理、错误处理和离线支持
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './use-debounce';

/**
 * 保存状态类型
 */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * 自动保存选项
 */
export interface AutoSaveOptions<T> {
  /** 防抖延迟时间（毫秒），默认 2000ms */
  delay?: number;
  /** 保存函数 */
  onSave: (data: T) => Promise<void>;
  /** 错误回调 */
  onError?: (error: Error) => void;
  /** 成功回调 */
  onSuccess?: () => void;
  /** 是否启用自动保存，默认 true */
  enabled?: boolean;
}

/**
 * 自动保存返回值
 */
export interface AutoSaveReturn {
  /** 当前保存状态 */
  status: SaveStatus;
  /** 最后保存时间 */
  lastSaved: Date | null;
  /** 错误信息 */
  error: Error | null;
  /** 手动触发保存 */
  triggerSave: () => Promise<void>;
  /** 重置状态 */
  reset: () => void;
}

/**
 * 自动保存 Hook
 *
 * @param data - 需要保存的数据
 * @param options - 自动保存选项
 * @returns 自动保存状态和控制函数
 *
 * @example
 * const { status, lastSaved, error } = useAutoSave(document, {
 *   delay: 2000,
 *   onSave: async (doc) => {
 *     await storage.updateDocument(doc);
 *   },
 *   onError: (err) => {
 *     console.error('Save failed:', err);
 *   },
 * });
 */
export function useAutoSave<T>(
  data: T,
  options: AutoSaveOptions<T>
): AutoSaveReturn {
  const {
    delay = 2000,
    onSave,
    onError,
    onSuccess,
    enabled = true,
  } = options;

  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const dataRef = useRef<T>(data);
  const isSavingRef = useRef(false);
  const savedTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const debouncedData = useDebounce(data, delay);

  const performSave = useCallback(async () => {
    if (!enabled || isSavingRef.current) {
      return;
    }

    try {
      isSavingRef.current = true;
      setStatus('saving');
      setError(null);

      await onSave(dataRef.current);

      setStatus('saved');
      setLastSaved(new Date());
      onSuccess?.();

      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }

      savedTimeoutRef.current = setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setStatus('error');
      setError(error);
      onError?.(error);
    } finally {
      isSavingRef.current = false;
    }
  }, [enabled, onSave, onSuccess, onError]);

  const triggerSave = useCallback(async () => {
    await performSave();
  }, [performSave]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    if (savedTimeoutRef.current) {
      clearTimeout(savedTimeoutRef.current);
      savedTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      hasInitializedRef.current = true;
      return;
    }

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }

    if (debouncedData !== undefined) {
      void performSave();
    }
  }, [debouncedData, enabled, performSave]);

  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }
    };
  }, []);

  return {
    status,
    lastSaved,
    error,
    triggerSave,
    reset,
  };
}
