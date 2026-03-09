"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  X,
  Save,
  Sparkles,
  Tag,
  Loader2,
} from "lucide-react";

type QuickNoteProps = {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, tags: string[]) => Promise<void>;
};

export function QuickNote({ open, onClose, onSave }: QuickNoteProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 保存笔记
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("请填写标题和内容");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(title, content, tags);
      // 重置表单
      setTitle("");
      setContent("");
      setTags([]);
      setTagInput("");
      onClose();
    } catch (error) {
      console.error("Failed to save note:", error);
      alert("保存失败，请重试");
    } finally {
      setIsSaving(false);
    }
  };

  // 添加标签
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 处理标签输入的回车键
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-950">
            <Sparkles className="w-5 h-5 text-amber-600" />
            快速记录
          </DialogTitle>
          <DialogDescription>
            快速记录你的想法和灵感
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 标题输入 */}
          <div>
            <Input
              placeholder="笔记标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold border-amber-200 focus:border-amber-400"
              autoFocus
            />
          </div>

          {/* 内容输入 */}
          <div>
            <Textarea
              placeholder="开始记录你的想法..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] border-amber-200 focus:border-amber-400"
            />
          </div>

          {/* 标签输入 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-900">标签</span>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="添加标签..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                className="flex-1 border-amber-200 focus:border-amber-400"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddTag}
                className="border-amber-300 hover:bg-amber-50"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 pr-1"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-amber-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="border-amber-300 hover:bg-amber-50"
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !content.trim()}
            className="bg-amber-500 hover:bg-amber-600"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-1" />
                保存
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
