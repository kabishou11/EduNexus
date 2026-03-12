/**
 * 自定义 Heading 扩展
 * 自动为标题添加 ID 属性，用于大纲导航
 */

import { Heading as TiptapHeading } from '@tiptap/extension-heading';
import { Plugin, PluginKey } from '@tiptap/pm/state';

/**
 * 从文本生成 ID
 */
function generateIdFromText(text: string): string {
  // 移除特殊字符，转换为小写，用连字符连接
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, '') // 保留字母、数字、空格和中文
    .replace(/\s+/g, '-') // 空格转连字符
    .substring(0, 50); // 限制长度

  return slug ? `heading-${slug}` : `heading-${Date.now()}`;
}

export const HeadingWithId = TiptapHeading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: element => element.getAttribute('id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {};
          }
          return { id: attributes.id };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('headingId'),
        appendTransaction: (transactions, oldState, newState) => {
          const docChanged = transactions.some(tr => tr.docChanged);
          if (!docChanged) return null;

          const tr = newState.tr;
          let modified = false;

          newState.doc.descendants((node, pos) => {
            if (node.type.name === 'heading') {
              const text = node.textContent;
              const currentId = node.attrs.id;

              // 如果没有 ID 或者文本改变了，重新生成 ID
              if (!currentId || text) {
                const newId = generateIdFromText(text);
                if (newId !== currentId) {
                  tr.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    id: newId,
                  });
                  modified = true;
                }
              }
            }
          });

          return modified ? tr : null;
        },
      }),
    ];
  },
});

