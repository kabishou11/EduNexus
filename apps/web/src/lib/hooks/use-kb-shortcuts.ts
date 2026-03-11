import { useEffect } from "react";

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
}

export function useKBShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

// 预定义的快捷键
export const KB_SHORTCUTS = {
  NEW_DOC: { key: "n", ctrl: true },
  SEARCH: { key: "k", ctrl: true },
  SAVE: { key: "s", ctrl: true },
  TOGGLE_LEFT_SIDEBAR: { key: "b", ctrl: true },
  TOGGLE_RIGHT_PANEL: { key: "\\", ctrl: true },
  FOCUS_EDITOR: { key: "e", ctrl: true },
};