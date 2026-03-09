import { useEffect, useCallback, useRef } from 'react';

/**
 * 快捷键配置接口
 */
export interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  description?: string;
  enabled?: boolean;
}

/**
 * 检测是否为 Mac 系统
 */
const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

/**
 * 全局快捷键 Hook
 *
 * @param shortcuts - 快捷键配置数组
 * @param options - 配置选项
 *
 * @example
 * ```tsx
 * useGlobalShortcuts([
 *   {
 *     key: 'n',
 *     ctrl: true,
 *     shift: true,
 *     handler: () => console.log('Ctrl+Shift+N pressed'),
 *     description: '创建新笔记'
 *   }
 * ]);
 * ```
 */
export function useGlobalShortcuts(
  shortcuts: ShortcutConfig[],
  options: {
    enabled?: boolean;
    preventDefault?: boolean;
    stopPropagation?: boolean;
  } = {}
) {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = false,
  } = options;

  const shortcutsRef = useRef(shortcuts);

  // 更新 shortcuts ref
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // 忽略在输入框、文本域等元素中的快捷键
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const isEditable = target.isContentEditable;

      // 如果在输入框中，只处理特定的快捷键（如 Ctrl+S）
      const isInputElement = ['input', 'textarea', 'select'].includes(tagName) || isEditable;

      for (const shortcut of shortcutsRef.current) {
        // 检查快捷键是否启用
        if (shortcut.enabled === false) continue;

        // 匹配修饰键
        const ctrlMatch = shortcut.ctrl !== undefined
          ? (isMac ? e.metaKey : e.ctrlKey) === shortcut.ctrl
          : true;

        const metaMatch = shortcut.meta !== undefined
          ? e.metaKey === shortcut.meta
          : true;

        const shiftMatch = shortcut.shift !== undefined
          ? e.shiftKey === shortcut.shift
          : true;

        const altMatch = shortcut.alt !== undefined
          ? e.altKey === shortcut.alt
          : true;

        // 匹配按键
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        // 所有条件都匹配
        if (ctrlMatch && metaMatch && shiftMatch && altMatch && keyMatch) {
          // 在输入框中，只允许特定的快捷键（如保存）
          if (isInputElement && !shortcut.ctrl && !shortcut.meta) {
            continue;
          }

          if (preventDefault) {
            e.preventDefault();
          }
          if (stopPropagation) {
            e.stopPropagation();
          }

          shortcut.handler();
          break;
        }
      }
    },
    [enabled, preventDefault, stopPropagation]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);

  return {
    isMac,
  };
}

/**
 * 格式化快捷键显示文本
 *
 * @param shortcut - 快捷键配置
 * @returns 格式化后的快捷键文本
 *
 * @example
 * ```tsx
 * formatShortcut({ key: 'n', ctrl: true, shift: true })
 * // Mac: "⌘⇧N"
 * // Windows: "Ctrl+Shift+N"
 * ```
 */
export function formatShortcut(shortcut: ShortcutConfig): string {
  const keys: string[] = [];

  if (isMac) {
    if (shortcut.ctrl) keys.push('⌃');
    if (shortcut.alt) keys.push('⌥');
    if (shortcut.shift) keys.push('⇧');
    if (shortcut.meta) keys.push('⌘');
  } else {
    if (shortcut.ctrl) keys.push('Ctrl');
    if (shortcut.alt) keys.push('Alt');
    if (shortcut.shift) keys.push('Shift');
    if (shortcut.meta) keys.push('Win');
  }

  keys.push(shortcut.key.toUpperCase());

  return isMac ? keys.join('') : keys.join('+');
}
