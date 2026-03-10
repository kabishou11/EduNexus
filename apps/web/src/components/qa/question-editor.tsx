"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import type { QuestionCategory } from '@/lib/qa/qa-types';

interface QuestionEditorProps {
  onSubmit: (data: {
    title: string;
    content: string;
    category: QuestionCategory;
    tags: string[];
    bounty: number;
  }) => void;
  onCancel?: () => void;
}

export function QuestionEditor({ onSubmit, onCancel }: QuestionEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<QuestionCategory>('programming');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [bounty, setBounty] = useState(0);

  const categories = [
    { value: 'programming', label: '编程' },
    { value: 'math', label: '数学' },
    { value: 'language', label: '语言' },
    { value: 'science', label: '科学' },
    { value: 'other', label: '其他' }
  ];

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容');
      return;
    }
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      tags,
      bounty
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 标题 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          问题标题
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="用一句话清晰描述你的问题"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          maxLength={200}
        />
        <div className="mt-1 text-xs text-gray-500 text-right">
          {title.length}/200
        </div>
      </div>

      {/* 分类 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          问题分类
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value as QuestionCategory)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                category === cat.value
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          问题详情
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="详细描述你的问题，支持 Markdown 格式"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[200px] font-mono text-sm"
        />
        <div className="mt-2 text-xs text-gray-500">
          <p>支持 Markdown 语法：</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>代码块：使用 ```语言 包裹代码</li>
            <li>行内代码：使用 `代码` 包裹</li>
            <li>粗体：**文本**</li>
            <li>斜体：*文本*</li>
          </ul>
        </div>
      </div>

      {/* 标签 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          标签（最多 5 个）
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="输入标签后按回车"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={tags.length >= 5}
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={tags.length >= 5}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            添加
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-orange-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 悬赏 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          悬赏积分（可选）
        </label>
        <input
          type="number"
          value={bounty}
          onChange={e => setBounty(Math.max(0, parseInt(e.target.value) || 0))}
          min="0"
          step="10"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          设置悬赏可以吸引更多高质量回答，最佳答案将获得悬赏积分
        </p>
      </div>

      {/* 按钮 */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          发布问题
        </button>
      </div>
    </form>
  );
}
