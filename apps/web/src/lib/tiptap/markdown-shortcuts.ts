/**
 * Markdown 快捷输入扩展
 * 支持 Obsidian 风格的 Markdown 快捷输入
 */

import { Extension } from '@tiptap/core';

export const MarkdownShortcuts = Extension.create({
  name: 'markdownShortcuts',

  addKeyboardShortcuts() {
    return {
      // 粗体：Cmd/Ctrl + B
      'Mod-b': () => this.editor.commands.toggleBold(),

      // 斜体：Cmd/Ctrl + I
      'Mod-i': () => this.editor.commands.toggleItalic(),

      // 删除线：Cmd/Ctrl + Shift + X
      'Mod-Shift-x': () => this.editor.commands.toggleStrike(),

      // 行内代码：Cmd/Ctrl + E
      'Mod-e': () => this.editor.commands.toggleCode(),

      // 代码块：Cmd/Ctrl + Shift + C
      'Mod-Shift-c': () => this.editor.commands.toggleCodeBlock(),

      // 引用：Cmd/Ctrl + Shift + Q
      'Mod-Shift-q': () => this.editor.commands.toggleBlockquote(),

      // 标题 1：Cmd/Ctrl + Alt + 1
      'Mod-Alt-1': () => this.editor.commands.toggleHeading({ level: 1 }),

      // 标题 2：Cmd/Ctrl + Alt + 2
      'Mod-Alt-2': () => this.editor.commands.toggleHeading({ level: 2 }),

      // 标题 3：Cmd/Ctrl + Alt + 3
      'Mod-Alt-3': () => this.editor.commands.toggleHeading({ level: 3 }),

      // 无序列表：Cmd/Ctrl + Shift + 8
      'Mod-Shift-8': () => this.editor.commands.toggleBulletList(),

      // 有序列表：Cmd/Ctrl + Shift + 7
      'Mod-Shift-7': () => this.editor.commands.toggleOrderedList(),

      // 任务列表：Cmd/Ctrl + Shift + 9
      'Mod-Shift-9': () => this.editor.commands.toggleTaskList(),

      // 水平线：Cmd/Ctrl + Shift + -
      'Mod-Shift--': () => this.editor.commands.setHorizontalRule(),
    };
  },
});
