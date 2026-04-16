"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X, Edit, Target } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { goalStorage, type Goal } from "@/lib/goals/goal-storage";
import type { LearningPath } from "@/lib/client/path-storage";

type PathEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  path: LearningPath | null;
  onSubmit: (data: {
    title: string;
    description: string;
    tags: string[];
    goalId?: string;
  }) => void;
};

export function PathEditDialog({
  open,
  onOpenChange,
  path,
  onSubmit,
}: PathEditDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [goalId, setGoalId] = useState<string | undefined>(undefined);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    if (open) {
      setGoals(goalStorage.getGoals().filter((goal) => goal.status === "active"));
    }
  }, [open]);

  useEffect(() => {
    if (path) {
      setTitle(path.title);
      setDescription(path.description);
      setTags(path.tags);
      setGoalId(path.goalId);
    }
  }, [path]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      tags,
      goalId,
    });
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-orange-500" />
            编辑成长地图
          </DialogTitle>
          <DialogDescription>
            修改学习路径的基本信息
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">路径名称 *</Label>
            <Input
              id="title"
              placeholder="例如：前端开发基础"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">路径描述</Label>
            <Textarea
              id="description"
              placeholder="描述这个学习路径的目标和内容..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">关联目标（可选）</Label>
            <Select value={goalId} onValueChange={(value) => setGoalId(value === "none" ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择一个目标..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">不关联目标</SelectItem>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    <div className="flex items-center gap-2">
                      <Target className="w-3 h-3" />
                      {goal.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">标签</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="添加标签..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" size="icon" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <motion.div
                    key={tag}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Badge
                      variant="outline"
                      className="gap-1 border-orange-300"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              保存修改
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
